/**
 * FlappyBird - Clean modern mobile tap-to-flap aviator.
 * Single impulse per tap, smooth gravity physics, pastel pillars.
 */
export class FlappyBirdGame {
  constructor(canvas, audio, onScore, onGameOver) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.audio = audio;
    this.onScore = onScore;
    this.onGameOver = onGameOver;

    this.width = 400;
    this.height = 600;

    this.bird = {
      x: 90,
      y: 300,
      vy: 0,
      radius: 14,
      gravity: 860,
      jumpForce: -300
    };

    this.pipes = [];
    this.pipeW = 54;
    this.pipeGap = 160;
    this.speed = 150;
    this.pipeTimer = 0;
    this.score = 0;
    this.hasStarted = false;
    this.isOver = false;
    this.particles = [];

    this.handleTap = this.handleTap.bind(this);
  }

  start() {
    this.score = 0;
    this.isOver = false;
    this.hasStarted = false;
    this.bird.y = 300;
    this.bird.vy = 0;
    this.pipes = [];
    this.particles = [];
    this.pipeTimer = 0;

    this.canvas.addEventListener('pointerdown', this.handleTap);
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') this.handleTap();
    });
  }

  handleTap() {
    if (this.isOver) return;
    this.hasStarted = true;
    this.bird.vy = this.bird.jumpForce;
    this.audio.jump();
    this.spawnFeathers(this.bird.x - 10, this.bird.y);
  }

  update(dt) {
    if (this.isOver || !this.hasStarted) return;

    // Gravity
    this.bird.vy += this.bird.gravity * dt;
    this.bird.y += this.bird.vy * dt;

    // Floor / ceiling check
    if (this.bird.y - this.bird.radius <= 0) {
      this.bird.y = this.bird.radius;
      this.bird.vy = 0;
    }
    if (this.bird.y + this.bird.radius >= this.height - 20) {
      this.handleDeath();
      return;
    }

    // Spawn pipes
    this.pipeTimer += dt;
    if (this.pipeTimer >= 1.9) {
      this.pipeTimer = 0;
      const minTop = 60;
      const maxTop = this.height - this.pipeGap - 100;
      const topH = Math.floor(Math.random() * (maxTop - minTop)) + minTop;
      this.pipes.push({
        x: this.width + 10,
        topH,
        scored: false
      });
    }

    // Update pipes
    for (let i = this.pipes.length - 1; i >= 0; i--) {
      const p = this.pipes[i];
      p.x -= this.speed * dt;

      // Score
      if (!p.scored && p.x + this.pipeW < this.bird.x) {
        p.scored = true;
        this.score++;
        this.onScore(this.score);
        this.audio.coin();
      }

      // Collision
      const inX = this.bird.x + this.bird.radius > p.x && this.bird.x - this.bird.radius < p.x + this.pipeW;
      const hitTop = inX && this.bird.y - this.bird.radius < p.topH;
      const hitBottom = inX && this.bird.y + this.bird.radius > p.topH + this.pipeGap;

      if (hitTop || hitBottom) {
        this.handleDeath();
        return;
      }

      if (p.x + this.pipeW < -20) {
        this.pipes.splice(i, 1);
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

  spawnFeathers(x, y) {
    for (let i = 0; i < 6; i++) {
      this.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 60,
        vy: Math.random() * 40 + 20,
        color: '#F59E0B',
        life: 0.3,
        maxLife: 0.3
      });
    }
  }

  handleDeath() {
    this.isOver = true;
    this.audio.hit();
    this.onGameOver(this.score);
  }

  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    // Clean white-sky background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, this.width, this.height);

    // Decorative soft clouds
    ctx.fillStyle = '#F1F5F9';
    ctx.beginPath();
    ctx.arc(80, 100, 45, 0, Math.PI * 2);
    ctx.arc(130, 90, 55, 0, Math.PI * 2);
    ctx.arc(180, 105, 40, 0, Math.PI * 2);
    ctx.fill();

    // Draw Pipes (Pastel Teal Green)
    for (const p of this.pipes) {
      ctx.save();
      ctx.fillStyle = '#10B981';
      ctx.shadowColor = 'rgba(16, 185, 129, 0.15)';
      ctx.shadowBlur = 10;

      // Top Pipe
      ctx.beginPath();
      ctx.roundRect(p.x, 0, this.pipeW, p.topH, [0, 0, 10, 10]);
      ctx.fill();

      // Bottom Pipe
      const bottomY = p.topH + this.pipeGap;
      ctx.beginPath();
      ctx.roundRect(p.x, bottomY, this.pipeW, this.height - bottomY, [10, 10, 0, 0]);
      ctx.fill();
      ctx.restore();
    }

    // Draw Bird (Sunny Yellow Aviator)
    ctx.save();
    ctx.translate(this.bird.x, this.bird.y);
    const rot = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, this.bird.vy * 0.002));
    ctx.rotate(rot);

    // Body
    ctx.fillStyle = '#F59E0B';
    ctx.beginPath();
    ctx.arc(0, 0, this.bird.radius, 0, Math.PI * 2);
    ctx.fill();

    // Wing
    ctx.fillStyle = '#D97706';
    ctx.beginPath();
    ctx.arc(-4, 2, 7, 0, Math.PI * 2);
    ctx.fill();

    // Eye
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(6, -4, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.arc(7, -4, 2, 0, Math.PI * 2);
    ctx.fill();

    // Beak
    ctx.fillStyle = '#EF4444';
    ctx.beginPath();
    ctx.moveTo(11, -1);
    ctx.lineTo(19, 2);
    ctx.lineTo(11, 5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Tap to Start Hint
    if (!this.hasStarted) {
      ctx.save();
      ctx.font = 'bold 16px Inter, sans-serif';
      ctx.fillStyle = '#64748B';
      ctx.textAlign = 'center';
      ctx.fillText('TAP ANYWHERE TO FLY', this.width / 2, 380);
      ctx.restore();
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

  destroy() {
    this.canvas.removeEventListener('pointerdown', this.handleTap);
    this.particles = [];
  }
}
