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

  manage(player , dt) {
    if (this.managed[player] == null) {
      this.managed[player] = {
        "mode" : "toball",
        "lastmode_ts" : 0,
      }
    }
    var infos = this.managed[player]
    var goals = [
      [106,-101,-114], // goal area on left side
      [283,-101,-114], // goal area on right side
    ]
    if (player.ball) {
      if (this.body.GetPosition().get_x() < goals[0][0] && this.body.GetPosition().get_y() < goals[0][1] && this.body.GetPosition().get_y() > goals[0][2]) {
          console.log(true)
      }
    }


    }

    clear() {

    }
}
