import { Rom } from './rom';

const rom = new Rom({
    path: 'roms/invaders.rom'
});

rom.load().then((content) => {
    console.log(content);
});
