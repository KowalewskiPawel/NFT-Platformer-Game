import Phaser from 'phaser'
import { IonPhaser } from '@ion-phaser/react'

import BackgroundImage from './assets/BG.png';

const game = {
  width: 800,
  height: 600,
  type: Phaser.AUTO,
  scene: {
    preload: function() {
      this.load.image('background', BackgroundImage);
    },
    create: function() {
      this.add.image(400, 300, 'background').setScale(0.55);
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
