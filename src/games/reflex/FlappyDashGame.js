import { BaseGame } from '../../engine/BaseGame.js';

/**
 * FlappyDashGame - Neon Cyber Flappy Dash with procedural glowing obstacles,
 * smooth gravity physics, particle trails, and synthesized audio.
 */
export class FlappyDashGame extends BaseGame {
  constructor(session, canvas, input, audio) {
    super(session, canvas, input, audio);
    this.width = 500;
    this.height = 650;

    this.bird = {
      x: 100,
      y: 300,
      vy: 0,
      radius: 16,
      gravity: 900,
      jumpForce: -320
    };

    this.pipes = [];
    this.pipeWidth = 60;
    this.pipeGap = 160;
    this.pipeInterval = 1.8; // seconds between pipes
    this.pipeTimer = 0;
    this.speed = 170;

    this.hasStarted = false;
  }

  create() {
    super.create();
    this.bird.x = 100;
    this.bird.y = this.height / 2;
    this.bird.vy = 0;
    this.pipes = [];
    this.pipeTimer = 0;
    this.hasStarted = false;
    this.setScore(0);
  }

  flap() {
    this.bird.vy = this.bird.jumpForce;
    if (this.audio) this.audio.playJump();
    this.spawnParticles(this.bird.x - 10, this.bird.y + 5, 8, '#00F2FE', 80, 2.5);
  }

  update(deltaTime) {
    super.update(deltaTime);
    if (this.isGameOver || this.isPaused) return;

    // Check for jump input (single impulse per press / tap)
    const flapPressed = this.input.isActionJustPressed('action1') ||
      this.input.isActionJustPressed('up') ||
      this.input.pointer.justPressed;

    if (flapPressed) {
      if (!this.hasStarted) {
        this.hasStarted = true;
      }
      this.flap();
    }

    if (!this.hasStarted) return;

    // Gravity
    this.bird.vy += this.bird.gravity * deltaTime;
    this.bird.y += this.bird.vy * deltaTime;

    // Ceiling / floor collision
    if (this.bird.y - this.bird.radius <= 0) {
      this.bird.y = this.bird.radius;
      this.bird.vy = 0;
    }
    if (this.bird.y + this.bird.radius >= this.height - 20) {
      this.handleDeath();
      return;
    }

    // Spawn pipes
    this.pipeTimer += deltaTime;
    if (this.pipeTimer >= this.pipeInterval) {
      this.pipeTimer = 0;
      this.spawnPipePair();
    }

    // Move & check pipes
    for (let i = this.pipes.length - 1; i >= 0; i--) {
      const p = this.pipes[i];
      p.x -= this.speed * deltaTime;

      // Score point when bird passes pipe center
      if (!p.scored && p.x + this.pipeWidth < this.bird.x) {
        p.scored = true;
        this.addScore(1);
        if (this.audio) this.audio.playCoin();
      }

      // Bird collision with top pipe or bottom pipe
      const inX = this.bird.x + this.bird.radius > p.x && this.bird.x - this.bird.radius < p.x + this.pipeWidth;
      const hitTop = inX && this.bird.y - this.bird.radius < p.topHeight;
      const hitBottom = inX && this.bird.y + this.bird.radius > p.topHeight + this.pipeGap;

      if (hitTop || hitBottom) {
        this.handleDeath();
        return;
      }

      // Remove off-screen pipes
      if (p.x + this.pipeWidth < -20) {
        this.pipes.splice(i, 1);
      }
    }
  }

  spawnPipePair() {
    const minTop = 60;
    const maxTop = this.height - this.pipeGap - 100;
    const topHeight = Math.floor(Math.random() * (maxTop - minTop)) + minTop;

    this.pipes.push({
      x: this.width + 10,
      topHeight,
      scored: false
    });
  }

  handleDeath() {
    this.shake(0.3, 10);
    if (this.audio) {
      this.audio.playHit();
      this.audio.playExplosion();
    }
    this.spawnParticles(this.bird.x, this.bird.y, 25, '#EC4899', 180, 4);
    this.triggerGameOver(false);
  }

  render(ctx) {
    ctx.save();
    ctx.translate(this.shakeOffset.x, this.shakeOffset.y);

    this.clearCanvas('#080A12');

    // Background Neon Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let x = 0; x < this.width; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.height);
      ctx.stroke();
    }

    // Ground line
    ctx.fillStyle = '#141824';
    ctx.fillRect(0, this.height - 20, this.width, 20);
    ctx.strokeStyle = '#00F2FE';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#00F2FE';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(0, this.height - 20);
    ctx.lineTo(this.width, this.height - 20);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Draw Pipes
    for (const p of this.pipes) {
      ctx.save();
      ctx.fillStyle = '#161F30';
      ctx.strokeStyle = '#8B5CF6';
      ctx.shadowColor = '#8B5CF6';
      ctx.shadowBlur = 12;
      ctx.lineWidth = 2;

      // Top Pipe
      ctx.beginPath();
      ctx.roundRect(p.x, 0, this.pipeWidth, p.topHeight, [0, 0, 8, 8]);
      ctx.fill();
      ctx.stroke();

      // Bottom Pipe
      const bottomY = p.topHeight + this.pipeGap;
      const bottomH = this.height - bottomY - 20;
      ctx.beginPath();
      ctx.roundRect(p.x, bottomY, this.pipeWidth, bottomH, [8, 8, 0, 0]);
      ctx.fill();
      ctx.stroke();

      // Glowing Portal Nodes at pipe openings
      ctx.fillStyle = '#00F2FE';
      ctx.fillRect(p.x + 2, p.topHeight - 5, this.pipeWidth - 4, 3);
      ctx.fillRect(p.x + 2, bottomY + 2, this.pipeWidth - 4, 3);

      ctx.restore();
    }

    // Draw Bird
    ctx.save();
    const rot = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, (this.bird.vy / 500)));
    ctx.translate(this.bird.x, this.bird.y);
    ctx.rotate(rot);

    // Glowing Neon Cyber Bird Body
    ctx.fillStyle = '#00F2FE';
    ctx.shadowColor = '#00F2FE';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(0, 0, this.bird.radius, 0, Math.PI * 2);
    ctx.fill();

    // Eye
    ctx.fillStyle = '#080A11';
    ctx.beginPath();
    ctx.arc(5, -4, 4, 0, Math.PI * 2);
    ctx.fill();

    // Beak
    ctx.fillStyle = '#FBBF24';
    ctx.shadowColor = '#FBBF24';
    ctx.beginPath();
    ctx.moveTo(8, -1);
    ctx.lineTo(18, 2);
    ctx.lineTo(8, 5);
    ctx.closePath();
    ctx.fill();

    ctx.restore();

    // Start Hint
    if (!this.hasStarted) {
      ctx.save();
      ctx.font = 'bold 20px Jost, sans-serif';
      ctx.fillStyle = '#FBBF24';
      ctx.textAlign = 'center';
      ctx.shadowColor = '#FBBF24';
      ctx.shadowBlur = 12;
      ctx.fillText('TAP, CLICK OR PRESS SPACE TO FLAP', this.width / 2, this.height / 2 - 50);
      ctx.restore();
    }

    // Particles
    super.render(ctx);
    ctx.restore();
  }
}
