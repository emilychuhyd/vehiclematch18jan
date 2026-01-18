import { TruckData, GameMode, Difficulty, Accessory, Category } from '../types';

export class TruckGenerator {
  private static COLORS = [
    { hex: 0xFF005C, name: 'red' },
    { hex: 0x0000FF, name: 'blue' },
    { hex: 0xFFFF00, name: 'yellow' },
    { hex: 0x00FF00, name: 'green' },
    { hex: 0xFF8800, name: 'orange' },
    { hex: 0x8800FF, name: 'purple' }
  ];
  
  private static SCALES = [
    { value: 0.6, name: 'tiny' },
    { value: 0.8, name: 'small' },
    { value: 1.0, name: 'medium' },
    { value: 1.2, name: 'big' }
  ];
  
  private static WHEELS = [4, 6, 8];
  private static ACCESSORIES: Accessory[] = ['ladder', 'siren', 'trailer', 'none'];
  private static CATEGORIES: Category[] = ['land', 'sky', 'sea'];
  
  static generate(mode: GameMode, difficulty: Difficulty): TruckData[] {
    const pairCount = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 3 : 4;
    const trucks: TruckData[] = [];
    
    for (let pairId = 0; pairId < pairCount; pairId++) {
      const matchingValue = this.getMatchingValue(mode, pairId);
      
      for (let i = 0; i < 2; i++) {
        const truck = this.createTruck(trucks.length, pairId, mode, matchingValue);
        trucks.push(truck);
      }
    }
    
    return Phaser.Utils.Array.Shuffle(trucks);
  }
  
  private static getMatchingValue(mode: GameMode, pairId: number): any {
    switch (mode) {
      case 'colors':
        return this.COLORS[pairId % this.COLORS.length];
      case 'sizes':
        return this.SCALES[pairId % this.SCALES.length];
      case 'wheels':
        return this.WHEELS[pairId % this.WHEELS.length];
      case 'details':
        return this.ACCESSORIES[pairId % this.ACCESSORIES.length];
      case 'where':
        return this.CATEGORIES[pairId % this.CATEGORIES.length];
      default:
        return this.COLORS[0];
    }
  }
  
  private static createTruck(id: number, pairId: number, mode: GameMode, matchingValue: any): TruckData {
    const randomColor = () => this.COLORS[Math.floor(Math.random() * this.COLORS.length)];
    const randomScale = () => this.SCALES[Math.floor(Math.random() * this.SCALES.length)];
    const randomWheels = () => this.WHEELS[Math.floor(Math.random() * this.WHEELS.length)];
    const randomAccessory = () => this.ACCESSORIES[Math.floor(Math.random() * this.ACCESSORIES.length)];
    const randomCategory = () => this.CATEGORIES[Math.floor(Math.random() * this.CATEGORIES.length)];
    
    let color, scale, wheels, accessory, category;
    
    switch (mode) {
      case 'colors':
        color = matchingValue;
        scale = randomScale();
        wheels = randomWheels();
        accessory = randomAccessory();
        category = randomCategory();
        break;
      case 'sizes':
        color = randomColor();
        scale = matchingValue;
        wheels = randomWheels();
        accessory = randomAccessory();
        category = randomCategory();
        break;
      case 'wheels':
        color = randomColor();
        scale = randomScale();
        wheels = matchingValue;
        accessory = randomAccessory();
        category = randomCategory();
        break;
      case 'details':
        color = randomColor();
        scale = randomScale();
        wheels = randomWheels();
        accessory = matchingValue;
        category = randomCategory();
        break;
      case 'where':
        color = randomColor();
        scale = randomScale();
        wheels = randomWheels();
        accessory = randomAccessory();
        category = matchingValue;
        break;
      default:
        color = randomColor();
        scale = randomScale();
        wheels = randomWheels();
        accessory = randomAccessory();
        category = randomCategory();
    }
    
    return {
      id,
      color: color.hex,
      colorName: color.name,
      scale: scale.value,
      scaleName: scale.name,
      wheels,
      accessory,
      category,
      pairId
    };
  }
}
