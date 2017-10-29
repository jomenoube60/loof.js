export class Display {
    constructor(canvas = "#game") {
        this.canvas = document.querySelector(canvas);
        this.canvas.width = window.innerWidth - 4;
        this.canvas.height = window.innerHeight - 4;
        this.context = this.canvas.getContext("2d");
        this.scale_ratio = 1.0
        this.offset_x = 0
        this.offset_y = 0
    }
    blit(img, posX, posY, options = {}) {
        let offsx = 0,
            offsy = 0
        if (!!options)
            this.context.save()
        if (options.fixratio)
            this.context.scale(this.width / img.width, this.height / img.height)
        if (options.opacity)
            this.context.globalAlpha = options.opacity
        if (options.scale) {
            offsx = img.width / 2
            offsy = img.height / 2
            this.context.translate(offsx, offsy)
            this.context.scale(options.scale, options.scale)
        }
        this.context.drawImage(img, posX - offsx, posY - offsy)
        if (!!options)
            this.context.restore()
    }
    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    get width() {
        return this.canvas.width
    }
    get height() {
        return this.canvas.height
    }
}
export class KeyboardManager {
    constructor() {
        document.onkeydown = (e) => this._key_down(e)
        document.onkeyup = (e) => this._key_up(e)
        this.keys = new Set() // "named" keys set
        this.processed_keys = new Set() // "named" keys set
        // human-editable structure:
        var keycode = new Map([
            ['1', [97]],
            ['3', [99]],
            ['PLUS', [107]],
            ['MINUS', [109]],
            ["ESC", [27]],
            ["UP", [38, 104]],
            ["DOWN", [40, 98]],
            ["LEFT", [37, 100]],
            ["RIGHT", [39, 102]],
            ["SPACE", [32]],
            ["ENTER", [13]]
        ])
        // conversion maps
        this.reverse_code = {}
        for (let v of keycode.entries()) {
            for (let code of v[1]) {
                this.reverse_code[code] = v[0]
            }
        }
    }
    _key_up(e) {
        var k = this.reverse_code[e.keyCode]
        if (k) {
            this.keys.delete(k)
            this.processed_keys.delete(k)
            return false
        }
        return true
    }
    _key_down(e) {
        var k = this.reverse_code[e.keyCode]
        if (k) {
            this.keys.add(k)
            return false
        }
        return true
    }
    is_pressed(name) {
        // tells if a key is currently pressed
        return this.keys.has(name)
    }
    is_new_press(name) {
        // tells if a key is pressed, only returns true the first time a key is pressed
        if (this.keys.has(name)) {
            if (this.processed_keys.has(name)) return false
            this.processed_keys.add(name)
            return true
        }
    }
}
