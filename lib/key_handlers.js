class KeyboardManager {
    constructor() {
        document.onkeydown = (e) => this._key_down(e)
        document.onkeyup = (e) => this._key_up(e)
        this.keys = new Set() // "named" keys set
        this.processed_keys = new Set() // "named" keys set
        // conversion maps
        this.keycode = new Map([
            ["ESC", [27]],
            ["UP", [38, 104]],
            ["DOWN", [40, 98]],
            ["LEFT", [37, 100]],
            ["RIGHT", [39, 102]],
            ["SPACE", [32]],
            ["ENTER", [13]]
        ])
        this.reverse_code = {}
        for (let v of this.keycode.entries()) {
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