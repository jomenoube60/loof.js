// vim: ts=4 sw=4 et :
class Menu {
    constructor(choices) {
        this.choices = choices; // save menu options
        this.selected = 0;
        this.unselected_pics = this.choices.map(name => makeImage(`img/menu_${name}.png`))
        this.selected_pics = this.choices.map(name => makeImage(`img/menu_${name}_sel.png`))
        this.dudes_img = makeImage("img/p2.png")
    }
    update(dt, delta) {
        if (app.keys.is_new_press('DOWN')) {
            if(this.selected < this.choices.length - 1) {
                this.selected = this.selected + 1;
            }
        } else if(app.keys.is_new_press("UP")) {
            if(this.selected > 0) {
                this.selected = this.selected - 1;
            }
        } else if(app.keys.is_new_press("RIGHT") && this.selected == 1) {
            if(app.config.DUDES < 10) app.config.DUDES += 1;
        } else if(app.keys.is_new_press("LEFT") && this.selected == 1) {
            if(app.config.DUDES > 1) app.config.DUDES -= 1;
        }
    }
    draw(dt, delta) {
        var i = 0,
            x = 100,
            y = 100,
            factor = 0;
        for(i = 0; i < this.choices.length; i++) {
            if(this.selected == i) {
                factor = Math.max(0.15, Math.abs(Math.sin((dt / 725) % Math.PI)))
                app.display.context.globalAlpha = 1 - factor;
                app.display.context.drawImage(this.unselected_pics[i], x, y);
                app.display.context.globalAlpha = factor;
                app.display.context.drawImage(this.selected_pics[i], x, y);
                app.display.context.globalAlpha = 1.0;
            } else {
                app.display.context.drawImage(this.unselected_pics[i], x, y);
            }
            y += 125;
        }
        y = 250;
        x = 500;
        for(i = 0; i < app.config.DUDES; i++) {
            app.display.context.drawImage(this.dudes_img, x, y);
            x += 50;
        }
    }
}
class MainMenu extends Menu {
    constructor() {
        super(["NewGame", "Enemies"]);
    }
    update(dt, delta) {
        super.update(dt, delta)
        if(app.keys.is_new_press("ESC")) {
            app.pop_menu();
        }
    }
    draw(dt, delta) {
        // add a semi transparent background
        app.display.context.fillStyle = "rgba(100, 120, 150, 0.4)";
        app.display.context.fillRect(0, 0, app.display.width, app.display.height);
        app.display.context.fillStyle = "white";
        super.draw(dt, delta)
    }
}
