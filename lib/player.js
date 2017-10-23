var PLR_SHADOW = -5
var PLR_FORCE = 0.8;
var PLR_RADIUS = 20

class Player {
    constructor(menu, image) {
        var shape = new planck.Circle(PLR_RADIUS / PHY_SCALE)
        var body = menu.world.createBody({
            'type': 'dynamic'
        })
        this.world = menu.world
        body.createFixture({
            'shape': shape,
            'restitution': 0.9,
            'm_radius': PLR_RADIUS / PHY_SCALE
        }).setUserData(this)
        body.setLinearDamping(0.3);
        body.setAwake(true);
        body.setActive(true);
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
        ball.body.setActive(false);
        this.ball = ball
        ball.owned = this
    }
    distance_from(coords) {
        return Math.sqrt(Math.pow(coords.x - this.pos.x, 2) + Math.pow(coords.y - this.pos.y, 2))
    }
    set_position(x, y, randomicity = 0, rotation = 0) {
        let temp = new planck.Vec2(x / PHY_SCALE + (Math.random() * randomicity - randomicity / 2), -y / PHY_SCALE + (Math.random() * randomicity - randomicity / 2))
        this.body.setLinearVelocity({
            x: 0,
            y: 0
        }, 0.0);
        this.body.setTransform(temp, rotation);
    }
    destroy() {
        this.world.destroyBody(this.body)
        this.body = null
        this.image = null
        this.world = null
    }

    targets(coords, coord2, delta) {
        var x = coords.x - this.pos.x
        var y = coords.y - this.pos.y
        var distance = Math.sqrt(Math.pow(Math.abs(x), 2) + Math.pow(Math.abs(y), 2))
        var angle = Math.acos(x / distance)
        var myangle = (Math.PI / 2 + this.body.getAngle()) % (2 * Math.PI)
        var sync = Math.abs(angle - myangle) < (delta / 360 * (2 * Math.PI))
        return [sync, angle]
    }
    push(dt) {
        if (!!this.ball) {
            // shooting ball
            this.ball.shot(dt)
            let angle = this.body.getAngle()
            let [x, y] = [Math.sin(-angle), Math.cos(-angle)]
            let temp = new planck.Vec2(this.pos.x + x, this.pos.y + y)
            this.ball.body.setTransform(temp, angle)
            this.ball.body.setActive(true)
            temp = this.body.getLinearVelocity()
            this.ball.body.setLinearVelocity(temp)
            this.ball.body.applyLinearImpulse(this.ball.body.getWorldVector(new planck.Vec2(0, 3 * PLR_FORCE)), this.ball.pos, true)
            this.ball = false
        } else {
            if (dt < this.boost_dt + 2000) // 2s min between 2 boosts
                return
            this.body.applyLinearImpulse(this.body.getWorldVector(new planck.Vec2(0, 5 * PLR_FORCE)), this.pos, true)
        }
        this.boost_dt = dt
    }
    forward(delta) {
        let force = PLR_FORCE * delta
        this.body.applyLinearImpulse(this.body.getWorldVector(new planck.Vec2(0, force)), this.pos, true)
    }
    backward(delta) {
        let force = PLR_FORCE * delta
        this.body.applyLinearImpulse(this.body.getWorldVector(new planck.Vec2(0, -force / 1.25)), this.pos, true)
    }
    left(delta) {
        let angle = 0.37 * delta
        this.body.setTransform(this.pos, this.body.getAngle() + angle)

    }
    right(delta) {
        let angle = 0.37 * delta
        this.body.setTransform(this.pos, this.body.getAngle() - angle)
    }
    draw(dt, delta) {
        this.pos = this.body.getPosition();
        app.display.context.save()
        let x = PHY_SCALE * (this.pos.x)
        let y = -PHY_SCALE * (this.pos.y)
        app.display.context.translate(x, y)
        app.display.blit(this.image, -PLR_RADIUS, -PLR_RADIUS)
        app.display.context.rotate(-this.body.getAngle())
        app.display.context.translate(0, -PLR_RADIUS / 2)
        if (this.ball) {
            app.display.blit(this.ball.image, -this.ball.image.width / 2, -this.ball.image.height / 2)
            let angle = this.body.getAngle()
            let [x, y] = [Math.sin(-angle), Math.cos(-angle)]
            this.ball.pos = new planck.Vec2(this.pos.x + x, this.pos.y + y)
        }
        app.display.context.translate(0, -PLR_RADIUS / 2)
        app.display.blit(this.pawn, -this.pawn.width / 2, -this.pawn.height / 2)
        app.display.context.restore()
    }
}
