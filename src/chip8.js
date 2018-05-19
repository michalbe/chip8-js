export class Chip8 {
    constructor() {
        this.display = {
            width: 64,
            height: 32,
            content: []
        };

        this.memory = new Uint8Array(new ArrayBuffer(0x1000));
        this.reset();
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

    }

    start() {
        setInterval(() => {
            this.tick();
        }, 2000);
    }

    tick() {
        const opcode = this.memory[this.pc] << 8 | this.memory[this.pc + 1];
        console.log(opcode);
        const x = (opcode & 0x0F00) >> 8;
        const y = (opcode & 0x00F0) >> 4;
        const instruction = opcode & 0xf000;

        switch(instruction) {

        }
    }
}
