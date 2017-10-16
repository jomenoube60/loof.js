// vim: ts=4 sw=4 et :

class Menu {
    constructor(display, choices, configs) {
        this.display = display
        this.ctx = display.context; // load ctx
        this.choices = choices; // save menu options
        this.selected = 0;
        this.last_ts = 0;
        this.ts = 0;
        this.repeat_max = 0.2;
        this.dudes_number = configs.DUDES;
        this.dudes_img = new Image(46, 46);
        this.selected_pics = [];
        this.unselected_pics = [];

        var i = 0;    
        var img = null;
        for (i = 0; i < this.choices.length; i++) {
            img = new Image(420, 120);
            img.src = `img/menu_${this.choices[i]}.png`;
            this.unselected_pics.push(img);
        }
        for (i = 0; i < this.choices.length; i++) {
            img = new Image(420, 120);
            img.src = `img/menu_${this.choices[i]}_sel.png`;
            this.selected_pics.push(img);
        }
        this.dudes_img.src = "img/p2.png";
    }
    update(e) {
        var propagate = true;
        console.log("Keypress:", e.keyCode);
        console.log("Dudes Number:", this.dudes_number);
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
        } else if (e.keyCode == '39') {
            propagate = false;
            if (this.dudes_number < 10)
                this.dudes_number += 1;
        } else if (e.keyCode == '37') {
            propagate = false;
            if (this.dudes_number > 1)
                this.dudes_number -= 1;
        }
        return propagate;
    }
    draw(dt, delta) {
        var i = 0,
            x = 100,
            y = 100,
            factor = 0;
        for (i = 0; i < this.choices.length; i++) {
            if (this.selected == i) {
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
        for (i = 0; i < this.dudes_number; i++) {
            this.ctx.drawImage(this.dudes_img, x, y);
            x += 50;

        }

    }
}

class MainMenu extends Menu {
    constructor(display, configs) {
        super(display, ["NewGame", "Enemies", "Quit"], configs);
    }

    update(e) {
        var propagate = super.update(e)
        if (e.keyCode == 27) {
            app.pop_menu()
            propagate = false
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


class Game {
    constructor(display) {
        this.display = display
        this.ctx = display.context
        this.background = new Image()
        this.background.src = 'img/level0.jpg'
    }
    update(e) {
        var propagate = true
        if (e.keyCode == 27) {
            app.push_menu(new MainMenu(this.display))
            propagate = false
        }
        return propagate
    }
    draw(dt, delta) {
        var ref = this.display.height
        this.ctx.drawImage(this.background, 0, 0, ref * 1.7777, ref) // FIXME: fixed ratio for image size
    }
}