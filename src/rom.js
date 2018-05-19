
const defaults = {
    path: 'roms/invaders.rom'
};

export class Rom {
    constructor(options = {}) {
        this.options = Object.assign({}, defaults, options);
    }

    load() {
        return fetch(this.patch)
        .then((response) => {
            return response.arrayBuffer();
        })
        .then((buffer) => {
            this.program = new Uint8Array(buffer);
            return this.program;
        });
    }
}
