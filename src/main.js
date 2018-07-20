import { Rom } from './rom';
import { Chip8 } from './chip8';
// import { Renderer } from './renderer-ascii';
import { Renderer } from './renderer-webgl';
// import { Renderer } from './renderer';

const renderer = new Renderer();

const rom = new Rom({
    // path: 'roms/invaders.rom'
    path: 'roms/tetris.rom'
});

const chip8 = new Chip8({ renderer });

rom.load().then((program) => {
    chip8.load_program(program);
    chip8.start();
});

