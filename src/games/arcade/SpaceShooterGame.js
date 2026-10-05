import { BaseGame } from '../../engine/BaseGame.js';

/**
 * SpaceShooterGame - Galaxy Defender retro arcade vertical shmup.
 * Features player starship, laser cannons, waves of alien invaders,
 * explosive particle bursts, and progressive wave difficulty.
 */
export class SpaceShooterGame extends BaseGame {
  constructor(session, canvas, input, audio) {
    super(session, canvas, input, audio);
    this.width = 600;
    this.height = 700;

    this.player = {
      x: 300,
      y: 620,
      speed: 460,
      w: 42,
      h: 42,
      hp: 3
    };

    this.lasers = [];
    this.enemies = [];
    this.stars = [];
    this.fireTimer = 0;
    this.spawnTimer = 0;
    this.wave = 1;
  }

  create() {
    super.create();
    this.player.x = this.width / 2;
    this.player.y = this.height - 80;
    this.player.hp = 3;
    this.lasers = [];
    this.enemies = [];
    this.setScore(0);
    this.wave = 1;

    // Generate starfield
    this.stars = [];
    for (let i = 0; i < 60; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        speed: Math.random() * 80 + 30,
        size: Math.random() * 2 + 1
      });
    }
  }

  update(deltaTime) {
    super.update(deltaTime);
    if (this.isGameOver || this.isPaused) return;

    // Move starfield
    for (const s of this.stars) {
      s.y += s.speed * deltaTime;
      if (s.y > this.height) {
        s.y = 0;
        s.x = Math.random() * this.width;
      }
    }

    // Player Movement
    if (this.input.isActionActive('left')) {
      this.player.x -= this.player.speed * deltaTime;
    }
    if (this.input.isActionActive('right')) {
      this.player.x += this.player.speed * deltaTime;
    }
    if (this.input.isActionActive('up')) {
      this.player.y -= this.player.speed * deltaTime;
    }
    if (this.input.isActionActive('down')) {
      this.player.y += this.player.speed * deltaTime;
    }

    // Touch / Pointer Steering
    if (this.input.pointer.isDown && this.input.pointer.canvasX > 0) {
      this.player.x += (this.input.pointer.canvasX - this.player.x) * 0.18;
      this.player.y += (this.input.pointer.canvasY - this.player.y) * 0.18;
    }

    this.player.x = Math.max(25, Math.min(this.width - 25, this.player.x));
    this.player.y = Math.max(100, Math.min(this.height - 35, this.player.y));

    // Rapid Laser Fire
    this.fireTimer += deltaTime;
    if (this.fireTimer >= 0.18) {
      this.fireTimer = 0;
      this.lasers.push({
        x: this.player.x - 12,
        y: this.player.y - 20,
        vy: -700
      });
      this.lasers.push({
        x: this.player.x + 12,
        y: this.player.y - 20,
        vy: -700
      });
      if (this.audio) this.audio.playLaser();
    }

    // Update Lasers
    for (let i = this.lasers.length - 1; i >= 0; i--) {
      const l = this.lasers[i];
      l.y += l.vy * deltaTime;
      if (l.y < -20) this.lasers.splice(i, 1);
    }

    // Spawn Alien Enemies
    this.spawnTimer += deltaTime;
    if (this.spawnTimer >= Math.max(0.45, 1.2 - this.wave * 0.1)) {
      this.spawnTimer = 0;
      this.enemies.push({
        x: Math.random() * (this.width - 60) + 30,
        y: -30,
        vx: (Math.random() - 0.5) * 80,
        vy: Math.random() * 60 + 130 + this.wave * 15,
        hp: Math.random() < 0.25 ? 3 : 1,
        color: Math.random() < 0.3 ? '#EC4899' : '#00F2FE'
      });
    }

    // Update Enemies & Collision checks
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const e = this.enemies[i];
      e.y += e.vy * deltaTime;
      e.x += e.vx * deltaTime;

      if (e.x < 20 || e.x > this.width - 20) e.vx = -e.vx;

      // Laser vs Enemy
      for (let j = this.lasers.length - 1; j >= 0; j--) {
        const l = this.lasers[j];
        if (Math.hypot(e.x - l.x, e.y - l.y) < 22) {
          this.lasers.splice(j, 1);
          e.hp--;
          this.spawnParticles(l.x, l.y, 6, '#00F2FE', 90, 2);

          if (e.hp <= 0) {
            this.enemies.splice(i, 1);
            this.addScore(25);
            if (this.audio) this.audio.playExplosion();
            this.spawnParticles(e.x, e.y, 18, e.color, 150, 3.5);
            this.shake(0.12, 4);
            break;
          }
        }
      }

      // Enemy vs Player collision
      if (Math.hypot(e.x - this.player.x, e.y - this.player.y) < 32) {
        this.enemies.splice(i, 1);
        this.player.hp--;
        this.shake(0.25, 10);
        if (this.audio) this.audio.playHit();
        this.spawnParticles(this.player.x, this.player.y, 20, '#EC4899', 180, 4);

        if (this.player.hp <= 0) {
          this.triggerGameOver(false);
          return;
        }
      }

      // Remove passed enemies
      if (e.y > this.height + 40) {
        this.enemies.splice(i, 1);
      }
    }
  }

  render(ctx) {
    ctx.save();
    ctx.translate(this.shakeOffset.x, this.shakeOffset.y);
    this.clearCanvas('#070912');

    // Starfield
    ctx.fillStyle = '#FFFFFF';
    for (const s of this.stars) {
      ctx.fillRect(s.x, s.y, s.size, s.size);
    }

    // Draw Lasers
    ctx.fillStyle = '#00F2FE';
    for (const l of this.lasers) {
      ctx.fillRect(l.x - 2, l.y, 4, 14);
    }

    // Draw Enemies
    for (const e of this.enemies) {
      ctx.save();
      ctx.translate(e.x, e.y);
      ctx.fillStyle = e.color;
      ctx.beginPath();
      ctx.moveTo(0, 18);
      ctx.lineTo(16, -12);
      ctx.lineTo(0, -6);
      ctx.lineTo(-16, -12);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    // Draw Player Ship
    ctx.save();
    ctx.translate(this.player.x, this.player.y);
    ctx.fillStyle = '#00F2FE';
    ctx.beginPath();
    ctx.moveTo(0, -22);
    ctx.lineTo(20, 16);
    ctx.lineTo(0, 8);
    ctx.lineTo(-20, 16);
    ctx.closePath();
    ctx.fill();

    // Jet Engine Exhaust Flame
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.moveTo(-6, 12);
    ctx.lineTo(0, 24 + Math.random() * 8);
    ctx.lineTo(6, 12);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Draw Shields / Lives HUD on Canvas
    ctx.save();
    ctx.font = 'bold 15px Orbitron, sans-serif';
    ctx.fillStyle = '#9CA3AF';
    ctx.fillText('SHIELDS:', 20, 30);
    for (let i = 0; i < this.player.hp; i++) {
      ctx.fillStyle = '#00F2FE';
      ctx.fillRect(115 + i * 20, 18, 14, 14);
    }
    ctx.restore();

    super.render(ctx);
    ctx.restore();
  }
}
