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

    SE(opcode, value) {
        const x = (opcode & 0x0F00) >> 8;

        if (this.chip8.v[x] === value) {
            this.chip8.pc += 2;
        }
    }

    SNE(opcode) {
        const x = (opcode & 0x0F00) >> 8;

        if (this.chip8.v[x] != (opcode & 0x00FF)) {
            this.chip8.pc += 2;
        }
    }

    LD(opcode, value) {
        const x = (opcode & 0x0F00) >> 8;

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
}
