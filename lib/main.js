function startApp() {
    console.log("init.");
    gameArea.start();
    let mainmenu = new MainMenu(gameArea.context, ["New Game" , "Players" , "Quit"]);
    // TODO: call update & draw periodically
    mainmenu.draw();
}
