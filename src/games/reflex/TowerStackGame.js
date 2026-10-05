import { BaseGame } from '../../engine/BaseGame.js';

/**
 * TowerStackGame - Precision block stacking reflex game.
 * Features sliding blocks, timing-based placement, overhang slicing physics,
 * perfect placement combo bonuses, and ascending camera tracking.
 */
export class TowerStackGame extends BaseGame {
  constructor(session, canvas, input, audio) {
    super(session, canvas, input, audio);
    this.width = 540;
    this.height = 700;

    this.blockHeight = 28;
    this.stack = [];
    this.currentBlock = null;
    this.fallingBlocks = [];
    this.direction = 1;
    this.speed = 220;
    this.cameraY = 0;
    this.combo = 0;
  }

  create() {
    super.create();
    this.stack = [];
    this.fallingBlocks = [];
    this.cameraY = 0;
    this.combo = 0;
    this.speed = 220;
    this.setScore(0);

    // Initial base block
    const baseW = 220;
    this.stack.push({
      x: (this.width - baseW) / 2,
      y: this.height - 80,
      w: baseW,
      color: '#00F2FE'
    });

    this.spawnNextBlock();
  }

  spawnNextBlock() {
    const prev = this.stack[this.stack.length - 1];
    const colors = ['#00F2FE', '#8B5CF6', '#EC4899', '#FBBF24', '#10B981'];
    const color = colors[this.stack.length % colors.length];

    this.currentBlock = {
      x: 0,
      y: prev.y - this.blockHeight,
      w: prev.w,
      color
    };
    this.direction = 1;
  }

  placeBlock() {
    if (this.isGameOver || this.isPaused || !this.currentBlock) return;

    const prev = this.stack[this.stack.length - 1];
    const curr = this.currentBlock;
    const diff = curr.x - prev.x;

    // Perfect alignment bonus
    if (Math.abs(diff) < 5) {
      curr.x = prev.x;
      this.combo++;
      this.addScore(20 + this.combo * 5);
      if (this.audio) this.audio.playCoin();
      this.spawnParticles(curr.x + curr.w / 2, curr.y, 16, '#FBBF24', 120, 3);
    } else if (Math.abs(diff) >= curr.w) {
      // Missed completely -> Game Over
      this.shake(0.3, 10);
      if (this.audio) this.audio.playExplosion();
      this.fallingBlocks.push({
        x: curr.x,
        y: curr.y,
        w: curr.w,
        h: this.blockHeight,
        vy: 100,
        color: curr.color
      });
      this.currentBlock = null;
      this.triggerGameOver(false);
      return;
    } else {
      // Slice off overhang
      this.combo = 0;
      this.addScore(10);
      if (this.audio) this.audio.playBlip(550, 0.05);

      const overhangW = Math.abs(diff);
      const newW = curr.w - overhangW;

      let fallingX;
      if (diff > 0) {
        fallingX = curr.x + newW;
        curr.x = prev.x;
      } else {
        fallingX = curr.x;
        curr.x = prev.x;
      }
      curr.w = newW;

      // Spawn falling sliced section
      this.fallingBlocks.push({
        x: fallingX,
        y: curr.y,
        w: overhangW,
        h: this.blockHeight,
        vy: 100,
        color: curr.color
      });
      this.spawnParticles(fallingX + overhangW / 2, curr.y, 8, curr.color, 80, 2);
    }

    this.stack.push({ ...curr });
    this.speed = Math.min(380, 220 + this.stack.length * 4);

    // Pan camera if tower gets high
    const targetCameraY = Math.max(0, (this.stack.length - 8) * this.blockHeight);
    this.cameraY = targetCameraY;

    this.spawnNextBlock();
  }

  update(deltaTime) {
    super.update(deltaTime);
    if (this.isGameOver || this.isPaused) return;

    // Check placement input
    if (this.input.isActionJustPressed('action1') || this.input.isActionJustPressed('up') || this.input.pointer.justPressed) {
      this.placeBlock();
      return;
    }

    // Move current sliding block
    if (this.currentBlock) {
      this.currentBlock.x += this.direction * this.speed * deltaTime;
      if (this.currentBlock.x + this.currentBlock.w >= this.width) {
        this.currentBlock.x = this.width - this.currentBlock.w;
        this.direction = -1;
      } else if (this.currentBlock.x <= 0) {
        this.currentBlock.x = 0;
        this.direction = 1;
      }
    }

    // Update falling slices
    for (let i = this.fallingBlocks.length - 1; i >= 0; i--) {
      const fb = this.fallingBlocks[i];
      fb.vy += 600 * deltaTime;
      fb.y += fb.vy * deltaTime;
      if (fb.y > this.height + 200) {
        this.fallingBlocks.splice(i, 1);
      }
    }
  }

  render(ctx) {
    ctx.save();
    ctx.translate(this.shakeOffset.x, this.shakeOffset.y + this.cameraY);
    this.clearCanvas('#080A12');

    // Subtle Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let y = -this.height; y < this.height * 2; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.width, y);
      ctx.stroke();
    }

    // Draw Stacked Blocks
    for (const b of this.stack) {
      ctx.save();
      ctx.fillStyle = b.color;
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(b.x, b.y, b.w, this.blockHeight, 4);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    // Draw Current Sliding Block
    if (this.currentBlock) {
      ctx.save();
      ctx.fillStyle = this.currentBlock.color;
      ctx.strokeStyle = '#00F2FE';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(this.currentBlock.x, this.currentBlock.y, this.currentBlock.w, this.blockHeight, 4);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    // Draw Falling Slices
    for (const fb of this.fallingBlocks) {
      ctx.save();
      ctx.fillStyle = fb.color;
      ctx.beginPath();
      ctx.roundRect(fb.x, fb.y, fb.w, fb.h, 3);
      ctx.fill();
      ctx.restore();
    }

    super.render(ctx);
    ctx.restore();
  }

  destroy() {
    if (this.actionCleanup) this.actionCleanup();
    if (this.canvas && this.pointerHandler) {
      this.canvas.removeEventListener('pointerdown', this.pointerHandler);
    }
    super.destroy();
  }
}
