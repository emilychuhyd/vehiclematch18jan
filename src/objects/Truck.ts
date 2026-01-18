import Phaser from 'phaser';
import { TruckData } from '../types';

export class Truck extends Phaser.GameObjects.Container {
  public data: TruckData;
  private graphics: Phaser.GameObjects.Graphics;
  private baseScale: number;
  private highlightGraphics: Phaser.GameObjects.Graphics;
  
  constructor(scene: Phaser.Scene, x: number, y: number, data: TruckData) {
    super(scene, x, y);
    this.data = data;
    this.baseScale = data.scale;
    
    this.highlightGraphics = scene.add.graphics();
    this.add(this.highlightGraphics);
    
    this.graphics = scene.add.graphics();
    this.add(this.graphics);
    
    this.drawTruck();
    
    const hitAreaSize = 280;
    this.setSize(hitAreaSize, hitAreaSize);
    this.setInteractive(
      new Phaser.Geom.Rectangle(-hitAreaSize / 2, -hitAreaSize / 2, hitAreaSize, hitAreaSize),
      Phaser.Geom.Rectangle.Contains
    );
    
    this.on('pointerover', () => {
      scene.tweens.add({
        targets: this,
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 100
      });
    });
    
    this.on('pointerout', () => {
      if (this.scaleX > 1.2) return;
      scene.tweens.add({
        targets: this,
        scaleX: 1,
        scaleY: 1,
        duration: 100
      });
    });
    
    scene.add.existing(this);
  }
  
  private drawTruck(): void {
    const g = this.graphics;
    g.clear();
    
    const scale = this.baseScale;
    const color = this.data.color;
    
    g.lineStyle(4, 0x000000);
    g.fillStyle(color);
    
    g.fillRoundedRect(-80 * scale, -40 * scale, 160 * scale, 80 * scale, 10 * scale);
    g.strokeRoundedRect(-80 * scale, -40 * scale, 160 * scale, 80 * scale, 10 * scale);
    
    g.fillStyle(0xFFFFFF);
    g.fillRoundedRect(-60 * scale, -30 * scale, 40 * scale, 30 * scale, 5 * scale);
    g.strokeRoundedRect(-60 * scale, -30 * scale, 40 * scale, 30 * scale, 5 * scale);
    
    g.fillStyle(0x000000);
    g.fillCircle(-50 * scale, -20 * scale, 4 * scale);
    g.fillCircle(-35 * scale, -20 * scale, 4 * scale);
    
    g.lineStyle(3, 0x000000);
    g.beginPath();
    g.arc(-42 * scale, -10 * scale, 8 * scale, 0.2, Math.PI - 0.2);
    g.strokePath();
    
    const wheelSpacing = 160 / (this.data.wheels + 1);
    for (let i = 0; i < this.data.wheels; i++) {
      const wx = -80 * scale + (wheelSpacing * (i + 1)) * scale;
      const wy = 40 * scale;
      
      g.fillStyle(0x000000);
      g.fillCircle(wx, wy, 15 * scale);
      g.lineStyle(4, 0x000000);
      g.strokeCircle(wx, wy, 15 * scale);
      
      g.fillStyle(0x666666);
      g.fillCircle(wx, wy, 8 * scale);
    }
    
    this.drawAccessory(scale);
    this.drawCategoryIcon(scale);
  }
  
  private drawAccessory(scale: number): void {
    const g = this.graphics;
    
    switch (this.data.accessory) {
      case 'ladder':
        g.lineStyle(3, 0x000000);
        g.strokeRect(20 * scale, -35 * scale, 8 * scale, 40 * scale);
        for (let i = 0; i < 4; i++) {
          g.lineBetween(20 * scale, -30 * scale + i * 10 * scale, 28 * scale, -30 * scale + i * 10 * scale);
        }
        break;
      case 'siren':
        g.fillStyle(0xFF0000);
        g.fillCircle(0, -50 * scale, 10 * scale);
        g.lineStyle(3, 0x000000);
        g.strokeCircle(0, -50 * scale, 10 * scale);
        break;
      case 'trailer':
        g.fillStyle(this.data.color);
        g.fillRect(80 * scale, -20 * scale, 40 * scale, 40 * scale);
        g.lineStyle(3, 0x000000);
        g.strokeRect(80 * scale, -20 * scale, 40 * scale, 40 * scale);
        break;
    }
  }
  
  private drawCategoryIcon(scale: number): void {
    const g = this.graphics;
    const iconX = 60 * scale;
    const iconY = -50 * scale;
    
    g.lineStyle(2, 0x000000);
    
    switch (this.data.category) {
      case 'land':
        g.strokeRect(iconX - 10 * scale, iconY, 20 * scale, 2 * scale);
        g.strokeRect(iconX - 8 * scale, iconY + 3 * scale, 16 * scale, 2 * scale);
        break;
      case 'sky':
        g.beginPath();
        g.arc(iconX, iconY, 8 * scale, Math.PI, 0);
        g.strokePath();
        g.beginPath();
        g.arc(iconX - 6 * scale, iconY, 6 * scale, Math.PI, 0);
        g.strokePath();
        g.beginPath();
        g.arc(iconX + 6 * scale, iconY, 6 * scale, Math.PI, 0);
        g.strokePath();
        break;
      case 'sea':
        for (let i = 0; i < 3; i++) {
          g.beginPath();
          g.arc(iconX - 10 * scale + i * 10 * scale, iconY, 5 * scale, Math.PI, 0);
          g.strokePath();
        }
        break;
    }
  }
  
  public highlight(): void {
    this.highlightGraphics.clear();
    this.highlightGraphics.lineStyle(8, 0xFFFF00);
    this.highlightGraphics.strokeCircle(0, 0, 140);
    
    this.scene.tweens.add({
      targets: this,
      scaleX: 1.3,
      scaleY: 1.3,
      duration: 200,
      ease: 'Back.easeOut'
    });
    
    const sparkles = this.scene.add.particles(this.x, this.y, 'particle', {
      speed: { min: 50, max: 150 },
      scale: { start: 1, end: 0 },
      lifespan: 500,
      quantity: 10,
      blendMode: 'ADD'
    });
    
    this.scene.time.delayedCall(500, () => sparkles.destroy());
  }
  
  public unhighlight(): void {
    this.highlightGraphics.clear();
    
    this.scene.tweens.add({
      targets: this,
      scaleX: 1,
      scaleY: 1,
      duration: 200,
      ease: 'Back.easeIn'
    });
  }
  
  public celebrate(): void {
    this.scene.tweens.add({
      targets: this,
      y: this.y - 50,
      duration: 300,
      yoyo: true,
      ease: 'Quad.easeOut'
    });
    
    this.scene.tweens.add({
      targets: this,
      angle: { from: -15, to: 15 },
      duration: 150,
      yoyo: true,
      repeat: 2
    });
  }
  
  public shake(): void {
    this.scene.tweens.add({
      targets: this,
      x: this.x + 10,
      duration: 50,
      yoyo: true,
      repeat: 3
    });
  }
}
