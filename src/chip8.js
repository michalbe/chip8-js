// import { Renderer } from './renderer';
import { Renderer } from './renderer-ascii';
import { CPU } from './cpu';

const renderer = new Renderer();

const key_maps = '1234qwerasdfzxcv'.split('');

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

        this.keys = key_maps.reduce((memo, curr, ind) => {
            memo[ind] = false;
            return memo;
        }, {});

        document.addEventListener('keydown', (e) => {
            const key = e.key;
            const key_index = key_maps.indexOf(key);

            if (key_index) {
                this.keys[key_index] = true;
            }
        });

        document.addEventListener('keyup', (e) => {
            const key = e.key;
            const key_index = key_maps.indexOf(key);

            if (key_index) {
                this.keys[key_index] = false;
            }
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

        this.delay_timer = 0;
        this.sound_timer = 0;

        this.keys = {};
    }

    active_key(key) {
        this.keys[key] = true;
    }

    inactive_key(key) {
        this.keys[key] = false;
    }

    set_key_state(key, status) {
        this.keys[key] = status;
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

            if (this.delay_timer > 0) {
                this.delay_timer--;
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
            case 0xA000: this.cpu.LD2(opcode); break;
            case 0xB000: this.cpu.JP2(opcode); break;
            case 0xC000: this.cpu.RND(opcode); break;
            case 0xD000: this.cpu.DRW(opcode); break;

            case 0xE000:
                switch (opcode & 0x00FF) {

                    case 0x009E: this.cpu.SKP(opcode); break;
                    case 0x00A1: this.cpu.SKPN(opcode); break;

                }

                break;

            case 0xF000:

                switch (opcode & 0x00FF) {

                    case 0x0007: this.cpu.LD_DT(opcode); break;
                    case 0x000A: this.cpu.LD_Vx(opcode); return;
                    case 0x0015: this.cpu.LD_DT2(opcode); break;
                    case 0x0018: console.log('0x0018'); break;
                    case 0x001E: this.cpu.ADD_Vx(opcode); break;
                    case 0x0029: this.cpu.LD_F_Vx(opcode); break;
                    case 0x0033: this.cpu.LD_B_Vx(opcode); break;
                    case 0x0055: this.cpu.LD_I_Vx(opcode); break;
                    case 0x0065: this.cpu.LD_Vx_I(opcode); break;

                }

                break;

            default:
                throw new Error("Unknown opcode " + opcode.toString(16) + " passed. Terminating.");
        }
    }
}
