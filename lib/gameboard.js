let gameArea = {
  canvas : document.createElement("canvas"),
  start  : function () {
    this.canvas.width = 800;
    this.canvas.height = 600;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas , document.body.childNodes[0]);
    this.frameNo = 0;
    console.log("start gameArea");
  },
  clear : function() {
    this.context.clearRect ( 0 , 0 , this.canvas.width , this.canvas.heigth);
  }

}
