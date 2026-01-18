import Phaser from 'phaser';
import { TruckData, GameState } from '../types';
import { TruckGenerator } from '../utils/TruckGenerator';
import { VoiceManager } from '../utils/VoiceManager';
import { AudioManager } from '../utils/AudioManager';
import { StorageManager } from '../utils/StorageManager';
import { Truck } from '../objects/Truck';

export default class GameScene extends Phaser.Scene {
  private trucks: Truck[] = [];
  private truckData: TruckData[] = [];
  private selectedTruck: Truck | null = null;
  private matchedPairs: number = 0;
  private totalPairs: number = 0;
  private voiceManager!: VoiceManager;
  private audioManager!: AudioManager;
  private gameState!: GameState;
  private progressText!: Phaser.GameObjects.Text;
  
  constructor() {
    super({ key: 'GameScene' });
  }
  
  preload(): void {
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });
    graphics.fillStyle(0xFFFFFF);
    graphics.fillCircle(8, 8, 8);
    graphics.generateTexture('particle', 16, 16);
    graphics.destroy();
  }
  
  create(): void {
    this.voiceManager = this.registry.get('voiceManager');
    this.audioManager = this.registry.get('audioManager');
    this.gameState = this.registry.get('gameState');
    
    this.createBackground();
    this.createUI();
    this.generateTrucks();
    this.layoutTrucks();
    
    this.voiceManager.speak('Find the matching trucks!');
  }
  
  private createBackground(): void {
    const bg = this.add.graphics();
    
    switch (this.gameState.mode) {
      case 'where':
        bg.fillGradientStyle(0x87CEEB, 0x87CEEB, 0x90EE90, 0x90EE90);
        break;
      case 'colors':
        bg.fillGradientStyle(0xFF005C, 0xFFFF00, 0x00F0FF, 0x8800FF);
        break;
      default:
        bg.fillStyle(0x00F0FF);
    }
    
    bg.fillRect(0, 0, 1080, 1920);
  }
  
  private createUI(): void {
    const homeBtn = this.createButton(120, 120, '🏠', () => {
      this.voiceManager.speak('Going home!');
      this.scene.start('MenuScene');
    });
    
    const restartBtn = this.createButton(960, 120, '🔄', () => {
      this.voiceManager.speak('Starting over!');
      this.scene.restart();
    });
    
    this.progressText = this.add.text(540, 120, '0/0 MATCHED!', {
      fontFamily: 'Courier New, monospace',
      fontSize: '56px',
      color: '#000000',
      fontStyle: 'bold'
    });
    this.progressText.setOrigin(0.5);
    this.progressText.setShadow(5, 5, '#FFFFFF', 0, false, true);
  }
  
  private createButton(x: number, y: number, emoji: string, callback: () => void): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);
    
    const size = 160;
    
    const shadow = this.add.graphics();
    shadow.fillStyle(0x000000);
    shadow.fillRect(-size / 2 + 8, -size / 2 + 8, size, size);
    
    const bg = this.add.graphics();
    bg.fillStyle(0xFFFFFF);
    bg.fillRect(-size / 2, -size / 2, size, size);
    bg.lineStyle(6, 0x000000);
    bg.strokeRect(-size / 2, -size / 2, size, size);
    
    container.add([shadow, bg]);
    
    const text = this.add.text(0, 0, emoji, {
      fontSize: '80px'
    });
    text.setOrigin(0.5);
    container.add(text);
    
    container.setSize(size, size);
    container.setInteractive(new Phaser.Geom.Rectangle(-size / 2, -size / 2, size, size), Phaser.Geom.Rectangle.Contains);
    
    container.on('pointerdown', () => {
      this.audioManager.playTap();
      this.tweens.add({
        targets: container,
        scaleX: 0.9,
        scaleY: 0.9,
        duration: 100,
        yoyo: true,
        onComplete: callback
      });
    });
    
    container.on('pointerover', () => {
      this.tweens.add({
        targets: container,
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 100
      });
    });
    
    container.on('pointerout', () => {
      this.tweens.add({
        targets: container,
        scaleX: 1,
        scaleY: 1,
        duration: 100
      });
    });
    
    return container;
  }
  
  private generateTrucks(): void {
    this.truckData = TruckGenerator.generate(this.gameState.mode, this.gameState.difficulty);
    this.totalPairs = this.truckData.length / 2;
    this.matchedPairs = 0;
    this.updateProgress();
  }
  
  private layoutTrucks(): void {
    const cols = this.gameState.difficulty === 'easy' ? 2 : 2;
    const rows = Math.ceil(this.truckData.length / cols);
    
    const startX = 270;
    const startY = 450;
    const spacingX = 540;
    const spacingY = 400;
    
    this.truckData.forEach((data, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      
      const x = startX + col * spacingX;
      const y = startY + row * spacingY;
      
      const truck = new Truck(this, x, y, data);
      truck.on('pointerdown', () => this.onTruckClick(truck));
      this.trucks.push(truck);
    });
  }
  
  private onTruckClick(truck: Truck): void {
    if (this.selectedTruck === truck) return;
    
    this.audioManager.playTap();
    
    if (!this.selectedTruck) {
      this.selectedTruck = truck;
      truck.highlight();
      this.speakTruckDetails(truck, true);
    } else {
      if (this.checkExactMatch(this.selectedTruck, truck)) {
        this.handleMatch(this.selectedTruck, truck);
      } else {
        this.handleMismatch(this.selectedTruck, truck);
      }
    }
  }
  
  private checkExactMatch(truck1: Truck, truck2: Truck): boolean {
    const d1 = truck1.data;
    const d2 = truck2.data;
    
    return d1.pairId === d2.pairId &&
           d1.color === d2.color &&
           d1.scale === d2.scale &&
           d1.wheels === d2.wheels &&
           d1.accessory === d2.accessory &&
           d1.category === d2.category;
  }
  
  private handleMatch(truck1: Truck, truck2: Truck): void {
    this.audioManager.playMatch();
    this.audioManager.playVroom(truck1.data.wheels);
    
    truck1.celebrate();
    truck2.celebrate();
    
    this.createConfetti(truck1.x, truck1.y);
    this.createConfetti(truck2.x, truck2.y);
    
    this.speakTruckDetails(truck1, false);
    
    this.matchedPairs++;
    this.updateProgress();
    
    this.time.delayedCall(1000, () => {
      truck1.setAlpha(0.3);
      truck2.setAlpha(0.3);
      truck1.disableInteractive();
      truck2.disableInteractive();
      
      this.selectedTruck = null;
      
      if (this.matchedPairs === this.totalPairs) {
        this.time.delayedCall(500, () => this.handleWin());
      }
    });
  }
  
  private handleMismatch(truck1: Truck, truck2: Truck): void {
    this.audioManager.playMismatch();
    
    truck1.shake();
    truck2.shake();
    
    this.voiceManager.speak('Not quite! Try again!');
    
    this.time.delayedCall(500, () => {
      truck1.unhighlight();
      this.selectedTruck = null;
    });
  }
  
  private speakTruckDetails(truck: Truck, isFirst: boolean): void {
    const mode = this.gameState.mode;
    let message = '';
    
    if (isFirst) {
      switch (mode) {
        case 'colors':
          message = `${truck.data.colorName} truck!`;
          break;
        case 'sizes':
          message = `${truck.data.scaleName} truck!`;
          break;
        case 'wheels':
          message = `Truck with ${truck.data.wheels} wheels!`;
          break;
        case 'details':
          message = `Truck with ${truck.data.accessory}!`;
          break;
        case 'where':
          message = `${truck.data.category} truck!`;
          break;
      }
    } else {
      switch (mode) {
        case 'colors':
          message = `Perfect match! Two ${truck.data.colorName} trucks!`;
          break;
        case 'sizes':
          message = `Perfect match! Two ${truck.data.scaleName} trucks!`;
          break;
        case 'wheels':
          message = `Perfect match! Two trucks with ${truck.data.wheels} wheels!`;
          break;
        case 'details':
          message = `Perfect match! Two trucks with ${truck.data.accessory}!`;
          break;
        case 'where':
          message = `Perfect match! Two ${truck.data.category} trucks!`;
          break;
      }
    }
    
    this.voiceManager.speak(message);
  }
  
  private updateProgress(): void {
    this.progressText.setText(`${this.matchedPairs}/${this.totalPairs} MATCHED!`);
  }
  
  private createConfetti(x: number, y: number): void {
    const colors = [0xFF005C, 0xFFFF00, 0x00F0FF, 0x00FF00, 0xFF8800, 0x8800FF];
    
    for (let i = 0; i < 30; i++) {
      const confetti = this.add.graphics();
      confetti.fillStyle(colors[Math.floor(Math.random() * colors.length)]);
      confetti.fillRect(0, 0, 12, 12);
      confetti.setPosition(x, y);
      
      this.tweens.add({
        targets: confetti,
        x: x + Phaser.Math.Between(-250, 250),
        y: y + Phaser.Math.Between(-250, 250),
        alpha: 0,
        rotation: Phaser.Math.Between(0, 360),
        duration: 1200,
        ease: 'Cubic.easeOut',
        onComplete: () => confetti.destroy()
      });
    }
  }
  
  private handleWin(): void {
    this.audioManager.playWin();
    
    const stars = 3;
    this.gameState.stars[this.gameState.mode][this.gameState.difficulty] = Math.max(
      this.gameState.stars[this.gameState.mode][this.gameState.difficulty],
      stars
    );
    StorageManager.save(this.gameState);
    
    this.time.delayedCall(2000, () => {
      this.advanceToNextGame();
    });
  }
  
  private advanceToNextGame(): void {
    const modes: Array<keyof typeof this.gameState.stars> = ['colors', 'sizes', 'wheels', 'details', 'where'];
    const difficulties: Array<'easy' | 'medium' | 'hard'> = ['easy', 'medium', 'hard'];
    
    const currentModeIndex = modes.indexOf(this.gameState.mode);
    const currentDiffIndex = difficulties.indexOf(this.gameState.difficulty);
    
    if (currentDiffIndex < difficulties.length - 1) {
      this.gameState.difficulty = difficulties[currentDiffIndex + 1];
    } else if (currentModeIndex < modes.length - 1) {
      this.gameState.mode = modes[currentModeIndex + 1];
      this.gameState.difficulty = 'easy';
    } else {
      this.gameState.mode = 'colors';
      this.gameState.difficulty = 'easy';
    }
    
    StorageManager.save(this.gameState);
    this.voiceManager.speak('Next challenge!');
    this.scene.restart();
  }
}
