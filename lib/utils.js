function makeImage(path) {
    var img = new Image()
    img.src = path
    return img
}

function fixRect(obj, co) {
    return fixChain(obj, [co[0], co[1], co[2], co[1], co[2], co[3], co[0], co[3]])
}

function fixChain(obj, coordinates) {
    var shape0 = new Box2D.b2EdgeShape()
    var fixdef = new Box2D.b2FixtureDef();
    fixdef.set_shape(shape0)
    for (var i = 0; i < coordinates.length - 2; i += 2) {
        shape0.Set(new Box2D.b2Vec2(coordinates[i] / PHY_SCALE, -coordinates[i + 1] / PHY_SCALE), new b2Vec2(coordinates[i + 2] / PHY_SCALE, -coordinates[i + 3] / PHY_SCALE))
        obj.CreateFixture(fixdef)
    }
    shape0.Set(new Box2D.b2Vec2(coordinates[0] / PHY_SCALE, -coordinates[1] / PHY_SCALE), new b2Vec2(coordinates[coordinates.length - 2] / PHY_SCALE, -coordinates[coordinates.length - 1] / PHY_SCALE))
    obj.CreateFixture(fixdef)
}
