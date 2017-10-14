class Menu {
    constructor(background, choices) {
        this.background = background ;// load background
        this.choices = choices; // save menu options
        this.selected = 0;
        this.last_ts = 0;
        this.ts = 0;
        this.repeat_max = 0.2;
    }
    update(e , dt) {
        // update menu state
        console.log(e);
        alert("test");
        this.ts += dt;
        if (this.last_ts + this.repeat_max > self.ts) return
        else if (e.key == '40' || e.keyCode == '98') {
          if (this.selected < this.choices.length ) {
            this.last_ts = this.ts;
            this.selected = this.selected + 1;
            alert("Key down");
          }
        }
        else if (e.key == '38' || e.keyCode == '104') {
          if (this.selected > 0 ) {
            this.last_ts = this.ts;
            this.selected = this.selected - 1;
            alert("Key Up");
          }
        }


    }
    draw() {
        // update display
        this.background.fillStyle = "rgb(200,0,0)";
        let y = 100
        for (let i = 0; i < this.choices.length; i++) {
          if (this.selected == i) this.choices[i] += "*";
          this.background.fillText(this.choices[i], 50, y);
          y += 25;
        }
    }
}

class MainMenu extends Menu {
    constructor(background , choices) {
        super(background , choices);
    }
}
