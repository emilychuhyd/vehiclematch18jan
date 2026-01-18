export class VoiceManager {
  private synth: SpeechSynthesis;
  private enabled: boolean = true;

  constructor() {
    this.synth = window.speechSynthesis;
  }

  public speak(text: string): void {
    if (!this.enabled) return;

    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.2;
    utterance.volume = 1.0;

    this.synth.speak(utterance);
  }

  public toggle(): void {
    this.enabled = !this.enabled;
    if (!this.enabled) {
      this.synth.cancel();
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }
}
