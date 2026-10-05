import { BaseGame } from '../../engine/BaseGame.js';

/**
 * HighwayRacerGame - Neon Highway Traffic Racer.
 * Features 3-lane highway scrolling, oncoming AI traffic, nitro boost,
 * near-miss scoring bonuses, particle exhaust trails, and explosive crash physics.
 */
export class HighwayRacerGame extends BaseGame {
  constructor(session, canvas, input, audio) {
    super(session, canvas, input, audio);
    this.width = 540;
    this.height = 700;

    this.laneWidth = 130;
    this.laneCenters = [
      this.width / 2 - this.laneWidth,
      this.width / 2,
      this.width / 2 + this.laneWidth
    ];

    this.player = {
      x: this.width / 2,
      y: 560,
      w: 44,
      h: 76,
      currentLane: 1,
      targetX: this.width / 2,
      speed: 380,
      isBoosting: false
    };

    this.roadOffset = 0;
    this.traffic = [];
    this.spawnTimer = 0;
    this.distance = 0;
    this.trafficSpeed = 160;
  }

  create() {
    super.create();
    this.player.currentLane = 1;
    this.player.x = this.laneCenters[1];
    this.player.targetX = this.laneCenters[1];
    this.player.y = 560;
    this.player.isBoosting = false;

    this.roadOffset = 0;
    this.traffic = [];
    this.spawnTimer = 0;
    this.distance = 0;
    this.trafficSpeed = 160;
    this.setScore(0);
  }

  update(deltaTime) {
    super.update(deltaTime);
    if (this.isGameOver || this.isPaused) return;

    // Nitro Boost
    this.player.isBoosting = this.input.isActionActive('up') || this.input.isActionActive('action1');
    const currentSpeed = this.player.isBoosting ? 650 : 420;

    // Distance progression
    this.distance += (currentSpeed * deltaTime) / 10;
    this.addScore(Math.floor(deltaTime * (this.player.isBoosting ? 25 : 10)));

    // Road scroll
    this.roadOffset = (this.roadOffset + currentSpeed * deltaTime) % 60;

    // Steering - Lane Switch via Left / Right
    if (this.input.isActionJustPressed('left')) {
      if (this.player.currentLane > 0) {
        this.player.currentLane--;
        this.player.targetX = this.laneCenters[this.player.currentLane];
        if (this.audio) this.audio.playBlip(500, 0.04);
      }
    } else if (this.input.isActionJustPressed('right')) {
      if (this.player.currentLane < 2) {
        this.player.currentLane++;
        this.player.targetX = this.laneCenters[this.player.currentLane];
        if (this.audio) this.audio.playBlip(500, 0.04);
      }
    }

    // Direct pointer / touch steering across lanes
    if (this.input.pointer.isDown && this.input.pointer.canvasX > 0) {
      const clickX = this.input.pointer.canvasX;
      let closestLane = 1;
      let minDist = 9999;
      this.laneCenters.forEach((center, idx) => {
        const d = Math.abs(center - clickX);
        if (d < minDist) {
          minDist = d;
          closestLane = idx;
        }
      });
      if (closestLane !== this.player.currentLane) {
        this.player.currentLane = closestLane;
        this.player.targetX = this.laneCenters[closestLane];
      }
    }

    // Smooth lerp to target lane
    this.player.x += (this.player.targetX - this.player.x) * 0.22;

    // Exhaust particles
    const exhaustColor = this.player.isBoosting ? '#FFD700' : '#00F2FE';
    this.spawnParticles(this.player.x - 10, this.player.y + 36, 1, exhaustColor, 80, 2);
    this.spawnParticles(this.player.x + 10, this.player.y + 36, 1, exhaustColor, 80, 2);

    // Spawn traffic
    this.spawnTimer += deltaTime;
    const interval = Math.max(0.65, 1.4 - (this.score / 2500) * 0.3);
    if (this.spawnTimer >= interval) {
      this.spawnTimer = 0;
      this.spawnTrafficCar();
    }

    // Update traffic
    for (let i = this.traffic.length - 1; i >= 0; i--) {
      const car = this.traffic[i];
      // Relative motion: road moving at currentSpeed, car moving forward at trafficSpeed
      const relativeVy = currentSpeed - car.speed;
      car.y += relativeVy * deltaTime;

      // Near-miss check
      if (!car.nearMissed && Math.abs(car.y - this.player.y) < 30 && Math.abs(car.x - this.player.x) < 80) {
        car.nearMissed = true;
        this.addScore(30);
        if (this.audio) this.audio.playCoin();
        this.spawnParticles(this.player.x, this.player.y, 10, '#FFD700', 100, 2);
      }

      // Collision check with player
      const collisionX = Math.abs(car.x - this.player.x) < (car.w + this.player.w) * 0.42;
      const collisionY = Math.abs(car.y - this.player.y) < (car.h + this.player.h) * 0.42;

      if (collisionX && collisionY) {
        this.shake(0.4, 14);
        if (this.audio) {
          this.audio.playHit();
          this.audio.playExplosion();
        }
        this.spawnParticles(this.player.x, this.player.y, 35, '#EC4899', 200, 4);
        this.spawnParticles(car.x, car.y, 25, '#FFD700', 180, 3.5);
        this.triggerGameOver(false);
        return;
      }

      // Remove passed traffic cars
      if (car.y > this.height + 100 || car.y < -200) {
        this.traffic.splice(i, 1);
      }
    }
  }

  spawnTrafficCar() {
    const lane = Math.floor(Math.random() * 3);
    // Don't spawn if there's already a car right at the top of that lane
    if (this.traffic.some(c => c.lane === lane && c.y < 80)) {
      return;
    }

    const colors = ['#EC4899', '#8B5CF6', '#FBBF24', '#10B981', '#EF4444'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    this.traffic.push({
      lane,
      x: this.laneCenters[lane],
      y: -90,
      w: 42,
      h: 72,
      speed: Math.random() * 60 + 120,
      color,
      nearMissed: false
    });
  }

  render(ctx) {
    ctx.save();
    ctx.translate(this.shakeOffset.x, this.shakeOffset.y);
    this.clearCanvas('#06080E');

    const roadLeft = this.width / 2 - (this.laneWidth * 1.5);
    const roadRight = this.width / 2 + (this.laneWidth * 1.5);

    // Road Asphalt
    ctx.fillStyle = '#111524';
    ctx.fillRect(roadLeft, 0, this.laneWidth * 3, this.height);

    // Road Glowing Neon Borders
    ctx.strokeStyle = '#00F2FE';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(roadLeft, 0);
    ctx.lineTo(roadLeft, this.height);
    ctx.stroke();

    ctx.strokeStyle = '#EC4899';
    ctx.beginPath();
    ctx.moveTo(roadRight, 0);
    ctx.lineTo(roadRight, this.height);
    ctx.stroke();

    // Dashed Lane Dividers
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([25, 25]);
    ctx.lineDashOffset = -this.roadOffset;

    // Divider 1
    ctx.beginPath();
    ctx.moveTo(this.laneCenters[0] + this.laneWidth / 2, 0);
    ctx.lineTo(this.laneCenters[0] + this.laneWidth / 2, this.height);
    ctx.stroke();

    // Divider 2
    ctx.beginPath();
    ctx.moveTo(this.laneCenters[1] + this.laneWidth / 2, 0);
    ctx.lineTo(this.laneCenters[1] + this.laneWidth / 2, this.height);
    ctx.stroke();

    ctx.setLineDash([]); // Reset line dash

    // Draw Traffic Cars
    for (const car of this.traffic) {
      this.drawVehicle(ctx, car.x, car.y, car.w, car.h, car.color, false);
    }

    // Draw Player Sports Car
    this.drawVehicle(ctx, this.player.x, this.player.y, this.player.w, this.player.h, '#00F2FE', true);

    // Speedometer HUD on canvas
    ctx.save();
    ctx.font = 'bold 15px Orbitron, sans-serif';
    ctx.fillStyle = this.player.isBoosting ? '#FFD700' : '#00F2FE';
    const mph = this.player.isBoosting ? 185 : 120;
    ctx.fillText(`SPEED: ${mph} MPH ${this.player.isBoosting ? '⚡ NITRO' : ''}`, 22, 34);

    ctx.fillStyle = '#9CA3AF';
    ctx.fillText(`DIST: ${Math.floor(this.distance)}M`, this.width - 150, 34);
    ctx.restore();

    super.render(ctx);
    ctx.restore();
  }

  drawVehicle(ctx, x, y, w, h, color, isPlayer) {
    ctx.save();
    ctx.translate(x, y);

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(-w / 2 - 2, -h / 2 + 6, w + 4, h);

    // Car Body
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(-w / 2, -h / 2, w, h, 8);
    ctx.fill();

    // Windshield (Black / Dark tint)
    ctx.fillStyle = '#080B14';
    ctx.beginPath();
    ctx.roundRect(-w / 2 + 5, isPlayer ? -h / 2 + 16 : -h / 2 + 24, w - 10, 18, 4);
    ctx.fill();

    // Headlights / Taillights
    if (isPlayer) {
      // White/Cyan Headlights at top
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(-w / 2 + 3, -h / 2, 7, 4);
      ctx.fillRect(w / 2 - 10, -h / 2, 7, 4);

      // Red Taillights at bottom
      ctx.fillStyle = '#EF4444';
      ctx.fillRect(-w / 2 + 4, h / 2 - 4, 7, 4);
      ctx.fillRect(w / 2 - 11, h / 2 - 4, 7, 4);
    } else {
      // Traffic coming towards player: headlights at bottom
      ctx.fillStyle = '#FFD700';
      ctx.fillRect(-w / 2 + 3, h / 2 - 4, 7, 4);
      ctx.fillRect(w / 2 - 10, h / 2 - 4, 7, 4);
    }

    ctx.restore();
  }
}
