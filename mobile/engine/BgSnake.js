import { mobileAudio } from './Audio.js';

/**
 * BgSnake - Autonomous & Interactive playful background snake.
 * Slithers smoothly across the full viewport, hunting glowing fruit dots,
 * with cute animated eyes, blinking, flicking tongue, confetti snacks,
 * and floating score popups.
 * 
 * INTERACTIVE "FEED ME" FEATURE:
 * Clicking / tapping anywhere on empty background drops an instant golden snack!
 * The snake detects it with excitement, speeds over, and gobbles it up!
 */
export class BgSnake {
  constructor(canvas, onFeed = null) {
    if (!canvas) return;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.onFeed = onFeed;

    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    // Snake properties
    this.segmentCount = 30;
    this.segmentDist = 14;
    this.headRadius = 13;
    this.baseSpeed = 155;
    this.speed = this.baseSpeed;
    this.turnSpeed = 3.4;

    this.pos = { x: this.width * 0.35, y: this.height * 0.45 };
    this.angle = Math.random() * Math.PI * 2;
    this.wiggleT = 0;
    this.segments = [];

    // Excitement & speed boost
    this.isExcited = false;
    this.speedBoostTimer = 0;

    // Fruits & interaction
    this.foods = [];
    this.maxFoods = 6;
    this.particles = [];
    this.floatingTexts = [];
    this.ripples = [];
    this.target = null;
    this.fruitsEaten = 0;

    // Cute facial animation
    this.blinkTimer = 0;
    this.isBlinking = false;
    this.tongueTimer = 0;
    this.tongueExt = 0;

    // Mouse influence
    this.mouse = { x: -999, y: -999, active: false };

    this.resize = this.resize.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onBackgroundClick = this.onBackgroundClick.bind(this);
    this.onVisibilityChange = this.onVisibilityChange.bind(this);
    this.rafId = null;
    this.lastTime = performance.now();
    this.isRunning = true;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', this.resize);
    window.addEventListener('pointermove', this.onMouseMove, { passive: true });
    window.addEventListener('pointerdown', this.onBackgroundClick);
    document.addEventListener('visibilitychange', this.onVisibilityChange);

    // Initial snake body trailing behind head
    this.segments = [];
    for (let i = 0; i < this.segmentCount; i++) {
      this.segments.push({
        x: this.pos.x - i * this.segmentDist,
        y: this.pos.y
      });
    }

    // Spawn initial fruits
    for (let i = 0; i < this.maxFoods; i++) {
      this.spawnFood();
    }
    this.pickNewTarget();

    // Start 60 FPS animation loop
    this.lastTime = performance.now();
    const tick = (now) => {
      if (!this.isRunning) return;
      const dt = Math.min(0.08, (now - this.lastTime) / 1000);
      this.lastTime = now;

      this.update(dt);
      this.render();

      this.rafId = requestAnimationFrame(tick);
    };
    this.rafId = requestAnimationFrame(tick);
  }

  onVisibilityChange() {
    if (document.hidden) {
      this.isRunning = false;
    } else {
      this.isRunning = true;
      this.lastTime = performance.now();
      this.rafId = requestAnimationFrame((now) => {
        this.lastTime = now;
        this.update(0.016);
        this.render();
      });
    }
  }

  onMouseMove(e) {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
    this.mouse.active = true;
  }

  onBackgroundClick(e) {
    // Only drop food if user didn't click inside an interactive element
    const target = e.target;
    if (
      target.closest('button') ||
      target.closest('a') ||
      target.closest('input') ||
      target.closest('.mobile-game-card') ||
      target.closest('.spotlight-hero-card') ||
      target.closest('.cat-pill') ||
      target.closest('.game-player-modal.active')
    ) {
      return;
    }

    this.dropSnack(e.clientX, e.clientY);
  }

  dropSnack(x, y) {
    // Add ripple animation at click point
    this.ripples.push({ x, y, r: 5, maxR: 45, alpha: 0.8 });

    // Spawn special golden star snack
    const specialSnack = {
      x,
      y,
      radius: 11,
      isSpecial: true,
      type: { emoji: '⭐', color: '#F59E0B', glow: 'rgba(245, 158, 11, 0.75)', name: 'Golden Star' },
      pulse: 0,
      scale: 0.1
    };

    // Prioritize this food for the snake
    this.foods.unshift(specialSnack);
    this.target = specialSnack;
    this.isExcited = true;
    this.speedBoostTimer = 2.4;
    mobileAudio.pop();

    // Floating prompt
    this.floatingTexts.push({
      x,
      y: y - 18,
      text: '⭐ SNACK DROPPED!',
      color: '#F59E0B',
      life: 0.9,
      maxLife: 0.9
    });
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(this.dpr, this.dpr);
  }

  spawnFood() {
    const pad = 60;
    const fruitTypes = [
      { emoji: '🍎', color: '#EF4444', glow: 'rgba(239, 68, 68, 0.4)', name: 'Apple' },
      { emoji: '⭐', color: '#F59E0B', glow: 'rgba(245, 158, 11, 0.45)', name: 'Star' },
      { emoji: '🥝', color: '#10B981', glow: 'rgba(16, 185, 129, 0.4)', name: 'Kiwi' },
      { emoji: '🫐', color: '#3B82F6', glow: 'rgba(59, 130, 246, 0.4)', name: 'Berry' },
      { emoji: '🍇', color: '#8B5CF6', glow: 'rgba(139, 92, 246, 0.4)', name: 'Grape' },
      { emoji: '🍊', color: '#F97316', glow: 'rgba(249, 115, 22, 0.4)', name: 'Orange' }
    ];

    const type = fruitTypes[Math.floor(Math.random() * fruitTypes.length)];
    const x = Math.random() * (this.width - pad * 2) + pad;
    const y = Math.random() * (this.height - pad * 2) + pad;

    this.foods.push({
      x,
      y,
      radius: 8,
      isSpecial: false,
      type,
      pulse: Math.random() * Math.PI * 2,
      scale: 0.1
    });
  }

  pickNewTarget() {
    if (this.foods.length === 0) return;
    // Check if any special food is present
    const special = this.foods.find(f => f.isSpecial);
    if (special) {
      this.target = special;
      return;
    }

    let closest = this.foods[0];
    let minDist = 999999;
    for (const f of this.foods) {
      const d = Math.hypot(f.x - this.pos.x, f.y - this.pos.y);
      if (d < minDist) {
        minDist = d;
        closest = f;
      }
    }
    this.target = closest;
  }

  update(dt) {
    this.wiggleT += dt * 8.0;

    // Speed boost timer
    if (this.speedBoostTimer > 0) {
      this.speedBoostTimer -= dt;
      this.speed = this.baseSpeed * 1.6;
      if (this.speedBoostTimer <= 0) {
        this.isExcited = false;
        this.speed = this.baseSpeed;
      }
    } else {
      this.speed = this.baseSpeed;
    }

    // Blinking logic
    this.blinkTimer += dt;
    if (this.blinkTimer > 4.2) {
      this.isBlinking = true;
      if (this.blinkTimer > 4.45) {
        this.isBlinking = false;
        this.blinkTimer = 0;
      }
    }

    // Tongue flick logic
    this.tongueTimer += dt;
    if (this.tongueTimer > 2.8) {
      this.tongueExt = Math.sin((this.tongueTimer - 2.8) * Math.PI * 2) * 8.5;
      if (this.tongueTimer > 3.3) {
        this.tongueTimer = 0;
        this.tongueExt = 0;
      }
    }

    // Fruit pop-in scale
    for (const f of this.foods) {
      if (f.scale < 1) {
        f.scale = Math.min(1, f.scale + dt * 4.5);
      }
      f.pulse += dt * 4.0;
    }

    // Target tracking
    if (!this.target || !this.foods.includes(this.target)) {
      this.pickNewTarget();
    }

    let targetX = this.target ? this.target.x : this.width / 2;
    let targetY = this.target ? this.target.y : this.height / 2;

    // Gentle curiosity towards cursor when idle and not rushing to food
    if (this.mouse.active && !this.isExcited) {
      const mouseDist = Math.hypot(this.mouse.x - this.pos.x, this.mouse.y - this.pos.y);
      if (mouseDist < 200 && mouseDist > 50) {
        targetX = this.pos.x + (this.mouse.x - this.pos.x) * 0.35 + (targetX - this.pos.x) * 0.65;
        targetY = this.pos.y + (this.mouse.y - this.pos.y) * 0.35 + (targetY - this.pos.y) * 0.65;
      }
    }

    const dx = targetX - this.pos.x;
    const dy = targetY - this.pos.y;
    const targetAngle = Math.atan2(dy, dx);

    let angleDiff = targetAngle - this.angle;
    while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
    while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;

    const maxTurn = (this.isExcited ? this.turnSpeed * 1.4 : this.turnSpeed) * dt;
    this.angle += Math.max(-maxTurn, Math.min(maxTurn, angleDiff));

    // Natural sinusoidal wave wiggle
    const wiggle = Math.sin(this.wiggleT) * (this.isExcited ? 0.22 : 0.14);
    const moveAngle = this.angle + wiggle;

    // Advance head
    this.pos.x += Math.cos(moveAngle) * this.speed * dt;
    this.pos.y += Math.sin(moveAngle) * this.speed * dt;

    // Soft boundary bounce
    const pad = 20;
    if (this.pos.x < pad) { this.pos.x = pad; this.angle = Math.PI - this.angle; }
    if (this.pos.x > this.width - pad) { this.pos.x = this.width - pad; this.angle = Math.PI - this.angle; }
    if (this.pos.y < pad) { this.pos.y = pad; this.angle = -this.angle; }
    if (this.pos.y > this.height - pad) { this.pos.y = this.height - pad; this.angle = -this.angle; }

    // Trailing Inverse Kinematics for segments
    this.segments[0] = { x: this.pos.x, y: this.pos.y };
    for (let i = 1; i < this.segments.length; i++) {
      const prev = this.segments[i - 1];
      const cur = this.segments[i];
      const segDx = cur.x - prev.x;
      const segDy = cur.y - prev.y;
      const segAngle = Math.atan2(segDy, segDx);

      cur.x = prev.x + Math.cos(segAngle) * this.segmentDist;
      cur.y = prev.y + Math.sin(segAngle) * this.segmentDist;
    }

    // Check eating fruit
    for (let i = this.foods.length - 1; i >= 0; i--) {
      const f = this.foods[i];
      const dist = Math.hypot(f.x - this.pos.x, f.y - this.pos.y);
      if (dist < this.headRadius + f.radius + 8) {
        this.eatFruit(f, i);
        break;
      }
    }

    // Update confetti particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 90 * dt;
      p.life -= dt;
      if (p.life <= 0) this.particles.splice(i, 1);
    }

    // Update floating score texts
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.y -= 48 * dt;
      ft.life -= dt;
      if (ft.life <= 0) this.floatingTexts.splice(i, 1);
    }

    // Update ripples
    for (let i = this.ripples.length - 1; i >= 0; i--) {
      const rp = this.ripples[i];
      rp.r += dt * 65;
      rp.alpha -= dt * 1.2;
      if (rp.alpha <= 0) this.ripples.splice(i, 1);
    }
  }

  eatFruit(f, index) {
    this.fruitsEaten++;
    this.foods.splice(index, 1);

    mobileAudio.snack();

    // Burst confetti sparks
    const count = f.isSpecial ? 22 : 12;
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const spd = Math.random() * 140 + 50;
      this.particles.push({
        x: f.x,
        y: f.y,
        vx: Math.cos(a) * spd,
        vy: Math.sin(a) * spd,
        color: f.type.color,
        size: Math.random() * 3.5 + 2,
        life: 0.55,
        maxLife: 0.55
      });
    }

    // Floating text
    this.floatingTexts.push({
      x: f.x,
      y: f.y - 12,
      text: f.isSpecial ? '⭐ YUMMY! +50' : '+10',
      color: f.type.color,
      life: 0.85,
      maxLife: 0.85
    });

    // Flick tongue happily
    this.tongueTimer = 2.9;

    // Grow snake slightly if under 44 segments
    if (this.segments.length < 42) {
      const last = this.segments[this.segments.length - 1];
      this.segments.push({ x: last.x, y: last.y });
    }

    // Notify listener
    if (typeof this.onFeed === 'function') {
      this.onFeed(this.fruitsEaten);
    }

    // Respawn fruit
    setTimeout(() => {
      if (this.foods.length < this.maxFoods) {
        this.spawnFood();
        this.pickNewTarget();
      }
    }, 450);

    this.pickNewTarget();
  }

  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    // 1. Subtle, delightful ambient dot grid
    ctx.fillStyle = 'rgba(203, 213, 225, 0.4)';
    const spacing = 36;
    for (let x = 18; x < this.width; x += spacing) {
      for (let y = 18; y < this.height; y += spacing) {
        ctx.beginPath();
        ctx.arc(x, y, 1.0, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 2. Draw Feeding Ripples
    for (const rp of this.ripples) {
      ctx.save();
      ctx.strokeStyle = `rgba(245, 158, 11, ${rp.alpha})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // 3. Draw Food Orbs with glowing aura and cute sheen
    for (const f of this.foods) {
      ctx.save();
      const r = (f.radius + Math.sin(f.pulse) * 1.6) * f.scale;

      ctx.shadowColor = f.type.glow;
      ctx.shadowBlur = f.isSpecial ? 20 : 12;
      ctx.fillStyle = f.type.color;

      ctx.beginPath();
      ctx.arc(f.x, f.y, Math.max(1, r), 0, Math.PI * 2);
      ctx.fill();

      // Top white shine highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
      ctx.beginPath();
      ctx.arc(f.x - r * 0.3, f.y - r * 0.3, r * 0.35, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    // 4. Draw Snake Body (Tail to Head)
    for (let i = this.segments.length - 1; i >= 0; i--) {
      const seg = this.segments[i];
      const progress = i / this.segments.length;
      const segR = Math.max(5.5, this.headRadius * (1 - progress * 0.48));

      ctx.save();
      // Fresh mint-emerald gradient with slight excitement glow
      ctx.fillStyle = i === 0 ? '#10B981' : (i % 2 === 0 ? '#34D399' : '#059669');
      ctx.shadowColor = this.isExcited ? 'rgba(245, 158, 11, 0.4)' : 'rgba(16, 185, 129, 0.22)';
      ctx.shadowBlur = this.isExcited ? 14 : 8;
      ctx.shadowOffsetY = 2;

      ctx.beginPath();
      ctx.arc(seg.x, seg.y, segR, 0, Math.PI * 2);
      ctx.fill();

      // Head details (Eyes, Tongue, Smile)
      if (i === 0) {
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;

        // Cute Little Red Tongue flicking out
        if (this.tongueExt > 0) {
          const tX = seg.x + Math.cos(this.angle) * (this.headRadius + this.tongueExt);
          const tY = seg.y + Math.sin(this.angle) * (this.headRadius + this.tongueExt);
          ctx.strokeStyle = '#F43F5E';
          ctx.lineWidth = 2.5;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(seg.x + Math.cos(this.angle) * this.headRadius, seg.y + Math.sin(this.angle) * this.headRadius);
          ctx.lineTo(tX, tY);
          ctx.stroke();

          // Forked tip
          const forkAngle1 = this.angle + 0.4;
          const forkAngle2 = this.angle - 0.4;
          ctx.beginPath();
          ctx.moveTo(tX, tY);
          ctx.lineTo(tX + Math.cos(forkAngle1) * 3, tY + Math.sin(forkAngle1) * 3);
          ctx.moveTo(tX, tY);
          ctx.lineTo(tX + Math.cos(forkAngle2) * 3, tY + Math.sin(forkAngle2) * 3);
          ctx.stroke();
        }

        // Eyes position
        const eyeOffset = 6;
        const eyeAngle1 = this.angle + Math.PI / 2;
        const eyeAngle2 = this.angle - Math.PI / 2;

        const e1x = seg.x + Math.cos(eyeAngle1) * eyeOffset + Math.cos(this.angle) * 3.5;
        const e1y = seg.y + Math.sin(eyeAngle1) * eyeOffset + Math.sin(this.angle) * 3.5;

        const e2x = seg.x + Math.cos(eyeAngle2) * eyeOffset + Math.cos(this.angle) * 3.5;
        const e2y = seg.y + Math.sin(eyeAngle2) * eyeOffset + Math.sin(this.angle) * 3.5;

        if (this.isBlinking) {
          // Happy closed eyes (^ ^)
          ctx.strokeStyle = '#064E3B';
          ctx.lineWidth = 2.0;
          ctx.beginPath();
          ctx.arc(e1x, e1y, 3.2, 0, Math.PI);
          ctx.arc(e2x, e2y, 3.2, 0, Math.PI);
          ctx.stroke();
        } else {
          // Open expressive eyes (larger if excited!)
          const eyeR = this.isExcited ? 4.5 : 3.8;
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(e1x, e1y, eyeR, 0, Math.PI * 2);
          ctx.arc(e2x, e2y, eyeR, 0, Math.PI * 2);
          ctx.fill();

          // Pupils looking forward / at snack
          const pupilR = this.isExcited ? 2.6 : 2.0;
          ctx.fillStyle = '#0F172A';
          ctx.beginPath();
          ctx.arc(e1x + Math.cos(this.angle) * 1.3, e1y + Math.sin(this.angle) * 1.3, pupilR, 0, Math.PI * 2);
          ctx.arc(e2x + Math.cos(this.angle) * 1.3, e2y + Math.sin(this.angle) * 1.3, pupilR, 0, Math.PI * 2);
          ctx.fill();

          // Catchlight twinkle
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(e1x + Math.cos(this.angle) * 0.5 - 0.6, e1y + Math.sin(this.angle) * 0.5 - 0.6, 0.9, 0, Math.PI * 2);
          ctx.arc(e2x + Math.cos(this.angle) * 0.5 - 0.6, e2y + Math.sin(this.angle) * 0.5 - 0.6, 0.9, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.restore();
    }

    // 5. Draw Confetti Sparks
    for (const p of this.particles) {
      ctx.save();
      ctx.globalAlpha = p.life / p.maxLife;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 6. Draw Floating Text
    for (const ft of this.floatingTexts) {
      ctx.save();
      const alpha = ft.life / ft.maxLife;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = ft.color;
      ctx.font = '800 13px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();
    }
  }

  destroy() {
    this.isRunning = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
    window.removeEventListener('resize', this.resize);
    window.removeEventListener('pointermove', this.onMouseMove);
    window.removeEventListener('pointerdown', this.onBackgroundClick);
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
  }
}
