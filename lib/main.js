function startApp() {
    console.log("init.");
    var gamearea = new GameArea();
    gamearea.start();
    var mainmenu = new MainMenu(gamearea.context, ["New Game" , "Players" , "Quit"]);
    // TODO: call update & draw periodically
    mainmenu.draw();

    document.onkeydown = function (e){
      mainmenu.update(e);
       alert(mainmenu.selected);
      mainmenu.draw();
    }

}
