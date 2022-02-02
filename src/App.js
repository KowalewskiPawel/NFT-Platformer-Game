import Phaser, { LEFT } from 'phaser'
import { IonPhaser } from '@ion-phaser/react'
import { useMoralis } from "react-moralis";

import BackgroundImage from './assets/BG.png';
import tile from './assets/tile.png';
import buddy from "./assets/buddy.png";


const App = () => {
  const { Moralis, authenticate, logout, isAuthenticated, user, object } = useMoralis();

  let platforms;
let player;
let cursors;
let competitors = {};

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
      this.textures.addBase64('buddy', buddy);
      this.load.image('background', BackgroundImage);
      
      
    },
    create: async function() {
      this.add.image(400, 300, 'background').setScale(0.55);

      platforms = this.physics.add.staticGroup();
      platforms.create(200, 400, 'tile').setScale(0.5).refreshBody();
      platforms.create(800, 400, 'tile').setScale(0.5).refreshBody();
      platforms.create(635, 400, 'tile').setScale(0.5).refreshBody();
      platforms.create(470, 400, 'tile').setScale(0.5).refreshBody();

      player = this.physics.add.sprite(500, 200, 'buddy').setScale(0.1).refreshBody();
      player.setBounce(0.2);
      player.setCollideWorldBounds(false);

      this.physics.add.collider(player, platforms);
      cursors = this.input.keyboard.createCursorKeys();

      let query = new Moralis.Query('PlayerPosition');
      let subscription = await query.subscribe();
      subscription.on('create', (plocation) => {
        if(plocation.get("player") !== user.get("ethAddress")){

          if(competitors[plocation.get("player")] === undefined){
            
            competitors[plocation.get("player")] = this.add.image( plocation.get("x"), plocation.get("y"), 'buddy').setScale(0.1);
          }
          else{
            competitors[plocation.get("player")].x = plocation.get("x");
            competitors[plocation.get("player")].y = plocation.get("y");
          }
        }
      });
    },
    update: async function() {
      if(cursors.left.isDown) {
          player.setVelocityX(-160);
      }
      
      else if(cursors.right.isDown) {
          player.setVelocityX(160);
      } else {
          player.setVelocityX(0);
      }

      if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
      }

      if(player.lastX !== player.x  || player.lastY !== player.y){
        let userPosition = user;

        const PlayerPosition = Moralis.Object.extend("PlayerPosition");
        const playerPosition = new PlayerPosition();

        playerPosition.set("player",userPosition.get("ethAddress"));
        playerPosition.set("x",player.x);
        playerPosition.set("y",player.y)

        player.lastX = player.x;
        player.lastY = player.y;

        await playerPosition.save();
      }
    }
    }
  
}

  if (!isAuthenticated) {
    return (
      <div>
        <button onClick={() => authenticate()}>Connect Wallet</button>
      </div>
    );
  }

  return (
    <>
    <button onClick={() => logout()}>Disconnect Wallet</button>
    <IonPhaser game={game} initialize={true} />
    </>
  );
}

export default App;
