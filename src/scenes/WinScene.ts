import Phaser from 'phaser';
import { VoiceManager } from '../utils/VoiceManager';
import { AudioManager } from '../utils/AudioManager';

export default class WinScene extends Phaser.Scene {
  private voiceManager!: VoiceManager;
  private audioManager!: AudioManager;
  
  constructor() {
    super({ key: 'WinScene' });
  }
  
  create(data: { stars: number }): void {
    this.voiceManager = this.registry.get('voiceManager');
    this.audioManager = this.registry.get('audioManager');
    
    this.createBackground();
    this.createConfetti();
    this.createMessage();
    this.createStars(data.stars);
    this.createButtons();
    
    this.voiceManager.speak('You won! Super matcher! You are amazing!');
  }
  
  private createBackground(): void {
    const bg = this.add.graphics();
    bg.fillGradientStyle(0xFF005C, 0xFFFF00, 0x00F0FF, 0x8800FF);
    bg.fillRect(0, 0, 1080, 1920);
  }
  
  private createConfetti(): void {
    for (let i = 0; i < 100; i++) {
      const colors = [0xFF005C, 0xFFFF00, 0x00F0FF, 0x00FF00, 0xFF8800, 0x8800FF, 0xFFFFFF];
      const confetti = this.add.graphics();
      confetti.fillStyle(colors[Math.floor(Math.random() * colors.length)]);
      confetti.fillRect(0, 0, 15, 15);
      
      const x = Phaser.Math.Between(0, 1080);
      const y = Phaser.Math.Between(-500, 0);
      confetti.setPosition(x, y);
      
      this.tweens.add({
        targets: confetti,
        y: 2000,
        rotation: Phaser.Math.Between(0, 720),
        duration: Phaser.Math.Between(3000, 5000),
        repeat: -1,
        delay: Phaser.Math.Between(0, 2000)
      });
    }
  }
  
  private createMessage(): void {
    const title = this.add.text(540, 400, 'YOU WON!', {
      fontFamily: 'Courier New, monospace',
      fontSize: '120px',
      color: '#000000',
      fontStyle: 'bold'
    });
    title.setOrigin(0.5);
    title.setShadow(10, 10, '#FFFFFF', 0, false, true);
    
    this.tweens.add({
      targets: title,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 500,
      yoyo: true,
      repeat: -1
    });
    
    const subtitle = this.add.text(540, 550, 'SUPER MATCHER!', {
      fontFamily: 'Courier New, monospace',
      fontSize: '64px',
      color: '#000000',
      fontStyle: 'bold'
    });
    subtitle.setOrigin(0.5);
    subtitle.setShadow(6, 6, '#FF005C', 0, false, true);
  }
  
  private createStars(count: number): void {
    const startX = 340;
    const spacing = 200;
    const y = 800;
    
    for (let i = 0; i < count; i++) {
      const star = this.add.text(startX + i * spacing, y, '⭐', {
        fontSize: '120px'
      });
      star.setOrigin(0.5);
      star.setAlpha(0);
      
      this.tweens.add({
        targets: star,
        alpha: 1,
        scaleX: 1.5,
        scaleY: 1.5,
        duration: 500,
        delay: i * 300,
        ease: 'Back.easeOut',
        onComplete: () => {
          this.tweens.add({
            targets: star,
            scaleX: 1,
            scaleY: 1,
            duration: 300
          });
        }
      });
    }
  }
  
  private createButtons(): void {
    const playAgainBtn = this.createButton(540, 1200, 'PLAY AGAIN', 0x00FF00, () => {
      this.audioManager.playTap();
      this.voiceManager.speak('Let\'s play again!');
      this.scene.start('GameScene');
    });
    
    const homeBtn = this.createButton(540, 1400, 'HOME', 0xFF005C, () => {
      this.audioManager.playTap();
      this.voiceManager.speak('Going home!');
      this.scene.start('MenuScene');
    });
  }
  
  private createButton(x: number, y: number, text: string, color: number, callback: () => void): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);
    
    const width = 600;
    const height = 140;
    
    const bg = this.add.graphics();
    bg.fillStyle(color);
    bg.fillRect(-width / 2, -height / 2, width, height);
    bg.lineStyle(4, 0x000000);
    bg.strokeRect(-width / 2, -height / 2, width, height);
    
    const shadow = this.add.graphics();
    shadow.fillStyle(0x000000);
    shadow.fillRect(-width / 2 + 8, -height / 2 + 8, width, height);
    
    container.add([shadow, bg]);
    
    const label = this.add.text(0, 0, text, {
      fontFamily: 'Courier New, monospace',
      fontSize: '56px',
      color: '#000000',
      fontStyle: 'bold'
    });
    label.setOrigin(0.5);
    container.add(label);
    
    container.setSize(width, height);
    container.setInteractive(new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height), Phaser.Geom.Rectangle.Contains);
    
    container.on('pointerdown', () => {
      this.tweens.add({
        targets: container,
        scaleX: 0.95,
        scaleY: 0.95,
        duration: 100,
        yoyo: true,
        onComplete: callback
      });
    });
    
    return container;
  }
}
