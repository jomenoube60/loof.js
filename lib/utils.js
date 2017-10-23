function makeImage(path) {
    var img = new Image()
    img.src = path
    return img
}

function fixRect(obj, co) {
    return fixChain(obj, [co[0], co[1], co[2], co[1], co[2], co[3], co[0], co[3]])
}

function fixChain(obj, coordinates) {
    for (var i = 0; i < coordinates.length - 2; i += 2) {
        let shape0 = new planck.Edge(new planck.Vec2(coordinates[i] / PHY_SCALE, -coordinates[i + 1] / PHY_SCALE), new planck.Vec2(coordinates[i + 2] / PHY_SCALE, -coordinates[i + 3] / PHY_SCALE))
        obj.createFixture({
            'shape': shape0
        })
    }
    let shape0 = new planck.Edge(new planck.Vec2(coordinates[0] / PHY_SCALE, -coordinates[1] / PHY_SCALE), new planck.Vec2(coordinates[coordinates.length - 2] / PHY_SCALE, -coordinates[coordinates.length - 1] / PHY_SCALE))
    obj.createFixture({
        'shape': shape0
    })
}
