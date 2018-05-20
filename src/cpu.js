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
}
