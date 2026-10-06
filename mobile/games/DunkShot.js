/**
 * Street Hoops (DunkShot) - Cyberpunk Streetball Arcade for Mobile.
 * Drag backward to aim parabolic laser trajectory and swish glowing magma basketballs!
 */
export class DunkShotGame {
  constructor(canvas, audio, onScore, onGameOver) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.audio = audio;
    this.onScore = onScore;
    this.onGameOver = onGameOver;

    this.width = 400;
    this.height = 600;

    this.ball = {
      x: 100,
      y: 470,
      vx: 0,
      vy: 0,
      radius: 16,
      angle: 0,
      isAirborne: false
    };

    this.hoop = {
      x: 280,
      y: 190,
      w: 68,
      rimH: 8
    };

    this.aimStart = null;
    this.aimCurrent = null;
    this.gravity = 860;
    this.timeLeft = 45;
    this.score = 0;
    this.streak = 0;
    this.isOver = false;

    this.particles = [];
    this.popups = [];
    this.netSway = 0;

    this.handleDown = this.handleDown.bind(this);
    this.handleMove = this.handleMove.bind(this);
    this.handleUp = this.handleUp.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
  }

  start() {
    this.score = 0;
    this.streak = 0;
    this.timeLeft = 45;
    this.isOver = false;
    this.particles = [];
    this.popups = [];
    this.netSway = 0;
    this.resetBall();

    this.canvas.addEventListener('pointerdown', this.handleDown);
    this.canvas.addEventListener('pointermove', this.handleMove);
    window.addEventListener('pointerup', this.handleUp);

    this.canvas.addEventListener('touchstart', this.handleDown, { passive: false });
    this.canvas.addEventListener('touchmove', this.handleTouchMove, { passive: false });
    window.addEventListener('touchend', this.handleUp);
  }

  resetBall() {
    this.ball.x = 95;
    this.ball.y = 475;
    this.ball.vx = 0;
    this.ball.vy = 0;
    this.ball.angle = 0;
    this.ball.isAirborne = false;
    this.aimStart = null;
    this.aimCurrent = null;
  }

  getCanvasCoords(e) {
    const rect = this.canvas.getBoundingClientRect();
    const clientX = (e.touches && e.touches[0]) ? e.touches[0].clientX : e.clientX;
    const clientY = (e.touches && e.touches[0]) ? e.touches[0].clientY : e.clientY;
    return {
      x: ((clientX - rect.left) / rect.width) * this.width,
      y: ((clientY - rect.top) / rect.height) * this.height
    };
  }

  handleDown(e) {
    if (this.ball.isAirborne || this.isOver) return;
    if (e.cancelable) e.preventDefault();
    const pos = this.getCanvasCoords(e);
    this.aimStart = pos;
    this.aimCurrent = pos;
  }

  handleMove(e) {
    if (!this.aimStart || this.ball.isAirborne || this.isOver) return;
    this.aimCurrent = this.getCanvasCoords(e);
  }

  handleTouchMove(e) {
    if (e.cancelable) e.preventDefault();
    this.handleMove(e);
  }

  handleUp(e) {
    if (!this.aimStart || this.ball.isAirborne || this.isOver) return;
    const pos = this.aimCurrent || this.aimStart;
    const dx = this.aimStart.x - pos.x;
    const dy = this.aimStart.y - pos.y;
    const dist = Math.hypot(dx, dy);

    if (dist > 18) {
      // Slingshot forward impulse
      const power = Math.min(dist, 140);
      this.ball.vx = dx * 4.6;
      this.ball.vy = dy * 4.6;
      this.ball.isAirborne = true;
      this.audio.jump();
      if (navigator.vibrate) navigator.vibrate(15);
    }

    this.aimStart = null;
    this.aimCurrent = null;
  }

  update(dt) {
    if (this.isOver) return;

    this.timeLeft -= dt;
    if (this.timeLeft <= 0) {
      this.timeLeft = 0;
      this.isOver = true;
      this.audio.win();
      this.onGameOver(this.score);
      return;
    }

    // Dampen net animation sway
    if (Math.abs(this.netSway) > 0.05) {
      this.netSway *= 0.92;
    } else {
      this.netSway = 0;
    }

    if (this.ball.isAirborne) {
      this.ball.vy += this.gravity * dt;
      this.ball.x += this.ball.vx * dt;
      this.ball.y += this.ball.vy * dt;
      this.ball.angle += (this.ball.vx * 0.015);

      // Trailing fireball spark particles
      if (Math.random() < 0.6) {
        this.particles.push({
          x: this.ball.x + (Math.random() * 8 - 4),
          y: this.ball.y + (Math.random() * 8 - 4),
          vx: -this.ball.vx * 0.15 + (Math.random() * 30 - 15),
          vy: -this.ball.vy * 0.15 + (Math.random() * 30 - 15),
          color: Math.random() < 0.5 ? '#FF5500' : '#FFD700',
          size: Math.random() * 3.5 + 1.5,
          life: 0.3,
          maxLife: 0.3
        });
      }

      const hLeft = this.hoop.x;
      const hRight = this.hoop.x + this.hoop.w;
      const hY = this.hoop.y;

      // Swish detection: ball traveling downwards passing between rim edges
      if (
        this.ball.vy > 0 &&
        this.ball.y >= hY &&
        this.ball.y - this.ball.vy * dt <= hY + 12 &&
        this.ball.x > hLeft + 4 &&
        this.ball.x < hRight - 4
      ) {
        this.streak++;
        const points = this.streak > 2 ? 3 : 2;
        this.score += points;
        this.onScore(this.score);
        this.audio.coin();
        if (navigator.vibrate) navigator.vibrate([25, 40, 25]);

        this.netSway = 14;
        this.spawnFireworks(hLeft + this.hoop.w / 2, hY + 10, this.streak > 2 ? '#FF007A' : '#00F2FE', 24);
        this.popups.push({
          x: hLeft + this.hoop.w / 2,
          y: hY - 15,
          text: this.streak > 2 ? `🔥 +${points} ON FIRE!` : `+${points} SWISH!`,
          color: this.streak > 2 ? '#FF0055' : '#00FF88',
          life: 0.8,
          maxLife: 0.8
        });
      }

      // Rim bounce physics
      if (Math.hypot(this.ball.x - hLeft, this.ball.y - hY) < this.ball.radius + 3) {
        this.ball.vx = -this.ball.vx * 0.72;
        this.ball.vy = -this.ball.vy * 0.58;
        this.audio.hit();
        this.spawnSparks(hLeft, hY, '#FF8800', 8);
      }
      if (Math.hypot(this.ball.x - hRight, this.ball.y - hY) < this.ball.radius + 3) {
        this.ball.vx = -this.ball.vx * 0.72;
        this.ball.vy = -this.ball.vy * 0.58;
        this.audio.hit();
        this.spawnSparks(hRight, hY, '#FF8800', 8);
      }

      // Backboard bounce
      const backboardX = hRight + 4;
      if (
        this.ball.x + this.ball.radius >= backboardX &&
        this.ball.x - this.ball.radius <= backboardX + 10 &&
        this.ball.y >= hY - 70 &&
        this.ball.y <= hY + 15
      ) {
        this.ball.vx = -Math.abs(this.ball.vx) * 0.75;
        this.audio.hit();
        this.spawnSparks(backboardX, this.ball.y, '#00F2FE', 6);
      }

      // Reset when off bottom or out of bounds
      if (this.ball.y > this.height + 40 || this.ball.x > this.width + 60 || this.ball.x < -60) {
        if (!this.isOver) this.resetBall();
      }
    }

    // Update Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
      if (p.life <= 0) this.particles.splice(i, 1);
    }

    // Update Popups
    for (let i = this.popups.length - 1; i >= 0; i--) {
      const pop = this.popups[i];
      pop.y -= 35 * dt;
      pop.life -= dt;
      if (pop.life <= 0) this.popups.splice(i, 1);
    }
  }

  spawnSparks(x, y, color, count = 10) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd = Math.random() * 140 + 50;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        color,
        size: Math.random() * 3 + 1,
        life: 0.32,
        maxLife: 0.32
      });
    }
  }

  spawnFireworks(x, y, color, count = 20) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd = Math.random() * 200 + 80;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        color: Math.random() < 0.4 ? '#FFD700' : color,
        size: Math.random() * 3.5 + 1.5,
        life: 0.45,
        maxLife: 0.45
      });
    }
  }

  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    // 1. Dark Cyber Asphalt Court Background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, this.height);
    bgGrad.addColorStop(0, '#090B14');
    bgGrad.addColorStop(0.55, '#0E1322');
    bgGrad.addColorStop(1, '#080A12');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, this.width, this.height);

    // Subtle Asphalt Grid Lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
    ctx.lineWidth = 1;
    for (let y = 0; y < this.height; y += 28) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.width, y);
      ctx.stroke();
    }

    // Neon Court Keylines & Free Throw Glow Circle
    ctx.save();
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.22)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(100, 480, 52, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255, 0, 122, 0.18)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(280, 190, 140, Math.PI * 0.5, Math.PI * 1.5);
    ctx.stroke();

    // Stencil Graffiti Court Label
    ctx.font = '900 20px "Outfit", sans-serif';
    ctx.fillStyle = 'rgba(0, 242, 254, 0.08)';
    ctx.textAlign = 'center';
    ctx.fillText('STREET HOOPS • NYC', 190, 540);
    ctx.restore();

    // 2. Neon Acrylic Glass Backboard
    const hx = this.hoop.x;
    const hy = this.hoop.y;
    const hw = this.hoop.w;

    // Backboard Pole
    ctx.fillStyle = '#1A1E2E';
    ctx.fillRect(hx + hw + 8, hy - 80, 10, 360);

    // Glass Acrylic Plate
    ctx.save();
    ctx.fillStyle = 'rgba(18, 24, 42, 0.85)';
    ctx.strokeStyle = '#00F2FE';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = '#00F2FE';
    ctx.shadowBlur = 12;
    ctx.fillRect(hx + hw + 2, hy - 74, 9, 96);
    ctx.strokeRect(hx + hw + 2, hy - 74, 9, 96);

    // Inner Target Square
    ctx.strokeStyle = '#FF5500';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#FF5500';
    ctx.shadowBlur = 8;
    ctx.strokeRect(hx + hw + 3, hy - 38, 7, 36);
    ctx.restore();

    // 3. Hanging Neon Chain Net (with dynamic sway ripple)
    ctx.save();
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.75)';
    ctx.lineWidth = 1.6;
    ctx.shadowColor = '#00F2FE';
    ctx.shadowBlur = 6;
    const sway = this.netSway;
    ctx.beginPath();
    ctx.moveTo(hx + 3, hy + 4);
    ctx.quadraticCurveTo(hx + 10 + sway, hy + 24, hx + 14 + sway, hy + 38);
    ctx.lineTo(hx + hw - 14 + sway, hy + 38);
    ctx.quadraticCurveTo(hx + hw - 10 + sway, hy + 24, hx + hw - 3, hy + 4);
    ctx.stroke();

    // Chain net cross-links
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.beginPath();
    ctx.moveTo(hx + 16, hy + 4);
    ctx.lineTo(hx + hw - 18 + sway, hy + 38);
    ctx.moveTo(hx + hw - 16, hy + 4);
    ctx.lineTo(hx + 18 + sway, hy + 38);
    ctx.stroke();
    ctx.restore();

    // 4. Molten Flaming Rim
    ctx.save();
    ctx.strokeStyle = '#FF6B00';
    ctx.lineWidth = 5;
    ctx.shadowColor = '#FF5500';
    ctx.shadowBlur = 14;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(hx - 2, hy);
    ctx.lineTo(hx + hw + 2, hy);
    ctx.stroke();
    ctx.restore();

    // 5. Parabolic Laser Trajectory Simulation (While Aiming)
    if (this.aimStart && this.aimCurrent && !this.ball.isAirborne) {
      const dx = this.aimStart.x - this.aimCurrent.x;
      const dy = this.aimStart.y - this.aimCurrent.y;
      const dist = Math.hypot(dx, dy);

      if (dist > 14) {
        ctx.save();
        const simVx = dx * 4.6;
        const simVy = dy * 4.6;
        let simX = this.ball.x;
        let simY = this.ball.y;
        const steps = 15;
        const dtSim = 0.038;

        for (let i = 0; i < steps; i++) {
          simX += simVx * dtSim;
          simY += (simVy + this.gravity * (i * dtSim)) * dtSim;

          const alpha = 1 - (i / steps);
          ctx.fillStyle = `rgba(0, 242, 254, ${alpha})`;
          ctx.shadowColor = '#00F2FE';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(simX, simY, Math.max(1.5, 4.5 * alpha), 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        // Slingshot pull line
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 85, 0, 0.7)';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(this.ball.x, this.ball.y);
        ctx.lineTo(this.ball.x - dx * 0.4, this.ball.y - dy * 0.4);
        ctx.stroke();
        ctx.restore();
      }
    }

    // 6. Glowing Magma Basketball
    ctx.save();
    ctx.translate(this.ball.x, this.ball.y);
    ctx.rotate(this.ball.angle);

    // Ball Outer Glow
    ctx.shadowColor = '#FF5500';
    ctx.shadowBlur = 16;

    // Magma Radial Gradient
    const ballGrad = ctx.createRadialGradient(-3, -3, 2, 0, 0, this.ball.radius);
    ballGrad.addColorStop(0, '#FFC700');
    ballGrad.addColorStop(0.35, '#FF5500');
    ballGrad.addColorStop(0.85, '#CC2200');
    ballGrad.addColorStop(1, '#660000');
    ctx.fillStyle = ballGrad;
    ctx.beginPath();
    ctx.arc(0, 0, this.ball.radius, 0, Math.PI * 2);
    ctx.fill();

    // Black Rubber Rib Seams
    ctx.strokeStyle = '#220500';
    ctx.lineWidth = 1.6;
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.arc(0, 0, this.ball.radius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-this.ball.radius, 0);
    ctx.lineTo(this.ball.radius, 0);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, this.ball.radius * 0.65, -Math.PI * 0.5, Math.PI * 0.5);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, this.ball.radius * 0.65, Math.PI * 0.5, Math.PI * 1.5);
    ctx.stroke();

    ctx.restore();

    // 7. Render Particles
    for (const p of this.particles) {
      ctx.save();
      const alpha = p.life / p.maxLife;
      ctx.globalAlpha = Math.max(0, alpha);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size || 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 8. Render Floating Score Popups
    for (const pop of this.popups) {
      ctx.save();
      const alpha = pop.life / pop.maxLife;
      ctx.globalAlpha = Math.max(0, alpha);
      ctx.font = '900 16px "Outfit", sans-serif';
      ctx.fillStyle = pop.color;
      ctx.shadowColor = pop.color;
      ctx.shadowBlur = 10;
      ctx.textAlign = 'center';
      ctx.fillText(pop.text, pop.x, pop.y);
      ctx.restore();
    }

    // 9. Cyber Scoreboard HUD
    ctx.save();
    // Clock Pill
    ctx.fillStyle = 'rgba(20, 25, 42, 0.85)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(16, 16, 110, 32, 16);
    ctx.fill();
    ctx.stroke();

    ctx.font = '800 12px "Outfit", sans-serif';
    ctx.fillStyle = '#FFD700';
    ctx.textAlign = 'left';
    ctx.fillText(`⏱️ ${Math.ceil(this.timeLeft)}S`, 30, 36);

    // Score Pill
    ctx.fillStyle = 'rgba(20, 25, 42, 0.85)';
    ctx.beginPath();
    ctx.roundRect(this.width - 126, 16, 110, 32, 16);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#00FF88';
    ctx.textAlign = 'right';
    ctx.fillText(`PTS: ${this.score}`, this.width - 30, 36);
    ctx.restore();

    // Help Hint while waiting to shoot
    if (!this.ball.isAirborne && !this.aimStart && this.score === 0) {
      ctx.save();
      ctx.font = '700 12px "Outfit", sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.textAlign = 'center';
      ctx.fillText('DRAG BACKWARD TO AIM & RELEASE', this.ball.x + 80, this.ball.y + 40);
      ctx.restore();
    }
  }

  destroy() {
    this.canvas.removeEventListener('pointerdown', this.handleDown);
    this.canvas.removeEventListener('pointermove', this.handleMove);
    window.removeEventListener('pointerup', this.handleUp);

    this.canvas.removeEventListener('touchstart', this.handleDown);
    this.canvas.removeEventListener('touchmove', this.handleTouchMove);
    window.removeEventListener('touchend', this.handleUp);

    this.particles = [];
    this.popups = [];
  }
}
