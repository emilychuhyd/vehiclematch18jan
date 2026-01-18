import { TruckData, GameMode, Difficulty } from '../types';

export class TruckGenerator {
  private static colors = [
    { value: 0xFF0000, name: 'red' },
    { value: 0x0000FF, name: 'blue' },
    { value: 0x00FF00, name: 'green' },
    { value: 0xFFFF00, name: 'yellow' },
    { value: 0xFF00FF, name: 'purple' },
    { value: 0xFF8800, name: 'orange' }
  ];

  private static scales = [
    { value: 0.7, name: 'small' },
    { value: 1.0, name: 'medium' },
    { value: 1.3, name: 'large' }
  ];

  private static wheelCounts = [2, 4, 6];
  private static accessories: Array<'ladder' | 'siren' | 'trailer'> = ['ladder', 'siren', 'trailer'];
  private static categories: Array<'land' | 'sky' | 'sea'> = ['land', 'sky', 'sea'];

  public static generate(mode: GameMode, difficulty: Difficulty): TruckData[] {
    const pairCount = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 5;
    const trucks: TruckData[] = [];

    for (let i = 0; i < pairCount; i++) {
      const baseTruck = this.generateBaseTruck(i, mode);
      trucks.push({ ...baseTruck });
      trucks.push({ ...baseTruck });
    }

    return this.shuffle(trucks);
  }

  private static generateBaseTruck(pairId: number, mode: GameMode): TruckData {
    const color = this.colors[pairId % this.colors.length];
    const scale = this.scales[pairId % this.scales.length];
    const wheels = this.wheelCounts[pairId % this.wheelCounts.length];
    const accessory = this.accessories[pairId % this.accessories.length];
    const category = this.categories[pairId % this.categories.length];

    return {
      pairId,
      color: color.value,
      colorName: color.name,
      scale: scale.value,
      scaleName: scale.name,
      wheels,
      accessory,
      category
    };
  }

  private static shuffle<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}
