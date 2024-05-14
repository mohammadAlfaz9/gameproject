import Phaser from "phaser";

export default class StartScene extends Phaser.Scene {
  constructor() {
    super("start-scene");
  }

  init(data) {
    this.startbutton = undefined;
  }

  preload() {
    this.load.image("background", "images/bg_layer1.png");
    this.load.image("startbutton", "images/right-btn.png");
  }

  create() {
    this.add.image(200, 320, "background");
    this.createButton();
    
   
    this.add.text(150, 300, "Start", {
        fontSize: "32px",
        color: "black",
      });
  }
  createButton(){
    let startbutton = this.add.image(200, 200, "startbutton");
 
    startbutton.on(
      "pointerdown",
      () => {
        this.startbutton = true;
        this.scene.start("corona-buster-scene");
      },
      this
    );
    
  }
}


