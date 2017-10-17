var PHY_SCALE = 100 // physics scale: 1m == 100px

class Game {
    constructor(display) {
        this.display = display
        this.ctx = display.context
        this.key = new KeyHandler()
        this.background = makeImage('img/level0.jpg')

        using(Box2D, "b2d.*")
        var gravity = new Box2D.b2Vec2(0, -9.81)
        this.world = new Box2D.b2World(gravity)

        var bd_ground = new Box2D.b2BodyDef();
        var ground = this.world.CreateBody(bd_ground);
        var shape0 = new b2EdgeShape()
        shape0.Set( new b2Vec2(-100, -525/PHY_SCALE), new b2Vec2(1000, -525/PHY_SCALE))
        var fixdef = new Box2D.b2FixtureDef();
        fixdef.set_shape(shape0)
        ground.CreateFixture(fixdef)

        // create a body
        var shape = new Box2D.b2CircleShape();
        shape.set_m_radius(0.2)
    
        fixdef = new Box2D.b2FixtureDef();
        fixdef.set_shape(shape)
        fixdef.set_restitution(0.7)
        var bd = new Box2D.b2BodyDef();
        bd.set_type(Box2D.b2_dynamicBody);
        var body = this.world.CreateBody(bd);
        body.CreateFixture(fixdef)

        this.bodies = [body]
        this.bodies.forEach(body => {
            var temp = new Box2D.b2Vec2(0.0, 0.0);
            temp.Set(20/PHY_SCALE, 20/PHY_SCALE)
            body.SetTransform(temp, 0.0);

            body.SetAwake(true);
            body.SetActive(true);
        })

        this.dude_img = makeImage("img/p2.png")
    }
    update(e) {
        var propagate = true
        if (this.key.pressed(e, 'UP')) {
            this.bodies[0].ApplyForce(-100, -100)
            propagate = false
        }
        if (this.key.pressed(e, 'RIGHT')) {
            this.bodies[0].ApplyForce(10, 10)
            propagate = false
        }
        if (this.key.pressed(e, 'ESC')) {
            app.push_menu(new MainMenu(this.display))
            propagate = false
        }
        return propagate
    }
    draw(dt, delta) {
        var ref = this.display.height
        this.ctx.drawImage(this.background, 0, 0) //, ref * 1.7777, ref) // FIXME: fixed ratio for image size

        this.world.Step(delta, 6, 6);
        var pos = this.bodies[0].GetPosition()
        this.ctx.drawImage(this.dude_img, PHY_SCALE*pos.get_x(), -PHY_SCALE*pos.get_y()) // WARNING: y coordinates inverted
    }
}
