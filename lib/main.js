function startApp() {
    console.log("init.");
    var gamearea = new GameArea();
    gamearea.start();
    var mainmenu = new MainMenu(gamearea.context, ["New Game" , "Players" , "Quit"]);
    // TODO: call update & draw periodically
    mainmenu.draw();



}
