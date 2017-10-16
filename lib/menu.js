// vim: ts=4 sw=4 et :

class Menu {
    constructor(display, choices) {
        this.display = display
        this.ctx = display.context; // load ctx
        this.choices = choices; // save menu options
        this.selected = 0;
        this.dudes_img = new Image()
        this.selected_pics = [];
        this.unselected_pics = [];

        var i = 0;    
        var img = null;
        this.unselected_pics = this.choices.map(name => {img = new Image(); img.src = `img/menu_${name}.png`; return img})
        this.selected_pics = this.choices.map(name => {img = new Image(); img.src = `img/menu_${name}_sel.png`; return img})
        this.dudes_img.src = "img/p2.png";
    }

  update(e) {
    var propagate = true;
    if (this.key.pressed(e, "DOWN")) {
      propagate = false;
      if (this.selected < this.choices.length - 1) {
        this.last_ts = this.ts;
        this.selected = this.selected + 1;
      }
    } else if (this.key.pressed(e, "UP")) {
      propagate = false;
      if (this.selected > 0) {
        this.last_ts = this.ts;
        this.selected = this.selected - 1;
      }
    } else if (this.key.pressed(e, "RIGHT") && this.selected == 1) {
      propagate = false;
      if (app.config.DUDES < 10)
        app.config.DUDES += 1;
    } else if (this.key.pressed(e, "LEFT") && this.selected == 1) {
      propagate = false;
      if (app.config.DUDES > 1)
        app.config.DUDES -= 1;
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
        for (i = 0; i < app.config.DUDES; i++) {
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
    if (this.key.pressed(e, "ESC")) {
      app.pop_menu();
      propagate = false;
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
    	this.key = new KeyHandler();
    }
    update(e) {
        var propagate = true
    if (this.key.pressed(e, "ESC")) {
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
