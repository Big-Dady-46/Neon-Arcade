/**
 * BrickBreaker - Smooth pastel mobile brick breaker.
 * Drag finger horizontally to steer the paddle.
 */
export class BrickBreakerMobile {
  constructor(canvas, audio, onScore, onGameOver) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.audio = audio;
    this.onScore = onScore;
    this.onGameOver = onGameOver;

    this.width = 400;
    this.height = 540;

    this.paddle = {
      w: 80,
      h: 12,
      x: 160,
      y: 490
    };

    this.ball = {
      x: 200,
      y: 470,
      vx: 180,
      vy: -260,
      radius: 7,
      isStuck: true
    };

    this.bricks = [];
    this.particles = [];
    this.score = 0;
    this.isOver = false;

    this.handleMove = this.handleMove.bind(this);
    this.handleTap = this.handleTap.bind(this);
  }

  start() {
    this.score = 0;
    this.isOver = false;
    this.paddle.x = (this.width - this.paddle.w) / 2;
    this.resetBall();
    this.createBricks();

    this.touchHandler = (e) => {
      if (e.cancelable) e.preventDefault();
      if (e.touches && e.touches.length > 0) {
        this.handleMove(e.touches[0]);
      }
    };
    this.canvas.addEventListener('pointermove', this.handleMove);
    this.canvas.addEventListener('pointerdown', this.handleTap);
    this.canvas.addEventListener('touchstart', (e) => {
      if (e.cancelable) e.preventDefault();
      this.handleTap();
      if (e.touches && e.touches.length > 0) this.handleMove(e.touches[0]);
    }, { passive: false });
    this.canvas.addEventListener('touchmove', this.touchHandler, { passive: false });
    window.addEventListener('keydown', (e) => {
      if (e.code === 'ArrowLeft') this.paddle.x -= 25;
      if (e.code === 'ArrowRight') this.paddle.x += 25;
      if (e.code === 'Space') this.launchBall();
    });
  }

  resetBall() {
    this.ball.isStuck = true;
    this.ball.x = this.paddle.x + this.paddle.w / 2;
    this.ball.y = this.paddle.y - this.ball.radius - 2;
    this.ball.vx = (Math.random() > 0.5 ? 1 : -1) * 180;
    this.ball.vy = -260;
  }

  launchBall() {
    if (this.ball.isStuck) {
      this.ball.isStuck = false;
      this.audio.jump();
    }
  }

  createBricks() {
    this.bricks = [];
    const rows = 5;
    const cols = 6;
    const bW = 54;
    const bH = 20;
    const gap = 8;
    const startX = (this.width - (cols * (bW + gap) - gap)) / 2;
    const startY = 60;
    const colors = ['#F43F5E', '#FB923C', '#FBBF24', '#34D399', '#60A5FA'];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        this.bricks.push({
          x: startX + c * (bW + gap),
          y: startY + r * (bH + gap),
          w: bW,
          h: bH,
          color: colors[r % colors.length],
          alive: true
        });
      }
    }
  }

  handleMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * this.width;
    this.paddle.x = Math.max(10, Math.min(this.width - this.paddle.w - 10, x - this.paddle.w / 2));
    if (this.ball.isStuck) {
      this.ball.x = this.paddle.x + this.paddle.w / 2;
    }
  }

  handleTap() {
    if (this.ball.isStuck) {
      this.launchBall();
    }
  }

  update(dt) {
    if (this.isOver) return;

    if (this.ball.isStuck) {
      this.ball.x = this.paddle.x + this.paddle.w / 2;
      return;
    }

    this.ball.x += this.ball.vx * dt;
    this.ball.y += this.ball.vy * dt;

    // Walls
    if (this.ball.x - this.ball.radius <= 0) {
      this.ball.x = this.ball.radius;
      this.ball.vx = -this.ball.vx;
      this.audio.pop();
    } else if (this.ball.x + this.ball.radius >= this.width) {
      this.ball.x = this.width - this.ball.radius;
      this.ball.vx = -this.ball.vx;
      this.audio.pop();
    }

    if (this.ball.y - this.ball.radius <= 0) {
      this.ball.y = this.ball.radius;
      this.ball.vy = -this.ball.vy;
      this.audio.pop();
    }

    // Paddle collision
    if (
      this.ball.y + this.ball.radius >= this.paddle.y &&
      this.ball.y - this.ball.radius <= this.paddle.y + this.paddle.h &&
      this.ball.x >= this.paddle.x &&
      this.ball.x <= this.paddle.x + this.paddle.w &&
      this.ball.vy > 0
    ) {
      const hit = (this.ball.x - (this.paddle.x + this.paddle.w / 2)) / (this.paddle.w / 2);
      this.ball.vx = hit * 260;
      this.ball.vy = -Math.abs(this.ball.vy);
      this.audio.tap();
      this.spawnSparks(this.ball.x, this.paddle.y, '#4F46E5', 6);
    }

    // Bricks collision
    for (const b of this.bricks) {
      if (b.alive) {
        if (
          this.ball.x + this.ball.radius > b.x &&
          this.ball.x - this.ball.radius < b.x + b.w &&
          this.ball.y + this.ball.radius > b.y &&
          this.ball.y - this.ball.radius < b.y + b.h
        ) {
          b.alive = false;
          this.ball.vy = -this.ball.vy;
          this.score += 15;
          this.onScore(this.score);
          this.audio.coin();
          this.spawnSparks(b.x + b.w / 2, b.y + b.h / 2, b.color, 12);
          break;
        }
      }
    }

    // Floor loss
    if (this.ball.y > this.height + 20) {
      this.isOver = true;
      this.audio.lose();
      this.onGameOver(this.score);
      return;
    }

    // Victory check
    if (this.bricks.every(b => !b.alive)) {
      this.score += 100;
      this.onScore(this.score);
      this.isOver = true;
      this.audio.win();
      this.onGameOver(this.score);
      return;
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

  spawnSparks(x, y, color, count = 10) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd = Math.random() * 120 + 40;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        color,
        life: 0.3,
        maxLife: 0.3
      });
    }
  }

  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, this.width, this.height);

    // Draw Bricks
    for (const b of this.bricks) {
      if (b.alive) {
        ctx.save();
        ctx.fillStyle = b.color;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.06)';
        ctx.shadowBlur = 6;
        ctx.shadowOffsetY = 2;
        ctx.beginPath();
        ctx.roundRect(b.x, b.y, b.w, b.h, 6);
        ctx.fill();
        ctx.restore();
      }
    }

    // Draw Paddle
    ctx.save();
    ctx.fillStyle = '#4F46E5';
    ctx.shadowColor = 'rgba(79, 70, 229, 0.3)';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.roundRect(this.paddle.x, this.paddle.y, this.paddle.w, this.paddle.h, 6);
    ctx.fill();
    ctx.restore();

    // Draw Ball
    ctx.save();
    ctx.fillStyle = '#0284C7';
    ctx.shadowColor = 'rgba(2, 132, 199, 0.3)';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Draw Particles
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
    this.canvas.removeEventListener('pointermove', this.handleMove);
    this.canvas.removeEventListener('pointerdown', this.handleTap);
    if (this.touchHandler) {
      this.canvas.removeEventListener('touchstart', this.handleTap);
      this.canvas.removeEventListener('touchmove', this.touchHandler);
    }
    this.particles = [];
  }
}
