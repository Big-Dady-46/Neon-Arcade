/**
 * KnifeHit - Hyper-addictive knife-flinging arcade game.
 * Tap anywhere to throw a knife into the rotating target.
 * Don't strike any previously embedded knives!
 */
export class KnifeHitGame {
  constructor(canvas, audio, onScore, onGameOver) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.audio = audio;
    this.onScore = onScore;
    this.onGameOver = onGameOver;

    this.width = 400;
    this.height = 600;
    this.score = 0;
    this.isOver = false;

    // Wheel
    this.wheel = {
      x: this.width / 2,
      y: 190,
      radius: 76,
      angle: 0,
      speed: 1.8
    };

    this.knivesInWheel = []; // angles in radians
    this.knivesRemaining = 7;
    this.flyingKnife = null;
    this.particles = [];

    this.handleTap = this.handleTap.bind(this);
  }

  start() {
    this.score = 0;
    this.isOver = false;
    this.wheel.angle = 0;
    this.wheel.speed = 1.8;
    this.knivesInWheel = [0, Math.PI * 0.75]; // Initial obstacles
    this.knivesRemaining = 8;
    this.flyingKnife = null;
    this.particles = [];

    this.canvas.addEventListener('pointerdown', this.handleTap);
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') this.handleTap();
    });
  }

  handleTap() {
    if (this.isOver || this.flyingKnife || this.knivesRemaining <= 0) return;

    this.flyingKnife = {
      x: this.width / 2,
      y: 510,
      vy: -1400,
      w: 10,
      h: 52
    };
    this.knivesRemaining--;
    this.audio.slice();
  }

  update(dt) {
    if (this.isOver) return;

    // Rotate wheel with dynamic variations
    this.wheel.angle += this.wheel.speed * dt;

    // Flying knife update
    if (this.flyingKnife) {
      this.flyingKnife.y += this.flyingKnife.vy * dt;

      // Check collision with wheel perimeter
      const targetY = this.wheel.y + this.wheel.radius;
      if (this.flyingKnife.y <= targetY) {
        // Calculate impact angle relative to rotating wheel
        const hitAngle = Math.PI / 2 - this.wheel.angle;
        const normAngle = ((hitAngle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);

        // Check if hit another knife (collision margin ~0.26 radians)
        const hitOther = this.knivesInWheel.some(kAngle => {
          const normK = ((kAngle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
          const diff = Math.abs(normAngle - normK);
          return Math.min(diff, Math.PI * 2 - diff) < 0.28;
        });

        if (hitOther) {
          // Deflection & Game Over
          this.audio.hit();
          this.spawnSparks(this.width / 2, targetY, '#EF4444');
          this.isOver = true;
          this.onGameOver(this.score);
          return;
        }

        // Successfully embedded knife!
        this.knivesInWheel.push(normAngle);
        this.flyingKnife = null;
        this.score += 10;
        this.onScore(this.score);
        this.audio.pop();
        this.spawnSparks(this.width / 2, targetY, '#4F46E5');

        // Stage cleared check
        if (this.knivesRemaining === 0) {
          this.score += 50;
          this.onScore(this.score);
          this.audio.win();
          // Reset wheel for next round with higher speed
          setTimeout(() => {
            this.wheel.speed = (Math.abs(this.wheel.speed) + 0.4) * (Math.random() > 0.5 ? 1 : -1);
            this.knivesInWheel = [];
            for (let i = 0; i < Math.min(4, Math.floor(this.score / 60)); i++) {
              this.knivesInWheel.push(Math.random() * Math.PI * 2);
            }
            this.knivesRemaining = 7;
          }, 350);
        }
      }
    }

    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
      if (p.life <= 0) this.particles.splice(i, 1);
    }
  }

  spawnSparks(x, y, color) {
    for (let i = 0; i < 14; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 160 + 60;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        life: 0.35,
        maxLife: 0.35
      });
    }
  }

  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    // Soft modern light background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, this.width, this.height);

    // Decorative radial accent
    const grad = ctx.createRadialGradient(this.wheel.x, this.wheel.y, 10, this.wheel.x, this.wheel.y, 220);
    grad.addColorStop(0, 'rgba(99, 102, 241, 0.08)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, this.width, this.height);

    // Draw Rotating Target Wheel
    ctx.save();
    ctx.translate(this.wheel.x, this.wheel.y);

    // Outer shadow
    ctx.shadowColor = 'rgba(15, 23, 42, 0.12)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 8;

    // Wheel Body
    ctx.fillStyle = '#1E293B';
    ctx.beginPath();
    ctx.arc(0, 0, this.wheel.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Inner Ring
    ctx.strokeStyle = '#4F46E5';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, this.wheel.radius - 8, 0, Math.PI * 2);
    ctx.stroke();

    // Center Hub
    ctx.fillStyle = '#6366F1';
    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, Math.PI * 2);
    ctx.fill();

    // Draw embedded knives
    for (const angle of this.knivesInWheel) {
      ctx.save();
      ctx.rotate(angle + this.wheel.angle);
      // Knife blade embedded sticking out
      ctx.fillStyle = '#64748B';
      ctx.fillRect(-4, this.wheel.radius, 8, 38);
      // Handle
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(-6, this.wheel.radius + 38, 12, 20);
      ctx.restore();
    }
    ctx.restore();

    // Draw Ready Knife at bottom
    if (!this.flyingKnife && this.knivesRemaining > 0) {
      this.drawKnife(ctx, this.width / 2, 510);
    }

    // Draw Flying Knife
    if (this.flyingKnife) {
      this.drawKnife(ctx, this.flyingKnife.x, this.flyingKnife.y);
    }

    // Draw Knives Remaining Indicator on Left
    for (let i = 0; i < this.knivesRemaining; i++) {
      ctx.fillStyle = '#4F46E5';
      ctx.fillRect(24, 480 - i * 16, 6, 12);
    }

    // Particles
    for (const p of this.particles) {
      ctx.save();
      ctx.globalAlpha = p.life / p.maxLife;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  drawKnife(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);

    // Blade
    ctx.fillStyle = '#0284C7';
    ctx.beginPath();
    ctx.moveTo(0, -32);
    ctx.lineTo(6, -6);
    ctx.lineTo(6, 6);
    ctx.lineTo(-6, 6);
    ctx.lineTo(-6, -6);
    ctx.closePath();
    ctx.fill();

    // Guard
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(-9, 6, 18, 5);

    // Handle
    ctx.fillStyle = '#334155';
    ctx.fillRect(-5, 11, 10, 24);
    ctx.restore();
  }

  destroy() {
    this.canvas.removeEventListener('pointerdown', this.handleTap);
    this.particles = [];
  }
}
