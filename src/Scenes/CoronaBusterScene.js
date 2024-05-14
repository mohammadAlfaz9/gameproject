import Phaser from "phaser";
import FallingObject from '../ui/FallingObject.1';
import Laser from '../ui/Laser';

export default class CoronaBusterScene extends Phaser.Scene {
  constructor() {
    super("corona-buster-scene");
  }
  init() {
    this.clouds = undefined
    this.background = undefined
    this.nav_left = false;
    this.nav_right = false;
    this.shoot = false;
    this.player = undefined;
    this.speed = 100;
    this.cursor= undefined;
    this.enemies= undefined;
    this.enemySpeed= 50;
    this.lasers = undefined;
    this.lastFired = 10;
    this.scoreLabel = undefined;
    this.score = 0;
    this.lifeLabel= undefined;
    this.life = 3;
    this.heart = undefined;
    this.backsound = undefined;

  }//init

  preload() {
    this.load.image("background", "images/level-1.jpg");
    this.load.image("cloud", "images/cloud.png");
    this.load.image("nav_left", "images/left-btn.png");
    this.load.image("nav_right", "images/right-btn.png");
    this.load.image("shoot", "images/shoot-btn.png");
    this.load.image("heart", "images/heart.png") 
    this.load.spritesheet("player", "images/ship.png", {
      frameWidth: 66,
      frameHeight: 66,
    })
    this.load.image("enemy", "images/enemy.png");
    this.load.spritesheet("laser", "images/laser-bolts.png", {
      frameWidth: 16,
      frameHeight: 16,
    });

    this.load.audio("bgsound", "sfx/AloneAgainst Enemy.ogg");
    this.load.audio("laser", "sfx/sfx_laser.ogg");
    this.load.audio("destroy", "sfx/destroy.mp3");
    this.load.audio("life", "sfx/heart.mp3");
    this.load.audio("gameover", "sfx/gameover.wav");
    

  }//preload

  create() {
    const gameWidth = this.scale.width * 0.5;
    const gameHeight = this.scale.height * 0.5;
    this.add.image(gameWidth, gameHeight, "background");
    this.clouds = this.physics.add.group({
      key: "cloud",
      repeat: 10,  
    });
    
    Phaser.Actions.RandomRectangle(this.clouds.getChildren(), this.physics.world.bounds);

    this.createButton();
    this.cursor = this.input.keyboard.createCursorKeys();
    this.player = this.createPlayer();
    this.anims.create({
      key: "left", //--->nama animasi
      frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }), //--->frame yang digunakan
      frameRate: 10, //--->kecepatan berpindah antar frame
      repeat: -1, //--->mengulangi animasi terus menerus
    });
    
    //animation idle
    this.anims.create({
      key: "turn",
      frames: [{ key: "dude", frame: 4 }],
      frameRate: 20,
    });
    //animation to the right
    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });
    this.time.addEvent({
      delay: Phaser.Math.Between(1000, 5000), //--------> Delay random  rentang 1-5 detik
      callback: this.spawnEnemy,
      callbackScope: this,        //--------------------> Memanggil method bernama spawnEnemy
      loop: true,
    });
    this.lasers = this.physics.add.group({
      classType: Laser,
      maxSize: 100000,
      runChildUpdate: true,
    });

    this.scoreLabel = this.add
  .text(10, 10, "Score", {
    fontSize: "16px",
    color: "black",
    backgroundColor: "white",
  })
  .setDepth(1);

  this.lifeLabel = this.add
  .text(10, 30, "Life", {
    fontSize: "16px",
    color: "black",
    backgroundColor: "white",
  })
  .setDepth(1);

  this.physics.add.overlap(
    this.player, 
    this.enemies, 
    this.decreaseLife, 
    null,
    this
 );
 this.replayButton = this.add.image(200, 400, 'replay-button')
      .setInteractive().setScale(0.5);
      this.replayButton.once(
        "pointerup",
        () => {
          this.scene.start("corona-buster-scene");
        },
        this
      );
      this.heart = this.physics.add.group({
        classType: FallingObject,
        runChildUpdate: true,
      });
      this.time.addEvent({
        delay: 10000,
        callback: this.spawnheart,
        callbackScope: this,
        loop: true,
      });
      
      // delay: 10000 = heart di spawn setiap 10s

      this.physics.add.overlap(
        this.player,
        this.heart,
        this.increaseLife,
        null,
        this
    );

    this.backsound = this.sound.add("bgsound");
var soundConfig = {
  loop: true,
  volume: 0.5,
};
this.backsound.play(soundConfig);
      
}//create

  
  update(time) {
    this.clouds.children.iterate((child) => {
      child.setVelocityY(20); //----------------> Semua awan bergerak kebawah dengan kecepatan 20.
    });

    this.clouds.children.iterate((child) => { //-----------> untuk setiap awan dalam kumpulan awan
      child.setVelocityY(20); //----------> bergerak kebawah
      if (child.y > this.scale.height) { //---------->  jika melewati batas bawah
        child.x = Phaser.Math.Between(10, 400); //----------> posisi awan dipindah ke atas layout
        child.y = 0;
      }
    });
    this.movePlayer(this.player, time);
    this.enemies = this.physics.add.group({
      classType: FallingObject,
      maxSize: 10,  //-----> banyaknya enemy dalam satu grup
      runChildUpdate: true,
    });
    this.scoreLabel.setText("Score : " + this.score);
    this.lifeLabel.setText("Life : " + this.life);

    
        
}//update

createButton(){
  this.input.addPointer(3)
  
  let shoot = this.add.image(320,550, "shoot").setInteractive().setDepth(0.5).setAlpha(0.8)
  
  let nav_left = this.add.image(50,550, "nav_left").setInteractive().setDepth(0.5).setAlpha(0.8)
  
  let nav_right = this.add.image(nav_left.x + nav_left.displayWidth+20, 550,"nav_right").setInteractive().setDepth(0.5).setAlpha(0.8)

  nav_left.on(
    "pointerdown",
    () => {       //---------> Ketika pointerup (diklik) maka properti nav left akan bernilai true
      this.nav_left = true;
    },
    this
  );
  nav_left.on(
    "pointerout",
    () => {      //----------> Ketika pointerout (tidak diklik) maka properti nav left akan bernilai false
      this.nav_left = false;
    },
    this
  );
  nav_right.on(
    "pointerdown",
    () => {
      this.nav_right = true;
    },
    this
  );
  nav_right.on(
    "pointerout",
    () => {
      this.nav_right = false;
    },
    this
  );
  shoot.on(
    "pointerdown",
    () => {
      this.shoot = true;
    },
    this
  );
  shoot.on(
    "pointerout",
    () => {
      this.shoot = false;
    },
    this
  );

  

  }//createButton

 //  movePlayer(){
     movePlayer(player, time) {
      if (this.nav_left || this.cursor.left.isDown) {
        player.setVelocityX(this.speed * -1);
        player.anims.play("left", true);
        player.setFlipX(false);
      } else if (this.nav_right || this.cursor.right.isDown) {
        player.setVelocityX(this.speed);
        player.anims.play("right", true);
        player.setFlipX(true);
      } else {
        player.setVelocityX(0);
        player.anims.play("turn");
      }
      if (this.shoot && time > this.lastFired) {
        const laser = this.lasers.get(0, 0, "laser");
        if (laser) {
          laser.fire(this.player.x, this.player.y);
          this.lastFired = time + 150;
          this.sound.play("laser");
        }
      }


    }
    

 
  createPlayer(){
    const player = this.physics.add.sprite(200, 450,'player')
    player.setCollideWorldBounds(true)

    this.anims.create({
      key: "turn",
      frames: [
        {
          key: "player",
          frame: 0,
        },
      ],
    });
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("player", {
        start: 1,
        end: 2,
      }),
    });
    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("player", {
        start: 1,
        end: 2,
      }),
    });

    return player

}//createPlayer
spawnEnemy() {
  const config = {
  speed: 30,       //-----------> Mengatur kecepatan dan besar rotasi dari enemy
  rotation: 0.1
  };
  // @ts-ignore
  const enemy = this.enemies.get(0, 0, 'enemy', config);
  const positionX = Phaser.Math.Between(50, 350); //-----> Mengambil angka acak dari 50-350
  if (enemy) {
  enemy.spawn(positionX);   //--------------> Memanggil method spawn dengan parameter nilai posisi sumbux
  }
}//spawnEnemy

hitEnemy(laser, enemy) {
  laser.die();
  enemy.die();
  this.score += 10;
  this.sound.play("destroy");
}//hitEnemy

decreaseLife(player, enemy) {
  enemy.die();
  this.life--;
  if (this.life == 2) {
    player.setTint(0xff0000);
  } else if (this.life == 1) {
    player.setTint(0xff0000).setAlpha(0.2);
  } else if (this.life == 0) {
    this.scene.start("over-scene", { score: this.score });
    this.sound.stopAll();
    this.sound.play("gameover");

  }
  
}//decreaseLife

spawnheart(){
  const config = {
    speed: 60,
    rotation: 0,   // ------------> heart tidak berputar
  };
  // @ts-ignore
  const heart = this.heart.get(0, 0, "heart", config);
  const positionX = Phaser.Math.Between(70, 330);
  if (heart) {
    heart.spawn(positionX);
  }
}//heart

increaseLife(player, heart) {
  heart.destroy();
  this.life++;
  if (this.life >= 3) {               //------> Menambah 1 life
      player.clearTint().setAlpha(1);
  } else if (this.life == 2) {
      player.setTint(0x00ff00);
  } else if (this.life == 1) {
      player.setTint(0xffff00);
  }
}//increaselife

}//class