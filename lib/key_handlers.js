class KeyHandler {
    constructor() {
        this.keycode = {
            "ESC": [27],
            "UP": [38, 104],
            "DOWN": [40, 98],
            "LEFT": [37, 100],
            "RIGHT": [39, 102],
            "SPACE": [32],
            "ENTER": [13],
        }
    }
    pressed(e, key) {
        return this.keycode[key].includes(e.keyCode)
    }
}
