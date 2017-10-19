var PLR_SHADOW = -5
var PLR_FORCE = 0.6;
var PLR_RADIUS = 20

class Player {
    constructor(menu, image, team) { // FIXME: pass position instead of team
        var shape = new Box2D.b2CircleShape();
        let fixdef = new Box2D.b2FixtureDef();
        shape.set_m_radius(PLR_RADIUS/PHY_SCALE);
        fixdef.set_shape(shape);
        fixdef.set_restitution(0.9);
        let bd = new Box2D.b2BodyDef();
        bd.set_type(Box2D.b2_dynamicBody);
        var body = menu.world.CreateBody(bd);
        this.world = menu.world
        body.CreateFixture(fixdef)
        var temp = new Box2D.b2Vec2(0.0, 0.0);
        if (team == 0) {
          temp.Set((Math.random() * 100 + 1250) / PHY_SCALE, (Math.random() * 100 - 1035) / PHY_SCALE);
        } else {
          temp.Set((Math.random() * 100 + 2400) / PHY_SCALE, (Math.random() * 100 - 1035) / PHY_SCALE);
        }
        body.SetTransform(temp, 0.0);
        body.SetLinearDamping(0.3);
        body.SetAwake(true);
        body.SetActive(true);
        this.body = body;
        this.image = image;
        this.pawn = makeImage('img/pawn.png')
    }
    destroy() {
        this.world.DestroyBody(this.body)
        this.body = null
        this.image = null
        this.world = null
    }
    push() {
        let force = 5 * PLR_FORCE
        this.body.ApplyLinearImpulse(this.body.GetWorldVector(new Box2D.b2Vec2(0, force)), this.body.GetPosition(), true);
    }
    forward(delta) {
        let force = PLR_FORCE * delta
        this.body.ApplyLinearImpulse(this.body.GetWorldVector(new Box2D.b2Vec2(0, force)), this.body.GetPosition(), true);
    }
    backward(delta) {
        let force = PLR_FORCE * delta
        this.body.ApplyLinearImpulse(this.body.GetWorldVector(new Box2D.b2Vec2(0, -force / 1.25)), this.body.GetPosition(), true);
    }
    left(delta) {
        let angle = 0.37*delta
        this.body.SetTransform(this.body.GetPosition(), this.body.GetAngle() + angle);

    }
    right(delta) {
        let angle = 0.37*delta
        this.body.SetTransform(this.body.GetPosition(), this.body.GetAngle() - angle);
    }

    draw(dt, delta) {
        this.pos = this.body.GetPosition();
        app.display.context.save()
        let x =  PHY_SCALE * (this.pos.get_x())
        let y = -PHY_SCALE * (this.pos.get_y())
        app.display.context.translate(x, y)
        app.display.blit(this.image, -PLR_RADIUS, -PLR_RADIUS)
        app.display.context.rotate(-this.body.GetAngle())
        app.display.context.translate(0, -PLR_RADIUS/2)
        app.display.blit(this.pawn, -this.pawn.width/2, -this.pawn.height/2)
        app.display.context.restore()
    }
}