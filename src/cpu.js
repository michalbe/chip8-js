export class CPU {
    constructor({ chip8 }) {
        this.chip8 = chip8;
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

    SE(opcode) {
        const x = (opcode & 0x0F00) >> 8;

        if (this.chip8.v[x] === (opcode & 0xFF)) {
            this.chip8.pc += 2;
        }
    }

    SNE(opcode) {
        const x = (opcode & 0x0F00) >> 8;

        if (this.chip8.v[x] != (opcode & 0x00FF)) {
            this.chip8.pc += 2;
        }
    }

    SE2(opcode) {
        const x = (opcode & 0x0F00) >> 8;
        const y = (opcode & 0x00F0) >> 4;

        if (this.chip8.v[x] === this.chip8.v[y]) {
            this.chip8.pc += 2;
        }
    }
}
