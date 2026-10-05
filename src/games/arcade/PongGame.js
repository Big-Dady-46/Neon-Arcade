import { BaseGame } from '../../engine/BaseGame.js';

/**
 * PongGame - Cyber Pong 3000 retro arcade table rally.
 * Features dual neon paddles, intelligent AI opponent, spin physics,
 * wall bounce sound synthesis, and score match to 7.
 */
export class PongGame extends BaseGame {
  constructor(session, canvas, input, audio) {
    super(session, canvas, input, audio);
    this.width = 700;
    this.height = 500;

    this.paddleW = 14;
    this.paddleH = 80;

    this.player = {
      x: 30,
      y: 210,
      speed: 480,
      score: 0
    };

    this.ai = {
      x: this.width - 30 - this.paddleW,
      y: 210,
      speed: 360,
      score: 0
    };

    this.ball = {
      x: this.width / 2,
      y: this.height / 2,
      vx: 320,
      vy: 160,
      radius: 8,
      speed: 360
    };

    this.trail = [];
  }

  create() {
    super.create();
    this.player.y = (this.height - this.paddleH) / 2;
    this.ai.y = (this.height - this.paddleH) / 2;
    this.player.score = 0;
    this.ai.score = 0;
    this.trail = [];
    this.setScore(0);
    this.resetBall(1);
  }

  resetBall(direction = 1) {
    this.ball.x = this.width / 2;
    this.ball.y = this.height / 2;
    this.ball.speed = 360;
    const angle = (Math.random() * 0.8 - 0.4) * Math.PI; // -0.4 to +0.4 rad
    this.ball.vx = Math.cos(angle) * this.ball.speed * direction;
    this.ball.vy = Math.sin(angle) * this.ball.speed;
  }

  update(deltaTime) {
    super.update(deltaTime);
    if (this.isGameOver || this.isPaused) return;

    // Player Paddle Movement - Keyboard (W/S or Up/Down)
    const isUp = this.input.isActionActive('up');
    const isDown = this.input.isActionActive('down');

    if (isUp) {
      this.player.y -= this.player.speed * deltaTime;
    }
    if (isDown) {
      this.player.y += this.player.speed * deltaTime;
    }

    // Pointer / Mouse / Touch steering (only if actively dragging/moving and no keyboard active)
    if (!isUp && !isDown && this.input.pointer.canvasY > 0) {
      if (this.input.pointer.moved || this.input.pointer.isDown) {
        this.player.y = this.input.pointer.canvasY - this.paddleH / 2;
      }
    }

    // Clamp player paddle
    this.player.y = Math.max(10, Math.min(this.height - this.paddleH - 10, this.player.y));

    // AI Paddle Tracking
    const aiCenter = this.ai.y + this.paddleH / 2;
    const targetY = this.ball.y;
    if (Math.abs(aiCenter - targetY) > 15) {
      if (aiCenter < targetY) {
        this.ai.y += this.ai.speed * deltaTime;
      } else {
        this.ai.y -= this.ai.speed * deltaTime;
      }
    }
    this.ai.y = Math.max(10, Math.min(this.height - this.paddleH - 10, this.ai.y));

    // Ball Movement
    this.ball.x += this.ball.vx * deltaTime;
    this.ball.y += this.ball.vy * deltaTime;

    // Ball Trail
    this.trail.push({ x: this.ball.x, y: this.ball.y, alpha: 0.6 });
    if (this.trail.length > 8) this.trail.shift();

    // Top / Bottom Wall Rebound
    if (this.ball.y - this.ball.radius <= 0) {
      this.ball.y = this.ball.radius;
      this.ball.vy = Math.abs(this.ball.vy);
      if (this.audio) this.audio.playBlip(500, 0.03);
    } else if (this.ball.y + this.ball.radius >= this.height) {
      this.ball.y = this.height - this.ball.radius;
      this.ball.vy = -Math.abs(this.ball.vy);
      if (this.audio) this.audio.playBlip(500, 0.03);
    }

    // Player Paddle Collision (Left)
    if (
      this.ball.x - this.ball.radius <= this.player.x + this.paddleW &&
      this.ball.x + this.ball.radius >= this.player.x &&
      this.ball.y >= this.player.y &&
      this.ball.y <= this.player.y + this.paddleH &&
      this.ball.vx < 0
    ) {
      const hitOffset = (this.ball.y - (this.player.y + this.paddleH / 2)) / (this.paddleH / 2);
      this.ball.speed = Math.min(650, this.ball.speed + 25);
      const angle = hitOffset * (Math.PI / 3.2); // Up to ~56 degrees
      this.ball.vx = Math.cos(angle) * this.ball.speed;
      this.ball.vy = Math.sin(angle) * this.ball.speed;

      this.addScore(5);
      if (this.audio) this.audio.playBlip(700, 0.05);
      this.spawnParticles(this.player.x + this.paddleW, this.ball.y, 8, '#00F2FE', 100, 2.5);
    }

    // AI Paddle Collision (Right)
    if (
      this.ball.x + this.ball.radius >= this.ai.x &&
      this.ball.x - this.ball.radius <= this.ai.x + this.paddleW &&
      this.ball.y >= this.ai.y &&
      this.ball.y <= this.ai.y + this.paddleH &&
      this.ball.vx > 0
    ) {
      const hitOffset = (this.ball.y - (this.ai.y + this.paddleH / 2)) / (this.paddleH / 2);
      this.ball.speed = Math.min(650, this.ball.speed + 25);
      const angle = hitOffset * (Math.PI / 3.2);
      this.ball.vx = -Math.cos(angle) * this.ball.speed;
      this.ball.vy = Math.sin(angle) * this.ball.speed;

      if (this.audio) this.audio.playBlip(600, 0.05);
      this.spawnParticles(this.ai.x, this.ball.y, 8, '#EC4899', 100, 2.5);
    }

    // Score Checks
    if (this.ball.x < -20) {
      // AI scores
      this.ai.score++;
      this.shake(0.2, 6);
      if (this.audio) this.audio.playHit();
      if (this.ai.score >= 7) {
        this.triggerGameOver(false);
      } else {
        this.resetBall(1);
      }
    } else if (this.ball.x > this.width + 20) {
      // Player scores
      this.player.score++;
      this.addScore(50);
      if (this.audio) this.audio.playCoin();
      this.spawnParticles(this.width / 2, this.height / 2, 20, '#00F2FE', 140, 3);
      if (this.player.score >= 7) {
        this.triggerGameOver(true);
      } else {
        this.resetBall(-1);
      }
    }
  }

  render(ctx) {
    this.clearCanvas('#080A12');

    // Middle Net Divider
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 2;
    ctx.setLineDash([12, 12]);
    ctx.beginPath();
    ctx.moveTo(this.width / 2, 0);
    ctx.lineTo(this.width / 2, this.height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Score HUD on canvas
    ctx.save();
    ctx.font = 'bold 36px Orbitron, sans-serif';
    ctx.fillStyle = '#00F2FE';
    ctx.textAlign = 'center';
    ctx.fillText(this.player.score, this.width / 2 - 60, 55);

    ctx.fillStyle = '#EC4899';
    ctx.fillText(this.ai.score, this.width / 2 + 60, 55);
    ctx.restore();

    // Draw Ball Trail
    for (let i = 0; i < this.trail.length; i++) {
      const t = this.trail[i];
      ctx.save();
      ctx.fillStyle = '#00F2FE';
      ctx.globalAlpha = (i / this.trail.length) * 0.4;
      ctx.beginPath();
      ctx.arc(t.x, t.y, this.ball.radius * 0.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Draw Ball
    ctx.save();
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = '#00F2FE';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Draw Player Paddle (Cyan)
    ctx.save();
    ctx.fillStyle = '#00F2FE';
    ctx.shadowColor = '#00F2FE';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.roundRect(this.player.x, this.player.y, this.paddleW, this.paddleH, 6);
    ctx.fill();
    ctx.restore();

    // Draw AI Paddle (Magenta)
    ctx.save();
    ctx.fillStyle = '#EC4899';
    ctx.shadowColor = '#EC4899';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.roundRect(this.ai.x, this.ai.y, this.paddleW, this.paddleH, 6);
    ctx.fill();
    ctx.restore();

    super.render(ctx);
  }
}
