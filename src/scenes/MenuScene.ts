import Phaser from 'phaser';
import { GameState, GameMode, Difficulty } from '../types';
import { VoiceManager } from '../utils/VoiceManager';
import { AudioManager } from '../utils/AudioManager';
import { StorageManager } from '../utils/StorageManager';

export default class MenuScene extends Phaser.Scene {
  private voiceManager!: VoiceManager;
  private audioManager!: AudioManager;
  private gameState!: GameState;
  
  constructor() {
    super({ key: 'MenuScene' });
  }
  
  create(): void {
    this.voiceManager = this.registry.get('voiceManager');
    this.audioManager = this.registry.get('audioManager');
    this.gameState = StorageManager.load();
    this.registry.set('gameState', this.gameState);
    
    this.createBackground();
    this.createTitle();
    this.createModeButtons();
    this.createDifficultyButtons();
    this.createPlayButton();
    
    this.voiceManager.speak('Welcome to Zoomy Vehicles Twins!');
  }
  
  private createBackground(): void {
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x00F0FF, 0x00F0FF, 0xFF005C, 0xFF005C);
    bg.fillRect(0, 0, 1080, 1920);
  }
  
  private createTitle(): void {
    const title = this.add.text(540, 200, 'ZOOMY VEHICLES\nTWINS!', {
      fontFamily: 'Courier New, monospace',
      fontSize: '96px',
      color: '#000000',
      fontStyle: 'bold',
      align: 'center'
    });
    title.setOrigin(0.5);
    title.setShadow(8, 8, '#FFFFFF', 0, false, true);
    
    this.tweens.add({
      targets: title,
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 1000,
      yoyo: true,
      repeat: -1
    });
  }
  
  private createModeButtons(): void {
    const modes: { mode: GameMode; label: string; emoji: string }[] = [
      { mode: 'colors', label: 'COLORS', emoji: '🎨' },
      { mode: 'sizes', label: 'SIZES', emoji: '📏' },
      { mode: 'wheels', label: 'WHEELS', emoji: '⚙️' },
      { mode: 'details', label: 'DETAILS', emoji: '🔧' },
      { mode: 'where', label: 'WHERE', emoji: '🌍' }
    ];
    
    const startY = 450;
    const spacing = 180;
    
    modes.forEach((item, index) => {
      const y = startY + index * spacing;
      this.createModeButton(540, y, item.label, item.emoji, item.mode);
    });
  }
  
  private createModeButton(x: number, y: number, label: string, emoji: string, mode: GameMode): void {
    const container = this.add.container(x, y);
    const isSelected = this.gameState.mode === mode;
    
    const width = 700;
    const height = 140;
    
    const shadow = this.add.graphics();
    shadow.fillStyle(0x000000);
    shadow.fillRect(-width / 2 + 8, -height / 2 + 8, width, height);
    
    const bg = this.add.graphics();
    bg.fillStyle(isSelected ? 0xFFFF00 : 0xFFFFFF);
    bg.fillRect(-width / 2, -height / 2, width, height);
    bg.lineStyle(6, 0x000000);
    bg.strokeRect(-width / 2, -height / 2, width, height);
    
    container.add([shadow, bg]);
    
    const emojiText = this.add.text(-250, 0, emoji, {
      fontSize: '80px'
    });
    emojiText.setOrigin(0.5);
    
    const labelText = this.add.text(50, 0, label, {
      fontFamily: 'Courier New, monospace',
      fontSize: '64px',
      color: '#000000',
      fontStyle: 'bold'
    });
    labelText.setOrigin(0.5);
    
    container.add([emojiText, labelText]);
    
    container.setSize(width, height);
    container.setInteractive(new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height), Phaser.Geom.Rectangle.Contains);
    
    container.on('pointerdown', () => {
      this.audioManager.playTap();
      this.gameState.mode = mode;
      this.voiceManager.speak(`${label} mode selected!`);
      this.scene.restart();
    });
    
    container.on('pointerover', () => {
      this.tweens.add({
        targets: container,
        scaleX: 1.05,
        scaleY: 1.05,
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
  }
  
  private createDifficultyButtons(): void {
    const difficulties: { diff: Difficulty; label: string }[] = [
      { diff: 'easy', label: 'EASY' },
      { diff: 'medium', label: 'MEDIUM' },
      { diff: 'hard', label: 'HARD' }
    ];
    
    const startX = 180;
    const spacing = 300;
    const y = 1400;
    
    difficulties.forEach((item, index) => {
      const x = startX + index * spacing;
      this.createDifficultyButton(x, y, item.label, item.diff);
    });
  }
  
  private createDifficultyButton(x: number, y: number, label: string, difficulty: Difficulty): void {
    const container = this.add.container(x, y);
    const isSelected = this.gameState.difficulty === difficulty;
    
    const width = 240;
    const height = 120;
    
    const shadow = this.add.graphics();
    shadow.fillStyle(0x000000);
    shadow.fillRect(-width / 2 + 6, -height / 2 + 6, width, height);
    
    const bg = this.add.graphics();
    bg.fillStyle(isSelected ? 0x00FF00 : 0xFFFFFF);
    bg.fillRect(-width / 2, -height / 2, width, height);
    bg.lineStyle(5, 0x000000);
    bg.strokeRect(-width / 2, -height / 2, width, height);
    
    container.add([shadow, bg]);
    
    const labelText = this.add.text(0, 0, label, {
      fontFamily: 'Courier New, monospace',
      fontSize: '48px',
      color: '#000000',
      fontStyle: 'bold'
    });
    labelText.setOrigin(0.5);
    container.add(labelText);
    
    container.setSize(width, height);
    container.setInteractive(new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height), Phaser.Geom.Rectangle.Contains);
    
    container.on('pointerdown', () => {
      this.audioManager.playTap();
      this.gameState.difficulty = difficulty;
      this.voiceManager.speak(`${label} difficulty selected!`);
      this.scene.restart();
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
  }
  
  private createPlayButton(): void {
    const container = this.add.container(540, 1650);
    
    const width = 700;
    const height = 160;
    
    const shadow = this.add.graphics();
    shadow.fillStyle(0x000000);
    shadow.fillRect(-width / 2 + 10, -height / 2 + 10, width, height);
    
    const bg = this.add.graphics();
    bg.fillStyle(0xFF005C);
    bg.fillRect(-width / 2, -height / 2, width, height);
    bg.lineStyle(8, 0x000000);
    bg.strokeRect(-width / 2, -height / 2, width, height);
    
    container.add([shadow, bg]);
    
    const label = this.add.text(0, 0, 'PLAY!', {
      fontFamily: 'Courier New, monospace',
      fontSize: '80px',
      color: '#FFFFFF',
      fontStyle: 'bold'
    });
    label.setOrigin(0.5);
    label.setShadow(4, 4, '#000000', 0, false, true);
    container.add(label);
    
    container.setSize(width, height);
    container.setInteractive(new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height), Phaser.Geom.Rectangle.Contains);
    
    container.on('pointerdown', () => {
      this.audioManager.playTap();
      this.voiceManager.speak('Let\'s play!');
      this.tweens.add({
        targets: container,
        scaleX: 0.9,
        scaleY: 0.9,
        duration: 100,
        yoyo: true,
        onComplete: () => {
          this.scene.start('GameScene');
        }
      });
    });
    
    container.on('pointerover', () => {
      this.tweens.add({
        targets: container,
        scaleX: 1.05,
        scaleY: 1.05,
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
    
    this.tweens.add({
      targets: container,
      y: 1660,
      duration: 500,
      yoyo: true,
      repeat: -1
    });
  }
}
