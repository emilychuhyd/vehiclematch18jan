export type GameMode = 'colors' | 'sizes' | 'wheels' | 'details' | 'where';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type Category = 'land' | 'sky' | 'sea';
export type Accessory = 'ladder' | 'siren' | 'trailer' | 'none';

export interface TruckData {
  id: number;
  color: number;
  colorName: string;
  scale: number;
  scaleName: string;
  wheels: number;
  accessory: Accessory;
  category: Category;
  pairId: number;
}

export interface GameState {
  mode: GameMode;
  difficulty: Difficulty;
  stars: {
    colors: { easy: number; medium: number; hard: number };
    sizes: { easy: number; medium: number; hard: number };
    wheels: { easy: number; medium: number; hard: number };
    details: { easy: number; medium: number; hard: number };
    where: { easy: number; medium: number; hard: number };
  };
  soundEnabled: boolean;
  voiceEnabled: boolean;
  language: 'en' | 'zh';
  volume: number;
}
