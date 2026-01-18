import { GameState } from '../types';

export class StorageManager {
  private static KEY = 'zoomy-vehicles-state';
  
  static save(state: GameState): void {
    try {
      localStorage.setItem(this.KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to save state:', e);
    }
  }
  
  static load(): GameState | null {
    try {
      const data = localStorage.getItem(this.KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.warn('Failed to load state:', e);
      return null;
    }
  }
  
  static getDefaultState(): GameState {
    return {
      mode: 'colors',
      difficulty: 'easy',
      stars: {
        colors: { easy: 0, medium: 0, hard: 0 },
        sizes: { easy: 0, medium: 0, hard: 0 },
        wheels: { easy: 0, medium: 0, hard: 0 },
        details: { easy: 0, medium: 0, hard: 0 },
        where: { easy: 0, medium: 0, hard: 0 }
      },
      soundEnabled: true,
      voiceEnabled: true,
      language: 'en',
      volume: 0.5
    };
  }
}
