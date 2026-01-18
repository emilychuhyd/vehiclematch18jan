import Phaser from 'phaser';
import { GameMode, Difficulty, GameState } from '../types';
import { StorageManager } from '../utils/StorageManager';
import { VoiceManager } from '../utils/VoiceManager';
import { AudioManager } from '../utils/AudioManager';

export default class MenuScene extends Phaser.Scene {
  private voiceManager!: VoiceManager;
  private audioManager!: AudioManager;
  private gameState!: GameState;
  
  constructor() {
    super({ key: 'MenuScene' });
  }
  
  create(): void {
    this.voiceManager = new VoiceManager();
    this.audioManager = new AudioManager();
    
    const savedState = StorageManager.load();
    this.gameState = savedState || StorageManager.getDefaultState();
    
    this.registry.set('voiceManager', this.voiceManager);
    this.registry.set('audioManager', this.audioManager);
    this.registry.set('gameState', this.gameState);
    
    this.createBackground();
    this.createTitle();
    this.createModeButtons();
    this.createDifficultyButtons();
    this.createControlButtons();
    
    this.voiceManager.speak('Hi! Welcome to Zoomy Vehicles Twins! Pick a game to play!');
  }
  
  private createBackground(): void {
    const bg = this.add.graphics();
    bg.fillStyle(0x00F0FF);
    bg.fillRect(0, 0, 1080, 1920);
    
    for (let i = 0; i < 5; i++) {
      const cloud = this.add.graphics();
      cloud.fillStyle(0xFFFFFF);
      cloud.lineStyle(3, 0x000000);
      
      const x = 200 + i * 200;
      const y = 200 + Math.random() * 300;
      
      cloud.fillEllipse(x, y, 80, 50);
      cloud.strokeEllipse(x, y, 80, 50);
      cloud.fillEllipse(x - 40, y, 60, 40);
      cloud.strokeEllipse(x - 40, y, 60, 40);
      cloud.fillEllipse(x + 40, y, 60, 40);
      cloud.strokeEllipse(x + 40, y, 60, 40);
    }
  }
  
  private createTitle(): void {
    const title = this.add.text(540, 150, 'ZOOMY VEHICLES\nTWINS!', {
      fontFamily: 'Courier New, monospace',
      fontSize: '72px',
      color: '#000000',
      align: 'center',
      fontStyle: 'bold'
    });
    title.setOrigin(0.5);
    title.setShadow(8, 8, '#FF005C', 0, false, true);
  }
  
  private createModeButtons(): void {
    const modes: { mode: GameMode; emoji: string; label: string; color: number }[] = [
      { mode: 'colors', emoji: '🌈', label: 'COLORS', color: 0xFF005C },
      { mode: 'sizes', emoji: '📏', label: 'SIZES', color: 0xFFFF00 },
      { mode: 'wheels', emoji: '🔢', label: 'WHEELS', color: 0x00FF00 },
      { mode: 'details', emoji: '🪜', label: 'DETAILS', color: 0xFF8800 },
      { mode: 'where', emoji: '🏞️', label: 'WHERE', color: 0x8800FF }
    ];
    
    const startY = 400;
    const spacing = 200;
    
    modes.forEach((modeData, index) => {
      const y = startY + index * spacing;
      this.createButton(540, y, modeData.label, modeData.emoji, modeData.color, () => {
        this.gameState.mode = modeData.mode;
        this.audioManager.playTap();
        this.voiceManager.speak(`Let's play ${modeData.label}!`);
      });
    });
  }
  
  private createDifficultyButtons(): void {
    const difficulties: { diff: Difficulty; label: string; color: number }[] = [
      { diff: 'easy', label: 'EASY', color: 0x00FF00 },
      { diff: 'medium', label: 'MEDIUM', color: 0xFFFF00 },
      { diff: 'hard', label: 'HARD', color: 0xFF005C }
    ];
    
    const startX = 200;
    const spacing = 280;
    const y = 1600;
    
    difficulties.forEach((diffData, index) => {
      const x = startX + index * spacing;
      this.createButton(x, y, diffData.label, '', diffData.color, () => {
        this.gameState.difficulty = diffData.diff;
        StorageManager.save(this.gameState);
        this.audioManager.playTap();
        this.voiceManager.speak(`Starting ${diffData.label} mode!`, () => {
          this.scene.start('GameScene');
        });
      }, 200, 120);
    });
  }
  
  private createControlButtons(): void {
    const soundBtn = this.createButton(150, 1800, '🔊', '', 0xFFFFFF, () => {
      this.gameState.soundEnabled = !this.gameState.soundEnabled;
      this.audioManager.setEnabled(this.gameState.soundEnabled);
      StorageManager.save(this.gameState);
    }, 120, 120);
    
    const voiceBtn = this.createButton(300, 1800, '🗣️', '', 0xFFFFFF, () => {
      this.gameState.voiceEnabled = !this.gameState.voiceEnabled;
      this.voiceManager.setEnabled(this.gameState.voiceEnabled);
      StorageManager.save(this.gameState);
    }, 120, 120);
  }
  
  private createButton(
    x: number,
    y: number,
    text: string,
    emoji: string,
    color: number,
    callback: () => void,
    width: number = 600,
    height: number = 140
  ): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);
    
    const bg = this.add.graphics();
    bg.fillStyle(color);
    bg.fillRect(-width / 2, -height / 2, width, height);
    bg.lineStyle(4, 0x000000);
    bg.strokeRect(-width / 2, -height / 2, width, height);
    
    const shadow = this.add.graphics();
    shadow.fillStyle(0x000000);
    shadow.fillRect(-width / 2 + 8, -height / 2 + 8, width, height);
    
    container.add([shadow, bg]);
    
    if (emoji) {
      const emojiText = this.add.text(-width / 2 + 40, 0, emoji, {
        fontSize: '64px'
      });
      emojiText.setOrigin(0, 0.5);
      container.add(emojiText);
    }
    
    const label = this.add.text(emoji ? 0 : 0, 0, text, {
      fontFamily: 'Courier New, monospace',
      fontSize: width > 200 ? '48px' : '36px',
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
