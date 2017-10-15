class Display {
    constructor(canvas = document.createElement("canvas")) {
        this.canvas = canvas;
        this.canvas.width = 800;
        this.canvas.height = 600;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    }
    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function startApp() {
    console.log("init.");
    var display = new Display()
    var mainmenu = new MainMenu(display, ["NewGame", "Enemies", "Quit"]);

    document.onkeydown = function(e) {
        return mainmenu.update(e);
    }

    function step(dt) {
        display.clear();
        mainmenu.draw();
        window.requestAnimationFrame(step)
    }
    window.requestAnimationFrame(step) // initiate main loop
}