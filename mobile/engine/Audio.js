/**
 * MobileAudio - Lightweight, zero-dependency Web Audio synthesizer for the White Mobile Arcade.
 */
class MobileAudio {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.initUserGesture = this.initUserGesture.bind(this);
    window.addEventListener('touchstart', this.initUserGesture, { once: true });
    window.addEventListener('pointerdown', this.initUserGesture, { once: true });
  }

  initUserGesture() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  ensure() {
    if (!this.ctx) this.initUserGesture();
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  playTone(freq, duration = 0.08, type = 'sine', volume = 0.2) {
    if (this.muted) return;
    this.ensure();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(volume, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + duration);
    } catch {
      // Audio fallback safety
    }
  }

  tap() {
    this.playTone(600, 0.04, 'sine', 0.15);
  }

  pop() {
    this.playTone(850, 0.06, 'triangle', 0.2);
  }

  slice() {
    this.playTone(420, 0.05, 'sawtooth', 0.12);
  }

  coin() {
    if (this.muted) return;
    this.ensure();
    if (!this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.frequency.setValueAtTime(987.77, t);
      osc.frequency.setValueAtTime(1318.51, t + 0.08);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.3);
    } catch {}
  }

  jump() {
    if (this.muted) return;
    this.ensure();
    if (!this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.frequency.setValueAtTime(320, t);
      osc.frequency.exponentialRampToValueAtTime(700, t + 0.12);
      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.12);
    } catch {}
  }

  hit() {
    this.playTone(180, 0.12, 'square', 0.25);
  }

  win() {
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.15, 'sine', 0.2), i * 110);
    });
  }

  lose() {
    [440, 370, 311, 260].forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.18, 'sawtooth', 0.2), i * 120);
    });
  }

  snack() {
    if (this.muted) return;
    this.ensure();
    if (!this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, t);
      osc.frequency.exponentialRampToValueAtTime(1040, t + 0.1);
      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.12);
    } catch {}
  }

  whoosh() {
    if (this.muted) return;
    this.ensure();
    if (!this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(200, t);
      osc.frequency.exponentialRampToValueAtTime(600, t + 0.15);
      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.18);
    } catch {}
  }

  celebrate() {
    if (this.muted) return;
    const chords = [
      [523.25, 659.25], // C5, E5
      [587.33, 739.99], // D5, F#5
      [659.25, 783.99], // E5, G5
      [783.99, 1046.50] // G5, C6
    ];
    chords.forEach(([f1, f2], i) => {
      setTimeout(() => {
        this.playTone(f1, 0.2, 'sine', 0.15);
        this.playTone(f2, 0.2, 'triangle', 0.15);
      }, i * 90);
    });
  }

  click() {
    this.playTone(1200, 0.02, 'sine', 0.08);
  }
}

export const mobileAudio = new MobileAudio();
