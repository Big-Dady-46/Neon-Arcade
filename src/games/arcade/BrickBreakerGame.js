import { BaseGame } from '../../engine/BaseGame.js';

/**
 * BrickBreakerGame - Neon Brick Breaker with paddle physics, particle explosions,
 * multi-tier bricks, and sound effects.
 */
export class BrickBreakerGame extends BaseGame {
  constructor(session, canvas, input, audio) {
    super(session, canvas, input, audio);
    this.width = 700;
    this.height = 550;

    this.paddle = {
      w: 110,
      h: 14,
      x: 0,
      y: 0,
      speed: 550
    };

    this.ball = {
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      radius: 8,
      speed: 360,
      isStuck: true
    };

    this.bricks = [];
    this.lives = 3;
  }

  create() {
    super.create();
    this.lives = 3;
    this.setScore(0);

    // Position paddle
    this.paddle.w = 110;
    this.paddle.x = (this.width - this.paddle.w) / 2;
    this.paddle.y = this.height - 35;

    // Reset ball
    this.resetBall();

    // Create brick grid
    this.createBricks();
  }

  resetBall() {
    this.ball.isStuck = true;
    this.ball.x = this.paddle.x + this.paddle.w / 2;
    this.ball.y = this.paddle.y - this.ball.radius - 2;
    this.ball.vx = (Math.random() > 0.5 ? 1 : -1) * 200;
    this.ball.vy = -300;
  }

  launchBall() {
    if (this.ball.isStuck) {
      this.ball.isStuck = false;
      if (this.audio) this.audio.playJump();
    }
  }

  createBricks() {
    this.bricks = [];
    const rows = 5;
    const cols = 9;
    const brickW = 66;
    const brickH = 22;
    const padding = 8;
    const offsetTop = 60;
    const offsetLeft = (this.width - (cols * (brickW + padding) - padding)) / 2;

    const colors = ['#00F2FE', '#8B5CF6', '#EC4899', '#FBBF24', '#10B981'];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        this.bricks.push({
          x: offsetLeft + c * (brickW + padding),
          y: offsetTop + r * (brickH + padding),
          w: brickW,
          h: brickH,
          color: colors[r % colors.length],
          points: (rows - r) * 10,
          alive: true
        });
      }
    }
  }

  update(deltaTime) {
    super.update(deltaTime);
    if (this.isGameOver || this.isPaused) return;

    // Paddle movement via keyboard
    const isKeyLeft = this.input.isActionActive('left');
    const isKeyRight = this.input.isActionActive('right');

    if (isKeyLeft) {
      this.paddle.x -= this.paddle.speed * deltaTime;
    }
    if (isKeyRight) {
      this.paddle.x += this.paddle.speed * deltaTime;
    }

    // Paddle movement via pointer/mouse/touch (only when actively moving or dragging, and not using keys)
    if (!isKeyLeft && !isKeyRight && this.input.pointer.canvasX > 0) {
      if (this.input.pointer.moved || this.input.pointer.isDown) {
        this.paddle.x = this.input.pointer.canvasX - this.paddle.w / 2;
      }
    }

    // Clamp paddle to arena boundaries
    this.paddle.x = Math.max(10, Math.min(this.width - this.paddle.w - 10, this.paddle.x));

    // Handle stuck ball before launch
    if (this.ball.isStuck) {
      this.ball.x = this.paddle.x + this.paddle.w / 2;
      this.ball.y = this.paddle.y - this.ball.radius - 2;

      // Launch ball only on intentional action: Space / Up / Click
      if (this.input.isActionJustPressed('action1') || this.input.isActionJustPressed('up') || this.input.pointer.justPressed) {
        this.launchBall();
      }
      return;
    }

    // Move ball
    this.ball.x += this.ball.vx * deltaTime;
    this.ball.y += this.ball.vy * deltaTime;

    // Wall collisions (Left & Right)
    if (this.ball.x - this.ball.radius <= 0) {
      this.ball.x = this.ball.radius;
      this.ball.vx = -this.ball.vx;
      if (this.audio) this.audio.playBlip(500, 0.04);
    } else if (this.ball.x + this.ball.radius >= this.width) {
      this.ball.x = this.width - this.ball.radius;
      this.ball.vx = -this.ball.vx;
      if (this.audio) this.audio.playBlip(500, 0.04);
    }

    // Ceiling collision
    if (this.ball.y - this.ball.radius <= 0) {
      this.ball.y = this.ball.radius;
      this.ball.vy = -this.ball.vy;
      if (this.audio) this.audio.playBlip(600, 0.04);
    }

    // Paddle collision
    if (
      this.ball.y + this.ball.radius >= this.paddle.y &&
      this.ball.y - this.ball.radius <= this.paddle.y + this.paddle.h &&
      this.ball.x >= this.paddle.x &&
      this.ball.x <= this.paddle.x + this.paddle.w &&
      this.ball.vy > 0
    ) {
      // Calculate bounce angle based on hit position on paddle (-1 to 1)
      const hitPoint = (this.ball.x - (this.paddle.x + this.paddle.w / 2)) / (this.paddle.w / 2);
      const angle = hitPoint * (Math.PI / 3); // Max 60 degree deflection
      const speed = Math.hypot(this.ball.vx, this.ball.vy) * 1.02; // slight speed increase

      this.ball.vx = speed * Math.sin(angle);
      this.ball.vy = -speed * Math.cos(angle);
      this.ball.y = this.paddle.y - this.ball.radius;

      if (this.audio) this.audio.playJump();
      this.spawnParticles(this.ball.x, this.paddle.y, 8, '#00F2FE', 90, 2.5);
    }

    // Brick collisions
    let allCleared = true;
    for (const b of this.bricks) {
      if (!b.alive) continue;
      allCleared = false;

      // Simple AABB vs Circle
      if (
        this.ball.x + this.ball.radius >= b.x &&
        this.ball.x - this.ball.radius <= b.x + b.w &&
        this.ball.y + this.ball.radius >= b.y &&
        this.ball.y - this.ball.radius <= b.y + b.h
      ) {
        b.alive = false;
        this.ball.vy = -this.ball.vy;
        this.addScore(b.points);

        if (this.audio) this.audio.playCoin();
        this.spawnParticles(b.x + b.w / 2, b.y + b.h / 2, 16, b.color, 140, 3.5);
        this.shake(0.12, 4);
        break;
      }
    }

    // Check Victory
    if (allCleared) {
      this.triggerGameOver(true);
      return;
    }

    // Bottom loss
    if (this.ball.y - this.ball.radius > this.height) {
      this.lives--;
      this.shake(0.25, 8);
      if (this.audio) this.audio.playHit();

      if (this.lives <= 0) {
        this.triggerGameOver(false);
      } else {
        this.resetBall();
      }
    }
  }

  render(ctx) {
    ctx.save();
    ctx.translate(this.shakeOffset.x, this.shakeOffset.y);

    this.clearCanvas('#080A12');

    // Background Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let x = 0; x < this.width; x += 25) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.height);
      ctx.stroke();
    }
    for (let y = 0; y < this.height; y += 25) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.width, y);
      ctx.stroke();
    }

    // Draw Glowing Boundary
    ctx.strokeStyle = '#00F2FE';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#00F2FE';
    ctx.shadowBlur = 10;
    ctx.strokeRect(1, 1, this.width - 2, this.height - 2);
    ctx.shadowBlur = 0;

    // Draw Bricks
    for (const b of this.bricks) {
      if (!b.alive) continue;
      ctx.save();
      ctx.fillStyle = b.color;
      ctx.shadowColor = b.color;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.roundRect(b.x, b.y, b.w, b.h, 4);
      ctx.fill();

      // Highlight line
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.fillRect(b.x + 3, b.y + 2, b.w - 6, 2);
      ctx.restore();
    }

    // Draw Paddle
    ctx.save();
    ctx.fillStyle = '#00F2FE';
    ctx.shadowColor = '#00F2FE';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.roundRect(this.paddle.x, this.paddle.y, this.paddle.w, this.paddle.h, 7);
    ctx.fill();

    // Paddle Center Accent
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect(this.paddle.x + this.paddle.w / 2 - 12, this.paddle.y + 3, 24, 4, 2);
    ctx.fill();
    ctx.restore();

    // Draw Ball
    ctx.save();
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = '#00F2FE';
    ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Draw Lives and status HUD in canvas
    ctx.save();
    ctx.font = 'bold 15px Jost, sans-serif';
    ctx.fillStyle = '#9CA3AF';
    ctx.fillText(`LIVES: `, 20, 30);
    for (let i = 0; i < this.lives; i++) {
      ctx.fillStyle = '#EC4899';
      ctx.shadowColor = '#EC4899';
      ctx.shadowBlur = 8;
      ctx.fillText('❤️', 75 + i * 22, 30);
    }
    ctx.restore();

    // If ball is stuck, render launch hint
    if (this.ball.isStuck) {
      ctx.save();
      ctx.font = 'bold 16px Jost, sans-serif';
      ctx.fillStyle = '#FBBF24';
      ctx.textAlign = 'center';
      ctx.shadowColor = '#FBBF24';
      ctx.shadowBlur = 10;
      ctx.fillText('CLICK, TAP OR PRESS SPACE TO LAUNCH', this.width / 2, this.height - 70);
      ctx.restore();
    }

    // Particles
    super.render(ctx);
    ctx.restore();
  }
}
