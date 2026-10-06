/**
 * ColorBounce - Tap-to-jump color matching reflex game.
 * Tap to bounce upward through rotating color rings.
 * Only cross segments matching your ball's current color!
 */
export class ColorBounceGame {
  constructor(canvas, audio, onScore, onGameOver) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.audio = audio;
    this.onScore = onScore;
    this.onGameOver = onGameOver;

    this.width = 400;
    this.height = 600;

    this.colors = ['#0284C7', '#F59E0B', '#A855F7', '#F43F5E'];
    this.ball = {
      x: this.width / 2,
      y: 460,
      vy: 0,
      radius: 12,
      color: this.colors[0],
      gravity: 920,
      jumpForce: -340
    };

    this.cameraY = 0;
    this.obstacles = [];
    this.colorSwitchers = [];
    this.particles = [];
    this.score = 0;
    this.isOver = false;

    this.handleTap = this.handleTap.bind(this);
  }

  start() {
    this.score = 0;
    this.isOver = false;
    this.cameraY = 0;
    this.ball.y = 460;
    this.ball.vy = 0;
    this.ball.color = this.colors[Math.floor(Math.random() * this.colors.length)];
    this.particles = [];

    this.obstacles = [];
    this.colorSwitchers = [];

    // Generate rings
    for (let i = 0; i < 6; i++) {
      const ringY = 280 - i * 260;
      this.obstacles.push({
        y: ringY,
        radius: 70,
        angle: 0,
        speed: (Math.random() > 0.5 ? 1 : -1) * (1.6 + i * 0.1),
        thickness: 14,
        passed: false
      });

      this.colorSwitchers.push({
        y: ringY - 130,
        collected: false
      });
    }

    this.canvas.addEventListener('pointerdown', this.handleTap);
    this.canvas.addEventListener('touchstart', (e) => {
      if (e.cancelable) e.preventDefault();
      this.handleTap();
    }, { passive: false });
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') this.handleTap();
    });
  }

  handleTap() {
    if (this.isOver) return;
    this.ball.vy = this.ball.jumpForce;
    this.audio.jump();
    this.spawnSparks(this.ball.x, this.ball.y + 10, this.ball.color, 6);
  }

  update(dt) {
    if (this.isOver) return;

    // Apply physics
    this.ball.vy += this.ball.gravity * dt;
    this.ball.y += this.ball.vy * dt;

    // Camera follow (scrolls up with ball)
    const targetCamY = Math.max(0, 360 - this.ball.y);
    if (targetCamY > this.cameraY) {
      this.cameraY += (targetCamY - this.cameraY) * 0.2;
    }

    // Floor collision
    if (this.ball.y > 580) {
      this.audio.hit();
      this.isOver = true;
      this.onGameOver(this.score);
      return;
    }

    // Update rotating rings
    for (const obs of this.obstacles) {
      obs.angle += obs.speed * dt;

      // Check ball passing ring center
      if (!obs.passed && this.ball.y < obs.y) {
        obs.passed = true;
        this.score += 10;
        this.onScore(this.score);
        this.audio.coin();
      }

      // Check collision with ring segments (Top and Bottom edges of ring)
      const distToRingCenter = Math.abs(this.ball.y - obs.y);
      if (distToRingCenter >= obs.radius - obs.thickness && distToRingCenter <= obs.radius + obs.thickness) {
        // Find which quadrant/color the ball is intersecting
        const hitAngle = Math.atan2(this.ball.y - obs.y, 0); // At x = 0 (ball is always center)
        const relAngle = ((hitAngle - obs.angle) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
        const segmentIdx = Math.floor(relAngle / (Math.PI / 2)) % 4;
        const segmentColor = this.colors[segmentIdx];

        if (segmentColor !== this.ball.color) {
          // Wrong color -> Game Over!
          this.audio.hit();
          this.spawnSparks(this.ball.x, this.ball.y, this.ball.color, 24);
          this.isOver = true;
          this.onGameOver(this.score);
          return;
        }
      }
    }

    // Check color switcher pickups
    for (const cs of this.colorSwitchers) {
      if (!cs.collected && Math.abs(this.ball.y - cs.y) < 22) {
        cs.collected = true;
        this.audio.pop();
        // Pick random different color
        const available = this.colors.filter(c => c !== this.ball.color);
        this.ball.color = available[Math.floor(Math.random() * available.length)];
        this.spawnSparks(this.ball.x, cs.y, this.ball.color, 16);
      }
    }

    // Dynamic infinite generation of rings
    const highestObs = this.obstacles[this.obstacles.length - 1];
    if (highestObs && this.ball.y < highestObs.y + 400) {
      const nextY = highestObs.y - 260;
      this.obstacles.push({
        y: nextY,
        radius: 70,
        angle: 0,
        speed: (Math.random() > 0.5 ? 1 : -1) * (1.8 + Math.random() * 0.4),
        thickness: 14,
        passed: false
      });
      this.colorSwitchers.push({
        y: nextY - 130,
        collected: false
      });
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

    // Clean White theme background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.save();
    ctx.translate(0, this.cameraY);

    // Draw Obstacle Rings
    for (const obs of this.obstacles) {
      ctx.save();
      ctx.translate(this.width / 2, obs.y);
      ctx.rotate(obs.angle);

      // 4 Color Arcs (90 degrees each)
      for (let i = 0; i < 4; i++) {
        ctx.strokeStyle = this.colors[i];
        ctx.lineWidth = obs.thickness;
        ctx.beginPath();
        ctx.arc(0, 0, obs.radius, i * (Math.PI / 2), (i + 1) * (Math.PI / 2));
        ctx.stroke();
      }
      ctx.restore();
    }

    // Draw Color Switchers
    for (const cs of this.colorSwitchers) {
      if (!cs.collected) {
        ctx.save();
        ctx.translate(this.width / 2, cs.y);
        // Small 4-color prism ball
        for (let i = 0; i < 4; i++) {
          ctx.fillStyle = this.colors[i];
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.arc(0, 0, 11, i * (Math.PI / 2), (i + 1) * (Math.PI / 2));
          ctx.fill();
        }
        ctx.restore();
      }
    }

    // Draw Bouncing Player Ball
    ctx.save();
    ctx.fillStyle = this.ball.color;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 4;
    ctx.beginPath();
    ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
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
