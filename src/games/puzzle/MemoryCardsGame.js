import { BaseGame } from '../../engine/BaseGame.js';

/**
 * MemoryCardsGame - Cyber Memory Matrix puzzle.
 * Features 4x4 card grid, 8 holographic icon pairs, smooth flip transitions,
 * move tracking, combo audio cues, and victory particle fireworks.
 */
export class MemoryCardsGame extends BaseGame {
  constructor(session, canvas, input, audio) {
    super(session, canvas, input, audio);
    this.width = 600;
    this.height = 640;

    this.gridCols = 4;
    this.gridRows = 4;
    this.cards = [];
    this.flippedIndices = [];
    this.matchedPairs = 0;
    this.moves = 0;
    this.isLockBoard = false;
  }

  create() {
    super.create();
    this.matchedPairs = 0;
    this.moves = 0;
    this.flippedIndices = [];
    this.isLockBoard = false;
    this.setScore(0);

    this.initCards();
  }

  initCards() {
    const symbols = [
      { id: 'bolt', icon: '⚡', color: '#00F2FE' },
      { id: 'alien', icon: '👾', color: '#EC4899' },
      { id: 'gem', icon: '💎', color: '#38BDF8' },
      { id: 'rocket', icon: '🚀', color: '#FBBF24' },
      { id: 'shield', icon: '🛡️', color: '#10B981' },
      { id: 'atom', icon: '⚛️', color: '#A855F7' },
      { id: 'fire', icon: '🔥', color: '#F97316' },
      { id: 'target', icon: '🎯', color: '#EF4444' }
    ];

    // Double the symbols to make pairs
    const deck = [...symbols, ...symbols];
    // Shuffle
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    this.cards = deck.map((item, idx) => ({
      index: idx,
      item,
      isFlipped: false,
      isMatched: false,
      flipProgress: 0 // 0 = face down, 1 = face up
    }));
  }

  update(deltaTime) {
    super.update(deltaTime);
    if (this.isGameOver || this.isPaused) return;

    // Smooth flip animation for cards
    for (const card of this.cards) {
      const target = card.isFlipped || card.isMatched ? 1 : 0;
      card.flipProgress += (target - card.flipProgress) * 0.2;
    }

    // Handle clicks / taps via unified InputManager
    if (this.input.pointer.justPressed && !this.isLockBoard) {
      const x = this.input.pointer.canvasX;
      const y = this.input.pointer.canvasY;

      const cardW = 100;
      const cardH = 110;
      const gap = 16;
      const startX = (this.width - (this.gridCols * cardW + (this.gridCols - 1) * gap)) / 2;
      const startY = 110;

      for (let r = 0; r < this.gridRows; r++) {
        for (let c = 0; c < this.gridCols; c++) {
          const idx = r * this.gridCols + c;
          const cardX = startX + c * (cardW + gap);
          const cardY = startY + r * (cardH + gap);

          if (x >= cardX && x <= cardX + cardW && y >= cardY && y <= cardY + cardH) {
            this.handleCardClick(idx);
            return;
          }
        }
      }
    }
  }

  handleCardClick(idx) {
    const card = this.cards[idx];
    if (!card || card.isFlipped || card.isMatched) return;

    card.isFlipped = true;
    this.flippedIndices.push(idx);
    if (this.audio) this.audio.playBlip(600, 0.04);

    if (this.flippedIndices.length === 2) {
      this.moves++;
      this.isLockBoard = true;
      const [idx1, idx2] = this.flippedIndices;
      const card1 = this.cards[idx1];
      const card2 = this.cards[idx2];

      if (card1.item.id === card2.item.id) {
        // MATCH!
        card1.isMatched = true;
        card2.isMatched = true;
        this.matchedPairs++;
        this.addScore(50);
        if (this.audio) this.audio.playCoin();

        // Spawn particles at both cards
        const pos1 = this.getCardCenter(idx1);
        const pos2 = this.getCardCenter(idx2);
        this.spawnParticles(pos1.x, pos1.y, 16, card1.item.color, 120, 3);
        this.spawnParticles(pos2.x, pos2.y, 16, card2.item.color, 120, 3);

        this.flippedIndices = [];
        this.isLockBoard = false;

        // Victory check
        if (this.matchedPairs === 8) {
          const bonus = Math.max(100, 500 - this.moves * 15);
          this.addScore(bonus);
          setTimeout(() => {
            this.triggerGameOver(true);
          }, 400);
        }
      } else {
        // MISMATCH - flip back over
        setTimeout(() => {
          card1.isFlipped = false;
          card2.isFlipped = false;
          this.flippedIndices = [];
          this.isLockBoard = false;
        }, 800);
      }
    }
  }

  getCardCenter(idx) {
    const cardW = 100;
    const cardH = 110;
    const gap = 16;
    const startX = (this.width - (this.gridCols * cardW + (this.gridCols - 1) * gap)) / 2;
    const startY = 110;
    const c = idx % this.gridCols;
    const r = Math.floor(idx / this.gridCols);
    return {
      x: startX + c * (cardW + gap) + cardW / 2,
      y: startY + r * (cardH + gap) + cardH / 2
    };
  }

  render(ctx) {
    this.clearCanvas('#080A12');

    // Header HUD on canvas
    ctx.save();
    ctx.font = 'bold 16px Orbitron, sans-serif';
    ctx.fillStyle = '#00F2FE';
    ctx.fillText(`MOVES: ${this.moves}`, 35, 45);

    ctx.fillStyle = '#FBBF24';
    ctx.fillText(`PAIRS: ${this.matchedPairs} / 8`, this.width - 170, 45);
    ctx.restore();

    // Subtle background divider
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(30, 75);
    ctx.lineTo(this.width - 30, 75);
    ctx.stroke();

    const cardW = 100;
    const cardH = 110;
    const gap = 16;
    const startX = (this.width - (this.gridCols * cardW + (this.gridCols - 1) * gap)) / 2;
    const startY = 110;

    // Draw Cards
    for (let r = 0; r < this.gridRows; r++) {
      for (let c = 0; c < this.gridCols; c++) {
        const idx = r * this.gridCols + c;
        const card = this.cards[idx];
        const cardX = startX + c * (cardW + gap);
        const cardY = startY + r * (cardH + gap);

        const centerX = cardX + cardW / 2;
        const centerY = cardY + cardH / 2;

        ctx.save();
        ctx.translate(centerX, centerY);

        // 3D Flip scale effect
        const scaleX = Math.abs(Math.cos(card.flipProgress * Math.PI));
        ctx.scale(scaleX, 1);

        const isShowingFront = card.flipProgress >= 0.5;

        if (isShowingFront) {
          // Card Front
          ctx.fillStyle = card.isMatched ? 'rgba(16, 185, 129, 0.15)' : '#161C2E';
          ctx.strokeStyle = card.isMatched ? '#10B981' : card.item.color;
          ctx.lineWidth = card.isMatched ? 2.5 : 2;
          ctx.beginPath();
          ctx.roundRect(-cardW / 2, -cardH / 2, cardW, cardH, 8);
          ctx.fill();
          ctx.stroke();

          // Icon
          ctx.font = '40px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(card.item.icon, 0, 0);
        } else {
          // Card Back (Cyber Hologram pattern)
          ctx.fillStyle = '#0F1322';
          ctx.strokeStyle = '#00F2FE';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.roundRect(-cardW / 2, -cardH / 2, cardW, cardH, 8);
          ctx.fill();
          ctx.stroke();

          // Cyber matrix back design
          ctx.strokeStyle = 'rgba(0, 242, 254, 0.3)';
          ctx.lineWidth = 1;
          ctx.strokeRect(-cardW / 2 + 10, -cardH / 2 + 10, cardW - 20, cardH - 20);

          ctx.fillStyle = '#00F2FE';
          ctx.font = 'bold 16px Orbitron, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('⚡', 0, 0);
        }

        ctx.restore();
      }
    }

    super.render(ctx);
  }
}
