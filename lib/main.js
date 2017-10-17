class Display {
    constructor(canvas = document.createElement("canvas")) {
        this.canvas = canvas;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    }
    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    get width() {
        return this.canvas.width
    }
    get height() {
        return this.canvas.height
    }
}
class Application {
    constructor(display) {
        this.display = display
        this.menus = []
        this.last_ts = 0
        this.delta = 0
        document.onkeydown = e => this.menuDispatch(e)
        window.requestAnimationFrame(ts => this.step(ts)) // initiate main loop
        this.config = {
            'POWER': 60000,
            'MAX_SPEED': 20000000,
            'BALL_SPEED': 1000,
            'DISTANCE': 90,
            'DEBUG': false,
            'DUDES': 3,
            'autozoom': true,
            'autozoom_margin': 200,
            'level': 'level0',
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
        this.display.clear();
        this.menus.forEach(menu => menu.draw(dt, this.delta))
        window.requestAnimationFrame(ts => this.step(ts))
    }
    menuDispatch(e) {
        if(this.menus.length) return this.menus[this.menus.length - 1].update(e);
        console.log("No menu loaded, can't dispatch")
    }
}
var app = null // global application object
function startApp() {
    var display = new Display()
    app = new Application(display)
    app.push_menu(new Game(display))
    app.push_menu(new MainMenu(display))
    console.log("Application started.");
}
