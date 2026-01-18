import { GameState } from '../types';

export class StorageManager {
  private static STORAGE_KEY = 'zoomy-vehicles-game-state';

  public static save(state: GameState): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save game state:', error);
    }
  }

  public static load(): GameState {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to load game state:', error);
    }

    return this.getDefaultState();
  }

  private static getDefaultState(): GameState {
    return {
      mode: 'colors',
      difficulty: 'easy',
      stars: {
        colors: { easy: 0, medium: 0, hard: 0 },
        sizes: { easy: 0, medium: 0, hard: 0 },
        wheels: { easy: 0, medium: 0, hard: 0 },
        details: { easy: 0, medium: 0, hard: 0 },
        where: { easy: 0, medium: 0, hard: 0 }
      }
    };
  }

  public static reset(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
