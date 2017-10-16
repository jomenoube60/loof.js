class Display {
    constructor(canvas = document.createElement("canvas")) {
        this.canvas = canvas;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    }
    clear() {
        this.context.fillStyle = "#445566"
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillStyle = "white"
    }
}

class Application {
    constructor(display) {
        this.display = display
        this.menus = []
        this.current_menu = -1
        this.last_ts = 0
        this.delta = 0
        document.onkeydown = e => this.menuDispatch(e)
        window.requestAnimationFrame(ts => this.step(ts)) // initiate main loop
    }
    push_menu(menu) {
        this.menus.push(menu)
        this.current_menu += 1
    }
    pop_menu() {
        this.current_menu -= 1
        return this.menus.pop()
    }
    step(dt) {
        this.delta = (dt-this.last_ts)/100
        this.last_ts = dt
        this.display.clear();

        this.menus.forEach(menu => menu.draw(dt, this.delta))
        //this.menus[this.current_menu].draw(dt, this.delta);

        window.requestAnimationFrame(ts => this.step(ts))
    }
    menuDispatch(e) {
        if (this.current_menu >= 0)
            return this.menus[this.current_menu].update(e);
        console.log("No menu loaded, can't dispatch")
    }
}

var app = null
function startApp() {
    var display = new Display()
    app = new Application(display)
    app.push_menu(new Game(display))
    app.push_menu(new MainMenu(display))
    console.log("Application started.");
}