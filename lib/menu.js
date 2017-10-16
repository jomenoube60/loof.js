// vim: ts=4 sw=4 et :

class Menu {
    constructor(display, choices) {
        this.display = display
        this.ctx = display.context; // load ctx
        this.choices = choices; // save menu options
        this.selected = 0;
        this.last_ts = 0;
        this.ts = 0;
        this.repeat_max = 0.2;
        this.selected_pics = [];
        this.unselected_pics = []
        for (var i = 0; i < this.choices.length; i++) {
            var img = new Image(420, 120);
            img.src = `img/menu_${this.choices[i]}.png`;
            this.unselected_pics.push(img);
        }
        for (var i = 0; i < this.choices.length; i++) {
            var img = new Image(420, 120);
            img.src = `img/menu_${this.choices[i]}_sel.png`;
            this.selected_pics.push(img);
        }
    }
    update(e) {
        var propagate = true;
        console.log("Keypress:", e.keyCode);
        if (e.keyCode == '40' || e.keyCode == '98') {
            propagate = false;
            if (this.selected < this.choices.length - 1) {
                this.last_ts = this.ts;
                this.selected = this.selected + 1;
            }
        } else if (e.keyCode == '38' || e.keyCode == '104') {
            propagate = false;
            if (this.selected > 0) {
                this.last_ts = this.ts;
                this.selected = this.selected - 1;
            }
        }
        return propagate;
    }
    draw(dt, delta) {
        var x = 100,
            y = 100,
            factor = 0;
        for (var i = 0; i < this.choices.length; i++) {
            if (this.selected == i) {
                factor = Math.max(0.15, Math.abs(Math.sin((dt/500)%Math.PI)))
                this.ctx.globalAlpha = 1-factor;
                this.ctx.drawImage(this.unselected_pics[i], x, y);

                this.ctx.globalAlpha = factor;
                this.ctx.drawImage(this.selected_pics[i], x, y);
                this.ctx.globalAlpha = 1.0;
            } else {
                this.ctx.drawImage(this.unselected_pics[i], x, y);
            }
            y += 125;
        }
    }
}

class MainMenu extends Menu {
    constructor(display) {
        super(display, ["NewGame", "Enemies", "Quit"]);
    }
    update(e) {
        var propagate = super.update(e)
        if(e.keyCode == 27) {
            app.pop_menu()
            propagate = false
        }
        return propagate
    }
    draw (dt, delta) {
        // add a semi transparent background
        this.ctx.fillStyle = "rgba(100, 120, 150, 0.4)";
        this.ctx.fillRect(0, 0, this.display.width, this.display.height);
        this.ctx.fillStyle = "white";
        super.draw(dt, delta)
    }
}

class Game {
    constructor(display) {
        this.display = display
        this.ctx = display.context
        this.background = new Image()
        this.background.src = 'img/level0.jpg'
    }
    update(e) {
        var propagate = true
        if(e.keyCode == 27) {
            app.push_menu(new MainMenu(this.display))
            propagate = false
        }
        return propagate
    }
    draw(dt, delta) {
        var ref = this.display.height
        this.ctx.drawImage(this.background, 0, 0, ref*1.7777, ref) // FIXME: fixed ratio for image size
    }
}