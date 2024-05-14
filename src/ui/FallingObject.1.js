import Phaser from 'phaser';
export default class FallingObject extends
  Phaser.Physics.Arcade.Sprite {

  //-------- Terdapat 3 method yang dibuat dalam kelas ini. Lengkapi dengan lanjut ke tahap berikutnya! -------//
  constructor(scene, x, y, texture, config) {
    super(scene, x, y, texture);
    this.scene = scene;
    this.speed = config.speed;
    this.rotationVal = config.rotation;

  }
  spawn(positionX) {
    this.setPosition(positionX, -10); //------> Nilai positionX akan diatur ketika method ini dipanggil
    this.setActive(true);
    this.setVisible(true);

  }
  die() {
  }
  update(time) {
    this.setVelocityY(this.speed);
    this.rotation += this.rotationVal;

    const gameHeight = this.scene.scale.height;
    if (this.y > gameHeight + 5) {
      this.die();
    }

  }
}
