var PHY_SCALE = 10 // physics scale: 1m == 100px
var PLR_RADIUS = 20 / PHY_SCALE
var PLR_FORCE = 5
class Game {
    constructor(display) {
        this.display = display
        this.ctx = display.context
        this.key = new KeyHandler()
        this.background = makeImage('img/level0.jpg')
        using(Box2D, "b2d.*")
        this.world = new Box2D.b2World(new Box2D.b2Vec2(0, 0))

        // define game area
        var ground = this.world.CreateBody(new Box2D.b2BodyDef())
        fixChain(ground, [950, 525, 2950, 525, 2950, 1650, 950, 1650])

        // create a body
        var shape = new Box2D.b2CircleShape();
        var fixdef = new Box2D.b2FixtureDef();
        shape.set_m_radius(PLR_RADIUS)
        fixdef.set_shape(shape)
        fixdef.set_restitution(0.3)
        var bd = new Box2D.b2BodyDef();
        bd.set_type(Box2D.b2_dynamicBody);
        var body = this.world.CreateBody(bd);
        body.CreateFixture(fixdef)
        this.bodies = [body]
        this.bodies.forEach(body => {
            var temp = new Box2D.b2Vec2(0.0, 0.0);
            temp.Set(1300 / PHY_SCALE, -1085 / PHY_SCALE)
            body.SetTransform(temp, 0.0);
            body.SetLinearDamping(0.1)
            body.SetAwake(true);
            body.SetActive(true);
        })
        this.dude_img = makeImage("img/p2.png")
    }
    update(e) {
        var propagate = true
        if(this.key.pressed(e, 'UP')) {
            this.bodies[0].ApplyLinearImpulse(this.bodies[0].GetWorldVector(new Box2D.b2Vec2(0, PLR_FORCE)), this.bodies[0].GetPosition(), true);
        } else if(this.key.pressed(e, 'DOWN')) {
            this.bodies[0].ApplyLinearImpulse(this.bodies[0].GetWorldVector(new Box2D.b2Vec2(0, -PLR_FORCE / 1.25)), this.bodies[0].GetPosition(), true);
            propagate = false
        } else if(this.key.pressed(e, 'RIGHT')) {
            this.bodies[0].SetTransform(this.bodies[0].GetPosition(), this.bodies[0].GetAngle() - 0.75);
            // this.bodies[0].ApplyForceToCenter(new Box2D.b2Vec2(PLR_FORCE, 0))
            propagate = false
        } else if(this.key.pressed(e, 'LEFT')) {
            this.bodies[0].SetTransform(this.bodies[0].GetPosition(), this.bodies[0].GetAngle() + 0.75);
            // this.bodies[0].ApplyForceToCenter(new Box2D.b2Vec2(-PLR_FORCE, 0))
            propagate = false
        } else if(this.key.pressed(e, 'ESC')) {
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
        this.ctx.drawImage(this.dude_img, PHY_SCALE * (pos.get_x() - PLR_RADIUS) * scale_ratio, -PHY_SCALE * scale_ratio * (pos.get_y() + PLR_RADIUS), this.dude_img.width * scale_ratio, this.dude_img.height * scale_ratio); // WARNING: y coordinates inverted
    }
}
