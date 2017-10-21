class PlayerAI {
    constructor() {
        this.have_ball = false
        this.toball_cnt = 0
        this.agressive_cnt = 0
        this.tofront_cnt = 0
        this.togoal_cnt = 0
        this.managed = []
        for (var p in this.players) {
            if (p.ball) this.have_ball = true
        }
    }


    step(dt) {

    }

    manage(player, dt) {
        if (this.managed[player] == null) {
            this.managed[player] = {
                "mode": "toball",
                "lastmode_ts": 0,
            }
        }
        var infos = this.managed[player]
        var mode_duration = 3
        var goals = [
            [106, -101, -114], // goal area on left side
            [283, -101, -114], // goal area on right side
        ]

        // set  ai behaviour
        if (player.ball) {
            // when near the goal and have ball
            if (player.body.GetPosition().get_x() < (goals[0][0] + 40) &&
                player.body.GetPosition().get_y() < goals[0][1] &&
                player.body.GetPosition().get_y() > goals[0][2]) {
                infos.mode = "togoal"
                this.togoal_cnt = this.togoal_cnt + 1
            } else {
                infos.mode = 'tofrontgoal'
                this.tofront_cnt = managed.tofront_cnt + 1
            }
        } else {
            if (this.have_ball) { // an another ennemy player have the ball
                infos.mode = 'agressive'
                this.agressive_cnt = managed.agressive_cnt + 1
            } else if (infos.lastmode == null || infos.lastmode_ts > mode_duration) {
                infos.lastmode_ts = 0
                if (this.toball_cnt > 0 && (Math.random() < 0.5 || this.toball_cnt == 0)) {
                    infos.mode = 'agressive' // make one agressive, then random
                    this.agressive_cnt = this.agressive_cnt + 1
                } else {
                    infos.mode = 'toball' // if one agressive then one here, then random
                    this.toball_cnt = this.toball_cnt + 1
                }

            } else {
                infos.lastmode_ts = infos.lastmode_ts + dt
                infos.mode = infos.lastmode
            }


        }


    }

    clear() {

    }
}
