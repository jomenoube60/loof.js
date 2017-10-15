function startApp() {
    console.log("init.");
    var gamearea = new GameArea();
    gamearea.start();
    var mainmenu = new MainMenu(gamearea.context, ["NewGame" , "Enemies" , "Quit"]);
    // TODO: call update & draw periodically
    mainmenu.draw();

    document.onkeydown = function (e){
      mainmenu.update(e);
      mainmenu.draw();
    }

}
