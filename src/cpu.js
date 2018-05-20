export class CPU {
    constructor({ chip8 }) {
        this.chip8 = chip8;
    }

    get_x_y(opcode) {
        return {
            x: (opcode & 0x0F00) >> 8,
            y: (opcode & 0x00F0) >> 4
        }
    }

    CLS() {
        this.chip8.display.content.fill(0);
    }

    RET() {
        this.chip8.sp--;
        this.chip8.pc = this.chip8.stack[this.chip8.sp];
    }

    JP(opcode) {
        this.chip8.pc = opcode & 0xFFF;
    }

    CALL(opcode) {
        this.chip8.stack[this.chip8.sp] = this.chip8.pc;
        this.chip8.sp++;
        this.chip8.pc = opcode & 0x0FFF;
    }

    SE(opcode, value) {
        const x = this.get_x_y(opcode).x;

        if (this.chip8.v[x] === value) {
            this.chip8.pc += 2;
        }
    }

    SNE(opcode) {
        const x = this.get_x_y(opcode).x;

        if (this.chip8.v[x] != (opcode & 0x00FF)) {
            this.chip8.pc += 2;
        }
    }

    LD(opcode, value) {
        const x = this.get_x_y(opcode).x;

        this.chip8.v[x] = value;
    }

    ADD(opcode) {
        const x = (opcode & 0x0F00) >> 8;
        let val = (opcode & 0xFF) + this.chip8.v[x]

        if (val > 255) {
            val -= 256;
        }

        this.chip8.v[x] = val;
    }

    OR(opcode) {
        const { x, y } = this.get_x_y(opcode);

        this.chip8.v[x] |= this.chip8.v[y];
    }

    AND(opcode) {
        const { x, y } = this.get_x_y(opcode);

        this.chip8.v[x] &= this.chip8.v[y];
    }

    XOR(opcode) {
        const { x, y } = this.get_x_y(opcode);

        this.chip8.v[x] ^= this.chip8.v[y];
    }

    ADD2(opcode) {
        const { x, y } = this.get_x_y(opcode);

        this.chip8.v[x] += this.chip8.v[y];
        this.chip8.v[0xF] = +(this.chip8.v[x] > 255);

        if (this.chip8.v[x] > 255) {
            this.chip8.v[x] -= 256;
        }
    }

    SUB(opcode) {
        const { x, y } = this.get_x_y(opcode);

        this.chip8.v[0xF] = +(this.chip8.v[x] > this.chip8.v[y]);
        this.chip8.v[x] -= this.v[y];
        if (this.chip8.v[x] < 0) {
            this.chip8.v[x] += 256;
        }
    }

    SHR(opcode) {
        const { x, y } = this.get_x_y(opcode);

        this.chip8.v[0xF] = this.chip8.v[x] & 0x1;
        this.chip8.v[x] >>= 1;
    }

    SUBN(opcode) {
        const { x, y } = this.get_x_y(opcode);

        this.chip8.v[0xF] = +(this.chip8.v[y] > this.chip8.v[x]);
        this.chip8.v[x] = this.chip8.v[y] - this.chip8.v[x];
        if (this.chip8.v[x] < 0) {
            this.chip8.v[x] += 256;
        }
    }

    SHL(opcode) {
        const { x, y } = this.get_x_y(opcode);

        this.chip8.v[0xF] = +(this.chip8.v[x] & 0x80);
        this.chip8.v[x] <<= 1;
        if (this.chip8.v[x] > 255) {
            this.chip8.v[x] -= 256;
        }
    }

    SNE2(opcode) {
        const { x, y } = this.get_x_y(opcode);

        if (this.chip8.v[x] != this.chip8.v[y]) {
            this.chip8.pc += 2;
        }
    }

    LD2(opcode) {
        this.chip8.i = opcode & 0xFFF;
    }

    JP2(opcode) {
        this.chip8.pc = (opcode & 0xFFF) + this.chip8.v[0];
    }

    RND(opcode) {
        const { x, y } = this.get_x_y(opcode);

        this.chip8.v[x] = ~~(Math.random() * 0xFF) & (opcode & 0xFF)
    }

    DRW(opcode) {
        const { x, y } = this.get_x_y(opcode);

        this.chip8.v[0xF] = 0;
        var height = opcode & 0x000F;
        var registerX = this.chip8.v[x];
        var registerY = this.chip8.v[y];
        var x1, y1, spr;

        for (y1 = 0; y1 < height; y1++) {
            spr = this.chip8.memory[this.chip8.i + y1];
            for (x1 = 0; x1 < 8; x1++) {
                if ((spr & 0x80) > 0) {
                    if (this.chip8.transform_pixel(registerX + x1, registerY + y1)) {
                        this.chip8.v[0xF] = 1;
                    }
                }
                spr <<= 1;
            }
        }
        this.chip8.is_drawing = true;
    }
}
