import { mobileAudio } from './Audio.js';

/**
 * SnakeTransition - High-Energy 60 FPS Animated Snake Game Start Sequence
 * Features an adorable, glossy cartoon arcade snake that zooms in,
 * bites a juicy orchard apple with particles, and blasts into the game!
 */
export class SnakeTransition {
  constructor() {
    this.overlay = null;
    this.canvas = null;
    this.ctx = null;
    this.animId = null;
    this.active = false;
    this.onComplete = null;
    this.startTime = 0;
    this.game = null;
    this.particles = [];
    this.appleBitten = false;

    this.initDOM();
  }

  initDOM() {
    let overlay = document.getElementById('snakeStartOverlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'snakeStartOverlay';
      overlay.className = 'snake-start-overlay';
      overlay.innerHTML = `
        <canvas id="snakeStartCanvas" class="snake-start-canvas"></canvas>
        <div class="snake-start-tap-hint">Tap to skip</div>
      `;
      document.body.appendChild(overlay);
    }

    this.overlay = overlay;
    this.canvas = overlay.querySelector('canvas');
    this.ctx = this.canvas.getContext('2d');

    // Tap to instantly skip if user wants to play immediately
    this.overlay.addEventListener('click', () => {
      if (this.active) {
        this.finishEarly();
      }
    });
  }

  play(game, onComplete) {
    if (this.active) {
      this.finishEarly();
    }

    this.game = game;
    this.onComplete = onComplete;
    this.active = true;
    this.appleBitten = false;
    this.particles = [];
    this.startTime = performance.now();

    // Show overlay
    this.overlay.classList.add('active');
    this.resizeCanvas();

    mobileAudio.whoosh();
    this.loop = this.loop.bind(this);
    this.animId = requestAnimationFrame(this.loop);
  }

  resizeCanvas() {
    if (!this.canvas) return;
    const w = this.overlay.clientWidth || window.innerWidth;
    const h = this.overlay.clientHeight || window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.width = w;
    this.height = h;
    this.canvas.width = w * dpr;
    this.canvas.height = h * dpr;
    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;

    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(dpr, dpr);
  }

  finishEarly() {
    if (!this.active) return;
    this.active = false;
    if (this.animId) cancelAnimationFrame(this.animId);
    this.overlay.classList.remove('active');
    const cb = this.onComplete;
    this.onComplete = null;
    if (cb) cb();
  }

  loop(now) {
    if (!this.active) return;

    const elapsed = (now - this.startTime) / 1000; // in seconds
    const totalDuration = 0.85; // snappy 850ms

    if (elapsed >= totalDuration) {
      this.finishEarly();
      return;
    }

    this.render(elapsed, totalDuration);
    this.animId = requestAnimationFrame(this.loop);
  }

  render(t, duration) {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    ctx.clearRect(0, 0, w, h);

    // Dynamic background with soft circular radial glow
    const p = t / duration; // 0.0 -> 1.0
    const alpha = p < 0.8 ? Math.min(1, p * 4) : Math.max(0, (1 - p) * 5);

    const grad = ctx.createRadialGradient(w / 2, h / 2, 20, w / 2, h / 2, Math.max(w, h) * 0.7);
    grad.addColorStop(0, `rgba(255, 255, 255, ${0.96 * alpha})`);
    grad.addColorStop(0.5, `rgba(241, 245, 249, ${0.94 * alpha})`);
    grad.addColorStop(1, `rgba(226, 232, 240, ${0.98 * alpha})`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Center Coordinates
    const cx = w / 2;
    const cy = h / 2;

    // Center Game Info Card (pops with spring scale)
    const cardScale = p < 0.2 ? (p / 0.2) * 1.05 : p < 0.3 ? 1.05 - (p - 0.2) * 0.5 : 1.0;
    ctx.save();
    ctx.translate(cx, cy - 70);
    ctx.scale(cardScale, cardScale);

    // Game Icon / Pill
    ctx.beginPath();
    ctx.arc(0, -10, 42, 0, Math.PI * 2);
    ctx.fillStyle = this.game ? (this.game.bg || '#EEF2FF') : '#EEF2FF';
    ctx.shadowColor = 'rgba(16, 185, 129, 0.25)';
    ctx.shadowBlur = 18;
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.lineWidth = 3;
    ctx.strokeStyle = this.game ? (this.game.color || '#10B981') : '#10B981';
    ctx.stroke();

    // Game Icon
    ctx.font = '34px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.game ? (this.game.icon || '🎮') : '🎮', 0, -10);

    // Game Title in Sora font
    ctx.font = '800 1.25rem "Sora", sans-serif';
    ctx.fillStyle = '#0F172A';
    ctx.fillText(this.game ? this.game.title : 'GAME READY', 0, 48);

    // Category Badge
    ctx.font = '700 0.75rem "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = this.game ? this.game.color : '#4F46E5';
    ctx.fillText(this.game ? `${this.game.categoryName.toUpperCase()} • 60 FPS` : 'ARCADE', 0, 70);
    ctx.restore();

    // Apple in center
    const appleY = cy + 50;
    if (!this.appleBitten && t >= 0.38) {
      this.appleBitten = true;
      mobileAudio.snack();
      // Spawn star & juice particles
      for (let i = 0; i < 22; i++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = 80 + Math.random() * 220;
        this.particles.push({
          x: cx,
          y: appleY,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          size: 4 + Math.random() * 6,
          color: ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#FDE047'][Math.floor(Math.random() * 5)],
          life: 0.35,
          maxLife: 0.35
        });
      }
    }

    // Draw Apple if not yet eaten
    if (!this.appleBitten) {
      const applePulse = 1 + Math.sin(t * 15) * 0.08;
      ctx.save();
      ctx.translate(cx, appleY);
      ctx.scale(applePulse, applePulse);

      // Apple glow ring
      ctx.beginPath();
      ctx.arc(0, 0, 24, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
      ctx.fill();

      // Apple Body
      ctx.beginPath();
      ctx.arc(-5, 0, 14, 0, Math.PI * 2);
      ctx.arc(5, 0, 14, 0, Math.PI * 2);
      const appleGrad = ctx.createLinearGradient(-12, -14, 12, 14);
      appleGrad.addColorStop(0, '#F87171');
      appleGrad.addColorStop(0.5, '#EF4444');
      appleGrad.addColorStop(1, '#991B1B');
      ctx.fillStyle = appleGrad;
      ctx.fill();

      // Specular highlight
      ctx.beginPath();
      ctx.arc(-5, -6, 4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
      ctx.fill();

      // Apple Stem & Green Leaf
      ctx.strokeStyle = '#78350F';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(0, -12);
      ctx.quadraticCurveTo(2, -18, 5, -20);
      ctx.stroke();

      ctx.fillStyle = '#22C55E';
      ctx.beginPath();
      ctx.ellipse(6, -17, 6, 3, Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    // Update & draw particles
    if (this.particles.length > 0) {
      const dt = 0.016;
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const pt = this.particles[i];
        pt.life -= dt;
        if (pt.life <= 0) {
          this.particles.splice(i, 1);
          continue;
        }
        pt.x += pt.vx * dt;
        pt.y += pt.vy * dt;
        pt.vy += 220 * dt; // gravity

        const ptAlpha = Math.max(0, pt.life / pt.maxLife);
        ctx.fillStyle = pt.color;
        ctx.globalAlpha = ptAlpha;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size * ptAlpha, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    // Dynamic Snake Slithering Path
    // The snake traverses an S-curve that crosses (cx, appleY) at exactly t = 0.38
    this.renderSnakeActor(t, cx, appleY, w, h);

    // "GET READY" -> "LET'S GO! 🚀" Banner Text
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    if (t < 0.38) {
      ctx.font = '900 1.6rem "Sora", sans-serif';
      ctx.fillStyle = '#10B981';
      ctx.shadowColor = 'rgba(16, 185, 129, 0.3)';
      ctx.shadowBlur = 10;
      ctx.fillText('READY...', cx, cy + 125);
    } else {
      const popP = Math.min(1, (t - 0.38) / 0.15);
      const textScale = 1 + Math.sin(popP * Math.PI) * 0.25;
      ctx.translate(cx, cy + 125);
      ctx.scale(textScale, textScale);
      ctx.font = '900 1.9rem "Sora", sans-serif';
      ctx.fillStyle = '#4F46E5';
      ctx.shadowColor = 'rgba(79, 70, 229, 0.4)';
      ctx.shadowBlur = 12;
      ctx.fillText("LET'S GO! 🚀", 0, 0);
    }
    ctx.restore();
  }

  renderSnakeActor(t, targetX, targetY, w, h) {
    const ctx = this.ctx;

    // Parametric position of snake head over time
    // Starts off-screen left/bottom at t=0, arrives at apple at t=0.38, swooshes off-screen right/top by t=0.85
    const progress = t / 0.85;

    // Segment count
    const numSegments = 16;
    const segSpacing = 11;

    // Compute head position along a spline curve
    const getPosAtTime = (subT) => {
      const u = subT / 0.85;
      // Interpolate along path: (-60, targetY + 120) -> (targetX * 0.5, targetY - 40) -> (targetX, targetY) -> (w + 100, targetY - 140)
      let x, y;
      if (u <= 0.45) {
        const f = u / 0.45;
        // Bezier from start to apple
        const p0x = -80, p0y = targetY + 80;
        const p1x = targetX * 0.3, p1y = targetY + 140;
        const p2x = targetX - 50, p2y = targetY - 30;
        const p3x = targetX, p3y = targetY;
        const it = 1 - f;
        x = it*it*it*p0x + 3*it*it*f*p1x + 3*it*f*f*p2x + f*f*f*p3x;
        y = it*it*it*p0y + 3*it*it*f*p1y + 3*it*f*f*p2y + f*f*f*p3y;
      } else {
        const f = (u - 0.45) / 0.55;
        // Bezier from apple to exit
        const p0x = targetX, p0y = targetY;
        const p1x = targetX + 70, p1y = targetY + 40;
        const p2x = targetX + 160, p2y = targetY - 120;
        const p3x = w + 120, p3y = targetY - 160;
        const it = 1 - f;
        x = it*it*it*p0x + 3*it*it*f*p1x + 3*it*f*f*p2x + f*f*f*p3x;
        y = it*it*it*p0y + 3*it*it*f*p1y + 3*it*f*f*p2y + f*f*f*p3y;
      }
      return { x, y };
    };

    // Calculate positions for each segment lagged by time
    const segments = [];
    for (let i = 0; i < numSegments; i++) {
      const lagT = Math.max(0, t - (i * 0.015));
      segments.push(getPosAtTime(lagT));
    }

    // Draw snake segments from tail to head
    for (let i = numSegments - 1; i >= 1; i--) {
      const seg = segments[i];
      const prev = segments[i - 1];
      const radius = 17 - (i / numSegments) * 8; // Taper from head (17px) to tail (9px)

      ctx.save();
      ctx.beginPath();
      ctx.arc(seg.x, seg.y, radius, 0, Math.PI * 2);

      // Alternating radiant emerald & lime green gradient
      const segGrad = ctx.createRadialGradient(seg.x - 3, seg.y - 3, 2, seg.x, seg.y, radius);
      if (i % 2 === 0) {
        segGrad.addColorStop(0, '#34D399');
        segGrad.addColorStop(0.7, '#10B981');
        segGrad.addColorStop(1, '#059669');
      } else {
        segGrad.addColorStop(0, '#6EE7B7');
        segGrad.addColorStop(0.7, '#059669');
        segGrad.addColorStop(1, '#047857');
      }
      ctx.fillStyle = segGrad;
      ctx.shadowColor = 'rgba(16, 185, 129, 0.35)';
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Cute diamond pattern on back
      if (i % 3 === 0 && radius > 10) {
        ctx.beginPath();
        ctx.fillStyle = '#FDE047';
        ctx.arc(seg.x, seg.y - 2, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // Draw Snake Head at segments[0]
    const head = segments[0];
    const neck = segments[1] || { x: head.x - 10, y: head.y };
    const angle = Math.atan2(head.y - neck.y, head.x - neck.x);

    ctx.save();
    ctx.translate(head.x, head.y);
    ctx.rotate(angle);

    // Flicking Forked Tongue
    const tongueLength = 14 + Math.sin(t * 35) * 6;
    ctx.strokeStyle = '#EF4444';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(18, 0);
    ctx.lineTo(18 + tongueLength, 0);
    ctx.lineTo(24 + tongueLength, -4);
    ctx.moveTo(18 + tongueLength, 0);
    ctx.lineTo(24 + tongueLength, 4);
    ctx.stroke();

    // Head Base
    ctx.beginPath();
    ctx.ellipse(4, 0, 20, 16, 0, 0, Math.PI * 2);
    const headGrad = ctx.createRadialGradient(2, -4, 4, 4, 0, 20);
    headGrad.addColorStop(0, '#34D399');
    headGrad.addColorStop(0.6, '#10B981');
    headGrad.addColorStop(1, '#047857');
    ctx.fillStyle = headGrad;
    ctx.shadowColor = 'rgba(16, 185, 129, 0.5)';
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Cheerful Eyes (Looking forward)
    // Left Eye
    ctx.beginPath();
    ctx.arc(7, -8, 5.5, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(8.5, -8, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#0F172A';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(7.5, -9.5, 1.4, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();

    // Right Eye
    ctx.beginPath();
    ctx.arc(7, 8, 5.5, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(8.5, 8, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#0F172A';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(7.5, 6.5, 1.4, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();

    // Cute Gamer Gold Crown on Head 👑
    ctx.fillStyle = '#F59E0B';
    ctx.beginPath();
    ctx.moveTo(-6, -10);
    ctx.lineTo(-4, -18);
    ctx.lineTo(-1, -12);
    ctx.lineTo(2, -19);
    ctx.lineTo(5, -12);
    ctx.lineTo(8, -18);
    ctx.lineTo(10, -10);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#D97706';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.restore();
  }
}

export const snakeTransition = new SnakeTransition();
