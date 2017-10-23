var PHY_SCALE = 10; // physics scale: 1m == 100px
var ANIM_FRAMES = 30 // number of frames for animations

class Ball {
    constructor(menu) {
        var shape = new planck.Circle(PLR_RADIUS /2/ PHY_SCALE)
        var shape = new planck.Circle();
        var body = menu.world.createBody({'type': 'dynamic'})
        body.createFixture({'shape': shape, 'restitution': 0.95, 'density': 0.1, 'm_radius': PLR_RADIUS/2/PHY_SCALE}).setUserData(this)
        body.setLinearDamping(0.05);
        body.setAwake(true);
        body.setActive(true);
        this.body = body;
        this.image = makeImage('img/ball.png')
        this.lastshot = 0
        this.last_owner = null
    }
    shot(when) {
        this.lastshot = when
        this.last_owner = this.owned
        this.owned = false
    }
    set_position(x, y) {
        let temp = new planck.Vec2(x / PHY_SCALE, -y / PHY_SCALE)
        this.body.setLinearVelocity({x: 0, y: 0}, 0.0);
        this.body.setTransform(temp, 0)
    }
    draw(dt, delta) {
        if (!!this.owned) return;
        this.pos = this.body.getPosition();
        let x = PHY_SCALE * (this.pos.x)
        let y = -PHY_SCALE * (this.pos.y)
        app.display.blit(this.image, x - this.image.width / 2, y - this.image.height / 2)
    }
}
class Game {
    constructor(display) {
        this.running = true
        let level = LEVELS[0]
        this.background = makeImage(`img/${level.background}`)
        this.world = new planck.World(new planck.Vec2(0, 0));
        // define game area
        var ground = this.world.createBody()
        fixChain(ground, level.limits)
        for (let rect of level.obstacles) fixRect(ground, rect)
        this.player = new Player(this, makeImage('img/p1.png'));
        this.enemies = [];
        this.ai = new PlayerAI()
        self.ennemy_img = makeImage('img/p2.png')
        app.display.scale_ratio = app.display.height / this.background.height;
        this.ball = new Ball(this)
        this.restart()
    }
    restart() {
        if (this.ball.owned) {
            this.ball.owned.ball = false
            this.ball.owned = false
        }
        this.enemies.forEach(dude => dude.destroy())
        this.enemies.length = 0
        for (var i = 0; i < app.config.DUDES; i++) {
            this.enemies.push(new Player(this, self.ennemy_img));
        }
        // place players
        this.level = LEVELS[0]
        this.reset_ball()
        this.player.set_position(...this.level.starting_points[0], 0, -3.1415 / 2)
        this.enemies.forEach(dude => dude.set_position(...this.level.starting_points[1], 10, 3.1415 / 2))
    }
    reset_ball() {
        this.ball.set_position(
            (this.level.starting_points[0][0] + this.level.starting_points[1][0]) / 2,
            (this.level.starting_points[0][1] + this.level.starting_points[1][1]) / 2
        )
    }
    update(dt, delta) {
        let [bx, by] = [this.ball.pos.x, this.ball.pos.y]
        // test out-of-limits ball position
        if (bx < this.level.limits[0] / PHY_SCALE ||
            by > -this.level.limits[1] / PHY_SCALE ||
            bx > this.level.limits[2] / PHY_SCALE ||
            by < -this.level.limits[5] / PHY_SCALE) {
            this.reset_ball()
        }
        if (app.keys.is_new_press('ESC')) {
            app.push_menu(new MainMenu(app.display));
            this.running = false
        }
        if (!this.running) return // do not allow player interaction if not running
        // simulate
        this.world.step(delta, 3, 3);
        // run AI
        for (var token of this.enemies) {
            this.ai.manage(token, dt, delta)
        }
        // contact handling
        for (let contact = this.world.getContactList(); !!contact; contact = contact.getNext()) {
            if (contact.isTouching()) {
                let fixA = contact.getFixtureA()
                let fixB = contact.getFixtureB()
                let plrA = fixA.getUserData()
                let plrB = fixB.getUserData()
                if (!!!plrA || !!!plrB) continue
                let ball = false
                let plr = false

                if (plrA instanceof Ball) {
                    ball = plrA
                    plr = plrB
                } else if (plrB instanceof Ball) {
                    ball = plrB
                    plr = plrA
                }
                if (!!ball) {
                    console.log("ball collides")
                    // if ball touches player, player takes it
                    plr.take_ball(ball)
                } else {
                    // player to player collision
                    let ballPlr = false
                    if (plrA.ball) {
                        ballPlr = plrA
                        plr = plrB
                    } else if (plrB.ball) {
                        ballPlr = plrB
                        plr = plrA
                    }
                    if (ballPlr) {
                        if (Math.random() < 0.1) { // probability to grab ball
                            plr.take_ball(this.ball)
                        }
                    }
                    // if one was boosted, it pushes
                    if (dt < plrA.boost_dt + 300)
                        plrB.push()
                    if (dt < plrB.boost_dt + 300)
                        plrA.push()
                }

            }
        }
        // direction keys
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
        // special keys
        if (app.keys.is_new_press('SPACE')) {
            this.player.push(dt)
        }
        if (app.keys.is_new_press('1')) {
            this.player.take_ball(this.ball)
        }
    }
    get drawables() {
        return [this.player, this.ball, ...this.enemies]
    }
    draw(dt, delta) {
        // transform world
        app.display.context.save()
        app.display.context.scale(app.display.scale_ratio, app.display.scale_ratio)
        app.display.context.translate(app.display.offset_x, app.display.offset_y)
        // draw scene
        app.display.blit(this.background, 0, 0)
        this.drawables.forEach(item => item.draw(dt, delta))
        // compute next transformation
        let buddies = this.drawables
        let max_x = PHY_SCALE * (buddies.reduce((val, dude) => Math.max(val, dude.pos.x), 0))
        let min_x = PHY_SCALE * (buddies.reduce((val, dude) => Math.min(val, dude.pos.x), app.display.width))
        let max_y = PHY_SCALE * (-buddies.reduce((val, dude) => Math.min(val, dude.pos.y), 0))
        let min_y = PHY_SCALE * (-buddies.reduce((val, dude) => Math.max(val, dude.pos.y), -app.display.height))
        // y is inverted
        min_y -= app.config.zoom_margin
        max_y += app.config.zoom_margin
        min_x -= app.config.zoom_margin
        max_x += app.config.zoom_margin
        let ratio_y = app.display.height / (max_y - min_y)
        let ratio_x = app.display.width / (max_x - min_x)
        // keep most "zoomed out" and only allow range 0.3-1.2 zooming factor
        let ratio = Math.max(app.config.min_zoom, Math.min(app.config.max_zoom, Math.min(ratio_y, ratio_x)))
        // shift to center
        let shift_x = app.display.width - ratio * (max_x - min_x)
        let shift_y = app.display.height - ratio * (max_y - min_y)
        let of_x = -min_x + shift_x / (2 * ratio)
        let of_y = -min_y + shift_y / (2 * ratio)
        app.display.offset_x = (of_x + app.display.offset_x * (ANIM_FRAMES - 1)) / ANIM_FRAMES
        app.display.offset_y = (of_y + app.display.offset_y * (ANIM_FRAMES - 1)) / ANIM_FRAMES

        app.display.scale_ratio = (ratio + app.display.scale_ratio * (ANIM_FRAMES - 1)) / ANIM_FRAMES
        app.display.context.restore()
    }
}
