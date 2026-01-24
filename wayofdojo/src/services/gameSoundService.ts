/**
 * 🔊 Service d'effets sonores pour les mini-jeux
 * 
 * Utilise Web Audio API pour générer des sons sans fichiers externes
 */

'use client';

type SoundType = 
  | 'success'      // Réussite, bonne réponse
  | 'fail'         // Échec, mauvaise réponse  
  | 'click'        // Clic sur bouton
  | 'levelUp'      // Montée de niveau
  | 'combo'        // Combo/streak
  | 'countdown'    // Compte à rebours
  | 'start'        // Début de jeu
  | 'end'          // Fin de jeu
  | 'breathing'    // Respiration (inspire/expire)
  | 'notification' // Notification
  | 'achievement'  // Badge/Trophée débloqué
  | 'whoosh'       // Mouvement rapide
  | 'pop'          // Pop léger
  | 'ding'         // Ding notification
  | 'drumroll';    // Roulement de tambour

interface SoundConfig {
  frequency: number;
  duration: number;
  type: OscillatorType;
  volume: number;
  attack?: number;
  decay?: number;
  modulation?: { frequency: number; depth: number };
}

// Configuration des sons
const SOUND_CONFIGS: Record<SoundType, SoundConfig | SoundConfig[]> = {
  success: [
    { frequency: 523.25, duration: 0.1, type: 'sine', volume: 0.3 },
    { frequency: 659.25, duration: 0.1, type: 'sine', volume: 0.3 },
    { frequency: 783.99, duration: 0.2, type: 'sine', volume: 0.4 },
  ],
  fail: { frequency: 200, duration: 0.3, type: 'sawtooth', volume: 0.2, decay: 0.3 },
  click: { frequency: 800, duration: 0.05, type: 'sine', volume: 0.15 },
  levelUp: [
    { frequency: 400, duration: 0.1, type: 'sine', volume: 0.3 },
    { frequency: 500, duration: 0.1, type: 'sine', volume: 0.3 },
    { frequency: 600, duration: 0.1, type: 'sine', volume: 0.3 },
    { frequency: 800, duration: 0.3, type: 'sine', volume: 0.4 },
  ],
  combo: [
    { frequency: 600, duration: 0.08, type: 'triangle', volume: 0.25 },
    { frequency: 900, duration: 0.12, type: 'triangle', volume: 0.3 },
  ],
  countdown: { frequency: 440, duration: 0.15, type: 'sine', volume: 0.2 },
  start: [
    { frequency: 330, duration: 0.15, type: 'sine', volume: 0.3 },
    { frequency: 440, duration: 0.15, type: 'sine', volume: 0.3 },
    { frequency: 550, duration: 0.2, type: 'sine', volume: 0.4 },
  ],
  end: [
    { frequency: 550, duration: 0.15, type: 'sine', volume: 0.3 },
    { frequency: 440, duration: 0.15, type: 'sine', volume: 0.3 },
    { frequency: 330, duration: 0.3, type: 'sine', volume: 0.4 },
  ],
  breathing: { frequency: 150, duration: 0.8, type: 'sine', volume: 0.1, attack: 0.3, decay: 0.5 },
  notification: { frequency: 880, duration: 0.1, type: 'sine', volume: 0.2 },
  achievement: [
    { frequency: 523.25, duration: 0.15, type: 'sine', volume: 0.3 },
    { frequency: 659.25, duration: 0.15, type: 'sine', volume: 0.3 },
    { frequency: 783.99, duration: 0.15, type: 'sine', volume: 0.35 },
    { frequency: 1046.50, duration: 0.4, type: 'sine', volume: 0.4 },
  ],
  whoosh: { frequency: 400, duration: 0.15, type: 'sawtooth', volume: 0.1, modulation: { frequency: 20, depth: 300 } },
  pop: { frequency: 600, duration: 0.05, type: 'sine', volume: 0.2 },
  ding: { frequency: 1200, duration: 0.2, type: 'sine', volume: 0.25, decay: 0.2 },
  drumroll: { frequency: 100, duration: 1.0, type: 'triangle', volume: 0.15, modulation: { frequency: 15, depth: 50 } },
};

class GameSoundService {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;
  private masterVolume: number = 0.5;

  /**
   * Initialize the audio context (must be called after user interaction)
   */
  private getContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    return this.audioContext;
  }

  /**
   * Play a single tone
   */
  private playTone(config: SoundConfig, startTime: number = 0): void {
    if (!this.enabled) return;

    try {
      const ctx = this.getContext();
      const currentTime = ctx.currentTime + startTime;

      // Create oscillator
      const oscillator = ctx.createOscillator();
      oscillator.type = config.type;
      oscillator.frequency.setValueAtTime(config.frequency, currentTime);

      // Add modulation if specified (for whoosh/drumroll effects)
      if (config.modulation) {
        const modulator = ctx.createOscillator();
        const modulatorGain = ctx.createGain();
        modulator.frequency.setValueAtTime(config.modulation.frequency, currentTime);
        modulatorGain.gain.setValueAtTime(config.modulation.depth, currentTime);
        modulator.connect(modulatorGain);
        modulatorGain.connect(oscillator.frequency);
        modulator.start(currentTime);
        modulator.stop(currentTime + config.duration);
      }

      // Create gain for envelope
      const gainNode = ctx.createGain();
      const volume = config.volume * this.masterVolume;
      const attack = config.attack || 0.01;
      const decay = config.decay || config.duration * 0.8;

      // Envelope
      gainNode.gain.setValueAtTime(0, currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, currentTime + attack);
      gainNode.gain.linearRampToValueAtTime(volume * 0.7, currentTime + attack + decay * 0.3);
      gainNode.gain.linearRampToValueAtTime(0, currentTime + config.duration);

      // Connect nodes
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Play
      oscillator.start(currentTime);
      oscillator.stop(currentTime + config.duration);
    } catch (error) {
      console.warn('Sound playback error:', error);
    }
  }

  /**
   * Play a sound effect
   */
  play(soundType: SoundType): void {
    if (!this.enabled) return;

    const config = SOUND_CONFIGS[soundType];
    
    if (Array.isArray(config)) {
      // Play sequence of tones
      let delay = 0;
      config.forEach((tone) => {
        this.playTone(tone, delay);
        delay += tone.duration * 0.8; // Slight overlap for smoother sound
      });
    } else {
      this.playTone(config);
    }
  }

  /**
   * Enable/disable sounds
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  /**
   * Check if sounds are enabled
   */
  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Set master volume (0-1)
   */
  setVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));
  }

  /**
   * Get current volume
   */
  getVolume(): number {
    return this.masterVolume;
  }

  /**
   * Play success sound with optional intensity
   */
  playSuccess(intensity: 'low' | 'medium' | 'high' = 'medium'): void {
    if (intensity === 'high') {
      this.play('achievement');
    } else if (intensity === 'low') {
      this.play('ding');
    } else {
      this.play('success');
    }
  }

  /**
   * Play combo sound with combo count
   */
  playCombo(comboCount: number): void {
    if (comboCount >= 10) {
      this.play('levelUp');
    } else if (comboCount >= 5) {
      this.play('achievement');
    } else {
      this.play('combo');
    }
  }

  /**
   * Resume audio context (call after user interaction)
   */
  resume(): void {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }
}

// Singleton instance
export const gameSounds = new GameSoundService();

// Hook for React components
export const useGameSounds = () => {
  const play = (soundType: SoundType) => gameSounds.play(soundType);
  const playSuccess = (intensity?: 'low' | 'medium' | 'high') => gameSounds.playSuccess(intensity);
  const playCombo = (count: number) => gameSounds.playCombo(count);
  const setEnabled = (enabled: boolean) => gameSounds.setEnabled(enabled);
  const isEnabled = () => gameSounds.isEnabled();
  const setVolume = (volume: number) => gameSounds.setVolume(volume);
  const resume = () => gameSounds.resume();

  return {
    play,
    playSuccess,
    playCombo,
    setEnabled,
    isEnabled,
    setVolume,
    resume,
  };
};

export default gameSounds;
