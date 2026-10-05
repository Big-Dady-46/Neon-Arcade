/**
 * BaseGame - Abstract foundation class for all 2D canvas games in the Neon Arcade.
 * Provides unified lifecycle management, particle system, screen shake, audio hooks, and score emission.
 */
export class BaseGame {
  constructor(session, canvas, input, audio) {
    this.session = session;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.input = input;
    this.audio = audio;

    // Virtual dimensions (games define their native logical coordinate space, e.g. 800x600 or 600x600)
    this.width = 800;
    this.height = 600;

    this.score = 0;
    this.isPaused = false;
    this.isGameOver = false;

    // Screen Shake state
    this.shakeDuration = 0;
    this.shakeIntensity = 0;
    this.shakeOffset = { x: 0, y: 0 };

    // Built-in particle engine
    this.particles = [];
  }

  /* =========================================================================
     CORE LIFECYCLE METHODS (Override in subclass)
     ========================================================================= */

  async preload() {
    // Override to load any dynamic textures or async resources
  }

  create() {
    // Override to initialize entities, levels, and state
    this.score = 0;
    this.isGameOver = false;
    this.isPaused = false;
    this.particles = [];
  }

  update(deltaTime) {
    // Update screen shake
    if (this.shakeDuration > 0) {
      this.shakeDuration -= deltaTime;
      const progress = Math.max(0, this.shakeDuration);
      this.shakeOffset.x = (Math.random() * 2 - 1) * this.shakeIntensity * (progress > 0 ? 1 : 0);
      this.shakeOffset.y = (Math.random() * 2 - 1) * this.shakeIntensity * (progress > 0 ? 1 : 0);
      if (this.shakeDuration <= 0) {
        this.shakeOffset = { x: 0, y: 0 };
      }
    }

    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * deltaTime;
      p.y += p.vy * deltaTime;
      p.life -= deltaTime;
      p.alpha = Math.max(0, p.life / p.maxLife);
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  render(ctx) {
    // Base render will draw particles
    this.renderParticles(ctx);
  }

  pause() {
    this.isPaused = true;
  }

  resume() {
    this.isPaused = false;
  }

  restart() {
    this.isPaused = false;
    this.isGameOver = false;
    this.create();
  }

  destroy() {
    this.particles = [];
    this.session = null;
    this.input = null;
    this.audio = null;
    this.ctx = null;
    this.canvas = null;
  }

  /* =========================================================================
     UTILITY METHODS
     ========================================================================= */

  setScore(newScore) {
    this.score = newScore;
    if (this.session && typeof this.session.onScoreUpdate === 'function') {
      this.session.onScoreUpdate(this.score);
    }
  }

  addScore(points) {
    this.setScore(this.score + points);
  }

  triggerGameOver(isVictory = false) {
    this.isGameOver = true;
    if (this.audio) {
      if (isVictory) {
        this.audio.playVictory();
      } else {
        this.audio.playGameOver();
      }
    }
    if (this.session && typeof this.session.onGameOver === 'function') {
      this.session.onGameOver(this.score, isVictory);
    }
  }

  shake(duration = 0.25, intensity = 8) {
    this.shakeDuration = duration;
    this.shakeIntensity = intensity;
  }

  spawnParticles(x, y, count = 12, color = '#00F2FE', speed = 150, size = 3) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd = (Math.random() * 0.7 + 0.3) * speed;
      const life = Math.random() * 0.4 + 0.2;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        color,
        size: Math.random() * size + 1.5,
        life,
        maxLife: life,
        alpha: 1
      });
    }
  }

  renderParticles(ctx) {
    if (this.particles.length === 0) return;
    ctx.save();
    for (const p of this.particles) {
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  clearCanvas(color = '#0F111A') {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }
}
