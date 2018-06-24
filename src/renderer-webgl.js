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
        });

        this.material = new PhongMaterial({
            requires: [
                Render,
                Transform
            ]
        });

        const box = new Box();
        const [box_transform, box_render] = box.get_components(Transform, Render);
        box_render.material = this.material;
        box_render.color = this.activeColor;
        box_transform.scale = [0.1, 0.1, 0.1];
        this.game.add(box);

        const camera_transform = window.camera = this.game.camera.get_component(Transform);

        camera_transform.position = [0, 0, -2.741666555404663];
        // this.game.camera.get_component(Move).keyboard_controlled = true;
        const light = this.game.light;
        const light_transform = light.get_component(Transform);
        light_transform.position = camera_transform.position;

    }

    draw(pixels) {
        // let output = '';
        // pixels.forEach((pixel, index) => {
        //     if (pixel) {
        //         output += '@';
        //     } else {
        //         output += '&nbsp;';
        //     }

        //     if (index % this.width === 0) {
        //         output += '<br/>';
        //     }
        // });

        // this.element.innerHTML = output;
    }
}
