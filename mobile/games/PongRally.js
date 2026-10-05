/**
 * PongRally - Clean table tennis vs AI for mobile.
 * Touch / drag left side of screen to move paddle.
 */
export class PongRallyMobile {
  constructor(canvas, audio, onScore, onGameOver) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.audio = audio;
    this.onScore = onScore;
    this.onGameOver = onGameOver;

    this.width = 400;
    this.height = 540;

    this.paddleW = 10;
    this.paddleH = 74;

    this.player = {
      x: 20,
      y: 230,
      score: 0
    };

    this.ai = {
      x: 370,
      y: 230,
      score: 0,
      speed: 250
    };

    this.ball = {
      x: 200,
      y: 270,
      vx: 240,
      vy: 120,
      radius: 7,
      speed: 260
    };

    this.score = 0;
    this.isOver = false;
    this.particles = [];

    this.handleMove = this.handleMove.bind(this);
  }

  start() {
    this.score = 0;
    this.isOver = false;
    this.player.score = 0;
    this.ai.score = 0;
    this.player.y = 230;
    this.ai.y = 230;
    this.resetBall(1);

    this.canvas.addEventListener('pointermove', this.handleMove);
    this.canvas.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches.length > 0) {
        this.handleMove(e.touches[0]);
      }
    }, { passive: false });
  }

  handleMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    const y = ((e.clientY - rect.top) / rect.height) * this.height;
    this.player.y = Math.max(10, Math.min(this.height - this.paddleH - 10, y - this.paddleH / 2));
  }

  resetBall(dir = 1) {
    this.ball.x = this.width / 2;
    this.ball.y = this.height / 2;
    this.ball.speed = 260;
    const angle = (Math.random() * 0.6 - 0.3) * Math.PI;
    this.ball.vx = Math.cos(angle) * this.ball.speed * dir;
    this.ball.vy = Math.sin(angle) * this.ball.speed;
  }

  update(dt) {
    if (this.isOver) return;

    // AI tracking
    const aiCenter = this.ai.y + this.paddleH / 2;
    if (Math.abs(aiCenter - this.ball.y) > 12) {
      if (aiCenter < this.ball.y) this.ai.y += this.ai.speed * dt;
      else this.ai.y -= this.ai.speed * dt;
    }
    this.ai.y = Math.max(10, Math.min(this.height - this.paddleH - 10, this.ai.y));

    // Ball movement
    this.ball.x += this.ball.vx * dt;
    this.ball.y += this.ball.vy * dt;

    // Ceiling / floor bounce
    if (this.ball.y - this.ball.radius <= 0) {
      this.ball.y = this.ball.radius;
      this.ball.vy = Math.abs(this.ball.vy);
      this.audio.pop();
    } else if (this.ball.y + this.ball.radius >= this.height) {
      this.ball.y = this.height - this.ball.radius;
      this.ball.vy = -Math.abs(this.ball.vy);
      this.audio.pop();
    }

    // Player collision
    if (
      this.ball.x - this.ball.radius <= this.player.x + this.paddleW &&
      this.ball.x + this.ball.radius >= this.player.x &&
      this.ball.y >= this.player.y &&
      this.ball.y <= this.player.y + this.paddleH &&
      this.ball.vx < 0
    ) {
      const hit = (this.ball.y - (this.player.y + this.paddleH / 2)) / (this.paddleH / 2);
      this.ball.speed = Math.min(480, this.ball.speed + 15);
      const angle = hit * (Math.PI / 3.4);
      this.ball.vx = Math.cos(angle) * this.ball.speed;
      this.ball.vy = Math.sin(angle) * this.ball.speed;

      this.score += 5;
      this.onScore(this.score);
      this.audio.tap();
      this.spawnSparks(this.player.x + this.paddleW, this.ball.y, '#4F46E5', 6);
    }

    // AI collision
    if (
      this.ball.x + this.ball.radius >= this.ai.x &&
      this.ball.x - this.ball.radius <= this.ai.x + this.paddleW &&
      this.ball.y >= this.ai.y &&
      this.ball.y <= this.ai.y + this.paddleH &&
      this.ball.vx > 0
    ) {
      const hit = (this.ball.y - (this.ai.y + this.paddleH / 2)) / (this.paddleH / 2);
      this.ball.speed = Math.min(480, this.ball.speed + 15);
      const angle = hit * (Math.PI / 3.4);
      this.ball.vx = -Math.cos(angle) * this.ball.speed;
      this.ball.vy = Math.sin(angle) * this.ball.speed;

      this.audio.tap();
      this.spawnSparks(this.ai.x, this.ball.y, '#F43F5E', 6);
    }

    // Score checks
    if (this.ball.x < -20) {
      this.ai.score++;
      this.audio.hit();
      if (this.ai.score >= 5) {
        this.isOver = true;
        this.audio.lose();
        this.onGameOver(this.score);
      } else {
        this.resetBall(1);
      }
    } else if (this.ball.x > this.width + 20) {
      this.player.score++;
      this.score += 30;
      this.onScore(this.score);
      this.audio.coin();
      if (this.player.score >= 5) {
        this.score += 50;
        this.onScore(this.score);
        this.isOver = true;
        this.audio.win();
        this.onGameOver(this.score);
      } else {
        this.resetBall(-1);
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

  spawnSparks(x, y, color, count = 10) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd = Math.random() * 100 + 40;
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

    // Court Net
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    ctx.moveTo(this.width / 2, 0);
    ctx.lineTo(this.width / 2, this.height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Scores
    ctx.save();
    ctx.font = 'bold 36px Inter, sans-serif';
    ctx.fillStyle = '#4F46E5';
    ctx.textAlign = 'center';
    ctx.fillText(this.player.score, this.width / 2 - 50, 60);

    ctx.fillStyle = '#F43F5E';
    ctx.fillText(this.ai.score, this.width / 2 + 50, 60);
    ctx.restore();

    // Player Paddle (Indigo)
    ctx.fillStyle = '#4F46E5';
    ctx.beginPath();
    ctx.roundRect(this.player.x, this.player.y, this.paddleW, this.paddleH, 5);
    ctx.fill();

    // AI Paddle (Rose)
    ctx.fillStyle = '#F43F5E';
    ctx.beginPath();
    ctx.roundRect(this.ai.x, this.ai.y, this.paddleW, this.paddleH, 5);
    ctx.fill();

    // Ball
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
    ctx.fill();

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
    this.canvas.removeEventListener('pointermove', this.handleMove);
    this.particles = [];
  }
}
