/**
 * WhackAMole - Fast-paced reflex target popping game.
 * 9 interactive holes on a modern clean board.
 * Tap popup bots before they vanish to build combo multipliers!
 */
export class WhackAMoleGame {
  constructor(canvas, audio, onScore, onGameOver) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.audio = audio;
    this.onScore = onScore;
    this.onGameOver = onGameOver;

    this.width = 400;
    this.height = 500;
    this.score = 0;
    this.combo = 0;
    this.timeLeft = 35;
    this.isOver = false;

    this.holes = [];
    this.particles = [];
    this.spawnTimer = 0;

    this.handleTap = this.handleTap.bind(this);
  }

  start() {
    this.score = 0;
    this.combo = 0;
    this.timeLeft = 35;
    this.isOver = false;
    this.particles = [];
    this.spawnTimer = 0;

    // Build 3x3 hole coordinates
    this.holes = [];
    const size = 80;
    const gap = 30;
    const startX = (this.width - (3 * size + 2 * gap)) / 2;
    const startY = 120;

    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        this.holes.push({
          x: startX + c * (size + gap) + size / 2,
          y: startY + r * (size + gap) + size / 2,
          radius: size / 2,
          active: false,
          timer: 0,
          type: 'regular' // regular or golden
        });
      }
    }

    this.canvas.addEventListener('pointerdown', this.handleTap);
  }

  handleTap(e) {
    if (this.isOver) return;
    const rect = this.canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * this.width;
    const y = ((e.clientY - rect.top) / rect.height) * this.height;

    let hit = false;
    for (const h of this.holes) {
      if (h.active) {
        const dist = Math.hypot(x - h.x, y - h.y);
        if (dist <= h.radius + 10) {
          hit = true;
          h.active = false;
          this.combo++;
          const pts = h.type === 'golden' ? 25 : 10;
          this.score += pts + this.combo * 2;
          this.onScore(this.score);
          this.audio.pop();
          this.spawnSparks(h.x, h.y, h.type === 'golden' ? '#F59E0B' : '#4F46E5');
          break;
        }
      }
    }

    if (!hit) {
      this.combo = 0; // Reset combo on miss
    }
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

    // Spawn moles
    this.spawnTimer += dt;
    if (this.spawnTimer >= 0.75) {
      this.spawnTimer = 0;
      // Pick random inactive hole
      const inactive = this.holes.filter(h => !h.active);
      if (inactive.length > 0) {
        const pick = inactive[Math.floor(Math.random() * inactive.length)];
        pick.active = true;
        pick.timer = 1.1; // stays up for 1.1 seconds
        pick.type = Math.random() < 0.25 ? 'golden' : 'regular';
      }
    }

    // Update active timers
    for (const h of this.holes) {
      if (h.active) {
        h.timer -= dt;
        if (h.timer <= 0) {
          h.active = false;
          this.combo = 0;
        }
      }
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

  spawnSparks(x, y, color) {
    for (let i = 0; i < 14; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd = Math.random() * 120 + 50;
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

    // Clean white surface
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, this.width, this.height);

    // Top Stats Bar
    ctx.save();
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.fillStyle = '#64748B';
    ctx.fillText(`TIME: ${Math.ceil(this.timeLeft)}S`, 30, 45);

    if (this.combo > 1) {
      ctx.fillStyle = '#10B981';
      ctx.fillText(`${this.combo}X COMBO!`, this.width / 2 - 40, 45);
    }

    ctx.fillStyle = '#4F46E5';
    ctx.textAlign = 'right';
    ctx.fillText(`SCORE: ${this.score}`, this.width - 30, 45);
    ctx.restore();

    // Board Surface Panel
    ctx.save();
    ctx.fillStyle = '#F8FAFC';
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(20, 75, this.width - 40, 390, 24);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Draw Holes and Popup Characters
    for (const h of this.holes) {
      // Hole Base
      ctx.save();
      ctx.fillStyle = '#CBD5E1';
      ctx.beginPath();
      ctx.ellipse(h.x, h.y + 12, h.radius, h.radius * 0.55, 0, 0, Math.PI * 2);
      ctx.fill();

      // Deep shadow inside hole
      ctx.fillStyle = '#64748B';
      ctx.beginPath();
      ctx.ellipse(h.x, h.y + 8, h.radius * 0.85, h.radius * 0.42, 0, 0, Math.PI * 2);
      ctx.fill();

      // Popup Target
      if (h.active) {
        const isGold = h.type === 'golden';
        ctx.fillStyle = isGold ? '#F59E0B' : '#6366F1';
        ctx.shadowColor = isGold ? 'rgba(245, 158, 11, 0.4)' : 'rgba(99, 102, 241, 0.35)';
        ctx.shadowBlur = 12;

        ctx.beginPath();
        ctx.arc(h.x, h.y - 10, h.radius * 0.72, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Eyes
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(h.x - 10, h.y - 14, 6, 0, Math.PI * 2);
        ctx.arc(h.x + 10, h.y - 14, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#0F172A';
        ctx.beginPath();
        ctx.arc(h.x - 10, h.y - 14, 3, 0, Math.PI * 2);
        ctx.arc(h.x + 10, h.y - 14, 3, 0, Math.PI * 2);
        ctx.fill();

        // Cheerful Smile
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(h.x, h.y - 4, 8, 0.2, Math.PI - 0.2);
        ctx.stroke();
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
    this.canvas.removeEventListener('pointerdown', this.handleTap);
    this.particles = [];
  }
}
