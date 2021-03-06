export class PlayerAI {
    constructor() {
        this.have_ball = false
        this.toball_cnt = 0
        this.aggressive_cnt = 0
        this.tofront_cnt = 0
        this.togoal_cnt = 0
        this.managed = []
    }


    step(dt) {

    }

    manage(game, dt, delta) {
        game.enemies.forEach( pl => this.manage_one(pl, dt, delta) )
    }
    manage_one(player, dt, delta) {

        if (this.managed[player] == null) {
            this.managed[player] = {
                "mode": "toball",
                "lastmode_ts": 0,
            }
        }
        var infos = this.managed[player]
        let managed = this.managed[player]
        var mode_duration = 3
        var goals = [
            [106, -101, -114], // goal area on left side
            [283, -101, -114], // goal area on right side
        ]

        for (let dude of app.menus[0].enemies) {
            if (dude.ball) {
                this.have_ball = true
            } else {
                this.have_ball = false
            }
        }

        // set  ai behaviour
        if (player.ball) {
            // when near the goal and have ball
            if (player.pos.x < (goals[0][0] + 40) &&
                player.pos.y < goals[0][1] &&
                player.pos.y > goals[0][2]) {
                infos.mode = "togoal"
                this.togoal_cnt = this.togoal_cnt + 1
            } else {
                infos.mode = 'tofrontgoal'
                this.tofront_cnt = managed.tofront_cnt + 1
            }
        } else {
            if (app.menus[0].player.ball) { // an another ennemy player have the ball
                infos.mode = 'aggressive'
                this.aggressive_cnt = managed.aggressive_cnt + 1
            } else if (infos.lastmode == null || infos.lastmode_ts > mode_duration) {
                infos.lastmode_ts = 0
                if (!this.have_ball) {

                    infos.mode = 'toball'
                    this.toball_cnt = this.toball_cnt + 1
                } else {
                  infos.mode = 'aggressive'
                  console.log("test");
                }


            } else {
                infos.lastmode_ts = infos.lastmode_ts + dt
                infos.mode = infos.lastmode
            }
        }
        // infos.mode = "toball"
        // now apply the behavior according to the chosen mode


        var x = null
        var y = null
        if (infos.mode == "toball") {
            let random_player = app.menus[0].ball

            var dist = player.distance_from(random_player.pos)
            let [targets, angle] = player.targets(random_player.pos, 20)
            if (angle > 0 || angle < -Math.PI) {
                player.left(delta);
            } else {
                player.right(delta);
            }
            if (targets)
                player.forward(delta);
        } else if (infos.mode == "aggressive") {
            let random_player = app.menus[0].player
            var dist = player.distance_from(random_player.pos)
            let [targets, angle] = player.targets(random_player.pos, 20)
            if (angle > 0 || angle < -Math.PI) {
                player.left(delta);
            } else {
                player.right(delta);
            }
            if (targets)
                player.forward(delta);
        } else if (infos.mode == "tofrontgoal") {
            let aim = {'x': goals[0][0] + 40, 'y': (goals[0][1] + goals[0][2]) / 2}

            var dist = player.distance_from(aim)
            let [targets, angle] = player.targets(aim, 40)
            if (angle > 0 || angle < -Math.PI) {
                player.left(delta);
            } else {
                player.right(delta);
            }
            if (targets)
                player.forward(delta);
        } else if (infos.mode == "togoal") {
            let aim = {'x': goals[0][0] - 5, 'y': (goals[0][1] + goals[0][2]) / 2}

            var dist = player.distance_from(aim)
            let [targets, angle] = player.targets(aim, 40)
            if (angle > 0 || angle < -Math.PI) {
                player.left(delta);
            } else {
                player.right(delta);
            }
            if (targets)
                player.forward(delta);
        }

    }

    clear() {

    }
}
