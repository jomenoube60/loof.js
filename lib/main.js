class Application {
    constructor(display) {
        this.display = display
        this.menus = []
        this.last_ts = 0
        this.delta = 0
        this.keys = new KeyboardManager()
        window.requestAnimationFrame(ts => this.step(ts)) // initiate main loop
        this.config = {
            'POWER': 60000,
            'MAX_SPEED': 20000000,
            'BALL_SPEED': 1000,
            'DISTANCE': 90,
            'DEBUG': false,
            'DUDES': 3,
            'autozoom': true,
            'max_zoom': 2.0,
            'min_zoom': 0.2,
            'zoom_margin': 40,
            'autozoom_margin': 200,
            'colors': [
                [128, 179, 255],
                [255, 170, 204],
            ],
        }
    }
    push_menu(menu) {
        this.menus.push(menu)
    }
    pop_menu() {
        return this.menus.pop()
    }
    step(dt) {
        this.delta = (dt - this.last_ts) / 100
        this.last_ts = dt
        this.menus.forEach(menu => menu.draw(dt, this.delta))
        if (this.menus.length) this.menus[this.menus.length - 1].update(dt, this.delta)
        window.requestAnimationFrame(ts => this.step(ts))
    }
}
var app = null // global application object
function startApp() {
    var display = new Display()
    app = new Application(display)
    app.push_menu(new Game())
    app.push_menu(new MainMenu())
    console.log("Application started.");
}
