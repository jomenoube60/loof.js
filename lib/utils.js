import {PHY_SCALE} from './levels'
import * as planck from 'planck-js'

export function makeImage(path) {
    var img = new Image()
    img.src = path
    return img
}

export function fixRect(obj, co) {
    return fixChain(obj, [co[0], co[1], co[2], co[1], co[2], co[3], co[0], co[3]])
}

export function fixChain(obj, coordinates) {
    var shape0 = null
    for (var i = 0; i < coordinates.length - 2; i += 2) {
        shape0 = new planck.Edge(new planck.Vec2(coordinates[i] / PHY_SCALE, -coordinates[i + 1] / PHY_SCALE), new planck.Vec2(coordinates[i + 2] / PHY_SCALE, -coordinates[i + 3] / PHY_SCALE))
        obj.createFixture({
            'shape': shape0
        })
    }
    shape0 = new planck.Edge(new planck.Vec2(coordinates[0] / PHY_SCALE, -coordinates[1] / PHY_SCALE), new planck.Vec2(coordinates[coordinates.length - 2] / PHY_SCALE, -coordinates[coordinates.length - 1] / PHY_SCALE))
    obj.createFixture({
        'shape': shape0
    })
}
export class TimedAction {
    constructor({
        duration = 1
    }) {
        this.duration = duration
        this.running_ts = false
        this.listeners = {
            'end': [],
            'start': []
        }
    }
    start() {
        this.running_ts = this.duration
    }
    cancel() {
        this.running_ts = false
    }
    get progress() {
        return (this.duration - this.running_ts) / this.duration
    }
    get running() {
        return !!this.running_ts
    }
    update(delta) {
        if (this.running_ts == false) return
        this.running_ts -= delta
        if (this.running_ts <= 0) {
            this.running_ts = false
            for (let cb of this.listeners.end) cb()
        }
    }
}
