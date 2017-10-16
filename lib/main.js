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
        this.mainmenu = new MainMenu(display)
        this.last_ts = 0
        this.delta = 0
        document.onkeydown = e => this.menuDispatch(e)
        window.requestAnimationFrame(ts => this.step(ts)) // initiate main loop
    }
    step(dt) {
        this.delta = (dt-this.last_ts)/100
        this.last_ts = dt
        this.display.clear();
        this.mainmenu.draw(dt, this.delta);
        window.requestAnimationFrame(ts => this.step(ts))
    }
    menuDispatch(e) {
        return this.mainmenu.update(e)
    }
}

function startApp() {
    var display = new Display()
    var app = new Application(display)
    console.log("Application started.");
}