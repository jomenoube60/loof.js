var PHY_SCALE = 10 // physics scale: 1m == 100px
class Game {
    constructor(display) {
        this.display = display
        this.ctx = display.context
        this.key = new KeyHandler()
        this.background = makeImage('img/level0.jpg')
        using(Box2D, "b2d.*")
        var gravity = new Box2D.b2Vec2(0, 0)
        this.world = new Box2D.b2World(gravity)
        var bd_ground = new Box2D.b2BodyDef();
        var ground = this.world.CreateBody(bd_ground);
        var shape0 = new b2EdgeShape()
        var fixdef = new Box2D.b2FixtureDef();

        // fix terrain borders
        shape0.Set(new b2Vec2(950/PHY_SCALE, -525 / PHY_SCALE), new b2Vec2(2950/PHY_SCALE, -525 / PHY_SCALE))
        fixdef.set_shape(shape0)
        ground.CreateFixture(fixdef)

        shape0.Set(new b2Vec2(2950/PHY_SCALE, -525/PHY_SCALE), new b2Vec2(2950/PHY_SCALE, -1650/PHY_SCALE))
        fixdef.set_shape(shape0)
        ground.CreateFixture(fixdef)

        shape0.Set(new b2Vec2(2950/PHY_SCALE, -1650/PHY_SCALE), new b2Vec2(950/PHY_SCALE, -1650/PHY_SCALE))
        fixdef.set_shape(shape0)
        ground.CreateFixture(fixdef)

        shape0.Set(new b2Vec2(950/PHY_SCALE, -525/PHY_SCALE), new b2Vec2(950/PHY_SCALE, -1650/PHY_SCALE))
        fixdef.set_shape(shape0)
        ground.CreateFixture(fixdef)

        // create a body
        var shape = new Box2D.b2CircleShape();
        shape.set_m_radius(0.2)
        fixdef = new Box2D.b2FixtureDef();
        fixdef.set_shape(shape)
        fixdef.set_restitution(0.3)
        var bd = new Box2D.b2BodyDef();
        bd.set_type(Box2D.b2_dynamicBody);
        var body = this.world.CreateBody(bd);
        body.CreateFixture(fixdef)
        this.bodies = [body]
        this.bodies.forEach(body => {
            var temp = new Box2D.b2Vec2(0.0, 0.0);
            temp.Set(1500 / PHY_SCALE, -1000 / PHY_SCALE)
            body.SetTransform(temp, 0.0);
            body.SetAwake(true);
            body.SetActive(true);
        })
        this.dude_img = makeImage("img/p2.png")
    }
    update(e) {
        var propagate = true
        if(this.key.pressed(e, 'UP')) {
            this.bodies[0].ApplyForceToCenter(new Box2D.b2Vec2(0, 10))
            propagate = false
        }
        else if(this.key.pressed(e, 'DOWN')) {
            this.bodies[0].ApplyForceToCenter(new Box2D.b2Vec2(0, -10))
            propagate = false
        }
        else if(this.key.pressed(e, 'RIGHT')) {
            this.bodies[0].ApplyForceToCenter(new Box2D.b2Vec2(10, 0))
            propagate = false
        }
        else if(this.key.pressed(e, 'LEFT')) {
            this.bodies[0].ApplyForceToCenter(new Box2D.b2Vec2(-10, 0))
            propagate = false
        }
        else if(this.key.pressed(e, 'ESC')) {
            app.push_menu(new MainMenu(this.display))
            propagate = false
        }
        return propagate
    }
    draw(dt, delta) {
        var scale_ratio = this.display.height / this.background.height
        var ref = this.display.height
        this.ctx.drawImage(this.background, 0, 0, ref * 1.7777, ref) // FIXME: fixed ratio for image size
        this.world.Step(delta, 3, 3);
        var pos = this.bodies[0].GetPosition()
        this.ctx.drawImage(this.dude_img, PHY_SCALE * pos.get_x() * scale_ratio, -PHY_SCALE * scale_ratio * pos.get_y(), this.dude_img.width*scale_ratio, this.dude_img.height*scale_ratio); // WARNING: y coordinates inverted
    }
}
