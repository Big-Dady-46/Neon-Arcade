/**
 * SnakeGame - Mobile Fruit Snake with responsive touch swipe,
 * direction buttons, smooth rounding, and vibrant fruit particles.
 */
export class SnakeGame {
  constructor(canvas, audio, onScore, onGameOver) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.audio = audio;
    this.onScore = onScore;
    this.onGameOver = onGameOver;

    this.width = 400;
    this.height = 400;
    this.gridSize = 20;
    this.cols = this.width / this.gridSize;
    this.rows = this.height / this.gridSize;

    this.snake = [];
    this.dir = { x: 1, y: 0 };
    this.nextDir = { x: 1, y: 0 };
    this.food = { x: 10, y: 10 };
    this.score = 0;
    this.timer = 0;
    this.speed = 0.13;
    this.isOver = false;
    this.particles = [];

    this.touchStart = { x: 0, y: 0 };
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  start() {
    this.score = 0;
    this.isOver = false;
    this.dir = { x: 1, y: 0 };
    this.nextDir = { x: 1, y: 0 };
    this.speed = 0.13;
    this.timer = 0;
    this.particles = [];

    const startX = Math.floor(this.cols / 2);
    const startY = Math.floor(this.rows / 2);
    this.snake = [
      { x: startX, y: startY },
      { x: startX - 1, y: startY },
      { x: startX - 2, y: startY }
    ];

    this.spawnFood();

    this.canvas.addEventListener('touchstart', this.handleTouchStart, { passive: false });
    this.canvas.addEventListener('touchend', this.handleTouchEnd, { passive: false });
    window.addEventListener('keydown', this.handleKeyDown);
  }

  spawnFood() {
    let valid = false;
    while (!valid) {
      this.food.x = Math.floor(Math.random() * this.cols);
      this.food.y = Math.floor(Math.random() * this.rows);
      valid = !this.snake.some(s => s.x === this.food.x && s.y === this.food.y);
    }
  }

  handleTouchStart(e) {
    if (e.touches && e.touches.length > 0) {
      this.touchStart.x = e.touches[0].clientX;
      this.touchStart.y = e.touches[0].clientY;
    }
  }

  handleTouchEnd(e) {
    if (e.changedTouches && e.changedTouches.length > 0) {
      const dx = e.changedTouches[0].clientX - this.touchStart.x;
      const dy = e.changedTouches[0].clientY - this.touchStart.y;

      if (Math.abs(dx) > 20 || Math.abs(dy) > 20) {
        if (Math.abs(dx) > Math.abs(dy)) {
          if (dx > 0 && this.dir.x === 0) this.nextDir = { x: 1, y: 0 };
          else if (dx < 0 && this.dir.x === 0) this.nextDir = { x: -1, y: 0 };
        } else {
          if (dy > 0 && this.dir.y === 0) this.nextDir = { x: 0, y: 1 };
          else if (dy < 0 && this.dir.y === 0) this.nextDir = { x: 0, y: -1 };
        }
      }
    }
  }

  handleKeyDown(e) {
    if (e.code === 'ArrowUp' && this.dir.y === 0) this.nextDir = { x: 0, y: -1 };
    else if (e.code === 'ArrowDown' && this.dir.y === 0) this.nextDir = { x: 0, y: 1 };
    else if (e.code === 'ArrowLeft' && this.dir.x === 0) this.nextDir = { x: -1, y: 0 };
    else if (e.code === 'ArrowRight' && this.dir.x === 0) this.nextDir = { x: 1, y: 0 };
  }

  setDirection(direction) {
    if (direction === 'up' && this.dir.y === 0) this.nextDir = { x: 0, y: -1 };
    if (direction === 'down' && this.dir.y === 0) this.nextDir = { x: 0, y: 1 };
    if (direction === 'left' && this.dir.x === 0) this.nextDir = { x: -1, y: 0 };
    if (direction === 'right' && this.dir.x === 0) this.nextDir = { x: 1, y: 0 };
  }

  update(dt) {
    if (this.isOver) return;

    this.timer += dt;
    if (this.timer >= this.speed) {
      this.timer = 0;
      this.step();
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

  step() {
    this.dir = { ...this.nextDir };
    const head = this.snake[0];
    const newHead = { x: head.x + this.dir.x, y: head.y + this.dir.y };

    // Wall collision
    if (newHead.x < 0 || newHead.x >= this.cols || newHead.y < 0 || newHead.y >= this.rows) {
      this.handleDeath();
      return;
    }

    // Self collision
    if (this.snake.some(s => s.x === newHead.x && s.y === newHead.y)) {
      this.handleDeath();
      return;
    }

    this.snake.unshift(newHead);

    // Food collision
    if (newHead.x === this.food.x && newHead.y === this.food.y) {
      this.score += 10;
      this.onScore(this.score);
      this.audio.pop();
      this.spawnFruitSparks(
        this.food.x * this.gridSize + this.gridSize / 2,
        this.food.y * this.gridSize + this.gridSize / 2
      );
      this.spawnFood();
      this.speed = Math.max(0.07, 0.13 - (this.score / 600) * 0.04);
    } else {
      this.snake.pop();
    }
  }

  spawnFruitSparks(x, y) {
    for (let i = 0; i < 12; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd = Math.random() * 100 + 40;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        color: '#10B981',
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

    // Clean White Grid Background
    ctx.fillStyle = '#F8FAFC';
    ctx.fillRect(0, 0, this.width, this.height);

    // Subtle checkered pattern
    ctx.fillStyle = 'rgba(226, 232, 240, 0.35)';
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if ((r + c) % 2 === 0) {
          ctx.fillRect(c * this.gridSize, r * this.gridSize, this.gridSize, this.gridSize);
        }
      }
    }

    // Border
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, this.width - 2, this.height - 2);

    // Draw Food (Juicy Strawberry Red)
    const fx = this.food.x * this.gridSize + this.gridSize / 2;
    const fy = this.food.y * this.gridSize + this.gridSize / 2;
    ctx.save();
    ctx.fillStyle = '#EF4444';
    ctx.shadowColor = 'rgba(239, 68, 68, 0.4)';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(fx, fy, this.gridSize / 2 - 2, 0, Math.PI * 2);
    ctx.fill();

    // Leaf
    ctx.fillStyle = '#10B981';
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.arc(fx + 2, fy - 6, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Draw Snake Segments
    for (let i = 0; i < this.snake.length; i++) {
      const s = this.snake[i];
      const sx = s.x * this.gridSize;
      const sy = s.y * this.gridSize;

      ctx.save();
      if (i === 0) {
        // Head (Emerald / Vibrant Teal)
        ctx.fillStyle = '#10B981';
        ctx.beginPath();
        ctx.roundRect(sx + 1, sy + 1, this.gridSize - 2, this.gridSize - 2, 6);
        ctx.fill();

        // Eyes
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(sx + 5, sy + 5, 3, 3);
        ctx.fillRect(sx + 12, sy + 5, 3, 3);
      } else {
        // Body (Pastel Mint Green)
        ctx.fillStyle = '#34D399';
        ctx.beginPath();
        ctx.roundRect(sx + 1.5, sy + 1.5, this.gridSize - 3, this.gridSize - 3, 5);
        ctx.fill();
      }
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
  }

  destroy() {
    this.canvas.removeEventListener('touchstart', this.handleTouchStart);
    this.canvas.removeEventListener('touchend', this.handleTouchEnd);
    window.removeEventListener('keydown', this.handleKeyDown);
    this.particles = [];
  }
}
