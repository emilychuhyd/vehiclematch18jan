export class VoiceManager {
  private synth: SpeechSynthesis;
  private enabled: boolean = true;
  private language: 'en' | 'zh' = 'en';
  private voice: SpeechSynthesisVoice | null = null;
  
  constructor() {
    this.synth = window.speechSynthesis;
    this.loadVoices();
    
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = () => this.loadVoices();
    }
  }
  
  private loadVoices(): void {
    const voices = this.synth.getVoices();
    const femaleEnglish = voices.find(v => 
      v.lang.startsWith('en') && v.name.toLowerCase().includes('female')
    );
    const anyEnglish = voices.find(v => v.lang.startsWith('en'));
    this.voice = femaleEnglish || anyEnglish || voices[0];
  }
  
  speak(text: string, onEnd?: () => void): void {
    if (!this.enabled) {
      if (onEnd) onEnd();
      return;
    }
    
    this.synth.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = this.language === 'en' ? 'en-US' : 'zh-HK';
    utterance.pitch = 1.3;
    utterance.rate = 0.8;
    utterance.volume = 1.0;
    
    if (this.voice) {
      utterance.voice = this.voice;
    }
    
    if (onEnd) {
      utterance.onend = onEnd;
    }
    
    this.synth.speak(utterance);
  }
  
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (!enabled) {
      this.synth.cancel();
    }
  }
  
  setLanguage(lang: 'en' | 'zh'): void {
    this.language = lang;
    this.loadVoices();
  }
  
  cancel(): void {
    this.synth.cancel();
  }
}
