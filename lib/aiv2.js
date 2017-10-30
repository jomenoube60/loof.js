import {pixels2coords} from './levels'
const MIN_AGE = 4000

class PlayerState {
    constructor(dt) {
        this.age = dt
    }
}
export class PlayerAI {
    constructor() {
        this.statemap = new WeakMap()
        this.had_ball = false
        this.ball_maked = false
    }
    manage(game, dt, delta) {
        this.delta = delta
        this.dt = dt
        this.have_ball = game.enemies.reduce( (r, dude) => r || dude.ball, false)
        this.ball_maked = false
        game.enemies.forEach(dude => this.manage_one(dude, game))
        this.had_ball = this.have_ball
    }
    manage_one(player, game) {
        if (! this.statemap.has(player)) {
            this.statemap.set(player, new PlayerState())
        }
        let state = this.statemap.get(player)
        let behavior = null
        if (this.had_ball && !this.have_ball) {
            state.age = 0 // reset state if losing ball (immediate reaction)
        }

        if (!! player.ball) { // case 1: ball owner
            behavior = 'togoal'
        } else if(this.dt - state.age < (MIN_AGE + (MIN_AGE*Math.random() - MIN_AGE/2))) { // replay last state
            behavior = state.behavior
        } else if (this.have_ball) { // case2: team have ball (but not me!)
            behavior = 'agressive'
        } else { // don't have ball, mix toball & agressive
            if (this.ball_maked) {
                if (Math.random() < 0.5) {
                    behavior = 'toball'
                } else {
                    behavior = 'agressive'
                }
            } else {
                behavior = 'toball'
                this.marked = true
            }
        }
        // apply behavior
        if (behavior != state.behavior) {
            state.age = this.dt
            state.behavior = behavior
        }
        this['behavior_' + state.behavior](player, game)
    }

    _follow(player, position) {
        let [targets, angle] = player.targets(position, 60)

        if (Math.abs(angle) > 0.1) {
            if (angle > 0 || angle < -Math.PI) {
                player.left(this.delta);
            } else {
                player.right(this.delta);
            }
        }
        player.forward(this.delta);
        return angle
    }
    behavior_toball(player, game) {
        this._follow(player, game.ball.pos)
    }
    behavior_togoal(player, game) {
        let frontgoal = pixels2coords(...game.level.starting_points[0])
        let dist = player.distance_from(frontgoal)
        if (dist > 15) {
            this._follow(player, frontgoal)
        } else {
            let angle = this._follow(player, pixels2coords(game.level.goals[0][0]-100, game.level.starting_points[0][1]))
            if (Math.abs(angle)  < 0.1) {
                player.push(this.dt)
            }
        }
    }
    behavior_agressive(player, game) {
        let dist = player.distance_from(game.player.pos)
        let angle = this._follow(player, game.player.pos)
        if (dist < 13 && angle < 0.1 && Math.random() < 0.1)
            player.push(this.dt)
    }
}
