import { BaseGame } from '../../engine/BaseGame.js';

/**
 * DunkBasketballGame - Drag-to-shoot basketball with parabolic trajectory,
 * hoop rim collision, swish net physics, and timed shootout rounds.
 */
export class DunkBasketballGame extends BaseGame {
  constructor(session, canvas, input, audio) {
    super(session, canvas, input, audio);
    this.width = 640;
    this.height = 640;

    this.ball = {
      x: 160,
      y: 500,
      vx: 0,
      vy: 0,
      radius: 16,
      isAirborne: false
    };

    this.hoop = {
      x: 480,
      y: 220,
      w: 60,
      rimRadius: 4
    };

    this.timeLeft = 45;
    this.aimStart = null;
    this.gravity = 780;
  }

  create() {
    super.create();
    this.resetBall();
    this.timeLeft = 45;
    this.setScore(0);
  }

  resetBall() {
    this.ball.x = 160;
    this.ball.y = 500;
    this.ball.vx = 0;
    this.ball.vy = 0;
    this.ball.isAirborne = false;
  }

  update(deltaTime) {
    super.update(deltaTime);
    if (this.isGameOver || this.isPaused) return;

    // Timer
    this.timeLeft -= deltaTime;
    if (this.timeLeft <= 0) {
      this.timeLeft = 0;
      this.triggerGameOver(false);
      return;
    }

    // Drag-to-shoot aiming
    if (!this.ball.isAirborne) {
      if (this.input.pointer.justPressed) {
        this.aimStart = { x: this.input.pointer.canvasX, y: this.input.pointer.canvasY };
      } else if (!this.input.pointer.isDown && this.aimStart) {
        const dx = this.aimStart.x - this.input.pointer.canvasX;
        const dy = this.aimStart.y - this.input.pointer.canvasY;
        const power = Math.hypot(dx, dy);

        if (power > 20) {
          this.ball.vx = dx * 3.8;
          this.ball.vy = dy * 3.8;
          this.ball.isAirborne = true;
          if (this.audio) this.audio.playJump();
        }
        this.aimStart = null;
      }
    }

    if (this.ball.isAirborne) {
      this.ball.vy += this.gravity * deltaTime;
      this.ball.x += this.ball.vx * deltaTime;
      this.ball.y += this.ball.vy * deltaTime;

      // Check Hoop scoring (passing between hoop.x and hoop.x + hoop.w going downwards)
      const hoopLeft = this.hoop.x;
      const hoopRight = this.hoop.x + this.hoop.w;
      const hoopY = this.hoop.y;

      if (
        this.ball.vy > 0 &&
        this.ball.y >= hoopY &&
        this.ball.y - this.ball.vy * deltaTime <= hoopY &&
        this.ball.x > hoopLeft + 5 &&
        this.ball.x < hoopRight - 5
      ) {
        // SWISH!
        this.addScore(2);
        if (this.audio) this.audio.playCoin();
        this.spawnParticles(this.hoop.x + this.hoop.w / 2, this.hoop.y, 16, '#FBBF24', 120, 3);
        this.shake(0.12, 4);
      }

      // Rim collisions (Left rim & Right rim bounce)
      const rimLeftDist = Math.hypot(this.ball.x - hoopLeft, this.ball.y - hoopY);
      if (rimLeftDist < this.ball.radius + 4) {
        this.ball.vx = -this.ball.vx * 0.7;
        this.ball.vy = -this.ball.vy * 0.6;
        if (this.audio) this.audio.playHit();
      }
      const rimRightDist = Math.hypot(this.ball.x - hoopRight, this.ball.y - hoopY);
      if (rimRightDist < this.ball.radius + 4) {
        this.ball.vx = -this.ball.vx * 0.7;
        this.ball.vy = -this.ball.vy * 0.6;
        if (this.audio) this.audio.playHit();
      }

      // Ground or out of bounds reset
      if (this.ball.y > this.height + 30 || this.ball.x > this.width + 30 || this.ball.x < -30) {
        this.resetBall();
      }
    }
  }

  render(ctx) {
    this.clearCanvas('#080A12');

    // Subtle Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let x = 0; x < this.width; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.height);
      ctx.stroke();
    }

    // Draw Backboard & Hoop
    const hx = this.hoop.x;
    const hy = this.hoop.y;
    const hw = this.hoop.w;

    // Backboard
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3;
    ctx.fillRect(hx + hw + 2, hy - 70, 8, 90);
    ctx.strokeRect(hx + hw + 2, hy - 70, 8, 90);

    // Rim
    ctx.strokeStyle = '#EC4899';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(hx, hy);
    ctx.lineTo(hx + hw, hy);
    ctx.stroke();

    // Net
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(hx, hy);
    ctx.lineTo(hx + 10, hy + 35);
    ctx.lineTo(hx + hw - 10, hy + 35);
    ctx.lineTo(hx + hw, hy);
    ctx.stroke();

    // Aim Trajectory Line
    if (this.aimStart && !this.ball.isAirborne) {
      const dx = this.aimStart.x - this.input.pointer.canvasX;
      const dy = this.aimStart.y - this.input.pointer.canvasY;

      ctx.save();
      ctx.strokeStyle = '#00F2FE';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(this.ball.x, this.ball.y);
      ctx.lineTo(this.ball.x + dx * 0.8, this.ball.y + dy * 0.8);
      ctx.stroke();
      ctx.restore();
    }

    // Draw Basketball
    ctx.save();
    ctx.fillStyle = '#FBBF24';
    ctx.beginPath();
    ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#0B0E17';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

    // Timer HUD
    ctx.save();
    ctx.font = 'bold 16px Orbitron, sans-serif';
    ctx.fillStyle = '#00F2FE';
    ctx.fillText(`TIME: ${Math.ceil(this.timeLeft)}S`, 20, 35);
    ctx.restore();

    super.render(ctx);
  }

  destroy() {
    if (this.canvas && this.onDown) {
      this.canvas.removeEventListener('pointerdown', this.onDown);
    }
    if (this.onUp) {
      window.removeEventListener('pointerup', this.onUp);
    }
    super.destroy();
  }
}
