// provides some fodders for Menu Class
choices = ["Menu1" , "Menu2" , "Menu3"] ;

// Menu arguments : background is an URL of a css files , choices is an array of strings
class Menu {
  constructor(background , choices) {
    this.background = background;
    this.choices    = choices;
    this.selected   = 1;
  }

  getMenu() {
    var menu = "";
    for (var i = 0; i < this.choices.length; i++) {
      html += "<h1>"+this.choices[i]+"</h1>";
    }
    return html;
  }
}

menu = new Menu("test" , choices);

document.write(menu.getMenu());
