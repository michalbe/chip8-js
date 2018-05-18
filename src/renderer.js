export class Renderer {
    constructor() {
        this.element = document.createElement('canvas');
        this.ctx = this.element.getContext('2d');
        this.element.width = 64;
        this.element.height = 32;
        this.activeColor = [255, 0, 255];
        this.clearColor = [0, 0, 0];
        document.body.appendChild(this.element);
    }

    draw(pixels) {
        const imageData = this.ctx.getImageData(0, 0, this.element.width, this.element.height);
        pixels.forEach((pixel, index) => {
            const i = index * 4;
            if (pixel) {
                imageData.data[i] = this.activeColor[0];
                imageData.data[i + 1] = this.activeColor[1];
                imageData.data[i + 2] = this.activeColor[2];
                imageData.data[i + 3] = 255
            } else {
                imageData.data[i] = this.clearColor[0];
                imageData.data[i + 1] = this.clearColor[1];
                imageData.data[i + 2] = this.clearColor[2];
                imageData.data[i + 3] = 255
            }
        });
        this.ctx.putImageData(imageData, 0, 0);
    }
}
