export class Renderer {
    constructor() {
        this.element = document.createElement('div');
        this.width = 64;
        this.height = 32;
        this.activeColor = [255, 0, 255];
        this.clearColor = [0, 0, 0];
        document.body.appendChild(this.element);

        this.element.style.fontFamily = 'Courier';
        this.element.style.color = '#FF00FF';
    }

    draw(pixels) {
        let output = '';
        pixels.forEach((pixel, index) => {
            if (pixel) {
                output += '@';
            } else {
                output += '&nbsp;';
            }

            if (index % this.width === 0) {
                output += '<br/>';
            }
        });

        this.element.innerHTML = output;
    }
}
