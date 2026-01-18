import Phaser from 'phaser';
import MenuScene from './scenes/MenuScene';
import GameScene from './scenes/GameScene';
import WinScene from './scenes/WinScene';
import { VoiceManager } from './utils/VoiceManager';
import { AudioManager } from './utils/AudioManager';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game-container',
  backgroundColor: '#00F0FF',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1080,
    height: 1920,
    min: {
      width: 320,
      height: 568
    },
    max: {
      width: 1080,
      height: 1920
    }
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false
    }
  },
  scene: [MenuScene, GameScene, WinScene]
};

const game = new Phaser.Game(config);

const voiceManager = new VoiceManager();
const audioManager = new AudioManager();

game.registry.set('voiceManager', voiceManager);
game.registry.set('audioManager', audioManager);

const loading = document.querySelector('.loading');
if (loading) {
  loading.remove();
}
