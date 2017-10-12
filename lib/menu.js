class Menu {
    constructor(background, choices) {
        this.background = background // load background
        this.choices = choices // save menu options
        this.selected = 1
    }
    update() {
        // update menu state
    }
    draw() {
        // update display
        console.log(this.choices);
        this.background.fillStyle = "rgb(200,0,0)";
        let y = 100
        for (let i = 0; i < this.choices.length; i++) {
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
