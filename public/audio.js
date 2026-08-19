// Retro 8-bit Audio Synthesizer - Senior Chiptune Ultra Polish Edition
class RetroAudio {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.compressor = null;
    this.noiseBuffer = null;
    this.muted = false;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master Compressor / Limiter para prevenir clipping e estalos
      this.compressor = this.ctx.createDynamicsCompressor();
      this.compressor.threshold.setValueAtTime(-12, this.ctx.currentTime);
      this.compressor.knee.setValueAtTime(10, this.ctx.currentTime);
      this.compressor.ratio.setValueAtTime(12, this.ctx.currentTime);
      this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
      this.compressor.release.setValueAtTime(0.12, this.ctx.currentTime);

      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.75, this.ctx.currentTime);

      this.masterGain.connect(this.compressor);
      this.compressor.connect(this.ctx.destination);

      this.noiseBuffer = this.createNoiseBuffer();
      this.initialized = true;
    } catch (e) {
      console.warn('Web Audio API not supported', e);
    }
  }

  createNoiseBuffer() {
    if (!this.ctx) return null;
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.muted ? 0 : 0.75, this.ctx.currentTime);
    }
    return this.muted;
  }

  playTone(freq, type, duration, startVol = 0.2, endVol = 0.0001) {
    if (this.muted) return;
    this.init();
    this.resume();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(Math.max(20, freq), now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(startVol, now + 0.005);
      gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, endVol), now + duration);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + duration);
    } catch (e) {}
  }

  playPaddleHit(isSmash = false) {
    if (this.muted) return;
    this.init();
    this.resume();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    if (isSmash) {
      // ⚡ Smash: Ataque de ruído chiptune + Oscilador duplo potente Sawtooth descendente
      try {
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(960, now);
        osc1.frequency.exponentialRampToValueAtTime(80, now + 0.22);

        osc2.type = 'square';
        osc2.frequency.setValueAtTime(480, now);
        osc2.frequency.exponentialRampToValueAtTime(60, now + 0.22);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(0.45, now + 0.004);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

        osc1.connect(gain);
        osc2.connect(gain);

        // Ruído percussivo de impacto
        if (this.noiseBuffer) {
          const noise = this.ctx.createBufferSource();
          const noiseGain = this.ctx.createGain();
          const filter = this.ctx.createBiquadFilter();

          noise.buffer = this.noiseBuffer;
          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(1400, now);
          filter.frequency.exponentialRampToValueAtTime(200, now + 0.09);

          noiseGain.gain.setValueAtTime(0.3, now);
          noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

          noise.connect(filter);
          filter.connect(noiseGain);
          noiseGain.connect(this.masterGain);

          noise.start(now);
          noise.stop(now + 0.09);
        }

        gain.connect(this.masterGain);
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.22);
        osc2.stop(now + 0.22);
      } catch (e) {}
    } else {
      // 🏓 Hit Normal: Square wave limpo com decaimento suave
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(460, now);
        osc.frequency.exponentialRampToValueAtTime(210, now + 0.07);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(0.25, now + 0.003);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.07);
      } catch (e) {}
    }
  }

  playWallBounce() {
    this.playTone(280, 'square', 0.05, 0.18, 0.0001);
  }

  playPortal() {
    if (this.muted) return;
    this.init();
    this.resume();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(1300, now + 0.12);
      osc.frequency.exponentialRampToValueAtTime(620, now + 0.24);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.24, now + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.24);
    } catch (e) {}
  }

  playLightningZap() {
    if (this.muted) return;
    this.init();
    this.resume();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.linearRampToValueAtTime(120, now + 0.09);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.28, now + 0.003);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.09);
    } catch (e) {}
  }

  playTimeWarp() {
    if (this.muted) return;
    this.init();
    this.resume();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(840, now);
      osc.frequency.exponentialRampToValueAtTime(170, now + 0.28);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.22, now + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.28);
    } catch (e) {}
  }

  playScore(isPlayerWin = true) {
    if (this.muted) return;
    this.init();
    this.resume();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    try {
      if (isPlayerWin) {
        // Arpeggio de vitória triunfante Chiptune
        const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
        notes.forEach((freq, idx) => {
          const startTime = now + idx * 0.07;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, startTime);

          gain.gain.setValueAtTime(0.0001, startTime);
          gain.gain.linearRampToValueAtTime(0.28, startTime + 0.005);
          gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.18);

          osc.connect(gain);
          gain.connect(this.masterGain);

          osc.start(startTime);
          osc.stop(startTime + 0.18);
        });
      } else {
        // Sequência descendente dramática
        const notes = [460, 340, 240, 160];
        notes.forEach((freq, idx) => {
          const startTime = now + idx * 0.1;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, startTime);

          gain.gain.setValueAtTime(0.0001, startTime);
          gain.gain.linearRampToValueAtTime(0.24, startTime + 0.005);
          gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.15);

          osc.connect(gain);
          gain.connect(this.masterGain);

          osc.start(startTime);
          osc.stop(startTime + 0.15);
        });
      }
    } catch (e) {}
  }

  playFireball() {
    if (this.muted) return;
    this.init();
    this.resume();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(980, now + 0.16);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.22, now + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.16);
    } catch (e) {}
  }

  playBumperHit() {
    if (this.muted) return;
    this.init();
    this.resume();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(920, now);
      osc.frequency.exponentialRampToValueAtTime(1500, now + 0.11);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.3, now + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.11);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.11);
    } catch (e) {}
  }

  playBlaster() {
    if (this.muted) return;
    this.init();
    this.resume();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(980, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.11);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.26, now + 0.003);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.11);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.11);
    } catch (e) {}
  }

  playBlasterHit() {
    this.playTone(190, 'square', 0.14, 0.28, 0.0001);
  }

  playGravityPulse() {
    if (this.muted) return;
    this.init();
    this.resume();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(130, now);
      osc.frequency.exponentialRampToValueAtTime(520, now + 0.2);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.2);
    } catch (e) {}
  }

  playKittyMeow() {
    if (this.muted) return;
    this.init();
    this.resume();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(620, now);
      osc.frequency.exponentialRampToValueAtTime(980, now + 0.11);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.28);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.26, now + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.28);
    } catch (e) {}
  }

  playShieldBreak() {
    this.playTone(760, 'sawtooth', 0.14, 0.28, 0.0001);
    setTimeout(() => this.playTone(1140, 'square', 0.09, 0.24, 0.0001), 35);
  }

  playBlackHole() {
    if (this.muted) return;
    this.init();
    this.resume();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(75, now);
      osc.frequency.linearRampToValueAtTime(340, now + 0.24);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.32, now + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.24);
    } catch (e) {}
  }

  playMagnetPulse() {
    this.playTone(540, 'triangle', 0.07, 0.2, 0.0001);
  }

  playTurretShot() {
    this.playTone(980, 'sawtooth', 0.06, 0.22, 0.0001);
  }

  playGhostPhase() {
    this.playTone(700, 'sine', 0.11, 0.18, 0.0001);
  }

  playCountdown(isGo = false) {
    this.playTone(isGo ? 920 : 460, 'square', isGo ? 0.24 : 0.09, 0.25, 0.0001);
  }

  playClick() {
    this.playTone(620, 'square', 0.035, 0.15, 0.0001);
  }
}

window.retroAudio = new RetroAudio();
