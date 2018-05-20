import { Renderer } from './renderer';
import { CPU } from './cpu';

const renderer = new Renderer();

export class Chip8 {
    constructor() {
        this.display = {
            width: 64,
            height: 32,
            content: []
        };

        this.memory = window.memory = new Uint8Array(new ArrayBuffer(0x1000));
        this.reset();

        this.cpu = new CPU({
            chip8: this
        });
    }

    load_program(program) {

        for (let i = 0; i < program.length; i++) {
            this.memory[i + 0x200] = program[i];
        }
    }

    reset() {
        this.memory = this.memory.map(() => 0);

        // program pointer
        this.pc = 0x200;

        // stack
        this.stack = new Array(16).fill(0);

        // stack pointer
        this.sp = 0;

        // v regs
        this.v = new Array(16).fill(0);

        // i reg
        this.i = 0;

        // clear display
        this.display.content = new Array(this.display.width * this.display.height).fill(0);

        this.delayTimer = 0;
        this.soundTimer = 0;

    }

    start() {
        setInterval(() => {
            this.tick();

            if (this.is_drawing) {
                // console.clear();
                // self.renderer.render(self.display);
                // console.log(this.display.content);
                renderer.draw(this.display.content);
                this.is_drawing = false;
            }

        }, 0);
    }

    transform_pixel(x, y) {
        const width = this.display.width;
        const height = this.display.height;

        // If the pixel exceeds the dimensions,
        // wrap it back around.
        if (x > width) {
            x -= width;
        } else if (x < 0) {
            x += width;
        }

        if (y > height) {
            y -= height;
        } else if (y < 0) {
            y += height;
        }

        const location = x + (y * width);

        this.display.content[location] ^= 1;

        return !this.display.content[location];
    }


    tick() {
        const opcode = this.memory[this.pc] << 8 | this.memory[this.pc + 1];
        let x = (opcode & 0x0F00) >> 8;
        let y = (opcode & 0x00F0) >> 4;
        const instruction = opcode & 0xf000;

        this.pc += 2;

        switch (instruction) {

            case 0x0000:

                switch (opcode) {
                    case 0x00E0: this.cpu.CLS(); break;
                    case 0x00EE: this.cpu.RET(); break;
                }

                break;

            case 0x1000: this.cpu.JP(opcode); break;
            case 0x2000: this.cpu.CALL(opcode); break;
            case 0x3000: this.cpu.SE(opcode, (opcode & 0xFF)); break;
            case 0x4000: this.cpu.SNE(opcode); break;
            case 0x5000: this.cpu.SE(opcode, this.v[y]); break;
            case 0x6000: this.cpu.LD(opcode, (opcode & 0xFF)); break;
            case 0x7000: this.cpu.ADD(opcode); break;

            case 0x8000:

                switch (opcode & 0x000f) {
                    case 0x0000: this.cpu.LD(opcode, this.v[y]); break;
                    case 0x0001: this.cpu.OR(opcode); break;
                    case 0x0002: this.cpu.AND(opcode); break;
                    case 0x0003: this.cpu.XOR(opcode); break;
                    case 0x0004: this.cpu.ADD2(opcode); break;
                    case 0x0005: this.cpu.SUB(opcode); break;
                    case 0x0006: this.cpu.SHR(opcode); break;
                    case 0x0007: this.cpu.SUBN(opcode); break;
                    case 0x000E: this.cpu.SHL(opcode); break;
                }

                break;

            case 0x9000: this.cpu.SNE2(opcode); break;

            // LD I, addr
            // Annn
            // Set I equal to nnn.
            case 0xA000:
                this.i = opcode & 0xFFF;
                break;

            // JP V0, addr
            // Bnnn
            // Jump to location V0 + nnn.
            case 0xB000:
                this.pc = (opcode & 0xFFF) + this.v[0];
                break;

            // RND Vx, byte
            // Cxkk
            // Set Vx equal to random byte AND kk.
            case 0xC000:
                this.v[x] = ~~(Math.random() * 0xFF) & (opcode & 0xFF)
                break;

            // DRW Vx, Vy, nibble
            // Dxyn
            // Display n-byte sprite starting at memory location I at (Vx, Vy), set VF equal to collision.
            case 0xD000:
                console.log('DRAWING!');
                this.v[0xF] = 0;

                var height = opcode & 0x000F;
                var registerX = this.v[x];
                var registerY = this.v[y];
                var x1, y1, spr;

                for (y1 = 0; y1 < height; y1++) {
                    spr = this.memory[this.i + y1];
                    for (x1 = 0; x1 < 8; x1++) {
                        if ((spr & 0x80) > 0) {
                            if (this.transform_pixel(registerX + x1, registerY + y1)) {
                                this.v[0xF] = 1;
                            }
                        }
                        spr <<= 1;
                    }
                }
                this.is_drawing = true;

                break;

            case 0xE000:
                switch (opcode & 0x00FF) {

                    // SKP Vx
                    // Ex9E
                    // Skip next instruction if the key with the value Vx is pressed.
                    case 0x009E:
                        console.log('0x009E');
                        // if (this.keys[this.v[x]]) {
                        //     this.pc += 2;
                        // }
                        break;

                    // SKNP Vx
                    // ExA1
                    // Skip  next instruction if the key with the value Vx is NOT pressed.
                    case 0x00A1:
                        console.log('0x00A1');
                        // if (!this.keys[this.v[x]]) {
                        //     this.pc += 2;
                        // }
                        break;

                }

                break;

            case 0xF000:

                switch (opcode & 0x00FF) {

                    // LD Vx, DT
                    // Fx07
                    // Place value of DT in Vx.
                    case 0x0007:
                        console.log('0x0007');
                        // this.v[x] = this.delayTimer;
                        break;

                    // LD Vx, K
                    // Fx0A
                    // Wait for keypress, then store it in Vx.
                    case 0x000A:
                        console.log('0x000A');
                        // var oldKeyDown = this.setKey;
                        // var self = this;

                        // this.setKey = function (key) {
                        //     self.v[x] = key;

                        //     self.setKey = oldKeyDown.bind(self);
                        //     self.setKey.apply(self, arguments);

                        //     self.start();
                        // }

                        // this.stop();
                        return;

                    // LD DT, Vx
                    // Fx15
                    // DT is set to Vx.
                    case 0x0015:
                        console.log('0x0015');
                        // this.delayTimer = this.v[x];
                        break;

                    // LD ST, Vx
                    // Fx18
                    // Set sound timer to Vx.
                    case 0x0018:
                        console.log('0x0018');
                        // this.soundTimer = this.v[x];
                        break;

                    // ADD I, Vx
                    // Fx1E
                    // Set I equal to I + Vx
                    case 0x001E:
                        this.i += this.v[x];
                        break;

                    // LD F, Vx
                    // Fx29
                    // Set I equal to location of sprite for digit Vx.
                    case 0x0029:
                        // Multiply by number of rows per character.
                        this.i = this.v[x] * 5;
                        break;

                    // LD B, Vx
                    // Fx33
                    // Store BCD representation of Vx in memory location starting at location I.
                    case 0x0033:
                        var number = this.v[x], i;

                        for (i = 3; i > 0; i--) {
                            this.memory[this.i + i - 1] = parseInt(number % 10);
                            number /= 10;
                        }
                        break;

                    // LD [I], Vx
                    // Fx55
                    // Store registers V0 through Vx in memory starting at location I.
                    case 0x0055:
                        for (var i = 0; i <= x; i++) {
                            this.memory[this.i + i] = this.v[i];
                        }
                        break;

                    // LD Vx, [I]
                    // Fx65
                    // Read registers V0 through Vx from memory starting at location I.
                    case 0x0065:
                        for (var i = 0; i <= x; i++) {
                            this.v[i] = this.memory[this.i + i];
                        }
                        break;

                }

                break;

            default:
                throw new Error("Unknown opcode " + opcode.toString(16) + " passed. Terminating.");
        }
    }
}
