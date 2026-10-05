import { mobileAudio } from './engine/Audio.js';
import { mobileStorage } from './engine/Storage.js';
import { BgSnake } from './engine/BgSnake.js';
import { GAME_ARTWORK } from './engine/GameArtwork.js';
import { snakeTransition } from './engine/SnakeTransition.js';

// Import All 15 Distinct Playable Games
import { KnifeHitGame } from './games/KnifeHit.js';
import { SnakeGame } from './games/SnakeGame.js';
import { ColorBounceGame } from './games/ColorBounce.js';
import { TowerStackGame } from './games/TowerStack.js';
import { FlappyBirdGame } from './games/FlappyBird.js';
import { Game2048Mobile } from './games/Game2048.js';
import { DunkShotGame } from './games/DunkShot.js';
import { HighwayRacerMobile } from './games/HighwayRacer.js';
import { BrickBreakerMobile } from './games/BrickBreaker.js';
import { WhackAMoleGame } from './games/WhackAMole.js';
import { MemoryCardsMobile } from './games/MemoryCards.js';
import { TicTacToeMobile } from './games/TicTacToe.js';
import { PongRallyMobile } from './games/PongRally.js';
import { ZigZagGame } from './games/ZigZag.js';
import { SpaceShooterMobile } from './games/SpaceShooter.js';

export const MOBILE_GAMES = [
  {
    id: 'knife-hit',
    title: 'Blade Dash: Target Master',
    category: 'action',
    categoryName: 'Action & Timing',
    desc: 'Fling sharp steel daggers into spinning timber targets. Pure timing adrenaline!',
    icon: '🎯',
    color: '#4F46E5',
    bg: '#EEF2FF',
    badge: '★ Featured',
    controls: '🖱️ Tap / Space / Click to fling dagger into rotating target.',
    factory: (canvas, audio, onScore, onGameOver) => new KnifeHitGame(canvas, audio, onScore, onGameOver)
  },
  {
    id: 'fruit-snake',
    title: 'Snaky: Garden Fruit Quest',
    category: 'arcade',
    categoryName: 'Classic Arcade',
    desc: 'Guide the lively emerald serpent, gobble sweet orchard apples, and set records.',
    icon: '🐍',
    color: '#10B981',
    bg: '#ECFDF5',
    badge: 'Classic',
    controls: '⬆️ ⬇️ ⬅️ ➡️ Arrow keys or Swipe screen to steer snake.',
    factory: (canvas, audio, onScore, onGameOver) => new SnakeGame(canvas, audio, onScore, onGameOver)
  },
  {
    id: 'color-bounce',
    title: 'Color Hop: Ring Switch 3D',
    category: 'reflex',
    categoryName: 'Reflex & Rhythm',
    desc: 'Bounce through spinning multi-color rings matching your glowing ball color.',
    icon: '🎨',
    color: '#0284C7',
    bg: '#F0F9FF',
    badge: 'Trending',
    controls: '🖱️ Tap / Space to hop ball up through matching colored arcs.',
    factory: (canvas, audio, onScore, onGameOver) => new ColorBounceGame(canvas, audio, onScore, onGameOver)
  },
  {
    id: 'tower-stack',
    title: 'Stack City: Skyscraper 3D',
    category: 'reflex',
    categoryName: 'Precision & Reflex',
    desc: 'Stack moving pastel high-rise slabs with pure timing. Overhangs get sliced!',
    icon: '🏙️',
    color: '#8B5CF6',
    bg: '#F5F3FF',
    badge: 'Popular',
    controls: '🖱️ Tap / Space to drop block at perfect vertical alignment.',
    factory: (canvas, audio, onScore, onGameOver) => new TowerStackGame(canvas, audio, onScore, onGameOver)
  },
  {
    id: 'flappy-aviator',
    title: 'Sky Glider: Aviator Wings',
    category: 'action',
    categoryName: 'Action & Flight',
    desc: 'Glide an aviator bird through tricky green pillars with silky aerodynamic flight.',
    icon: '🐥',
    color: '#F59E0B',
    bg: '#FFFBEB',
    badge: 'Addictive',
    controls: '🖱️ Tap / Space to flap wings and glide through gaps safely.',
    factory: (canvas, audio, onScore, onGameOver) => new FlappyBirdGame(canvas, audio, onScore, onGameOver)
  },
  {
    id: 'game-2048',
    title: '2048 Deluxe: Pastel Numbers',
    category: 'puzzle',
    categoryName: 'Brain & Logic',
    desc: 'Slide and combine matching numeric tiles across 4x4 grid to reach 2048!',
    icon: '🔢',
    color: '#6366F1',
    bg: '#EEF2FF',
    badge: 'Top Pick',
    controls: '⬆️ ⬇️ ⬅️ ➡️ Arrow keys or Swipe to slide & merge matching numbers.',
    factory: (canvas, audio, onScore, onGameOver) => new Game2048Mobile(canvas, audio, onScore, onGameOver)
  },
  {
    id: 'dunk-shot',
    title: 'Street Hoops: Dunk Champion',
    category: 'sports',
    categoryName: 'Sports & Aim',
    desc: 'Pull back slingshot trajectory to swish basketballs into floating hoops.',
    icon: '🏀',
    color: '#EA580C',
    bg: '#FFF7ED',
    badge: 'Hot',
    controls: '🖱️ Drag back and release to shoot ball into moving basket.',
    factory: (canvas, audio, onScore, onGameOver) => new DunkShotGame(canvas, audio, onScore, onGameOver)
  },
  {
    id: 'highway-racer',
    title: 'Nitro Chase: Highway Rush 3D',
    category: 'action',
    categoryName: 'Racing & Speed',
    desc: 'Weave across 3 turbo highway lanes, dodge commuter traffic, and pop nitro!',
    icon: '🏎️',
    color: '#F43F5E',
    bg: '#FFF1F2',
    badge: 'Fast',
    controls: '⬅️ ➡️ Left/Right arrow keys or tap screen sides to switch lanes.',
    factory: (canvas, audio, onScore, onGameOver) => new HighwayRacerMobile(canvas, audio, onScore, onGameOver)
  },
  {
    id: 'brick-breaker',
    title: 'Prism Breaker: Neon Brick Blast',
    category: 'arcade',
    categoryName: 'Classic Arcade',
    desc: 'Demolish glowing prism bricks with high-velocity laser balls and paddle spin.',
    icon: '🧱',
    color: '#06B6D4',
    bg: '#ECFEFF',
    badge: 'Retro',
    controls: '🖱️ Move paddle left/right with touch or mouse to bounce laser ball.',
    factory: (canvas, audio, onScore, onGameOver) => new BrickBreakerMobile(canvas, audio, onScore, onGameOver)
  },
  {
    id: 'whack-a-mole',
    title: 'Bot Buster: Reflex Frenzy',
    category: 'reflex',
    categoryName: 'Reflex & Speed',
    desc: 'Smash mischievous yellow bots as they pop out of 9 bunker holes before time runs out.',
    icon: '🔨',
    color: '#4F46E5',
    bg: '#EEF2FF',
    badge: 'Frenzy',
    controls: '🖱️ Tap or click smiling bots as they jump from holes.',
    factory: (canvas, audio, onScore, onGameOver) => new WhackAMoleGame(canvas, audio, onScore, onGameOver)
  },
  {
    id: 'memory-matrix',
    title: 'Memory Magic: Flip & Match',
    category: 'puzzle',
    categoryName: 'Brain & Memory',
    desc: 'Flip 16 enchanted holographic cards to uncover matching pairs in minimum moves.',
    icon: '🃏',
    color: '#A855F7',
    bg: '#FAF5FF',
    badge: 'Mind',
    controls: '🖱️ Tap cards to flip and reveal matching pairs.',
    factory: (canvas, audio, onScore, onGameOver) => new MemoryCardsMobile(canvas, audio, onScore, onGameOver)
  },
  {
    id: 'zigzag-runner',
    title: 'ZigZag Canyon: Crystal Run',
    category: 'reflex',
    categoryName: 'Reflex & Action',
    desc: 'Tap to make sharp 90° turns along endless floating isometric cliff paths.',
    icon: '⚡',
    color: '#EC4899',
    bg: '#FDF2F8',
    badge: 'Addictive',
    controls: '🖱️ Tap / Space / Click to switch 90° direction on walkway.',
    factory: (canvas, audio, onScore, onGameOver) => new ZigZagGame(canvas, audio, onScore, onGameOver)
  },
  {
    id: 'tictactoe-ai',
    title: 'Master XO: Neural Duel',
    category: 'puzzle',
    categoryName: 'Puzzle & Strategy',
    desc: 'Challenge an intelligent tactical neural AI on a sleek minimalist board.',
    icon: '⭕',
    color: '#64748B',
    bg: '#F8FAFC',
    badge: 'Strategy',
    controls: '🖱️ Tap any empty square to place your symbol.',
    factory: (canvas, audio, onScore, onGameOver) => new TicTacToeMobile(canvas, audio, onScore, onGameOver)
  },
  {
    id: 'pong-rally',
    title: 'Smash Rally: Pro Table Tennis',
    category: 'sports',
    categoryName: 'Sports & AI',
    desc: 'Drag paddle to spin powerful table tennis returns past the robot goalkeeper.',
    icon: '🏓',
    color: '#0284C7',
    bg: '#F0F9FF',
    badge: 'Rally',
    controls: '🖱️ Drag paddle vertically with finger or mouse to rally ball.',
    factory: (canvas, audio, onScore, onGameOver) => new PongRallyMobile(canvas, audio, onScore, onGameOver)
  },
  {
    id: 'space-defender',
    title: 'Star Strike: Galaxy Invaders',
    category: 'arcade',
    categoryName: 'Arcade Shooter',
    desc: 'Pilot a twin-plasma starfighter through asteroid fields blasting alien armadas.',
    icon: '🚀',
    color: '#4F46E5',
    bg: '#EEF2FF',
    badge: 'Epic',
    controls: '🖱️ Drag starfighter to steer. Rapid lasers fire automatically!',
    factory: (canvas, audio, onScore, onGameOver) => new SpaceShooterMobile(canvas, audio, onScore, onGameOver)
  }
];

class MobileApp {
  constructor() {
    this.currentCategory = 'all';
    this.currentSort = 'popular';
    this.searchQuery = '';
    this.activeGameInstance = null;
    this.activeGameLoop = null;
    this.currentScore = 0;
    this.currentHighScore = 0;
    this.isPaused = false;
    this.lastLoopTime = performance.now();

    this.initDOM();
    this.bindEvents();
    this.renderGameList();
  }

  initDOM() {
    this.gridEl = document.getElementById('mobileGamesGrid');
    this.playerModal = document.getElementById('gamePlayerModal');
    this.playerCanvas = document.getElementById('playerCanvas');
    this.scoreValEl = document.getElementById('hudScore');
    this.bestValEl = document.getElementById('hudBest');
    this.gameTitleEl = document.getElementById('playerGameTitle');
    this.gameOverDialog = document.getElementById('gameOverDialog');
    this.pauseDialog = document.getElementById('gamePauseOverlay');
    this.dialogFinalScore = document.getElementById('dialogFinalScore');
    this.dialogBestScore = document.getElementById('dialogBestScore');
    this.totalPlaysEl = document.getElementById('totalPlaysVal');
    this.snakeFedValEl = document.getElementById('snakeFedVal');
    this.controlsHelperText = document.getElementById('controlsHelperText');

    if (this.totalPlaysEl) {
      this.totalPlaysEl.textContent = mobileStorage.getTotalPlayed();
    }

    // Initialize Autonomous Background Snake with Feed Callback
    const snakeCanvas = document.getElementById('bgSnakeCanvas');
    if (snakeCanvas) {
      this.bgSnake = new BgSnake(snakeCanvas, (fruitsCount) => {
        if (this.snakeFedValEl) {
          this.snakeFedValEl.textContent = fruitsCount;
          this.snakeFedValEl.parentElement?.classList.add('snack-pop');
          setTimeout(() => this.snakeFedValEl.parentElement?.classList.remove('snack-pop'), 400);
        }
      });
    }

    // Set Spotlight Card Icon & Info
    const spotlightIconEl = document.querySelector('.spotlight-icon');
    if (spotlightIconEl && GAME_ARTWORK['knife-hit']) {
      spotlightIconEl.innerHTML = GAME_ARTWORK['knife-hit'];
    }
  }

  bindEvents() {
    // Spotlight hero card play button
    const btnSpotlight = document.getElementById('btnSpotlightPlay');
    if (btnSpotlight) {
      btnSpotlight.addEventListener('click', () => {
        mobileAudio.tap();
        const feat = MOBILE_GAMES.find(g => g.id === 'knife-hit') || MOBILE_GAMES[0];
        this.launchGame(feat);
      });
    }

    // Surprise Me / Random Game Roulette Buttons
    const surpriseBtns = [
      document.getElementById('btnHeaderSurprise'),
      document.getElementById('btnHeroSurprise')
    ];
    surpriseBtns.forEach(btn => {
      if (btn) {
        btn.addEventListener('click', () => {
          this.launchRandomGame();
        });
      }
    });

    // Ambiance Theme Switcher
    const btnAmbient = document.getElementById('btnThemeAmbient');
    if (btnAmbient) {
      const themes = ['☀️', '🌅', '🌿', '🌌'];
      let themeIdx = 0;
      btnAmbient.addEventListener('click', () => {
        mobileAudio.click();
        themeIdx = (themeIdx + 1) % themes.length;
        btnAmbient.textContent = themes[themeIdx];
        document.body.className = `theme-${['white', 'sunset', 'mint', 'lavender'][themeIdx]}`;
      });
    }

    // Category pill filtering
    const pills = document.querySelectorAll('.cat-pill');
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        mobileAudio.tap();
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.currentCategory = pill.dataset.cat;
        this.renderGameList();
      });
    });

    // Sort Pills
    const sortChips = document.querySelectorAll('.sort-chip');
    sortChips.forEach(chip => {
      chip.addEventListener('click', () => {
        mobileAudio.tap();
        sortChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.currentSort = chip.dataset.sort;
        this.renderGameList();
      });
    });

    // Search bar live filter
    const searchInput = document.getElementById('mobileSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.renderGameList();
      });

      // Quick keyboard shortcut: '/' to focus search
      window.addEventListener('keydown', (e) => {
        if (e.key === '/' && document.activeElement !== searchInput && !this.playerModal.classList.contains('active')) {
          e.preventDefault();
          searchInput.focus();
        } else if (e.key === 'r' && !this.playerModal.classList.contains('active') && document.activeElement !== searchInput) {
          e.preventDefault();
          this.launchRandomGame();
        } else if (e.key === 'm' && document.activeElement !== searchInput) {
          const isMuted = mobileAudio.toggleMute();
          const muteBtn = document.getElementById('btnMuteAudio');
          if (muteBtn) muteBtn.textContent = isMuted ? '🔇' : '🔊';
        }
      });
    }

    // Modal back / exit button
    document.getElementById('btnExitGame')?.addEventListener('click', () => {
      mobileAudio.tap();
      this.exitActiveGame();
    });

    // Modal mute button
    document.getElementById('btnMuteAudio')?.addEventListener('click', (e) => {
      const isMuted = mobileAudio.toggleMute();
      e.currentTarget.textContent = isMuted ? '🔇' : '🔊';
    });

    // Modal pause button
    document.getElementById('btnPauseGame')?.addEventListener('click', () => {
      this.togglePause();
    });

    // Pause Dialog buttons
    document.getElementById('btnResumeGame')?.addEventListener('click', () => {
      mobileAudio.tap();
      this.togglePause(false);
    });

    document.getElementById('btnRestartFromPause')?.addEventListener('click', () => {
      mobileAudio.tap();
      this.togglePause(false);
      this.restartActiveGame();
    });

    document.getElementById('btnExitFromPause')?.addEventListener('click', () => {
      mobileAudio.tap();
      this.togglePause(false);
      this.exitActiveGame();
    });

    // Fullscreen toggle button
    document.getElementById('btnFullscreenGame')?.addEventListener('click', () => {
      mobileAudio.click();
      this.toggleFullscreen();
    });

    // Play again button (Game Over)
    document.getElementById('btnPlayAgain')?.addEventListener('click', () => {
      mobileAudio.tap();
      this.restartActiveGame();
    });

    // Exit from game over
    document.getElementById('btnExitFromOver')?.addEventListener('click', () => {
      mobileAudio.tap();
      this.exitActiveGame();
    });

    // Global Key Listener for Pause (Esc or P)
    window.addEventListener('keydown', (e) => {
      if (this.playerModal.classList.contains('active')) {
        if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
          if (!this.gameOverDialog.classList.contains('hidden')) {
            this.exitActiveGame();
          } else {
            this.togglePause();
          }
        }
      }
    });

    // Bottom navigation bar
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        mobileAudio.tap();
        navItems.forEach(n => n.classList.remove('active'));
        item.classList.add('active');
        const view = item.dataset.view;

        if (view === 'favorites') {
          this.currentCategory = 'favorites';
        } else if (view === 'top') {
          this.currentCategory = 'top';
        } else {
          this.currentCategory = 'all';
        }
        this.renderGameList();
      });
    });

    // Window resize handler for mobile rotation & viewport changes
    window.addEventListener('resize', () => {
      if (this.activeGameInstance) {
        this.resizePlayerCanvas();
      }
    });
  }

  launchRandomGame() {
    mobileAudio.whoosh();
    const randomIndex = Math.floor(Math.random() * MOBILE_GAMES.length);
    const chosenGame = MOBILE_GAMES[randomIndex];

    if (navigator.vibrate) navigator.vibrate([20, 40, 20]);
    this.launchGame(chosenGame);
  }

  togglePause(forceState = null) {
    if (!this.activeGameInstance) return;
    mobileAudio.tap();
    this.isPaused = forceState !== null ? forceState : !this.isPaused;

    if (this.pauseDialog) {
      this.pauseDialog.classList.toggle('hidden', !this.isPaused);
    }

    if (!this.isPaused) {
      this.lastLoopTime = performance.now();
    }
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      this.playerModal.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
    setTimeout(() => this.resizePlayerCanvas(), 100);
  }

  resizePlayerCanvas() {
    if (!this.playerCanvas) return;
    const wrap = document.getElementById('canvasWrap');
    if (!wrap) return;

    // Available size inside canvas wrap area accounting for padding
    const availW = Math.max(260, wrap.clientWidth - 16);
    const availH = Math.max(320, wrap.clientHeight - 48);

    // Maintain strict 2:3 aspect ratio (400w x 600h)
    const scale = Math.min(availW / 400, availH / 600, 1.05);
    const displayW = Math.floor(400 * scale);
    const displayH = Math.floor(600 * scale);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.playerCanvas.width = 400 * dpr;
    this.playerCanvas.height = 600 * dpr;
    this.playerCanvas.style.width = `${displayW}px`;
    this.playerCanvas.style.height = `${displayH}px`;

    const ctx = this.playerCanvas.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  }

  renderGameList() {
    let list = [...MOBILE_GAMES];

    // Filter by bottom bar / category
    if (this.currentCategory === 'favorites') {
      const favs = mobileStorage.getFavorites();
      list = list.filter(g => favs.includes(g.id));
    } else if (this.currentCategory === 'top') {
      list = list.sort((a, b) => mobileStorage.getHighScore(b.id) - mobileStorage.getHighScore(a.id));
    } else if (this.currentCategory !== 'all') {
      list = list.filter(g => g.category === this.currentCategory);
    }

    // Filter by search
    if (this.searchQuery) {
      list = list.filter(g =>
        g.title.toLowerCase().includes(this.searchQuery) ||
        g.desc.toLowerCase().includes(this.searchQuery) ||
        g.categoryName.toLowerCase().includes(this.searchQuery)
      );
    }

    // Apply Sorting
    if (this.currentSort === 'top') {
      list.sort((a, b) => mobileStorage.getHighScore(b.id) - mobileStorage.getHighScore(a.id));
    } else if (this.currentSort === 'az') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    }

    // Update section counter
    const counterBadge = document.getElementById('gamesCountBadge');
    if (counterBadge) {
      counterBadge.textContent = `${list.length} Game${list.length === 1 ? '' : 's'}`;
    }

    if (list.length === 0) {
      this.gridEl.innerHTML = `
        <div class="empty-state">
          <div style="font-size: 2.8rem; margin-bottom: 8px;">🔍</div>
          <h3 style="font-weight: 700; color: #1E293B;">No matching games</h3>
          <p style="color: #64748B; font-size: 0.9rem; margin-top: 4px;">Try searching for a different keyword or choose another category.</p>
        </div>
      `;
      return;
    }

    this.gridEl.innerHTML = '';
    list.forEach(game => {
      const isFav = mobileStorage.isFavorite(game.id);
      const highScore = mobileStorage.getHighScore(game.id);
      const svgArt = GAME_ARTWORK[game.id] || `<span style="font-size: 2rem;">${game.icon}</span>`;

      const card = document.createElement('div');
      card.className = 'mobile-game-card';
      card.innerHTML = `
        <div class="card-art-box" style="background: ${game.bg};">
          ${svgArt}
        </div>
        <div class="card-info">
          <div class="card-header-row">
            <span class="card-title">${game.title}</span>
            <div class="card-header-actions">
              <span class="card-badge" style="background: ${game.bg}; color: ${game.color};">${game.badge}</span>
              <button class="btn-card-fav ${isFav ? 'is-fav' : ''}" title="Favorite" data-id="${game.id}">
                ${isFav ? '❤️' : '🤍'}
              </button>
            </div>
          </div>
          <p class="card-desc">${game.desc}</p>
          <div class="card-meta-chips">
            <span class="meta-chip">⏱️ 1-2 min</span>
            <span class="meta-chip">★ 4.9</span>
            <span class="meta-chip" style="color: ${game.color}; font-weight: 800;">${game.categoryName}</span>
          </div>
          <div class="card-footer-row">
            <span class="card-score">Best: <strong>${highScore}</strong></span>
            <button class="card-play-btn" style="background: ${game.color};">PLAY ▶</button>
          </div>
        </div>
      `;

      // Handle card click to launch game
      card.addEventListener('click', () => {
        mobileAudio.tap();
        if (navigator.vibrate) navigator.vibrate(15);
        this.launchGame(game);
      });

      // Handle heart favorite click without launching
      const favBtn = card.querySelector('.btn-card-fav');
      if (favBtn) {
        favBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          mobileAudio.pop();
          if (navigator.vibrate) navigator.vibrate(20);
          const nowFav = mobileStorage.toggleFavorite(game.id);
          favBtn.textContent = nowFav ? '❤️' : '🤍';
          favBtn.classList.toggle('is-fav', nowFav);
          if (this.currentCategory === 'favorites' && !nowFav) {
            this.renderGameList();
          }
        });
      }

      this.gridEl.appendChild(card);
    });
  }

  launchGame(game, showAnimation = true) {
    // Stop any existing game loop
    if (this.activeGameLoop) {
      cancelAnimationFrame(this.activeGameLoop);
      this.activeGameLoop = null;
    }
    if (this.activeGameInstance && typeof this.activeGameInstance.destroy === 'function') {
      this.activeGameInstance.destroy();
      this.activeGameInstance = null;
    }

    this.currentGame = game;
    this.currentScore = 0;
    this.currentHighScore = mobileStorage.getHighScore(game.id);
    this.isPaused = false;

    this.gameTitleEl.textContent = game.title;
    this.scoreValEl.textContent = '0';
    this.bestValEl.textContent = this.currentHighScore.toString();
    this.gameOverDialog.classList.add('hidden');
    if (this.pauseDialog) this.pauseDialog.classList.add('hidden');

    // Update controls guide text
    if (this.controlsHelperText) {
      this.controlsHelperText.textContent = game.controls || 'Tap or click to play!';
    }

    // Show modal with slide-up
    this.playerModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    mobileStorage.recordPlay(game.id);
    if (this.totalPlaysEl) {
      this.totalPlaysEl.textContent = mobileStorage.getTotalPlayed();
    }

    // Setup canvas with 100% responsive aspect ratio fitting
    this.resizePlayerCanvas();

    if (showAnimation) {
      snakeTransition.play(game, () => {
        this.startActiveGameSession(game);
      });
    } else {
      this.startActiveGameSession(game);
    }
  }

  startActiveGameSession(game) {
    if (!this.playerModal.classList.contains('active')) return;
    this.resizePlayerCanvas();

    // Instantiate game
    this.activeGameInstance = game.factory(
      this.playerCanvas,
      mobileAudio,
      (score) => {
        this.currentScore = score;
        this.scoreValEl.textContent = score.toString();
        if (score > this.currentHighScore) {
          this.currentHighScore = score;
          this.bestValEl.textContent = score.toString();
        }
      },
      (finalScore) => {
        const isNewBest = mobileStorage.saveHighScore(game.id, finalScore);
        this.showGameOver(finalScore, isNewBest);
      }
    );

    this.activeGameInstance.start();

    // Start 60 FPS Game Loop
    this.lastLoopTime = performance.now();
    const tick = (now) => {
      const dt = Math.min(0.1, (now - this.lastLoopTime) / 1000);
      this.lastLoopTime = now;

      if (!this.isPaused) {
        if (this.activeGameInstance && typeof this.activeGameInstance.update === 'function') {
          this.activeGameInstance.update(dt);
        }
        if (this.activeGameInstance && typeof this.activeGameInstance.render === 'function') {
          this.activeGameInstance.render();
        }
      }

      this.activeGameLoop = requestAnimationFrame(tick);
    };

    this.activeGameLoop = requestAnimationFrame(tick);
  }

  showGameOver(score, isNewBest) {
    this.dialogFinalScore.textContent = score.toString();
    this.dialogBestScore.textContent = mobileStorage.getHighScore(this.currentGame.id).toString();

    const banner = document.getElementById('newBestBanner');
    if (banner) {
      banner.style.display = isNewBest ? 'block' : 'none';
    }

    if (isNewBest) {
      mobileAudio.celebrate();
      if (navigator.vibrate) navigator.vibrate([40, 60, 40, 80]);
    } else {
      if (navigator.vibrate) navigator.vibrate(30);
    }

    this.gameOverDialog.classList.remove('hidden');
  }

  restartActiveGame() {
    this.gameOverDialog.classList.add('hidden');
    if (this.pauseDialog) this.pauseDialog.classList.add('hidden');
    if (this.currentGame) {
      this.launchGame(this.currentGame, true);
    }
  }

  exitActiveGame() {
    snakeTransition.finishEarly();

    if (this.activeGameLoop) {
      cancelAnimationFrame(this.activeGameLoop);
      this.activeGameLoop = null;
    }
    if (this.activeGameInstance) {
      if (typeof this.activeGameInstance.destroy === 'function') {
        this.activeGameInstance.destroy();
      }
      this.activeGameInstance = null;
    }

    this.playerModal.classList.remove('active');
    document.body.style.overflow = '';
    this.renderGameList();
  }
}

// Auto-boot on load
window.addEventListener('DOMContentLoaded', () => {
  new MobileApp();
});
