var PLR_SHADOW = -5
var PLR_FORCE = 0.8;
var PLR_RADIUS = 20

class Player {
    constructor(menu, image) {
        var shape = new Box2D.b2CircleShape();
        let fixdef = new Box2D.b2FixtureDef();
        shape.set_m_radius(PLR_RADIUS / PHY_SCALE);
        fixdef.set_shape(shape);
        fixdef.set_restitution(0.9);
        let bd = new Box2D.b2BodyDef();
        bd.set_type(Box2D.b2_dynamicBody);
        var body = menu.world.CreateBody(bd);
        this.world = menu.world
        body.CreateFixture(fixdef)
        body.SetLinearDamping(0.3);
        body.SetAwake(true);
        body.SetActive(true);
        this.body = body;
        this.image = image;
        this.pawn = makeImage('img/pawn.png')
        this.ball = false
        this.boost_dt = 0
    }
    take_ball(ball) {
        if (ball.owned) {
            ball.owned.ball = false;
        }
        ball.body.SetActive(false);
        this.ball = ball
        ball.owned = this
    }
    distance_from(x, y) {
        return Math.sqrt(Math.pow(x - this.pos.get_x(), 2) + Math.pow(y - this.pos.get_y(), 2))
    }
    set_position(x, y, randomicity = 0, rotation = 0) {
        let temp = new Box2D.b2Vec2(0.0, 0.0);
        this.body.SetLinearVelocity(temp, 0.0);
        temp.Set(x / PHY_SCALE + (Math.random() * randomicity - randomicity / 2), -y / PHY_SCALE + (Math.random() * randomicity - randomicity / 2))
        this.body.SetTransform(temp, rotation);
    }
    destroy() {
        this.world.DestroyBody(this.body)
        this.body = null
        this.image = null
        this.world = null
    }
    distance(coords, coord2) {
      if (coord2 != null) {
          coords = [coords, coord2]
        }
      else if (coords[1] == null) {
          coords = [coords.x, coords.y]
        }
      var x = coords[0]-this.body.GetPosition().get_x()
      var y = coords[1]-this.body.GetPosition().get_y()
      return Math.sqrt(Math.pow(Math.abs(x),2) + Math.pow(Math.abs(y),2))
    }
    targets(coords, coord2 ,delta) {
      var x = coords[0]-this.pos.get_x()
      var y = coords[1]-this.pos.get_y()
      var distance = Math.sqrt(Math.pow(Math.abs(x),2) + Math.pow(Math.abs(y),2))
      var angle =  Math.acos(x / distance )
      var myangle = (Math.PI/2 + this.body.GetAngle()) % (2*Math.PI)
      var sync = Math.abs(angle-myangle) < (delta /360 *(2*Math.PI))
      return sync, angle
    }
    push(dt) {
        if (!!this.ball) {
            this.ball.owned = false
            let temp = new Box2D.b2Vec2(0.0, 0.0)
            let angle = this.body.GetAngle()
            let [x, y] = [2.5 * Math.sin(-angle), 2.5 * Math.cos(-angle)]
            temp.Set(this.pos.get_x() + x, this.pos.get_y() + y)
            this.ball.body.SetTransform(temp, angle)
            this.ball.body.SetActive(true)
            temp = this.body.GetLinearVelocity()
            this.ball.body.SetLinearVelocity(temp)
            this.ball.body.ApplyLinearImpulse(this.ball.body.GetWorldVector(new Box2D.b2Vec2(0, 2 * PLR_FORCE)), this.ball.body.GetPosition(), true);
            this.ball = false
        } else {
            if (dt < this.boost_dt + 2000) // 2s min between 2 boosts
                return
            this.body.ApplyLinearImpulse(this.body.GetWorldVector(new Box2D.b2Vec2(0, 5 * PLR_FORCE)), this.body.GetPosition(), true);
        }
        this.boost_dt = dt
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
        let angle = 0.37 * delta
        this.body.SetTransform(this.body.GetPosition(), this.body.GetAngle() + angle);

    }
    right(delta) {
        let angle = 0.37 * delta
        this.body.SetTransform(this.body.GetPosition(), this.body.GetAngle() - angle);
    }
    draw(dt, delta) {
        this.pos = this.body.GetPosition();
        app.display.context.save()
        let x = PHY_SCALE * (this.pos.get_x())
        let y = -PHY_SCALE * (this.pos.get_y())
        app.display.context.translate(x, y)
        app.display.blit(this.image, -PLR_RADIUS, -PLR_RADIUS)
        app.display.context.rotate(-this.body.GetAngle())
        app.display.context.translate(0, -PLR_RADIUS / 2)
        app.display.blit(this.pawn, -this.pawn.width / 2, -this.pawn.height / 2)
        if (this.ball) {
            app.display.blit(this.ball.image, -this.ball.image.width / 2, -this.ball.image.height / 2)

            let angle = this.body.GetAngle()
            let [x, y] = [2.5 * Math.sin(-angle), 2.5 * Math.cos(-angle)]
            this.ball.pos.Set(this.pos.get_x() + x, this.pos.get_y() + y)

        }
        app.display.context.restore()
    }
}
