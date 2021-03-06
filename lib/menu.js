// vim: ts=4 sw=4 et :
import {makeImage} from './utils'

export var ANIM_FRAMES = 30 // number of frames for animations

class Menu {
    constructor(choices) {
        this.choices = choices; // save menu options
        this.selected = 0;
        this.unselected_pics = this.choices.map(name => makeImage(`img/menu_${name}.png`))
        this.selected_pics = this.choices.map(name => makeImage(`img/menu_${name}_sel.png`))
        this.age = 0
        this.fade_time = 3
        this.pos = {
            x: -150,
            y: 0
        }
        this.requested_pos = {
            x: 0,
            y: 0
        }
    }
    update(dt, delta) {
        this.pos.x = ((ANIM_FRAMES - 1) * this.pos.x + this.requested_pos.x) / ANIM_FRAMES
        this.pos.y = ((ANIM_FRAMES - 1) * this.pos.y + this.requested_pos.y) / ANIM_FRAMES
        for (const sp_key of ['ENTER', 'LEFT', 'RIGHT']) {
            if (app.keys.is_new_press(sp_key)) {
                let ev_name = `${this.choices[this.selected]}_${sp_key}`
                if (this[ev_name])
                    this[ev_name](dt)
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
        let globalAlpha = 1
        if (this.age < this.fade_time) {
            globalAlpha = this.age / this.fade_time
            this.age += delta
            if (this.age > this.fade_time) this.age = this.fade_time
        }
        app.display.context.globalAlpha = globalAlpha;
        app.display.context.translate(this.pos.x, this.pos.y)
        let i = 0,
            x = 100,
            y = 100,
            factor = 0;
        for (i = 0; i < this.choices.length; i++) {
            if (this.selected == i) {
                factor = Math.max(0.15, Math.abs(Math.sin((dt / 725) % Math.PI)))
                app.display.blit(this.unselected_pics[i], x, y, {
                    opacity: globalAlpha * (1 - factor)
                })
                app.display.blit(this.selected_pics[i], x, y, {
                    opacity: globalAlpha * factor
                })
            } else {
                app.display.context.drawImage(this.unselected_pics[i], x, y);
            }
            y += 125;
        }
        this.draw_extra()
        app.display.context.restore()
    }
}
export class MainMenu extends Menu {
    constructor() {
        super(["NewGame", "Enemies", "Duration"]);
        this.dudes_img = makeImage("img/p2.png")
    }
    NewGame_ENTER(dt) {
        app.menus[0].new_game(dt)
        app.pop_menu()
    }
    Enemies_RIGHT() {
        if (app.config.DUDES < 10) app.config.DUDES += 1;
    }
    Enemies_LEFT() {
        if (app.config.DUDES > 1) app.config.DUDES -= 1;
    }
    Duration_RIGHT() {
        if (app.config.DURATION < 10) app.config.DURATION += 1;
    }
    Duration_LEFT() {
        if (app.config.DURATION > 1) app.config.DURATION -= 1;
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
        app.display.context.fillStyle = `rgba(100, 120, 150, ${(1.0/this.fade_time)*this.age*0.8})`;
        app.display.context.fillRect(0, 0, app.display.width, app.display.height);
        app.display.context.fillStyle = "white";
        super.draw(dt, delta);
    }
    draw_extra() {
        let y1 = 250;
        let y2 = 375;
        let x1 = 500;
        let x2 = 500;


        for (let i = 0; i < app.config.DUDES; i++) {
            app.display.context.drawImage(this.dudes_img, x1, y1);
            x1 += 50;
        }
        for (var i = 0; i < app.config.DURATION; i++) {
          app.display.context.drawImage(this.dudes_img, x2, y2);
          x2 += 50;
        }
    }
}
export class ScoreMenu extends MainMenu {
    constructor(winner) {
        super([])
        this.winner = winner
        this.cup_imgs = [
            makeImage("img/cup1.png"),
            makeImage("img/cup2.png")
        ]
    }
    draw_extra() {
        let n = this.winner
        app.display.context.drawImage(this.cup_imgs[n-1], 500, 60)
        super.draw_extra()
    }
}
