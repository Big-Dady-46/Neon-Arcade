import { storageManager } from '../engine/StorageManager.js';
import { audioManager } from '../engine/AudioManager.js';

/**
 * GameCard - Modern, clean arcade card with subtle, anti-clipping 3D tilt
 * and refined glow effects.
 */
export class GameCard {
  constructor(gameEntry, onPlay) {
    this.game = gameEntry;
    this.onPlay = onPlay;
    this.element = null;
  }

  render() {
    this.element = document.createElement('article');
    this.element.className = 'game-card';
    this.element.tabIndex = 0;
    this.element.dataset.id = this.game.id;

    const isFav = storageManager.isFavorite(this.game.id);
    const bestScore = storageManager.getHighScore(this.game.id);

    this.element.innerHTML = `
      <div class="card-media">
        <canvas class="card-canvas-thumb" width="340" height="210"></canvas>
        <span class="card-badge">${this.game.badge || this.game.categoryName}</span>
        <button class="card-favorite-btn ${isFav ? 'favorited' : ''}" title="Favorite">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2.2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
        <div class="card-play-overlay">
          <div class="card-play-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="card-body">
        <h3 class="card-title">${this.game.title}</h3>
        <p class="card-desc">${this.game.description}</p>
        <div class="card-footer">
          <div class="card-best-score">
            <span>🏆</span>
            <span>${bestScore > 0 ? bestScore : 'Play'}</span>
          </div>
          <span class="card-difficulty">${this.game.difficulty}</span>
        </div>
      </div>
    `;

    this.drawArtwork(this.element.querySelector('.card-canvas-thumb'));
    this.bindInteractions();

    return this.element;
  }

  bindInteractions() {
    // Subtle, gentle 3D tilt with anti-clipping translation
    this.element.addEventListener('mousemove', (e) => {
      const rect = this.element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;

      this.element.style.transform = `perspective(800px) rotateX(${rotateX.toFixed(1)}deg) rotateY(${rotateY.toFixed(1)}deg) translateY(-4px)`;
    });

    this.element.addEventListener('mouseleave', () => {
      this.element.style.transform = 'none';
    });

    // Favorite button
    const favBtn = this.element.querySelector('.card-favorite-btn');
    favBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      audioManager.playClick();
      const favorited = storageManager.toggleFavorite(this.game.id);
      favBtn.classList.toggle('favorited', favorited);
      favBtn.querySelector('svg').setAttribute('fill', favorited ? 'currentColor' : 'none');
    });

    // Click to play
    this.element.addEventListener('click', () => {
      audioManager.playClick();
      if (this.onPlay) this.onPlay(this.game.id);
    });

    // Keyboard support
    this.element.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        audioManager.playClick();
        if (this.onPlay) this.onPlay(this.game.id);
      }
    });
  }

  drawArtwork(canvas) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    // Deep clean background
    const bgGrad = ctx.createLinearGradient(0, 0, w, h);
    bgGrad.addColorStop(0, '#141828');
    bgGrad.addColorStop(1, '#0A0C14');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Subtle background grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 22) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 22) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    const theme = this.game.themeColor || '#00F2FE';
    const accent = this.game.accentColor || '#8B5CF6';
    const cx = w / 2;
    const cy = h / 2 - 8;

    // Clean subtle radial glow
    const radGlow = ctx.createRadialGradient(cx, cy, 5, cx, cy, 70);
    radGlow.addColorStop(0, theme + '25');
    radGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = radGlow;
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.strokeStyle = theme;
    ctx.fillStyle = theme;
    ctx.lineWidth = 3;

    if (this.game.id === 'snake') {
      ctx.beginPath();
      ctx.arc(cx - 28, cy, 13, 0, Math.PI * 2);
      ctx.arc(cx, cy - 8, 13, 0, Math.PI * 2);
      ctx.arc(cx + 28, cy, 13, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FBBF24';
      ctx.beginPath();
      ctx.arc(cx + 60, cy, 9, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.game.id === 'brick-breaker') {
      ctx.fillStyle = '#EC4899';
      for (let i = -2; i <= 2; i++) {
        ctx.fillRect(cx + i * 26 - 11, cy - 28, 22, 9);
      }
      ctx.fillStyle = '#00F2FE';
      ctx.fillRect(cx - 28, cy + 22, 56, 7);
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(cx, cy - 4, 5, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.game.id === 'flappy-dash') {
      ctx.fillStyle = '#00F2FE';
      ctx.beginPath();
      ctx.arc(cx - 18, cy, 15, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#8B5CF6';
      ctx.strokeRect(cx + 24, cy - 36, 22, 26);
      ctx.strokeRect(cx + 24, cy + 10, 22, 32);
    } else if (this.game.category === 'arcade') {
      ctx.beginPath();
      ctx.moveTo(cx, cy - 26);
      ctx.lineTo(cx + 24, cy + 20);
      ctx.lineTo(cx, cy + 10);
      ctx.lineTo(cx - 24, cy + 20);
      ctx.closePath();
      ctx.stroke();
      ctx.fillStyle = accent;
      ctx.fill();

      ctx.strokeStyle = '#00F2FE';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(cx - 12, cy - 8);
      ctx.lineTo(cx - 12, cy - 30);
      ctx.moveTo(cx + 12, cy - 8);
      ctx.lineTo(cx + 12, cy - 30);
      ctx.stroke();
    } else if (this.game.category === 'reflex') {
      ctx.beginPath();
      ctx.moveTo(cx + 6, cy - 30);
      ctx.lineTo(cx - 18, cy);
      ctx.lineTo(cx + 2, cy);
      ctx.lineTo(cx - 6, cy + 30);
      ctx.lineTo(cx + 18, cy);
      ctx.lineTo(cx - 2, cy);
      ctx.closePath();
      ctx.stroke();
      ctx.fillStyle = '#00F2FE';
      ctx.fill();
    } else if (this.game.category === 'puzzle') {
      ctx.beginPath();
      ctx.moveTo(cx, cy - 26);
      ctx.lineTo(cx + 25, cy - 10);
      ctx.lineTo(cx, cy + 6);
      ctx.lineTo(cx - 25, cy - 10);
      ctx.closePath();
      ctx.stroke();
      ctx.fillStyle = accent;
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(cx, cy + 6);
      ctx.lineTo(cx + 25, cy - 10);
      ctx.lineTo(cx + 25, cy + 20);
      ctx.lineTo(cx, cy + 34);
      ctx.closePath();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx, cy + 6);
      ctx.lineTo(cx - 25, cy - 10);
      ctx.lineTo(cx - 25, cy + 20);
      ctx.lineTo(cx, cy + 34);
      ctx.closePath();
      ctx.stroke();
    } else if (this.game.category === 'sports') {
      ctx.beginPath();
      ctx.arc(cx - 8, cy - 8, 20, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#FBBF24';
      ctx.fill();

      ctx.strokeStyle = '#EC4899';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(cx + 10, cy + 10);
      ctx.lineTo(cx + 40, cy + 10);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.moveTo(cx - 26, cy - 20);
      ctx.lineTo(cx + 8, cy);
      ctx.lineTo(cx - 26, cy + 20);
      ctx.stroke();

      ctx.strokeStyle = accent;
      ctx.beginPath();
      ctx.moveTo(cx - 6, cy - 20);
      ctx.lineTo(cx + 28, cy);
      ctx.lineTo(cx - 6, cy + 20);
      ctx.stroke();
    }

    ctx.restore();
  }
}
