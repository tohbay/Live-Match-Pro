class SoundManager {
  private audioCtx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('livematch_muted');
      if (saved !== null) {
        this.isMuted = saved === 'true';
      }
    }
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('livematch_muted', String(this.isMuted));
    }
    return this.isMuted;
  }

  public getMutedState(): boolean {
    return this.isMuted;
  }

  /**
   * Human Voice Speech Synthesizer for Match Commentary
   */
  private speakHumanVoice(phrase: string, pitch = 1.1, rate = 1.05) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      // Cancel previous utterances to avoid speech backlog
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(phrase);
      utterance.pitch = pitch;
      utterance.rate = rate;
      utterance.volume = 1.0;

      // Select a natural English voice if available
      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(
        (v) => (v.lang.startsWith('en') && v.name.includes('Natural')) || v.lang.startsWith('en-US') || v.lang.startsWith('en-GB')
      ) || voices.find((v) => v.lang.startsWith('en'));

      if (englishVoice) {
        utterance.voice = englishVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis failed:', e);
    }
  }

  /**
   * Synthesizes Stadium Crowd Roar & Cheer sound effect using Web Audio API
   */
  private createCrowdCheerSound(durationSeconds = 2.5) {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const bufferSize = ctx.sampleRate * durationSeconds;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Generate pink/white noise for crowd roar texture
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        data[i] *= 0.11;
        b6 = white * 0.115926;
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;

      // Bandpass filter centered around crowd vocal frequencies (600Hz to 2400Hz)
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, ctx.currentTime);
      filter.Q.setValueAtTime(1.2, ctx.currentTime);

      const gain = ctx.createGain();
      const now = ctx.currentTime;
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.exponentialRampToValueAtTime(0.4, now + 0.4); // Crowd roar swell!
      gain.gain.exponentialRampToValueAtTime(0.01, now + durationSeconds);

      noiseSource.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noiseSource.start(now);
      noiseSource.stop(now + durationSeconds);
    } catch (e) {
      console.warn('Crowd sound synthesis failed:', e);
    }
  }

  /**
   * Synthesizes Referee Whistle sound effect
   */
  private createRefereeWhistleSound() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      // Dual high frequencies characteristic of a Fox40 referee whistle (2800Hz & 3100Hz)
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(2800, now);
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(3100, now);

      // Tremolo whistle pulse effect
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.setValueAtTime(0.05, now + 0.15);
      gain.gain.setValueAtTime(0.35, now + 0.25);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.6);
      osc2.stop(now + 0.6);
    } catch (e) {
      console.warn('Whistle sound synthesis failed:', e);
    }
  }

  /**
   * Human Goal Announcement + Crowd Stadium Roar
   */
  public playGoalSound(player?: string): void {
    if (this.isMuted) return;

    // 1. Play stadium crowd cheer roar
    this.createCrowdCheerSound(3.0);

    // 2. Human Voice Announcement
    const phrase = player ? `Goal! ${player} scores!` : `GOAAAAAL! Goal scored!`;
    this.speakHumanVoice(phrase, 1.25, 1.1);
  }

  /**
   * Human Red Card Announcement + Referee Whistle
   */
  public playCardSound(player?: string): void {
    if (this.isMuted) return;

    // 1. Play dual-tone referee whistle
    this.createRefereeWhistleSound();

    // 2. Human Voice Announcement
    const phrase = player ? `Red Card! ${player} is sent off!` : `Red Card! Sent off the pitch!`;
    this.speakHumanVoice(phrase, 0.9, 1.0);
  }
}

export const soundManager = new SoundManager();
