var bodies=[] // global for debugging

function main() {
    var ball = document.getElementById('ball')
    console.log("init.")
    var mainmenu = new MainMenu()
    using(Box2D, "b2d.+") // get "Box2D"

    // TODO: call update & draw periodically
    var ZERO = new Box2D.b2Vec2(0.0, 0.0);

    // setup world
    var gravity = new Box2D.b2Vec2(0.0, -10.0);
    var world = new Box2D.b2World(gravity);

    // setup floor

    var bd_ground = new Box2D.b2BodyDef();
    var ground = world.CreateBody(bd_ground);
    var shape0 = new Box2D.b2EdgeShape();
    shape0.Set(new Box2D.b2Vec2(-10, 0.0), new Box2D.b2Vec2(1000, -100.0));

    var fixdef = new Box2D.b2FixtureDef();
    fixdef.set_friction( 0.6 );
    fixdef.set_restitution( 0.9 );
    fixdef.set_shape(shape0)
    ground.CreateFixture(fixdef)

    var size = 2.0;
    var shape = new Box2D.b2PolygonShape();
    shape.SetAsBox(size, size);

    // create a body
    var fixdef = new Box2D.b2FixtureDef();
    fixdef.set_friction( 0.2 );
    fixdef.set_restitution( 0.5 );
    fixdef.set_density( 2.0 );
    fixdef.set_shape(shape)
    var bd = new Box2D.b2BodyDef();
    bd.set_type(Box2D.b2_dynamicBody);
    var body = world.CreateBody(bd);
    body.CreateFixture(fixdef)
    bodies.push(body);

    bodies.forEach(body => {
        var temp = new Box2D.b2Vec2(0.0, 0.0);
        temp.Set(10, 500)
        body.SetTransform(temp, 0.0);
        body.SetLinearVelocity(ZERO);
        body.SetAwake(true);
        body.SetActive(true);
    })

    function simulate(dt) {
        world.Step(dt/50000.0, 10, 10);
        var pos = bodies[0].GetPosition()
        ball.style.left = pos.get_x() + "px"
        ball.style.top = (500 - pos.get_y()) + "px"
        window.requestAnimationFrame(simulate)
    }
    console.log('Frame', window.requestAnimationFrame(simulate))
}
