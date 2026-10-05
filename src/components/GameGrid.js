import { GameCard } from './GameCard.js';

/**
 * Smoothly glides a scrollable element by a specified distance over a comfortable duration
 * using an easeInOutCubic easing curve without abrupt browser snapping.
 */
function smoothGlide(element, distance, duration = 600) {
  if (!element) return;

  const start = element.scrollLeft;
  const startTime = performance.now();
  const maxScroll = element.scrollWidth - element.clientWidth;
  const targetDistance = Math.max(-start, Math.min(maxScroll - start, distance));

  // Temporarily disable snapping during animation to prevent abrupt snaps
  element.style.scrollSnapType = 'none';

  // Buttery-smooth easing curve
  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = easeInOutCubic(progress);

    element.scrollLeft = start + targetDistance * ease;

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      element.style.scrollSnapType = 'x proximity';
    }
  }

  requestAnimationFrame(step);
}

/**
 * GameGrid - Renders cinematic hero section, buttery-smooth gliding carousels,
 * and responsive game grids.
 */
export class GameGrid {
  constructor(onPlayGame) {
    this.onPlayGame = onPlayGame;
  }

  renderHero(featuredGame) {
    const hero = document.createElement('div');
    hero.className = 'hero-featured';

    hero.innerHTML = `
      <div class="hero-content">
        <span class="hero-tag">
          <span>🔥</span> TRENDING #1 ARCADE GAME
        </span>
        <h1 class="hero-title">${featuredGame.title}</h1>
        <p class="hero-desc">${featuredGame.description}</p>
        <div class="hero-meta">
          <span>Category: <strong style="color: #FFF;">${featuredGame.categoryName}</strong></span>
          <span>•</span>
          <span>Difficulty: <strong style="color: #FFF;">${featuredGame.difficulty}</strong></span>
          <span>•</span>
          <span style="color: var(--neon-cyan); font-weight: 800;">⚡ 60 FPS ULTRA SMOOTH</span>
        </div>
        <div class="hero-actions">
          <button class="btn btn-primary" id="heroPlayBtn" style="padding: 13px 32px; font-size: 1.05rem; border-radius: var(--radius-full);">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            PLAY NOW - INSTANT
          </button>
        </div>
      </div>

      <div class="hero-preview">
        <canvas class="hero-preview-canvas" id="heroPreviewCanvas" width="480" height="300"></canvas>
      </div>
    `;

    const canvas = hero.querySelector('#heroPreviewCanvas');
    this.startHeroCanvasAnimation(canvas);

    hero.querySelector('#heroPlayBtn').addEventListener('click', () => {
      if (this.onPlayGame) this.onPlayGame(featuredGame.id);
    });

    return hero;
  }

  startHeroCanvasAnimation(canvas) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let t = 0;
    let animId = null;

    const render = () => {
      t += 0.035;
      const w = canvas.width;
      const h = canvas.height;

      // Deep space background
      ctx.fillStyle = '#090B12';
      ctx.fillRect(0, 0, w, h);

      // Neon grid
      ctx.strokeStyle = 'rgba(0, 242, 254, 0.05)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 24) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 24) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      const cx = w / 2;
      const cy = h / 2;
      const segments = 18;

      ctx.save();
      for (let i = 0; i < segments; i++) {
        const sx = cx + Math.sin(t - i * 0.18) * 125;
        const sy = cy + Math.cos((t - i * 0.18) * 0.8) * 65;

        const isHead = i === 0;
        ctx.fillStyle = isHead ? '#00F2FE' : `rgba(139, 92, 246, ${1 - i / segments})`;
        ctx.shadowColor = '#00F2FE';
        ctx.shadowBlur = isHead ? 14 : 6;

        ctx.beginPath();
        ctx.arc(sx, sy, isHead ? 11 : 7.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Pulsing apple
      const fx = cx + 85;
      const fy = cy - 45;
      ctx.fillStyle = '#FBBF24';
      ctx.shadowColor = '#FBBF24';
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.arc(fx, fy, 9 + Math.sin(t * 3.5) * 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    const observer = new MutationObserver(() => {
      if (!document.body.contains(canvas)) {
        cancelAnimationFrame(animId);
        observer.disconnect();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  renderSection(title, icon, games, isCarousel = true) {
    if (!games || games.length === 0) return null;

    const section = document.createElement('section');
    section.className = 'arcade-section';

    section.innerHTML = `
      <div class="section-header">
        <div class="section-title-wrap">
          <span class="section-icon">${icon}</span>
          <h2 class="section-title">${title}</h2>
          <span class="section-count">${games.length}</span>
        </div>
        ${isCarousel ? `
          <div style="display: flex; gap: 8px;">
            <button class="btn-icon carousel-arrow scroll-prev" style="width: 36px; height: 36px; font-size: 0.95rem;" title="Scroll Left (Previous Games)">◀</button>
            <button class="btn-icon carousel-arrow scroll-next" style="width: 36px; height: 36px; font-size: 0.95rem;" title="Scroll Right (More Games)">▶</button>
          </div>
        ` : ''}
      </div>
      <div class="${isCarousel ? 'games-carousel' : 'games-grid'}" id="cardsContainer"></div>
    `;

    const container = section.querySelector('#cardsContainer');
    games.forEach(game => {
      const card = new GameCard(game, this.onPlayGame);
      container.appendChild(card.render());
    });

    if (isCarousel) {
      const prevBtn = section.querySelector('.scroll-prev');
      const nextBtn = section.querySelector('.scroll-next');

      // Scroll smoothly by the width of ~2 cards with a gentle 600ms glide
      const getScrollStep = () => {
        const cardWidth = container.querySelector('.game-card')?.offsetWidth || 250;
        return (cardWidth + 18) * 2; // Glide 2 cards at a time
      };

      if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', (e) => {
          e.preventDefault();
          smoothGlide(container, -getScrollStep(), 600);
        });

        nextBtn.addEventListener('click', (e) => {
          e.preventDefault();
          smoothGlide(container, getScrollStep(), 600);
        });
      }

      // Mouse Wheel Support: convert vertical mouse wheel to smooth horizontal gliding
      container.addEventListener('wheel', (e) => {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
          e.preventDefault();
          container.scrollLeft += e.deltaY * 0.7;
        }
      }, { passive: false });
    }

    return section;
  }

  renderGrid(games) {
    if (!games || games.length === 0) {
      return this.renderEmptyState('No games match your search query. Try another keyword!');
    }

    const grid = document.createElement('div');
    grid.className = 'games-grid';
    games.forEach(game => {
      const card = new GameCard(game, this.onPlayGame);
      grid.appendChild(card.render());
    });
    return grid;
  }

  renderEmptyState(message = 'No games found.') {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.innerHTML = `
      <div class="empty-icon">🕹️</div>
      <div class="empty-title">No Games Found</div>
      <p style="color: var(--text-muted); font-size: 0.95rem;">${message}</p>
    `;
    return empty;
  }
}
