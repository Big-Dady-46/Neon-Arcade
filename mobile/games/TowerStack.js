/**
 * TowerStack - Precision mobile sliding block tower.
 * Clean pastel 3D blocks on white canvas.
 * Tap with millisecond timing to stack without overhang slices!
 */
export class TowerStackGame {
  constructor(canvas, audio, onScore, onGameOver) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.audio = audio;
    this.onScore = onScore;
    this.onGameOver = onGameOver;

    this.width = 400;
    this.height = 600;
    this.blockHeight = 24;

    this.stack = [];
    this.currentBlock = null;
    this.fallingSlices = [];
    this.particles = [];
    this.direction = 1;
    this.speed = 210;
    this.cameraY = 0;
    this.combo = 0;
    this.score = 0;
    this.isOver = false;

    this.colors = ['#4F46E5', '#06B6D4', '#10B981', '#F59E0B', '#F43F5E', '#8B5CF6'];
    this.handleTap = this.handleTap.bind(this);
  }

  start() {
    this.score = 0;
    this.isOver = false;
    this.stack = [];
    this.fallingSlices = [];
    this.particles = [];
    this.cameraY = 0;
    this.combo = 0;
    this.speed = 210;

    // Base block
    const baseW = 180;
    this.stack.push({
      x: (this.width - baseW) / 2,
      y: this.height - 120,
      w: baseW,
      color: this.colors[0]
    });

    this.spawnNext();
    this.canvas.addEventListener('pointerdown', this.handleTap);
    this.canvas.addEventListener('touchstart', (e) => {
      if (e.cancelable) e.preventDefault();
      this.handleTap();
    }, { passive: false });
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') this.handleTap();
    });
  }

  spawnNext() {
    const prev = this.stack[this.stack.length - 1];
    const color = this.colors[this.stack.length % this.colors.length];
    this.currentBlock = {
      x: 0,
      y: prev.y - this.blockHeight,
      w: prev.w,
      color
    };
    this.direction = 1;
  }

  handleTap() {
    if (this.isOver || !this.currentBlock) return;

    const prev = this.stack[this.stack.length - 1];
    const curr = this.currentBlock;
    const diff = curr.x - prev.x;

    // Perfect alignment
    if (Math.abs(diff) < 5) {
      curr.x = prev.x;
      this.combo++;
      this.score += 20 + this.combo * 5;
      this.onScore(this.score);
      this.audio.coin();
      this.spawnSparks(curr.x + curr.w / 2, curr.y, '#F59E0B');
    } else if (Math.abs(diff) >= curr.w) {
      // Missed completely -> Game Over
      this.audio.hit();
      this.fallingSlices.push({
        x: curr.x,
        y: curr.y,
        w: curr.w,
        h: this.blockHeight,
        vy: 120,
        color: curr.color
      });
      this.currentBlock = null;
      this.isOver = true;
      this.onGameOver(this.score);
      return;
    } else {
      // Slice overhang
      this.combo = 0;
      this.score += 10;
      this.onScore(this.score);
      this.audio.slice();

      const overhangW = Math.abs(diff);
      const newW = curr.w - overhangW;
      let sliceX = diff > 0 ? curr.x + newW : curr.x;
      curr.x = prev.x;
      curr.w = newW;

      this.fallingSlices.push({
        x: sliceX,
        y: curr.y,
        w: overhangW,
        h: this.blockHeight,
        vy: 120,
        color: curr.color
      });
      this.spawnSparks(sliceX + overhangW / 2, curr.y, curr.color, 8);
    }

    this.stack.push({ ...curr });
    this.speed = Math.min(360, 210 + this.stack.length * 4);

    // Pan camera upwards
    const targetCamY = Math.max(0, (this.stack.length - 8) * this.blockHeight);
    this.cameraY = targetCamY;

    this.spawnNext();
  }

  update(dt) {
    if (this.isOver) return;

    if (this.currentBlock) {
      this.currentBlock.x += this.direction * this.speed * dt;
      if (this.currentBlock.x + this.currentBlock.w >= this.width) {
        this.currentBlock.x = this.width - this.currentBlock.w;
        this.direction = -1;
      } else if (this.currentBlock.x <= 0) {
        this.currentBlock.x = 0;
        this.direction = 1;
      }
    }

    // Update falling slices
    for (let i = this.fallingSlices.length - 1; i >= 0; i--) {
      const fb = this.fallingSlices[i];
      fb.vy += 650 * dt;
      fb.y += fb.vy * dt;
      if (fb.y > this.height + 200) this.fallingSlices.splice(i, 1);
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

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.save();
    ctx.translate(0, this.cameraY);

    // Draw Stacked Blocks
    for (const b of this.stack) {
      ctx.save();
      ctx.fillStyle = b.color;
      ctx.shadowColor = 'rgba(15, 23, 42, 0.08)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 4;
      ctx.beginPath();
      ctx.roundRect(b.x, b.y, b.w, this.blockHeight, 6);
      ctx.fill();
      ctx.restore();
    }

    // Draw Current Sliding Block
    if (this.currentBlock) {
      ctx.save();
      ctx.fillStyle = this.currentBlock.color;
      ctx.shadowColor = 'rgba(79, 70, 229, 0.25)';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.roundRect(this.currentBlock.x, this.currentBlock.y, this.currentBlock.w, this.blockHeight, 6);
      ctx.fill();
      ctx.restore();
    }

    // Draw Falling Slices
    for (const fb of this.fallingSlices) {
      ctx.save();
      ctx.fillStyle = fb.color;
      ctx.beginPath();
      ctx.roundRect(fb.x, fb.y, fb.w, fb.h, 4);
      ctx.fill();
      ctx.restore();
    }

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
