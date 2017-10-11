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
    }
}

class MainMenu {
    constructor() {
        super.constructor('mainmenu', [])
    }
}
