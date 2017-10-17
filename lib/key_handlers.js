class KeyHandler {
  constructor() {
    this.keycode = {
        "ESC": 27,
        "UP": [38,104],
        "DOWN": [40,98],
        "LEFT": [37,100],
        "RIGHT": [39,102],
        "SPACE": 32,
        "ENTER": 13,
    }
  }

  pressed(e , key){
    var checked = false;
    for (var k in this.keycode) {
      if (k == key) {
        for (var v in this.keycode[k]) {
          if (e.keyCode == `${this.keycode[k][v]}`) {
            checked = true;
            return checked;
          }
        }
      }
    }
    return checked;
  }
}
