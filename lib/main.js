function startApp() {
    console.log("init.");
    var gamearea = new GameArea();
    gamearea.start();
    var mainmenu = new MainMenu(gamearea.context, ["NewGame" , "Enemies" , "Quit"]);

    document.onkeydown = function (e) {
        return mainmenu.update(e);
    }

    function step(dt) {
        gamearea.clear();
        mainmenu.draw();
        window.requestAnimationFrame(step)
    }
    window.requestAnimationFrame(step) // initiate main loop
}
