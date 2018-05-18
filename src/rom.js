
const defaults = {
    path: ''
};

export class Rom {
    constructor(options = {}) {
        this.options = Object.assign({}, defaults, options);
    }

    load() {
        return fetch(this.options.path)
        .then((response) => {
            return response.arrayBuffer();
        })
        .then((buffer) => {
            this.program = new Uint8Array(buffer);
            return this.program;
        });
    }
}
