var PHY_SCALE = 10; // physics scale: 1m == 100px
var ANIM_FRAMES = 30 // number of frames for animations

class Game {
    constructor(display) {
        let level = LEVELS[0]
        this.background = makeImage(`img/${level.background}`)
        this.world = new Box2D.b2World(new Box2D.b2Vec2(0, 0));

        // define game area
        var ground = this.world.CreateBody(new Box2D.b2BodyDef());
        fixChain(ground, level.limits)
        for (let rect of level.obstacles) fixRect(ground, rect)
        this.player = new Player(this, makeImage('img/p1.png'));
        this.enemies = [];
        self.ennemy_img = makeImage('img/p2.png')
        app.display.scale_ratio = app.display.height / this.background.height;
        this.restart()
    }
    restart() {
        console.log(app.config.DUDES)
        this.enemies.forEach(dude => dude.destroy())
        this.enemies.length = 0
        for (var i = 0; i < app.config.DUDES; i++) {
            // TODO: compute positions of players given some level configuration
            this.enemies.push(new Player(this, self.ennemy_img));
        }
        // place players
        let level = LEVELS[0]
        this.player.set_position(... level.starting_points[0], 0, -3.1415/2)
        this.enemies.forEach(dude => dude.set_position(... level.starting_points[1], 10, 3.1415/2))
    }
    update(dt, delta) {
        if (app.keys.is_pressed('UP')) {
            this.player.forward(delta)
        } else if (app.keys.is_pressed('DOWN')) {
            this.player.backward(delta)
        }
        if (app.keys.is_pressed('RIGHT')) {
            this.player.right(delta)
        }
        if (app.keys.is_pressed('LEFT')) {
            this.player.left(delta)
        }
        if (app.keys.is_new_press('SPACE')) {
            this.player.push()
        }
        if (app.keys.is_new_press('ESC')) {
            app.push_menu(new MainMenu(app.display));
        }
    }
    draw(dt, delta) {
        // simulate
        this.world.Step(delta, 3, 3);
        // transform world
        app.display.context.save()
        app.display.context.scale(app.display.scale_ratio, app.display.scale_ratio)
        app.display.context.translate(app.display.offset_x, app.display.offset_y)
        // draw scene
        app.display.blit(this.background, 0, 0)
        this.player.draw(dt, delta);
        this.enemies.map(dude => dude.draw(dt, delta));
        // compute next transformation
        let buddies = [this.player, ...this.enemies]
        let max_x = buddies.reduce((val, dude) => Math.max(val, dude.pos.get_x()), 0)
        let min_x = buddies.reduce((val, dude) => Math.min(val, dude.pos.get_x()), app.display.width)
        let max_y = buddies.reduce((val, dude) => Math.min(val, dude.pos.get_y()), 0)
        let min_y = buddies.reduce((val, dude) => Math.max(val, dude.pos.get_y()), -app.display.height)
        min_y += app.config.zoom_margin
        max_y -= app.config.zoom_margin
        min_x -= app.config.zoom_margin
        max_x += app.config.zoom_margin
        app.display.offset_x = (-min_x * PHY_SCALE + app.display.offset_x * (ANIM_FRAMES - 1)) / ANIM_FRAMES
        app.display.offset_y = (min_y * PHY_SCALE + app.display.offset_y * (ANIM_FRAMES - 1)) / ANIM_FRAMES
        let ratio_y = app.display.height / (Math.abs(max_y - min_y) * PHY_SCALE)
        let ratio_x = app.display.width / (Math.abs(max_x - min_x) * PHY_SCALE)
        // keep most "zoomed out" and only allow range 0.3-1.2 zooming factor
        let ratio = Math.max(app.config.min_zoom, Math.min(app.config.max_zoom, Math.min(ratio_y, ratio_x)))
        app.display.scale_ratio = (ratio + app.display.scale_ratio * (ANIM_FRAMES - 1)) / ANIM_FRAMES
        app.display.context.restore()
    }
}
