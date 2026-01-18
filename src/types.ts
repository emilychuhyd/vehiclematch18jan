export type GameMode = 'colors' | 'sizes' | 'wheels' | 'details' | 'where';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface TruckData {
  pairId: number;
  color: number;
  colorName: string;
  scale: number;
  scaleName: string;
  wheels: number;
  accessory: 'ladder' | 'siren' | 'trailer';
  category: 'land' | 'sky' | 'sea';
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
}
