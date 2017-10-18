var PLR_SHADOW = -5
var PLR_FORCE = 0.6;

class Player {
    constructor(menu, image) {
        var shape = new Box2D.b2CircleShape();
        var fixdef = new Box2D.b2FixtureDef();
        shape.set_m_radius(PLR_RADIUS);
        fixdef.set_shape(shape);
        fixdef.set_restitution(0.9);
        var bd = new Box2D.b2BodyDef();
        bd.set_type(Box2D.b2_dynamicBody);
        var body = menu.world.CreateBody(bd);
        body.CreateFixture(fixdef);
        var temp = new Box2D.b2Vec2(0.0, 0.0);
        temp.Set(1300 / PHY_SCALE, -1085 / PHY_SCALE);
        body.SetTransform(temp, 0.0);
        body.SetLinearDamping(0.3);
        body.SetAwake(true);
        body.SetActive(true);
        this.body = body;
        this.image = image;
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
        app.display.blit(this.image, PLR_SHADOW + PHY_SCALE * (this.pos.get_x() - PLR_RADIUS), PLR_SHADOW + -PHY_SCALE * (this.pos.get_y() + PLR_RADIUS))
    }
}