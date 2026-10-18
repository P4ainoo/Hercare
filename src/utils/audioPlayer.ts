/**
 * Web Audio API synthesized ambient audio utilities:
 * - Gentle Tibetan singing bowl / crystal chime
 * - Lo-Fi chill warm acoustic chord loop for calm studying
 * - Soft breathing and sparkle cues
 * - Speech synthesis voice reading with gentle pacing
 */

class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  private lofiInterval: number | null = null;
  private isLofiPlaying = false;
  private volumeGain: GainNode | null = null;

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  /**
   * Plays a warm crystal chime / Tibetan bowl resonance
   */
  playGentleChime(freq = 528) {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.33, ctx.currentTime + 0.6);

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.8);
    } catch {
      // audio suspended or not allowed yet
    }
  }

  /**
   * Plays mascot soft hop sparkle sound
   */
  playSparkle() {
    try {
      const ctx = this.getContext();
      const notes = [659.25, 783.99, 987.77, 1318.51]; // E5, G5, B5, E6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = ctx.currentTime + idx * 0.07;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.12, start + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + 0.45);
      });
    } catch {
      // audio error
    }
  }

  /**
   * Plays celebration chime when milestone or task is completed
   */
  playSuccessFanfare() {
    try {
      const ctx = this.getContext();
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = ctx.currentTime + idx * 0.1;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.15, start + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.8);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + 0.8);
      });
    } catch {
      // audio error
    }
  }

  /**
   * Speaks message using Web Speech API with gentle pacing and pitch
   */
  speakText(text: string, lang = 'en', onEnd?: () => void) {
    this.playGentleChime(528);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const cleanText = text.replace(/[*_#•]/g, '').trim();
        const utterance = new SpeechSynthesisUtterance(cleanText);

        if (lang === 'fr') utterance.lang = 'fr-FR';
        else if (lang === 'tn' || lang === 'msa') utterance.lang = 'ar-TN';
        else utterance.lang = 'en-US';

        utterance.rate = 0.92; // gentle, comforting pace
        utterance.pitch = 1.08; // soft, warm pitch

        utterance.onend = () => {
          onEnd?.();
        };
        utterance.onerror = () => {
          onEnd?.();
        };

        window.speechSynthesis.speak(utterance);
        return;
      } catch {
        // speech synthesis not allowed
      }
    }
    setTimeout(() => {
      onEnd?.();
    }, 2000);
  }

  /**
   * Starts a continuous, soothing lo-fi chord ambient progression
   */
  toggleLofiBeats(onStateChange?: (playing: boolean) => void): boolean {
    if (this.isLofiPlaying) {
      this.stopLofiBeats();
      onStateChange?.(false);
      return false;
    } else {
      this.startLofiBeats();
      onStateChange?.(true);
      return true;
    }
  }

  private ambientType: 'lofi' | 'ocean' | 'rain' = 'lofi';
  private noiseNode: AudioNode | null = null;

  setAmbientType(type: 'lofi' | 'ocean' | 'rain') {
    const wasPlaying = this.isLofiPlaying;
    if (wasPlaying) {
      this.stopLofiBeats();
    }
    this.ambientType = type;
    if (wasPlaying) {
      this.startLofiBeats();
    }
  }

  getAmbientType(): 'lofi' | 'ocean' | 'rain' {
    return this.ambientType;
  }

  startLofiBeats() {
    try {
      const ctx = this.getContext();
      this.isLofiPlaying = true;

      if (this.ambientType === 'ocean') {
        // Synthesize gentle Mediterranean waves (Sidi Bou Said)
        const bufferSize = ctx.sampleRate * 3;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(250, ctx.currentTime);

        const lfo = ctx.createOscillator();
        lfo.frequency.setValueAtTime(0.12, ctx.currentTime); // gentle wave cadence ~8 seconds
        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(200, ctx.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.08, ctx.currentTime);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        noise.start();
        lfo.start();
        this.noiseNode = gain;
        return;
      }

      if (this.ambientType === 'rain') {
        // Synthesize soft Jasmine rain
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * 0.5;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(800, ctx.currentTime);
        filter.Q.setValueAtTime(0.6, ctx.currentTime);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.045, ctx.currentTime);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        noise.start();
        this.noiseNode = gain;
        return;
      }

      // Default: Warm Lo-Fi Chords
      // Chord progressions in Dmaj7 - Bm7 - Gmaj7 - A7
      const chords = [
        [146.83, 220.00, 277.18, 369.99], // D3, A3, C#4, F#4
        [123.47, 185.00, 246.94, 329.63], // B2, F#3, B3, E4
        [98.00, 196.00, 246.94, 293.66],  // G2, G3, B3, D4
        [110.00, 164.81, 220.00, 277.18]  // A2, E3, A3, C#4
      ];

      let chordIdx = 0;

      const playChord = () => {
        if (!this.isLofiPlaying) return;
        const currentChord = chords[chordIdx % chords.length];
        chordIdx++;

        currentChord.forEach((f) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const filter = ctx.createBiquadFilter();

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(650, ctx.currentTime);

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(f, ctx.currentTime);

          gain.gain.setValueAtTime(0, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.045, ctx.currentTime + 0.6);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3.8);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          osc.start();
          osc.stop(ctx.currentTime + 4.0);
        });
      };

      playChord();
      this.lofiInterval = window.setInterval(playChord, 3800);
    } catch {
      this.isLofiPlaying = false;
    }
  }

  stopLofiBeats() {
    this.isLofiPlaying = false;
    if (this.lofiInterval) {
      clearInterval(this.lofiInterval);
      this.lofiInterval = null;
    }
    if (this.noiseNode) {
      try {
        (this.noiseNode as unknown as { disconnect: () => void }).disconnect();
      } catch {
        // ignore
      }
      this.noiseNode = null;
    }
  }

  getIsLofiPlaying(): boolean {
    return this.isLofiPlaying;
  }
}

export const soundFx = new AudioSynthesizer();

