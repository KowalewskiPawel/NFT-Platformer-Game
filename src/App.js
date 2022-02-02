import Phaser from 'phaser'
import { IonPhaser } from '@ion-phaser/react'

import BackgroundImage from './assets/BG.png';
import tile from './assets/tile.png';

let platforms;

const game = {
  width: 800,
  height: 600,
  type: Phaser.AUTO,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  scene: {
    preload: function() {
      this.load.setCORS('anonymous');
      this.textures.addBase64('tile', tile);
      this.load.image('background', BackgroundImage);
      
      
    },
    create: function() {
      this.add.image(400, 300, 'background').setScale(0.55);
      platforms = this.physics.add.staticGroup();
      platforms.create(600, 400, 'tile').setScale(0.5).refreshBody();
    },
    update: function() {
    }
  }
}
const App = () => {
  return (
    <IonPhaser game={game} />
  );
}

export default App;
