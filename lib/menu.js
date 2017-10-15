class Menu {
    constructor(background, choices) {
        this.background = background ;// load background
        this.choices = choices; // save menu options
        this.selected = 0;
        this.last_ts = 0;
        this.ts = 0;
        this.repeat_max = 0.2;
        this.selected_pics = [];
        this.unselected_pics = []
        for (var i = 0; i < this.choices.length; i++) {
          var img = new Image(420,120);
          img.src = `img/menu_${this.choices[i]}.png`;
          this.unselected_pics.push(img);
        }
        for (var i = 0; i < this.choices.length; i++) {
          var img = new Image(420,120);
          img.src = `img/menu_${this.choices[i]}_sel.png`;
          this.selected_pics.push(img);
        }
    }
    update(e) {
        // update menu state
        console.log(e);
        alert("test");
        // this.ts += dt;
        // if (this.last_ts + this.repeat_max > self.ts) return
        if (e.keyCode == '40' || e.keyCode == '98') {
          if (this.selected < this.choices.length ) {
            this.last_ts = this.ts;
            this.selected = this.selected + 1;
            alert("Key down");
          }
        }
        else if (e.keyCode == '38' || e.keyCode == '104') {
          if (this.selected > 0 ) {
            this.last_ts = this.ts;
            this.selected = this.selected - 1;
            alert("Key Up");
          }
        }


    }
    draw() {
            console.log("Draw");
            var x = 100 , y = 100 ;
            for (var i = 0; i < this.choices.length; i++) {
              console.log("boucle for");
              if (this.selected == i) {
                console.log("selected_pics");
                this.background.drawImage(this.selected_pics[i], x , y);
              }
              else {
                console.log("unselected_pics");
                this.background.drawImage(this.unselected_pics[i] , x , y);
              }
                y += 125;
            }
    }
}

class MainMenu extends Menu {
    constructor(background , choices) {
        super(background , choices);
    }
}
