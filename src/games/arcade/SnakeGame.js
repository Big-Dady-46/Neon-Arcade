import { BaseGame } from '../../engine/BaseGame.js';

/**
 * CyberSnake - Neon Arcade Snake implementation.
 * Features smooth grid movement, neon aesthetics, particle trails, golden bonus fruits,
 * dynamic speed progression, screen shake, and synthesized sound effects.
 */
export class SnakeGame extends BaseGame {
  constructor(session, canvas, input, audio) {
    super(session, canvas, input, audio);
    this.width = 600;
    this.height = 600;
    this.gridSize = 20; // 30 x 30 grid
    this.cols = this.width / this.gridSize;
    this.rows = this.height / this.gridSize;

    // Movement timer
    this.moveInterval = 0.12; // Base speed: ~8 moves per second
    this.moveTimer = 0;

    // Snake state
    this.snake = [];
    this.direction = { x: 1, y: 0 };
    this.nextDirection = { x: 1, y: 0 };

    // Food state
    this.food = { x: 15, y: 15 };
    this.bonusFood = null;
    this.bonusTimer = 0;

    // Visual eye candy
    this.pulseTime = 0;
  }

  create() {
    super.create();
    this.gridSize = 20;
    this.cols = this.width / this.gridSize;
    this.rows = this.height / this.gridSize;

    // Initial snake with 4 segments
    const startX = Math.floor(this.cols / 2);
    const startY = Math.floor(this.rows / 2);
    this.snake = [
      { x: startX, y: startY },
      { x: startX - 1, y: startY },
      { x: startX - 2, y: startY },
      { x: startX - 3, y: startY }
    ];

    this.direction = { x: 1, y: 0 };
    this.nextDirection = { x: 1, y: 0 };
    this.moveInterval = 0.12;
    this.moveTimer = 0;

    this.spawnFood();
    this.bonusFood = null;
    this.bonusTimer = 0;
    this.pulseTime = 0;

    this.setScore(0);
  }

  spawnFood() {
    let valid = false;
    let newX, newY;
    while (!valid) {
      newX = Math.floor(Math.random() * this.cols);
      newY = Math.floor(Math.random() * this.rows);
      valid = !this.snake.some(segment => segment.x === newX && segment.y === newY);
    }
    this.food = { x: newX, y: newY };
  }

  spawnBonusFood() {
    let valid = false;
    let newX, newY;
    let attempts = 0;
    while (!valid && attempts < 50) {
      attempts++;
      newX = Math.floor(Math.random() * this.cols);
      newY = Math.floor(Math.random() * this.rows);
      valid = !this.snake.some(segment => segment.x === newX && segment.y === newY) &&
              !(this.food.x === newX && this.food.y === newY);
    }
    if (valid) {
      this.bonusFood = { x: newX, y: newY };
      this.bonusTimer = 6.0; // 6 seconds before disappearing
    }
  }

  update(deltaTime) {
    super.update(deltaTime);

    if (this.isGameOver || this.isPaused) return;

    this.pulseTime += deltaTime * 5;

    // Handle keyboard / D-pad inputs
    if ((this.input.isActionActive('up') || this.input.isActionJustPressed('up')) && this.direction.y === 0) {
      this.nextDirection = { x: 0, y: -1 };
    } else if ((this.input.isActionActive('down') || this.input.isActionJustPressed('down')) && this.direction.y === 0) {
      this.nextDirection = { x: 0, y: 1 };
    } else if ((this.input.isActionActive('left') || this.input.isActionJustPressed('left')) && this.direction.x === 0) {
      this.nextDirection = { x: -1, y: 0 };
    } else if ((this.input.isActionActive('right') || this.input.isActionJustPressed('right')) && this.direction.x === 0) {
      this.nextDirection = { x: 1, y: 0 };
    }

    // Handle mouse click / touch tap steering relative to snake head
    if (this.input.pointer.justPressed && this.snake && this.snake.length > 0) {
      const head = this.snake[0];
      const headPxX = head.x * this.gridSize + this.gridSize / 2;
      const headPxY = head.y * this.gridSize + this.gridSize / 2;
      const dx = this.input.pointer.canvasX - headPxX;
      const dy = this.input.pointer.canvasY - headPxY;

      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0 && this.direction.x === 0) this.nextDirection = { x: 1, y: 0 };
        else if (dx < 0 && this.direction.x === 0) this.nextDirection = { x: -1, y: 0 };
      } else {
        if (dy > 0 && this.direction.y === 0) this.nextDirection = { x: 0, y: 1 };
        else if (dy < 0 && this.direction.y === 0) this.nextDirection = { x: 0, y: -1 };
      }
    }

    // Bonus food timer
    if (this.bonusFood) {
      this.bonusTimer -= deltaTime;
      if (this.bonusTimer <= 0) {
        this.bonusFood = null;
      }
    }

    // Move step accumulator
    this.moveTimer += deltaTime;
    if (this.moveTimer >= this.moveInterval) {
      this.moveTimer = 0;
      this.step();
    }
  }

  step() {
    this.direction = { ...this.nextDirection };

    const head = this.snake[0];
    const newHead = {
      x: head.x + this.direction.x,
      y: head.y + this.direction.y
    };

    // Wall collision
    if (newHead.x < 0 || newHead.x >= this.cols || newHead.y < 0 || newHead.y >= this.rows) {
      this.handleDeath();
      return;
    }

    // Self collision
    if (this.snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
      this.handleDeath();
      return;
    }

    // Advance snake
    this.snake.unshift(newHead);

    // Check food consumption
    if (newHead.x === this.food.x && newHead.y === this.food.y) {
      this.addScore(10);
      if (this.audio) this.audio.playEat();

      // Particle explosion at food site
      const px = this.food.x * this.gridSize + this.gridSize / 2;
      const py = this.food.y * this.gridSize + this.gridSize / 2;
      this.spawnParticles(px, py, 14, '#00F2FE', 120, 3);

      this.spawnFood();

      // Speed up slightly as score increases (down to 0.06s)
      this.moveInterval = Math.max(0.06, 0.12 - (this.score / 1000) * 0.04);

      // Random chance to spawn bonus gold fruit
      if (!this.bonusFood && Math.random() < 0.25) {
        this.spawnBonusFood();
      }
    } else if (this.bonusFood && newHead.x === this.bonusFood.x && newHead.y === this.bonusFood.y) {
      this.addScore(50);
      if (this.audio) this.audio.playCoin();

      const px = this.bonusFood.x * this.gridSize + this.gridSize / 2;
      const py = this.bonusFood.y * this.gridSize + this.gridSize / 2;
      this.spawnParticles(px, py, 25, '#FFD700', 180, 4);

      this.bonusFood = null;
    } else {
      // Remove tail segment if not eating
      this.snake.pop();
    }
  }

  handleDeath() {
    this.shake(0.35, 12);
    if (this.audio) {
      this.audio.playHit();
      this.audio.playExplosion();
    }

    // Spawn massive crash particle burst
    const head = this.snake[0];
    const px = head.x * this.gridSize + this.gridSize / 2;
    const py = head.y * this.gridSize + this.gridSize / 2;
    this.spawnParticles(px, py, 30, '#FF007F', 200, 4);

    this.triggerGameOver(false);
  }

  render(ctx) {
    ctx.save();

    // Apply screen shake
    ctx.translate(this.shakeOffset.x, this.shakeOffset.y);

    // Background
    this.clearCanvas('#0C0E17');

    // Draw Subtle Cyber Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let c = 0; c <= this.cols; c++) {
      ctx.beginPath();
      ctx.moveTo(c * this.gridSize, 0);
      ctx.lineTo(c * this.gridSize, this.height);
      ctx.stroke();
    }
    for (let r = 0; r <= this.rows; r++) {
      ctx.beginPath();
      ctx.moveTo(0, r * this.gridSize);
      ctx.lineTo(this.width, r * this.gridSize);
      ctx.stroke();
    }

    // Draw Grid Arena Border with Neon Glow
    ctx.strokeStyle = '#00F2FE';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#00F2FE';
    ctx.shadowBlur = 10;
    ctx.strokeRect(1, 1, this.width - 2, this.height - 2);
    ctx.shadowBlur = 0;

    // Draw Standard Food (Neon Teal Pulsing Orb)
    const foodPulse = Math.sin(this.pulseTime) * 2;
    const fx = this.food.x * this.gridSize + this.gridSize / 2;
    const fy = this.food.y * this.gridSize + this.gridSize / 2;
    const fRadius = Math.max(3, this.gridSize / 2 - 3 + foodPulse);

    ctx.save();
    ctx.fillStyle = '#00F2FE';
    ctx.shadowColor = '#00F2FE';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(fx, fy, fRadius, 0, Math.PI * 2);
    ctx.fill();

    // Inner bright center
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(fx, fy, fRadius * 0.45, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Draw Golden Bonus Food if active
    if (this.bonusFood) {
      const bx = this.bonusFood.x * this.gridSize + this.gridSize / 2;
      const by = this.bonusFood.y * this.gridSize + this.gridSize / 2;
      const bRadius = this.gridSize / 2 - 2 + Math.cos(this.pulseTime * 2) * 2;

      ctx.save();
      ctx.fillStyle = '#FFD700';
      ctx.shadowColor = '#FFD700';
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.arc(bx, by, Math.max(4, bRadius), 0, Math.PI * 2);
      ctx.fill();

      // Star shine
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(bx - 1.5, by - 6, 3, 12);
      ctx.fillRect(bx - 6, by - 1.5, 12, 3);
      ctx.restore();
    }

    // Draw Snake Segments
    for (let i = 0; i < this.snake.length; i++) {
      const seg = this.snake[i];
      const sx = seg.x * this.gridSize;
      const sy = seg.y * this.gridSize;
      const isHead = i === 0;

      ctx.save();
      if (isHead) {
        // Glowing Head
        ctx.fillStyle = '#00F2FE';
        ctx.shadowColor = '#00F2FE';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.roundRect(sx + 1, sy + 1, this.gridSize - 2, this.gridSize - 2, 5);
        ctx.fill();

        // Snake Eyes
        ctx.fillStyle = '#0F111A';
        ctx.shadowBlur = 0;
        const eyeOffset = 4;
        let eye1X, eye1Y, eye2X, eye2Y;

        if (this.direction.x === 1) { // Moving right
          eye1X = sx + this.gridSize - 5; eye1Y = sy + eyeOffset;
          eye2X = sx + this.gridSize - 5; eye2Y = sy + this.gridSize - eyeOffset - 2;
        } else if (this.direction.x === -1) { // Moving left
          eye1X = sx + 3; eye1Y = sy + eyeOffset;
          eye2X = sx + 3; eye2Y = sy + this.gridSize - eyeOffset - 2;
        } else if (this.direction.y === -1) { // Moving up
          eye1X = sx + eyeOffset; eye1Y = sy + 3;
          eye2X = sx + this.gridSize - eyeOffset - 2; eye2Y = sy + 3;
        } else { // Moving down
          eye1X = sx + eyeOffset; eye1Y = sy + this.gridSize - 5;
          eye2X = sx + this.gridSize - eyeOffset - 2; eye2Y = sy + this.gridSize - 5;
        }

        ctx.fillRect(eye1X, eye1Y, 3, 3);
        ctx.fillRect(eye2X, eye2Y, 3, 3);
      } else {
        // Body gradient from Cyan to Purple
        const progress = i / this.snake.length;
        const r = Math.round(0 + (121 - 0) * progress);
        const g = Math.round(242 - (242 - 40) * progress);
        const b = Math.round(254 - (254 - 202) * progress);

        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.beginPath();
        ctx.roundRect(sx + 1.5, sy + 1.5, this.gridSize - 3, this.gridSize - 3, 4);
        ctx.fill();
      }
      ctx.restore();
    }

    // Render particles
    super.render(ctx);

    ctx.restore();
  }
}
