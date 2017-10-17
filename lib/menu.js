// vim: ts=4 sw=4 et :
class Menu {
    constructor(display, choices) {
        this.display = display
        this.ctx = display.context; // load ctx
        this.choices = choices; // save menu options
        this.selected = 0;
        this.unselected_pics = this.choices.map(name => makeImage(`img/menu_${name}.png`))
        this.selected_pics = this.choices.map(name => makeImage(`img/menu_${name}_sel.png`))
        this.dudes_img = makeImage("img/p2.png")
        this.key = new KeyHandler()
    }
    update(e) {
        var propagate = true;
        if(this.key.pressed(e, "DOWN")) {
            propagate = false;
            if(this.selected < this.choices.length - 1) {
                this.selected = this.selected + 1;
            }
        } else if(this.key.pressed(e, "UP")) {
            propagate = false;
            if(this.selected > 0) {
                this.selected = this.selected - 1;
            }
        } else if(this.key.pressed(e, "RIGHT") && this.selected == 1) {
            propagate = false;
            if(app.config.DUDES < 10) app.config.DUDES += 1;
        } else if(this.key.pressed(e, "LEFT") && this.selected == 1) {
            propagate = false;
            if(app.config.DUDES > 1) app.config.DUDES -= 1;
        }
        return propagate;
    }
    draw(dt, delta) {
        var i = 0,
            x = 100,
            y = 100,
            factor = 0;
        for(i = 0; i < this.choices.length; i++) {
            if(this.selected == i) {
                factor = Math.max(0.15, Math.abs(Math.sin((dt / 725) % Math.PI)))
                this.ctx.globalAlpha = 1 - factor;
                this.ctx.drawImage(this.unselected_pics[i], x, y);
                this.ctx.globalAlpha = factor;
                this.ctx.drawImage(this.selected_pics[i], x, y);
                this.ctx.globalAlpha = 1.0;
            } else {
                this.ctx.drawImage(this.unselected_pics[i], x, y);
            }
            y += 125;
        }
        y = 250;
        x = 500;
        for(i = 0; i < app.config.DUDES; i++) {
            this.ctx.drawImage(this.dudes_img, x, y);
            x += 50;
        }
    }
}
class MainMenu extends Menu {
    constructor(display) {
        super(display, ["NewGame", "Enemies"]);
    }
    update(e) {
        var propagate = super.update(e)
        if(this.key.pressed(e, "ESC")) {
            app.pop_menu();
            propagate = false;
        }
        return propagate
    }
    draw(dt, delta) {
        // add a semi transparent background
        this.ctx.fillStyle = "rgba(100, 120, 150, 0.4)";
        this.ctx.fillRect(0, 0, this.display.width, this.display.height);
        this.ctx.fillStyle = "white";
        super.draw(dt, delta)
    }
}
