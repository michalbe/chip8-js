import { Game } from 'cervus/core';
import { Render, Transform, Move } from 'cervus/components';
import { PhongMaterial } from 'cervus/materials';
import { Box } from 'cervus/shapes';

export class Renderer {
    constructor() {
        this.element = document.createElement('div');
        this.width = 64;
        this.height = 32;
        this.activeColor = '#ff00ff';

        this.game = new Game({
            width: window.innerWidth,
            height: window.innerHeight,
            light_intensity: 0.1,
            clear_color: '#000000'
        });

        this.material = new PhongMaterial({
            requires: [
                Render,
                Transform
            ]
        });

        this.boxes = [];

        for (let j = 0; j < this.height; j++) {
            for (let i = 0; i < this.width; i++) {
                const box = new Box();
                const [box_transform, box_render] = box.get_components(Transform, Render);
                box_render.material = this.material;
                box_render.color = this.activeColor;
                box_transform.scale = [0.1, 0.1, 1];
                box_transform.position = [ -i / 10, - j / 10, 0];
                box.skip = true;
                this.game.add(box);
                this.boxes.push(box);
            }

            // this.boxes.reverse();
        }




        const camera_transform = window.camera = this.game.camera.get_component(Transform);

        camera_transform.position = [-3.0333335399627686, -1.0500000715255737, -5.5416693687438965];
        const light = this.game.light;
        const light_transform = light.get_component(Transform);
        light_transform.position = camera_transform.position;

    }

    draw(pixels) {
        // return;
        // let output = '';
        pixels.forEach((pixel, index) => {
            this.boxes[index].skip = !pixel;
        });

        // this.element.innerHTML = output;
    }
}
