/**
 * SpaceShooter - Clean mobile thumb-drag galaxy defender.
 * Drag finger anywhere on screen to smoothly steer your starship.
 */
export class SpaceShooterMobile {
  constructor(canvas, audio, onScore, onGameOver) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.audio = audio;
    this.onScore = onScore;
    this.onGameOver = onGameOver;

    this.width = 400;
    this.height = 600;

    this.player = {
      x: 200,
      y: 500,
      w: 36,
      h: 36,
      hp: 3
    };

    this.lasers = [];
    this.enemies = [];
    this.particles = [];
    this.fireTimer = 0;
    this.spawnTimer = 0;
    this.score = 0;
    this.isOver = false;

    this.handleMove = this.handleMove.bind(this);
  }

  start() {
    this.score = 0;
    this.isOver = false;
    this.player.x = 200;
    this.player.y = 500;
    this.player.hp = 3;
    this.lasers = [];
    this.enemies = [];
    this.particles = [];

    this.touchHandler = (e) => {
      e.preventDefault();
      if (e.touches && e.touches.length > 0) {
        this.handleMove(e.touches[0]);
      }
    };
    this.canvas.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      this.handleMove(e);
    });
    this.canvas.addEventListener('pointermove', this.handleMove);
    this.canvas.addEventListener('touchstart', this.touchHandler, { passive: false });
    this.canvas.addEventListener('touchmove', this.touchHandler, { passive: false });
  }

  handleMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * this.width;
    const y = ((e.clientY - rect.top) / rect.height) * this.height;

    this.player.x = Math.max(20, Math.min(this.width - 20, x));
    this.player.y = Math.max(80, Math.min(this.height - 30, y));
  }

  update(dt) {
    if (this.isOver) return;

    // Rapid auto-fire lasers
    this.fireTimer += dt;
    if (this.fireTimer >= 0.2) {
      this.fireTimer = 0;
      this.lasers.push({ x: this.player.x - 10, y: this.player.y - 18, vy: -700 });
      this.lasers.push({ x: this.player.x + 10, y: this.player.y - 18, vy: -700 });
      this.audio.slice();
    }

    // Move lasers
    for (let i = this.lasers.length - 1; i >= 0; i--) {
      const l = this.lasers[i];
      l.y += l.vy * dt;
      if (l.y < -10) this.lasers.splice(i, 1);
    }

    // Spawn alien drones
    this.spawnTimer += dt;
    if (this.spawnTimer >= 0.75) {
      this.spawnTimer = 0;
      const colors = ['#F43F5E', '#8B5CF6', '#10B981', '#0284C7'];
      this.enemies.push({
        x: Math.random() * (this.width - 60) + 30,
        y: -30,
        vy: Math.random() * 80 + 130,
        color: colors[Math.floor(Math.random() * colors.length)],
        hp: 2
      });
    }

    // Update enemies
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const e = this.enemies[i];
      e.y += e.vy * dt;

      // Laser collision
      for (let j = this.lasers.length - 1; j >= 0; j--) {
        const l = this.lasers[j];
        if (Math.hypot(e.x - l.x, e.y - l.y) < 20) {
          this.lasers.splice(j, 1);
          e.hp--;
          this.spawnSparks(l.x, l.y, '#0284C7', 4);

          if (e.hp <= 0) {
            this.enemies.splice(i, 1);
            this.score += 20;
            this.onScore(this.score);
            this.audio.coin();
            this.spawnSparks(e.x, e.y, e.color, 14);
            break;
          }
        }
      }

      // Player collision
      if (Math.hypot(e.x - this.player.x, e.y - this.player.y) < 28) {
        this.enemies.splice(i, 1);
        this.player.hp--;
        this.audio.hit();
        this.spawnSparks(this.player.x, this.player.y, '#EF4444', 18);

        if (this.player.hp <= 0) {
          this.isOver = true;
          this.audio.lose();
          this.onGameOver(this.score);
          return;
        }
      }

      if (e.y > this.height + 40) this.enemies.splice(i, 1);
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

    // Shields HUD
    ctx.save();
    ctx.font = 'bold 15px Inter, sans-serif';
    ctx.fillStyle = '#64748B';
    ctx.fillText('SHIELDS:', 24, 34);
    for (let i = 0; i < this.player.hp; i++) {
      ctx.fillStyle = '#4F46E5';
      ctx.fillRect(100 + i * 16, 22, 11, 14);
    }
    ctx.restore();

    // Draw Lasers
    ctx.fillStyle = '#0284C7';
    for (const l of this.lasers) {
      ctx.fillRect(l.x - 2, l.y, 4, 12);
    }

    // Draw Enemies (Geometric Alien Ships)
    for (const e of this.enemies) {
      ctx.save();
      ctx.translate(e.x, e.y);
      ctx.fillStyle = e.color;
      ctx.beginPath();
      ctx.moveTo(0, 14);
      ctx.lineTo(14, -10);
      ctx.lineTo(0, -4);
      ctx.lineTo(-14, -10);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    // Draw Player Ship
    ctx.save();
    ctx.translate(this.player.x, this.player.y);
    ctx.fillStyle = '#4F46E5';
    ctx.beginPath();
    ctx.moveTo(0, -18);
    ctx.lineTo(16, 14);
    ctx.lineTo(0, 7);
    ctx.lineTo(-16, 14);
    ctx.closePath();
    ctx.fill();

    // Thruster
    ctx.fillStyle = '#F59E0B';
    ctx.beginPath();
    ctx.arc(0, 11, 4, 0, Math.PI * 2);
    ctx.fill();
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
    this.canvas.removeEventListener('pointermove', this.handleMove);
    if (this.touchHandler) {
      this.canvas.removeEventListener('touchstart', this.touchHandler);
      this.canvas.removeEventListener('touchmove', this.touchHandler);
    }
    this.particles = [];
  }
}
