/**
 * DunkShot - Pull-back mobile basketball arcade game.
 * Touch and drag backward to aim parabolic trajectory into the hoop!
 */
export class DunkShotGame {
  constructor(canvas, audio, onScore, onGameOver) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.audio = audio;
    this.onScore = onScore;
    this.onGameOver = onGameOver;

    this.width = 400;
    this.height = 600;

    this.ball = {
      x: 100,
      y: 480,
      vx: 0,
      vy: 0,
      radius: 15,
      isAirborne: false
    };

    this.hoop = {
      x: 290,
      y: 200,
      w: 64
    };

    this.aimStart = null;
    this.gravity = 820;
    this.timeLeft = 40;
    this.score = 0;
    this.isOver = false;
    this.particles = [];

    this.handleDown = this.handleDown.bind(this);
    this.handleUp = this.handleUp.bind(this);
  }

  start() {
    this.score = 0;
    this.timeLeft = 40;
    this.isOver = false;
    this.particles = [];
    this.resetBall();

    this.canvas.addEventListener('pointerdown', this.handleDown);
    window.addEventListener('pointerup', this.handleUp);
  }

  resetBall() {
    this.ball.x = 100;
    this.ball.y = 480;
    this.ball.vx = 0;
    this.ball.vy = 0;
    this.ball.isAirborne = false;
  }

  handleDown(e) {
    if (this.ball.isAirborne || this.isOver) return;
    const rect = this.canvas.getBoundingClientRect();
    this.aimStart = {
      x: ((e.clientX - rect.left) / rect.width) * this.width,
      y: ((e.clientY - rect.top) / rect.height) * this.height
    };
  }

  handleUp(e) {
    if (!this.aimStart || this.ball.isAirborne || this.isOver) return;
    const rect = this.canvas.getBoundingClientRect();
    const curX = ((e.clientX - rect.left) / rect.width) * this.width;
    const curY = ((e.clientY - rect.top) / rect.height) * this.height;

    const dx = this.aimStart.x - curX;
    const dy = this.aimStart.y - curY;
    const pwr = Math.hypot(dx, dy);

    if (pwr > 20) {
      this.ball.vx = dx * 4.2;
      this.ball.vy = dy * 4.2;
      this.ball.isAirborne = true;
      this.audio.jump();
    }
    this.aimStart = null;
  }

  update(dt) {
    if (this.isOver) return;

    this.timeLeft -= dt;
    if (this.timeLeft <= 0) {
      this.timeLeft = 0;
      this.isOver = true;
      this.audio.win();
      this.onGameOver(this.score);
      return;
    }

    if (this.ball.isAirborne) {
      this.ball.vy += this.gravity * dt;
      this.ball.x += this.ball.vx * dt;
      this.ball.y += this.ball.vy * dt;

      // Check hoop swish (passing between hoop.x and hoop.x + hoop.w moving down)
      const hLeft = this.hoop.x;
      const hRight = this.hoop.x + this.hoop.w;
      const hY = this.hoop.y;

      if (
        this.ball.vy > 0 &&
        this.ball.y >= hY &&
        this.ball.y - this.ball.vy * dt <= hY &&
        this.ball.x > hLeft + 4 &&
        this.ball.x < hRight - 4
      ) {
        // Swish!
        this.score += 2;
        this.onScore(this.score);
        this.audio.coin();
        this.spawnSparks(hLeft + this.hoop.w / 2, hY, '#F59E0B', 16);
      }

      // Rim bounce
      if (Math.hypot(this.ball.x - hLeft, this.ball.y - hY) < this.ball.radius + 4) {
        this.ball.vx = -this.ball.vx * 0.7;
        this.ball.vy = -this.ball.vy * 0.6;
        this.audio.hit();
      }
      if (Math.hypot(this.ball.x - hRight, this.ball.y - hY) < this.ball.radius + 4) {
        this.ball.vx = -this.ball.vx * 0.7;
        this.ball.vy = -this.ball.vy * 0.6;
        this.audio.hit();
      }

      // Reset when off bottom or far out
      if (this.ball.y > this.height + 30 || this.ball.x > this.width + 50 || this.ball.x < -50) {
        this.resetBall();
      }
    }

    // Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
      if (p.life <= 0) this.particles.splice(i, 1);
    }
  }

  spawnSparks(x, y, color, count = 12) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd = Math.random() * 120 + 40;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        color,
        life: 0.35,
        maxLife: 0.35
      });
    }
  }

  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    // Clean White Court
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, this.width, this.height);

    // Top Header
    ctx.save();
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.fillStyle = '#64748B';
    ctx.fillText(`TIME: ${Math.ceil(this.timeLeft)}S`, 30, 45);

    ctx.fillStyle = '#F59E0B';
    ctx.textAlign = 'right';
    ctx.fillText(`SCORE: ${this.score}`, this.width - 30, 45);
    ctx.restore();

    // Backboard & Hoop
    const hx = this.hoop.x;
    const hy = this.hoop.y;
    const hw = this.hoop.w;

    // Backboard
    ctx.fillStyle = '#CBD5E1';
    ctx.fillRect(hx + hw + 2, hy - 65, 8, 85);

    // Rim (Vibrant Orange)
    ctx.strokeStyle = '#F97316';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(hx, hy);
    ctx.lineTo(hx + hw, hy);
    ctx.stroke();

    // Net
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(hx, hy);
    ctx.lineTo(hx + 12, hy + 30);
    ctx.lineTo(hx + hw - 12, hy + 30);
    ctx.lineTo(hx + hw, hy);
    ctx.stroke();

    // Aim Trajectory Line
    if (this.aimStart && !this.ball.isAirborne) {
      ctx.save();
      ctx.strokeStyle = '#4F46E5';
      ctx.lineWidth = 3;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(this.ball.x, this.ball.y);
      ctx.lineTo(this.ball.x + (this.aimStart.x - this.ball.x) * 1.5, this.ball.y + (this.aimStart.y - this.ball.y) * 1.5);
      ctx.stroke();
      ctx.restore();
    }

    // Basketball (Orange Textured Sphere)
    ctx.save();
    ctx.fillStyle = '#EA580C';
    ctx.shadowColor = 'rgba(234, 88, 12, 0.3)';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
    ctx.fill();

    // Seams
    ctx.strokeStyle = '#7C2D12';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();

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

  destroy() {
    this.canvas.removeEventListener('pointerdown', this.handleDown);
    window.removeEventListener('pointerup', this.handleUp);
    this.particles = [];
  }
}
