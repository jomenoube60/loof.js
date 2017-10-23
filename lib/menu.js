// vim: ts=4 sw=4 et :
class Menu {
    constructor(choices) {
        this.choices = choices; // save menu options
        this.selected = 0;
        this.unselected_pics = this.choices.map(name => makeImage(`img/menu_${name}.png`))
        this.selected_pics = this.choices.map(name => makeImage(`img/menu_${name}_sel.png`))
        this.dudes_img = makeImage("img/p2.png")
        this.age = 0
    }
    update(dt, delta) {
        for (let sp_key of ['ENTER', 'LEFT', 'RIGHT']) {
            if (app.keys.is_new_press(sp_key)) {
                let ev_name = `${this.choices[this.selected]}_${sp_key}`
                if (this[ev_name])
                    this[ev_name]()
            }
            if (app.keys.is_new_press('DOWN')) {
                if (this.selected < this.choices.length - 1) {
                    this.selected = this.selected + 1;
                }
            } else if (app.keys.is_new_press("UP")) {
                if (this.selected > 0) {
                    this.selected = this.selected - 1;
                }
            }
        }
    }
    draw(dt, delta) {
        app.display.context.save()
        let fade_time = 3
        let globalAlpha = 1
        if (this.age < fade_time) {
            globalAlpha = this.age / fade_time
            this.age += delta
            if (this.age > fade_time) this.age = fade_time
        }
        app.display.context.globalAlpha = globalAlpha;
        let i = 0,
            x = 100,
            y = 100,
            factor = 0;
        app.display.context.translate(-100 * (fade_time - this.age), 0)
        for (i = 0; i < this.choices.length; i++) {
            if (this.selected == i) {
                factor = Math.max(0.15, Math.abs(Math.sin((dt / 725) % Math.PI)))
                app.display.context.globalAlpha = globalAlpha * (1 - factor);
                app.display.context.drawImage(this.unselected_pics[i], x, y);
                app.display.context.globalAlpha = globalAlpha * factor;
                app.display.context.drawImage(this.selected_pics[i], x, y);
                app.display.context.globalAlpha = globalAlpha;
            } else {
                app.display.context.drawImage(this.unselected_pics[i], x, y);
            }
            y += 125;
        }
        this.draw_extra()
        app.display.context.restore()
    }
}
class MainMenu extends Menu {
    constructor() {
        super(["NewGame", "Enemies", "Options"]);
    }
    NewGame_ENTER() {
        app.menus[0].restart()
        app.menus[0].running = true
        app.pop_menu()
    }
    Enemies_RIGHT() {
        if (app.config.DUDES < 10) app.config.DUDES += 1;
    }
    Enemies_LEFT() {
        if (app.config.DUDES > 1) app.config.DUDES -= 1;
    }
    Options_RIGHT() {
        app.config.zoom_margin += 50
    }
    Options_LEFT() {
        app.config.zoom_margin -= 50
        if (app.config.zoom_margin < 0) app.config.zoom_margin = 0;
    }
    update(dt, delta) {
        super.update(dt, delta);
        if (app.keys.is_new_press("ESC")) {
            app.pop_menu();
            app.menus[0].running = true
        }
    }
    draw(dt, delta) {
        // add a semi transparent background
        app.display.context.fillStyle = "rgba(100, 120, 150, 0.4)";
        app.display.context.fillRect(0, 0, app.display.width, app.display.height);
        app.display.context.fillStyle = "white";
        super.draw(dt, delta);
    }
    draw_extra() {
        let y = 250;
        let x = 500;
        for (let i = 0; i < app.config.DUDES; i++) {
            app.display.context.drawImage(this.dudes_img, x, y);
            x += 50;
        }
    }
}
