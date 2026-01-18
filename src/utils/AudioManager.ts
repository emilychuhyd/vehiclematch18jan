export class AudioManager {
  private context: AudioContext;
  private enabled: boolean = true;
  private volume: number = 0.5;
  
  constructor() {
    this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  
  private playTone(frequency: number, duration: number, type: OscillatorType = 'sine'): void {
    if (!this.enabled) return;
    
    const oscillator = this.context.createOscillator();
    const gainNode = this.context.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.context.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(this.volume, this.context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + duration);
    
    oscillator.start(this.context.currentTime);
    oscillator.stop(this.context.currentTime + duration);
  }
  
  playTap(): void {
    this.playTone(800, 0.1, 'sine');
  }
  
  playMatch(): void {
    this.playTone(523, 0.15, 'triangle');
    setTimeout(() => this.playTone(659, 0.15, 'triangle'), 100);
    setTimeout(() => this.playTone(784, 0.2, 'triangle'), 200);
  }
  
  playMismatch(): void {
    this.playTone(300, 0.2, 'sawtooth');
  }
  
  playWin(): void {
    const notes = [523, 659, 784, 1047];
    notes.forEach((note, i) => {
      setTimeout(() => this.playTone(note, 0.3, 'triangle'), i * 150);
    });
  }
  
  playVroom(wheels: number): void {
    const baseFreq = 200 + (wheels * 50);
    this.playTone(baseFreq, 0.3, 'sawtooth');
  }
  
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }
  
  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
  }
}
