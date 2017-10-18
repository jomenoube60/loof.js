var PHY_SCALE = 10; // physics scale: 1m == 100px
var PLR_RADIUS = 20 / PHY_SCALE;
var PLR_FORCE = 2;
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
        var pos = this.body.GetPosition();
        app.display.blit(this.image, PHY_SCALE * (pos.get_x() - PLR_RADIUS) , -PHY_SCALE * (pos.get_y() + PLR_RADIUS))
    }
}
class Game {
    constructor(display) {
        this.background = makeImage('img/level0.jpg');
        using(Box2D, "b2d.*");
        this.world = new Box2D.b2World(new Box2D.b2Vec2(0, 0));
        // define game area
        var ground = this.world.CreateBody(new Box2D.b2BodyDef());
        fixChain(ground, [950, 525, 2950, 525, 2950, 1650, 950, 1650]);
        this.player = new Player(this, makeImage('img/p1.png'));
        this.enemies = [];
        let ennemy_img = makeImage('img/p2.png')
        for (var i = 0; i < app.config.DUDES; i++) {
            this.enemies.push(new Player(this, ennemy_img));
        }
        app.display.scale_ratio = app.display.height / this.background.height;
        app.display.offset = 0
    }
    update(dt, delta) {
        let force = PLR_FORCE * delta
        if (app.keys.is_pressed('1')) {
            app.display.offset += 1
        }
        if (app.keys.is_pressed('3')) {
            app.display.offset -= 1
        }
        if (app.keys.is_pressed('PLUS')) {
            app.display.scale_ratio += 0.001
        }
        if (app.keys.is_pressed('MINUS')) {
            app.display.scale_ratio -= 0.001
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
        var ref = app.display.height;
        app.display.context.save()
        // TODO: gather information about max&min (x,y) coordinates to compute scale & translate
        app.display.context.translate(app.display.offset, app.display.offset)
        app.display.context.scale(app.display.scale_ratio, app.display.scale_ratio)
        app.display.blit(this.background, 0, 0)
        this.world.Step(delta, 3, 3);
        this.player.draw(dt, delta);
        this.enemies.map(dude => dude.draw(dt, delta));
        app.display.context.restore()
    }
}
