/**
 * MemoryCards - Clean pastel 16-card mobile pair matching game.
 * Smooth 3D-card flip effect, move counter, and audio celebration.
 */
export class MemoryCardsMobile {
  constructor(canvas, audio, onScore, onGameOver) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.audio = audio;
    this.onScore = onScore;
    this.onGameOver = onGameOver;

    this.width = 400;
    this.height = 480;

    this.cards = [];
    this.flipped = [];
    this.matches = 0;
    this.moves = 0;
    this.score = 0;
    this.isLock = false;
    this.isOver = false;
    this.particles = [];

    this.handleTap = this.handleTap.bind(this);
  }

  start() {
    this.score = 0;
    this.matches = 0;
    this.moves = 0;
    this.flipped = [];
    this.isLock = false;
    this.isOver = false;
    this.particles = [];

    const icons = [
      { id: '1', emoji: '🍓', color: '#F43F5E' },
      { id: '2', emoji: '🥑', color: '#10B981' },
      { id: '3', emoji: '🍇', color: '#8B5CF6' },
      { id: '4', emoji: '🍊', color: '#F97316' },
      { id: '5', emoji: '⭐', color: '#FBBF24' },
      { id: '6', emoji: '💎', color: '#0284C7' },
      { id: '7', emoji: '🚀', color: '#6366F1' },
      { id: '8', emoji: '⚡', color: '#EAB308' }
    ];

    const deck = [...icons, ...icons];
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    this.cards = deck.map((item, idx) => ({
      idx,
      item,
      isFlipped: false,
      isMatched: false,
      flip: 0 // 0 to 1
    }));

    this.canvas.addEventListener('pointerdown', this.handleTap);
  }

  handleTap(e) {
    if (this.isLock || this.isOver) return;
    const rect = this.canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * this.width;
    const y = ((e.clientY - rect.top) / rect.height) * this.height;

    const cardW = 76;
    const cardH = 88;
    const gap = 12;
    const startX = (this.width - (4 * cardW + 3 * gap)) / 2;
    const startY = 50;

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const idx = r * 4 + c;
        const cx = startX + c * (cardW + gap);
        const cy = startY + r * (cardH + gap);

        if (x >= cx && x <= cx + cardW && y >= cy && y <= cy + cardH) {
          const card = this.cards[idx];
          if (!card.isFlipped && !card.isMatched) {
            card.isFlipped = true;
            this.flipped.push(idx);
            this.audio.slice();

            if (this.flipped.length === 2) {
              this.moves++;
              this.isLock = true;
              const [i1, i2] = this.flipped;
              const c1 = this.cards[i1];
              const c2 = this.cards[i2];

              if (c1.item.id === c2.item.id) {
                // Match
                c1.isMatched = true;
                c2.isMatched = true;
                this.matches++;
                this.score += 40;
                this.onScore(this.score);
                this.audio.coin();
                this.spawnSparks(cx + cardW / 2, cy + cardH / 2, c1.item.color, 14);

                this.flipped = [];
                this.isLock = false;

                if (this.matches === 8) {
                  this.score += Math.max(50, 200 - this.moves * 10);
                  this.onScore(this.score);
                  this.isOver = true;
                  this.audio.win();
                  this.onGameOver(this.score);
                }
              } else {
                // Mismatch
                setTimeout(() => {
                  c1.isFlipped = false;
                  c2.isFlipped = false;
                  this.flipped = [];
                  this.isLock = false;
                }, 750);
              }
            }
          }
          return;
        }
      }
    }
  }

  update(dt) {
    if (this.isOver) return;

    for (const card of this.cards) {
      const target = card.isFlipped || card.isMatched ? 1 : 0;
      card.flip += (target - card.flip) * 0.22;
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

  spawnSparks(x, y, color, count = 10) {
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

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, this.width, this.height);

    // Header info
    ctx.save();
    ctx.font = 'bold 15px Inter, sans-serif';
    ctx.fillStyle = '#64748B';
    ctx.fillText(`MOVES: ${this.moves}`, 30, 30);
    ctx.fillStyle = '#10B981';
    ctx.textAlign = 'right';
    ctx.fillText(`PAIRS: ${this.matches}/8`, this.width - 30, 30);
    ctx.restore();

    const cardW = 76;
    const cardH = 88;
    const gap = 12;
    const startX = (this.width - (4 * cardW + 3 * gap)) / 2;
    const startY = 50;

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const idx = r * 4 + c;
        const card = this.cards[idx];
        const cx = startX + c * (cardW + gap) + cardW / 2;
        const cy = startY + r * (cardH + gap) + cardH / 2;

        ctx.save();
        ctx.translate(cx, cy);
        const scaleX = Math.abs(Math.cos(card.flip * Math.PI));
        ctx.scale(scaleX, 1);

        if (card.flip >= 0.5) {
          // Front
          ctx.fillStyle = card.isMatched ? '#ECFDF5' : '#F8FAFC';
          ctx.strokeStyle = card.isMatched ? '#10B981' : '#CBD5E1';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(-cardW / 2, -cardH / 2, cardW, cardH, 12);
          ctx.fill();
          ctx.stroke();

          ctx.font = '32px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(card.item.emoji, 0, 0);
        } else {
          // Back
          ctx.fillStyle = '#4F46E5';
          ctx.shadowColor = 'rgba(79, 70, 229, 0.2)';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.roundRect(-cardW / 2, -cardH / 2, cardW, cardH, 12);
          ctx.fill();
          ctx.shadowBlur = 0;

          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.font = 'bold 20px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('✦', 0, 0);
        }
        ctx.restore();
      }
    }

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

  destroy() {
    this.canvas.removeEventListener('pointerdown', this.handleTap);
    this.particles = [];
  }
}
