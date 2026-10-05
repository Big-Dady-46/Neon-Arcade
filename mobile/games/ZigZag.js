/**
 * ZigZag - High-speed tap-to-turn path runner.
 * Tap anywhere to switch 90-degree movement direction.
 * Stay on the floating zigzag pathway and collect sparkling gems!
 */
export class ZigZagGame {
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

    this.tileW = 40;
    this.path = [];
    this.gems = [];
    this.particles = [];

    this.ball = {
      x: 0,
      y: 0,
      radius: 8,
      speed: 190,
      dir: 'right' // 'right' or 'left' (along isometric axes)
    };

    this.cameraOffset = { x: 0, y: 0 };
    this.handleTap = this.handleTap.bind(this);
  }

  start() {
    this.score = 0;
    this.isOver = false;
    this.path = [];
    this.gems = [];
    this.particles = [];

    // Starting platform
    let curX = this.width / 2;
    let curY = this.height / 2 + 100;

    this.ball.x = curX;
    this.ball.y = curY;
    this.ball.dir = 'right';
    this.ball.speed = 210;

    for (let i = 0; i < 40; i++) {
      this.path.push({ x: curX, y: curY });
      if (Math.random() < 0.25 && i > 3) {
        this.gems.push({ x: curX, y: curY, collected: false });
      }
      // Step either diagonally right or diagonally left
      const nextDir = Math.random() > 0.5 ? 'right' : 'left';
      if (nextDir === 'right') {
        curX += this.tileW / 2;
        curY -= this.tileW / 2.2;
      } else {
        curX -= this.tileW / 2;
        curY -= this.tileW / 2.2;
      }
    }

    this.canvas.addEventListener('pointerdown', this.handleTap);
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') this.handleTap();
    });
  }

  handleTap() {
    if (this.isOver) return;
    this.ball.dir = this.ball.dir === 'right' ? 'left' : 'right';
    this.audio.tap();
  }

  update(dt) {
    if (this.isOver) return;

    // Move ball along current diagonal direction
    const vx = this.ball.dir === 'right' ? this.ball.speed * 0.7 : -this.ball.speed * 0.7;
    const vy = -this.ball.speed * 0.7;

    this.ball.x += vx * dt;
    this.ball.y += vy * dt;

    // Camera follow
    this.cameraOffset.x = this.width / 2 - this.ball.x;
    this.cameraOffset.y = this.height / 2 + 80 - this.ball.y;

    // Check if ball is on any platform tile
    const onTile = this.path.some(tile => {
      return Math.hypot(tile.x - this.ball.x, tile.y - this.ball.y) < this.tileW * 0.75;
    });

    if (!onTile) {
      // Fell off edge!
      this.isOver = true;
      this.audio.hit();
      this.spawnSparks(this.ball.x, this.ball.y, '#EF4444');
      this.onGameOver(this.score);
      return;
    }

    // Gem collection
    for (const gem of this.gems) {
      if (!gem.collected && Math.hypot(gem.x - this.ball.x, gem.y - this.ball.y) < 18) {
        gem.collected = true;
        this.score += 5;
        this.onScore(this.score);
        this.audio.coin();
        this.spawnSparks(gem.x, gem.y, '#EC4899', 12);
      }
    }

    // Progression score
    this.score += Math.floor(dt * 8);
    this.onScore(this.score);

    // Dynamic path generation
    const lastTile = this.path[this.path.length - 1];
    if (this.path.length < 80) {
      const nextDir = Math.random() > 0.5 ? 'right' : 'left';
      const nx = nextDir === 'right' ? lastTile.x + this.tileW / 2 : lastTile.x - this.tileW / 2;
      const ny = lastTile.y - this.tileW / 2.2;
      this.path.push({ x: nx, y: ny });
      if (Math.random() < 0.22) {
        this.gems.push({ x: nx, y: ny, collected: false });
      }
    }

    // Clean old tiles behind player
    if (this.path.length > 0 && this.ball.y < this.path[0].y - 200) {
      this.path.shift();
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

    // Clean White background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.save();
    ctx.translate(this.cameraOffset.x, this.cameraOffset.y);

    // Draw Isometric Zigzag Path
    for (const tile of this.path) {
      ctx.save();
      ctx.translate(tile.x, tile.y);

      // Diamond Top
      ctx.fillStyle = '#F1F5F9';
      ctx.strokeStyle = '#CBD5E1';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, -this.tileW / 4);
      ctx.lineTo(this.tileW / 2, 0);
      ctx.lineTo(0, this.tileW / 4);
      ctx.lineTo(-this.tileW / 2, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Extrusion 3D Depth
      ctx.fillStyle = '#E2E8F0';
      ctx.beginPath();
      ctx.moveTo(-this.tileW / 2, 0);
      ctx.lineTo(0, this.tileW / 4);
      ctx.lineTo(0, this.tileW / 4 + 14);
      ctx.lineTo(-this.tileW / 2, 14);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#CBD5E1';
      ctx.beginPath();
      ctx.moveTo(0, this.tileW / 4);
      ctx.lineTo(this.tileW / 2, 0);
      ctx.lineTo(this.tileW / 2, 14);
      ctx.lineTo(0, this.tileW / 4 + 14);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    }

    // Draw Gems
    for (const gem of this.gems) {
      if (!gem.collected) {
        ctx.save();
        ctx.fillStyle = '#EC4899';
        ctx.beginPath();
        ctx.arc(gem.x, gem.y - 4, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // Draw Ball
    ctx.save();
    ctx.fillStyle = '#4F46E5';
    ctx.shadowColor = 'rgba(79, 70, 229, 0.4)';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(this.ball.x, this.ball.y - 8, this.ball.radius, 0, Math.PI * 2);
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

    ctx.restore();
  }

  destroy() {
    this.canvas.removeEventListener('pointerdown', this.handleTap);
    this.particles = [];
  }
}
