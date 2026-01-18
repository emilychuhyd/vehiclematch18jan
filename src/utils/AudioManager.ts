export class AudioManager {
  private audioContext: AudioContext;
  private enabled: boolean = true;

  constructor() {
    this.audioContext = new AudioContext();
  }

  private playTone(frequency: number, duration: number, type: OscillatorType = 'sine'): void {
    if (!this.enabled) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  public playTap(): void {
    this.playTone(800, 0.1, 'sine');
  }

  public playMatch(): void {
    this.playTone(523.25, 0.15, 'sine');
    setTimeout(() => this.playTone(659.25, 0.15, 'sine'), 100);
    setTimeout(() => this.playTone(783.99, 0.3, 'sine'), 200);
  }

  public playMismatch(): void {
    this.playTone(200, 0.2, 'sawtooth');
    setTimeout(() => this.playTone(150, 0.2, 'sawtooth'), 150);
  }

  public playWin(): void {
    const notes = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50];
    notes.forEach((note, index) => {
      setTimeout(() => this.playTone(note, 0.2, 'sine'), index * 100);
    });
  }

  public playVroom(wheels: number): void {
    const baseFreq = 100 + (wheels * 50);
    this.playTone(baseFreq, 0.5, 'sawtooth');
  }

  public toggle(): void {
    this.enabled = !this.enabled;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }
}
