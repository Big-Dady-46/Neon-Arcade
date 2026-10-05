/**
 * HighwayRacer - Fast mobile traffic lane dodger.
 * Tap left/right to steer between 3 lanes, dodge colorful traffic,
 * and collect coin powerups!
 */
export class HighwayRacerMobile {
  constructor(canvas, audio, onScore, onGameOver) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.audio = audio;
    this.onScore = onScore;
    this.onGameOver = onGameOver;

    this.width = 400;
    this.height = 600;

    this.laneW = 100;
    this.lanes = [
      this.width / 2 - this.laneW,
      this.width / 2,
      this.width / 2 + this.laneW
    ];

    this.player = {
      lane: 1,
      x: this.lanes[1],
      y: 480,
      w: 38,
      h: 68,
      speed: 380
    };

    this.traffic = [];
    this.coins = [];
    this.particles = [];
    this.roadOffset = 0;
    this.spawnTimer = 0;
    this.score = 0;
    this.isOver = false;

    this.handleTap = this.handleTap.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  start() {
    this.score = 0;
    this.isOver = false;
    this.player.lane = 1;
    this.player.x = this.lanes[1];
    this.traffic = [];
    this.coins = [];
    this.particles = [];
    this.roadOffset = 0;
    this.spawnTimer = 0;

    this.canvas.addEventListener('pointerdown', this.handleTap);
    window.addEventListener('keydown', this.handleKeyDown);
  }

  handleTap(e) {
    if (this.isOver) return;
    const rect = this.canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * this.width;

    if (x < this.player.x - 20 && this.player.lane > 0) {
      this.player.lane--;
      this.audio.slice();
    } else if (x > this.player.x + 20 && this.player.lane < 2) {
      this.player.lane++;
      this.audio.slice();
    }
  }

  handleKeyDown(e) {
    if (e.code === 'ArrowLeft' && this.player.lane > 0) {
      this.player.lane--;
      this.audio.slice();
    } else if (e.code === 'ArrowRight' && this.player.lane < 2) {
      this.player.lane++;
      this.audio.slice();
    }
  }

  update(dt) {
    if (this.isOver) return;

    // Smooth lane lerp
    const targetX = this.lanes[this.player.lane];
    this.player.x += (targetX - this.player.x) * 0.25;

    // Road scroll & score
    this.roadOffset = (this.roadOffset + 420 * dt) % 50;
    this.score += Math.floor(dt * 15);
    this.onScore(this.score);

    // Spawn traffic
    this.spawnTimer += dt;
    if (this.spawnTimer >= 0.9) {
      this.spawnTimer = 0;
      const lane = Math.floor(Math.random() * 3);
      const colors = ['#F43F5E', '#8B5CF6', '#10B981', '#F59E0B'];
      this.traffic.push({
        lane,
        x: this.lanes[lane],
        y: -80,
        w: 38,
        h: 64,
        speed: Math.random() * 60 + 140,
        color: colors[Math.floor(Math.random() * colors.length)]
      });

      if (Math.random() < 0.4) {
        const cLane = (lane + 1) % 3;
        this.coins.push({
          x: this.lanes[cLane],
          y: -40,
          radius: 10,
          collected: false
        });
      }
    }

    // Update traffic
    for (let i = this.traffic.length - 1; i >= 0; i--) {
      const car = this.traffic[i];
      car.y += (380 - car.speed) * dt;

      // Collision check with player
      if (Math.abs(car.x - this.player.x) < 32 && Math.abs(car.y - this.player.y) < 56) {
        this.isOver = true;
        this.audio.hit();
        this.spawnSparks(this.player.x, this.player.y, '#EF4444', 25);
        this.onGameOver(this.score);
        return;
      }

      if (car.y > this.height + 90) this.traffic.splice(i, 1);
    }

    // Update coins
    for (let i = this.coins.length - 1; i >= 0; i--) {
      const c = this.coins[i];
      c.y += 380 * dt;

      if (!c.collected && Math.abs(c.x - this.player.x) < 28 && Math.abs(c.y - this.player.y) < 34) {
        c.collected = true;
        this.score += 25;
        this.onScore(this.score);
        this.audio.coin();
        this.spawnSparks(c.x, c.y, '#F59E0B', 10);
      }

      if (c.y > this.height + 40) this.coins.splice(i, 1);
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

    // Clean Highway
    ctx.fillStyle = '#F8FAFC';
    ctx.fillRect(0, 0, this.width, this.height);

    const roadL = this.width / 2 - (this.laneW * 1.5);
    const roadR = this.width / 2 + (this.laneW * 1.5);

    // Road Surface
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(roadL, 0, this.laneW * 3, this.height);

    // Curbs
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(roadL, 0);
    ctx.lineTo(roadL, this.height);
    ctx.moveTo(roadR, 0);
    ctx.lineTo(roadR, this.height);
    ctx.stroke();

    // Dashed Lane Dividers
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([20, 20]);
    ctx.lineDashOffset = -this.roadOffset;

    ctx.beginPath();
    ctx.moveTo(this.lanes[0] + this.laneW / 2, 0);
    ctx.lineTo(this.lanes[0] + this.laneW / 2, this.height);
    ctx.moveTo(this.lanes[1] + this.laneW / 2, 0);
    ctx.lineTo(this.lanes[1] + this.laneW / 2, this.height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw Coins
    for (const c of this.coins) {
      if (!c.collected) {
        ctx.save();
        ctx.fillStyle = '#F59E0B';
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // Draw Traffic Cars
    for (const car of this.traffic) {
      this.drawCar(ctx, car.x, car.y, car.w, car.h, car.color);
    }

    // Draw Player Car (Blue/Indigo)
    this.drawCar(ctx, this.player.x, this.player.y, this.player.w, this.player.h, '#4F46E5', true);

    // Particles
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

  drawCar(ctx, x, y, w, h, color, isPlayer = false) {
    ctx.save();
    ctx.translate(x, y);

    // Body
    ctx.fillStyle = color;
    ctx.shadowColor = 'rgba(0,0,0,0.1)';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.roundRect(-w / 2, -h / 2, w, h, 8);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Windshield
    ctx.fillStyle = '#1E293B';
    ctx.beginPath();
    ctx.roundRect(-w / 2 + 4, isPlayer ? -h / 2 + 14 : -h / 2 + 20, w - 8, 16, 4);
    ctx.fill();

    // Lights
    ctx.fillStyle = isPlayer ? '#FFFFFF' : '#F59E0B';
    ctx.fillRect(-w / 2 + 2, isPlayer ? -h / 2 : h / 2 - 3, 6, 3);
    ctx.fillRect(w / 2 - 8, isPlayer ? -h / 2 : h / 2 - 3, 6, 3);
    ctx.restore();
  }

  destroy() {
    this.canvas.removeEventListener('pointerdown', this.handleTap);
    window.removeEventListener('keydown', this.handleKeyDown);
    this.particles = [];
  }
}
