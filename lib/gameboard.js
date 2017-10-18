var PHY_SCALE = 10; // physics scale: 1m == 100px
var PLR_RADIUS = 20 / PHY_SCALE;
var PLR_SHADOW = -5
var PLR_FORCE = 0.3;
var ANIM_FRAMES = 10 // number of frames for animations
class Player {
    constructor(menu, image) {
        var shape = new Box2D.b2CircleShape();
        var fixdef = new Box2D.b2FixtureDef();
        shape.set_m_radius(PLR_RADIUS);
        fixdef.set_shape(shape);
        fixdef.set_restitution(0.3);
        var bd = new Box2D.b2BodyDef();
        bd.set_type(Box2D.b2_dynamicBody);
        var body = menu.world.CreateBody(bd);
        body.CreateFixture(fixdef);
        var temp = new Box2D.b2Vec2(0.0, 0.0);
        temp.Set(1300 / PHY_SCALE, -1085 / PHY_SCALE);
        body.SetTransform(temp, 0.0);
        body.SetLinearDamping(0.1);
        body.SetAwake(true);
        body.SetActive(true);
        this.body = body;
        this.image = image;
    }
    draw(dt, delta) {
        this.pos = this.body.GetPosition();
        app.display.blit(this.image, PLR_SHADOW + PHY_SCALE * (this.pos.get_x() - PLR_RADIUS), PLR_SHADOW + -PHY_SCALE * (this.pos.get_y() + PLR_RADIUS))
    }
}
class Game {
    constructor(display) {
        let level = LEVELS[0]
        this.background = makeImage(`img/${level.background}`)
        using(Box2D, "b2d.*");
        this.world = new Box2D.b2World(new Box2D.b2Vec2(0, 0));
        // define game area
        var ground = this.world.CreateBody(new Box2D.b2BodyDef());
        fixChain(ground, level.limits)
        for (let rect of level.obstacles) fixRect(ground, rect)

        this.player = new Player(this, makeImage('img/p1.png'));
        this.enemies = [];
        let ennemy_img = makeImage('img/p2.png')
        for (var i = 0; i < app.config.DUDES; i++) {
            this.enemies.push(new Player(this, ennemy_img));
        }
        app.display.scale_ratio = app.display.height / this.background.height;
    }
    update(dt, delta) {
        let force = PLR_FORCE * delta
        if (app.keys.is_pressed('PLUS')) {
            app.display.scale_ratio += 0.1
        }
        if (app.keys.is_pressed('MINUS')) {
            app.display.scale_ratio -= 0.1
        }
        if (app.keys.is_pressed('UP')) {
            this.player.body.ApplyLinearImpulse(this.player.body.GetWorldVector(new Box2D.b2Vec2(0, force)), this.player.body.GetPosition(), true);
        }
        if (app.keys.is_pressed('DOWN')) {
            this.player.body.ApplyLinearImpulse(this.player.body.GetWorldVector(new Box2D.b2Vec2(0, -force / 1.25)), this.player.body.GetPosition(), true);
        }
        if (app.keys.is_pressed('RIGHT')) {
            this.player.body.SetTransform(this.player.body.GetPosition(), this.player.body.GetAngle() - 0.37 * delta);
        }
        if (app.keys.is_pressed('LEFT')) {
            this.player.body.SetTransform(this.player.body.GetPosition(), this.player.body.GetAngle() + 0.37 * delta);
        }
        if (app.keys.is_new_press('ESC')) {
            app.push_menu(new MainMenu(app.display));
        }
    }
    draw(dt, delta) {
        app.display.context.save()
        app.display.context.scale(app.display.scale_ratio, app.display.scale_ratio)
        app.display.context.translate(app.display.offset_x, app.display.offset_y)
        app.display.blit(this.background, 0, 0)
        this.world.Step(delta, 3, 3);
        this.player.draw(dt, delta);
        this.enemies.map(dude => dude.draw(dt, delta));
        let buddies = [this.player, ...this.enemies]
        let max_x = buddies.reduce((val, dude) => Math.max(val, dude.pos.get_x()), 0)
        let min_x = buddies.reduce((val, dude) => Math.min(val, dude.pos.get_x()), app.display.width)
        let max_y = buddies.reduce((val, dude) => Math.min(val, dude.pos.get_y()), 0)
        let min_y = buddies.reduce((val, dude) => Math.max(val, dude.pos.get_y()), -app.display.height)
        let margin = 20
        min_y += margin
        max_y -= margin
        min_x -= margin
        max_x += margin
        app.display.offset_x = (-min_x * PHY_SCALE + app.display.offset_x * (ANIM_FRAMES - 1)) / ANIM_FRAMES
        app.display.offset_y = (min_y * PHY_SCALE + app.display.offset_y * (ANIM_FRAMES - 1)) / ANIM_FRAMES
        let ratio_y = app.display.height / (Math.abs(max_y - min_y) * PHY_SCALE)
        let ratio_x = app.display.width / (Math.abs(max_x - min_x) * PHY_SCALE)
        // keep most "zoomed out" and only allow range 0.3-1.2 zooming factor
        let ratio = Math.max(0.3, Math.min(1.2, Math.min(ratio_y, ratio_x)))
        app.display.scale_ratio = (ratio + app.display.scale_ratio * (ANIM_FRAMES - 1)) / ANIM_FRAMES
        app.display.context.restore()
    }
}
