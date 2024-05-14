import Phaser from 'phaser'
import CoronaBusterScene from './Scenes/CoronaBusterScene'
import GameOverScene from './Scenes/GameOverScene';
import StartScene from './Scenes/StartScene';
const config = {
	type: Phaser.AUTO,
	width: 400, //----------->1. canvas width 
	height: 620, //----------->2. canvas height 
	physics: {
	  default: "arcade",
	  arcade: {
		gravity: { y: 0 }, //--------> 3. gravitasi 0 agar pesawat tidak jatuh
	  },
	},
	scene: [ CoronaBusterScene, GameOverScene], //4. -----> scene yang ditampilkan
	
	//---------- 5. membuat layout game centered ----------//
	scale: { 
	  mode: Phaser.Scale.FIT, 
	  autoCenter: Phaser.Scale.CENTER_BOTH,
	}
  
  };

export default new Phaser.Game(config)