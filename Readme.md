Chip-8-js
---
My first attempt to write an emulator.

## About CHIP-8
[CHIP-8](https://en.wikipedia.org/wiki/CHIP-8) is an interpreted programming language, developed by Joseph Weisbecker. It's consider an [easiest VM to emulate](https://news.ycombinator.com/item?id=6568569).


## Renderers

It supports three basic renderers:
### Pixel based 2d canvas
![canvas](screens/canvas-renderer.gif)

### HTML based ASCII renderer
![ascii](screens/ascii-renderer.gif)

### Voxel WebGL renderer with [Cervus](https://github.com/michalbe/cervus)
![webgl](screens/webgl-renderer.gif)

## Try me!
Try `Space invaders` game [online](https://michalbe.github.io/chip8-js/index.html). Controls:
  - `Q` Left
  - `W` Fire
  - `E` Right
