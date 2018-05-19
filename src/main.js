import { Rom } from './rom';
import { Chip8 } from './chip8';

const rom = new Rom({
    path: 'roms/invaders.rom'
});

const chip8 = new Chip8();
rom.load().then((program) => {
    console.log(program);
    chip8.load_program(program);
    chip8.start();
});
