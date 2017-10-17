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
    console.log("arguments :" , e.keyCode , key);
    for (var k in this.keycode) {
      console.log("k: ", k);
      if (k == key) {
        for (var v in this.keycode[k]) {
          console.log("v ",this.keycode[k][v]);
          console.log("Resultat de if:",e.keyCode == `${this.keycode[k][v]}`);
          if (e.keyCode == `${this.keycode[k][v]}`) {
            checked = true;
            console.log("checked :",checked);
            return checked;
          }
        }
      }
    }
    return checked;
  }
}
