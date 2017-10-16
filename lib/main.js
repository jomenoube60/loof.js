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

function startApp() {
    console.log("init.");
    var display = new Display()
    var mainmenu = new MainMenu(display);

    document.onkeydown = function(e) {
        return mainmenu.update(e);
    }

    var last_ts = 0
    var delta = 0
    function step(dt) {
        delta = (dt-last_ts)/100
        last_ts = dt
        display.clear();
        mainmenu.draw(dt, delta);
        window.requestAnimationFrame(step)
    }
    window.requestAnimationFrame(step) // initiate main loop
}