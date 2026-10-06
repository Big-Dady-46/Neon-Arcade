import { mobileAudio } from './engine/Audio.js';
import { mobileStorage } from './engine/Storage.js';
import { GAME_ARTWORK } from './engine/GameArtwork.js';

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
    title: 'Blade Dash',
    fullName: 'Blade Dash: Target Master',
    category: 'reflex',
    categoryName: 'Reflex & Action',
    desc: 'Fling steel kunai blades into spinning timber targets. Pure timing adrenaline!',
    icon: '🎯',
    color: '#00F2FE',
    badge: 'HOT',
    controlsType: 'tap',
    factory: (canvas, audio, onScore, onGameOver) => new KnifeHitGame(canvas, audio, onScore, onGameOver)
  },
  {
    id: 'fruit-snake',
    title: 'Cyber Snake',
    fullName: 'Cyber Snake: Neon Fruit Quest',
    category: 'arcade',
    categoryName: 'Arcade Classics',
    desc: 'Steer the glowing neon serpent, devour energy apples, and shatter records.',
    icon: '🐍',
    color: '#10B981',
    badge: 'CLASSIC',
    controlsType: 'dpad',
    factory: (canvas, audio, onScore, onGameOver) => new SnakeGame(canvas, audio, onScore, onGameOver)
  },
  {
    id: 'color-bounce',
    title: 'Color Switch',
    fullName: 'Color Switch: Ring Hopper',
    category: 'reflex',
    categoryName: 'Reflex & Action',
    desc: 'Hop through spinning neon rings matching your glowing ball color.',
    icon: '🎨',
    color: '#00F2FE',
    badge: 'POPULAR',
    controlsType: 'tap',
    factory: (canvas, audio, onScore, onGameOver) => new ColorBounceGame(canvas, audio, onScore, onGameOver)
  },
  {
    id: 'tower-stack',
    title: 'Stack 3D',
    fullName: 'Stack 3D: Skyscraper',
    category: 'reflex',
    categoryName: 'Reflex & Action',
    desc: 'Stack moving high-rise cyber slabs with precision. Overhangs get sliced!',
    icon: '🏙️',
    color: '#7928CA',
    badge: 'TRENDING',
    controlsType: 'tap',
    factory: (canvas, audio, onScore, onGameOver) => new TowerStackGame(canvas, audio, onScore, onGameOver)
  },
  {
    id: 'flappy-aviator',
    title: 'Flappy Wings',
    fullName: 'Flappy Wings: Aviator Dash',
    category: 'reflex',
    categoryName: 'Reflex & Action',
    desc: 'Glide an aviator bird through laser green columns with aerodynamic flight.',
    icon: '🐥',
    color: '#FFD700',
    badge: 'ADDICTIVE',
    controlsType: 'flappy',
    factory: (canvas, audio, onScore, onGameOver) => new FlappyBirdGame(canvas, audio, onScore, onGameOver)
  },
  {
    id: 'game-2048',
    title: '2048 Neon',
    fullName: '2048 Neon: Puzzle Grid',
    category: 'puzzle',
    categoryName: 'Puzzle & Logic',
    desc: 'Slide and merge matching cyber number tiles across a 4x4 grid to reach 2048!',
    icon: '🔢',
    color: '#6366F1',
    badge: 'BRAIN',
    controlsType: 'dpad',
    factory: (canvas, audio, onScore, onGameOver) => new Game2048Mobile(canvas, audio, onScore, onGameOver)
  },
  {
    id: 'dunk-shot',
    title: 'Street Hoops',
    fullName: 'Street Hoops: Dunk Master',
    category: 'sports',
    categoryName: 'Sports & Physics',
    desc: 'Drag back slingshot trajectory to swish basketballs into floating hoops.',
    icon: '🏀',
    color: '#EA580C',
    badge: 'HOT',
    controlsType: 'drag',
    factory: (canvas, audio, onScore, onGameOver) => new DunkShotGame(canvas, audio, onScore, onGameOver)
  },
  {
    id: 'highway-racer',
    title: 'Nitro Chase',
    fullName: 'Nitro Chase: Highway Rush',
    category: 'racing',
    categoryName: 'Racing & Speed',
    desc: 'Weave across 3 turbo highway lanes, dodge commuter traffic, and hit nitro!',
    icon: '🏎️',
    color: '#FF007A',
    badge: 'FAST',
    controlsType: 'racing',
    factory: (canvas, audio, onScore, onGameOver) => new HighwayRacerMobile(canvas, audio, onScore, onGameOver)
  },
  {
    id: 'brick-breaker',
    title: 'Prism Blast',
    fullName: 'Prism Blast: Brick Breaker',
    category: 'arcade',
    categoryName: 'Arcade Classics',
    desc: 'Demolish glowing prism bricks with laser balls and high-speed paddle spin.',
    icon: '🧱',
    color: '#06B6D4',
    badge: 'RETRO',
    controlsType: 'paddle',
    factory: (canvas, audio, onScore, onGameOver) => new BrickBreakerMobile(canvas, audio, onScore, onGameOver)
  },
  {
    id: 'whack-a-mole',
    title: 'Bot Buster',
    fullName: 'Bot Buster: Reflex Frenzy',
    category: 'reflex',
    categoryName: 'Reflex & Action',
    desc: 'Smash mischievous cyber bots as they pop out of bunker hatches.',
    icon: '🔨',
    color: '#00F2FE',
    badge: 'SPEED',
    controlsType: 'tap',
    factory: (canvas, audio, onScore, onGameOver) => new WhackAMoleGame(canvas, audio, onScore, onGameOver)
  },
  {
    id: 'memory-matrix',
    title: 'Memory Cards',
    fullName: 'Memory Cards: Hologram Match',
    category: 'puzzle',
    categoryName: 'Puzzle & Logic',
    desc: 'Flip 16 enchanted holographic cards to uncover matching pairs in minimum moves.',
    icon: '🃏',
    color: '#7928CA',
    badge: 'MEMORY',
    controlsType: 'tap',
    factory: (canvas, audio, onScore, onGameOver) => new MemoryCardsMobile(canvas, audio, onScore, onGameOver)
  },
  {
    id: 'zigzag-runner',
    title: 'ZigZag Run',
    fullName: 'ZigZag Run: Crystal Path',
    category: 'reflex',
    categoryName: 'Reflex & Action',
    desc: 'Tap to make sharp 90° turns along endless floating isometric cliff paths.',
    icon: '⚡',
    color: '#FF007A',
    badge: 'REFLEX',
    controlsType: 'tap',
    factory: (canvas, audio, onScore, onGameOver) => new ZigZagGame(canvas, audio, onScore, onGameOver)
  },
  {
    id: 'tictactoe-ai',
    title: 'Master XO',
    fullName: 'Master XO: Cyber AI Duel',
    category: 'puzzle',
    categoryName: 'Puzzle & Logic',
    desc: 'Challenge an intelligent tactical neural AI on a sleek cyber board.',
    icon: '⭕',
    color: '#A7ADBF',
    badge: 'TACTIC',
    controlsType: 'tap',
    factory: (canvas, audio, onScore, onGameOver) => new TicTacToeMobile(canvas, audio, onScore, onGameOver)
  },
  {
    id: 'pong-rally',
    title: 'Smash Pong',
    fullName: 'Smash Pong: Pro Table Tennis',
    category: 'sports',
    categoryName: 'Sports & Physics',
    desc: 'Drag paddle to spin powerful table tennis returns past the robot opponent.',
    icon: '🏓',
    color: '#00F2FE',
    badge: 'SPORTS',
    controlsType: 'paddle',
    factory: (canvas, audio, onScore, onGameOver) => new PongRallyMobile(canvas, audio, onScore, onGameOver)
  },
  {
    id: 'space-defender',
    title: 'Star Strike',
    fullName: 'Star Strike: Galaxy Invaders',
    category: 'arcade',
    categoryName: 'Arcade Classics',
    desc: 'Pilot a twin-plasma starfighter through asteroid fields blasting alien armadas.',
    icon: '🚀',
    color: '#7928CA',
    badge: 'EPIC',
    controlsType: 'shooter',
    factory: (canvas, audio, onScore, onGameOver) => new SpaceShooterMobile(canvas, audio, onScore, onGameOver)
  }
];

class MobileApp {
  constructor() {
    this.currentCategory = 'all';
    this.searchQuery = '';
    this.activeGameInstance = null;
    this.activeGameLoop = null;
    this.currentGame = null;
    this.currentScore = 0;
    this.currentHighScore = 0;
    this.isPaused = false;
    this.lastLoopTime = performance.now();

    // Featured games for the Hero Carousel
    this.featuredGames = [
      MOBILE_GAMES[0],  // Blade Dash
      MOBILE_GAMES[7],  // Nitro Chase
      MOBILE_GAMES[14]  // Star Strike
    ];
    this.heroIdx = 0;
    this.heroTimer = null;

    this.allGameIds = MOBILE_GAMES.map(g => g.id);

    this.initDOM();
    this.bindEvents();
    this.renderHero(0);
    this.startHeroCarousel();
    this.startHeroCanvasAnimation();
    this.renderGameList();
  }

  initDOM() {
    this.gridEl = document.getElementById('mobileGameGrid');
    this.playerModal = document.getElementById('gamePlayerModal');
    this.playerCanvas = document.getElementById('playerCanvas');
    this.scoreValEl = document.getElementById('hudScore');
    this.bestValEl = document.getElementById('hudBest');
    this.gameTitleEl = document.getElementById('playerGameTitle');
    this.gameOverDialog = document.getElementById('gameOverDialog');
    this.pauseDialog = document.getElementById('gamePauseOverlay');
    this.dialogFinalScore = document.getElementById('dialogFinalScore');
    this.dialogBestScore = document.getElementById('dialogBestScore');
    this.touchControlsEl = document.getElementById('gameTouchControls');
    this.sectionTitleEl = document.getElementById('sectionTitle');
    this.sectionSubtextEl = document.getElementById('sectionSubtext');
    this.gamesCountBadge = document.getElementById('gamesCountBadge');
  }

  renderHero(idx = 0) {
    this.heroIdx = idx % this.featuredGames.length;
    const feat = this.featuredGames[this.heroIdx];
    if (!feat) return;

    const artFrame = document.getElementById('heroArtworkFrame');
    if (artFrame && GAME_ARTWORK[feat.id]) {
      artFrame.innerHTML = GAME_ARTWORK[feat.id];
      artFrame.style.background = `radial-gradient(circle at 50% 50%, ${feat.color}35 0%, #121522 75%)`;
    }

    const titleEl = document.getElementById('heroTitle');
    const descEl = document.getElementById('heroDesc');
    const tagEl = document.getElementById('heroCategoryTag');
    const badgeTextEl = document.getElementById('heroBadgeText');
    const bestValEl = document.getElementById('heroBestVal');

    if (titleEl) titleEl.textContent = feat.title;
    if (descEl) descEl.textContent = feat.desc;
    if (tagEl) {
      tagEl.textContent = feat.categoryName.toUpperCase();
      tagEl.style.color = feat.color;
    }
    if (badgeTextEl) {
      badgeTextEl.textContent = this.heroIdx === 0 ? '🔥 #1 TRENDING ARCADE' : (this.heroIdx === 1 ? '⚡ SPEED DEMON' : '👾 CYBER CLASSIC');
    }
    if (bestValEl) {
      bestValEl.textContent = mobileStorage.getHighScore(feat.id);
    }

    // Update dots
    const dots = document.querySelectorAll('.hero-dot');
    dots.forEach((dot, dIdx) => {
      dot.classList.toggle('active', dIdx === this.heroIdx);
    });

    const heroBtn = document.getElementById('btnHeroPlay');
    if (heroBtn) {
      heroBtn.onclick = () => {
        mobileAudio.tap();
        this.launchGame(feat);
      };
    }
  }

  startHeroCarousel() {
    if (this.heroTimer) clearInterval(this.heroTimer);
    this.heroTimer = setInterval(() => {
      // Rotate hero if not playing a game
      if (!this.activeGameInstance) {
        this.heroIdx = (this.heroIdx + 1) % this.featuredGames.length;
        this.renderHero(this.heroIdx);
      }
    }, 6000);
  }

  startHeroCanvasAnimation() {
    const canvas = document.getElementById('heroLiveCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let t = 0;

    const resize = () => {
      const card = canvas.parentElement;
      if (!card) return;
      const w = card.clientWidth || 360;
      const h = card.clientHeight || 236;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      // Pause drawing if player modal is active or tab hidden to preserve 60fps & battery
      if (this.activeGameInstance || document.hidden) {
        requestAnimationFrame(render);
        return;
      }

      t += 0.035;
      const card = canvas.parentElement;
      const w = card ? card.clientWidth : 360;
      const h = card ? card.clientHeight : 236;

      // Dark space background
      ctx.fillStyle = '#0F121E';
      ctx.fillRect(0, 0, w, h);

      // Retro Cyber Grid Boxes
      ctx.strokeStyle = 'rgba(0, 242, 254, 0.08)';
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

      // Winding Glowing Cyber Snake
      const cx = w * 0.72;
      const cy = h * 0.44;
      const segments = 16;

      ctx.save();
      for (let i = 0; i < segments; i++) {
        const sx = cx + Math.sin(t - i * 0.19) * (w * 0.25);
        const sy = cy + Math.cos((t - i * 0.19) * 0.85) * (h * 0.26);

        const isHead = i === 0;
        ctx.fillStyle = isHead ? '#00FF88' : `rgba(0, 242, 254, ${1 - i / segments})`;
        ctx.shadowColor = isHead ? '#00FF88' : '#00F2FE';
        ctx.shadowBlur = isHead ? 14 : 6;

        ctx.beginPath();
        ctx.arc(sx, sy, isHead ? 8.5 : 5.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Pulsing golden energy apple
      const fx = cx + Math.sin(t * 0.5) * 35;
      const fy = cy + Math.cos(t * 0.5) * 20;
      ctx.fillStyle = '#FFD700';
      ctx.shadowColor = '#FFD700';
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.arc(fx, fy, 7 + Math.sin(t * 3.5) * 1.8, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
      requestAnimationFrame(render);
    };

    requestAnimationFrame(render);
  }

  bindEvents() {
    // Hero dots click
    const dots = document.querySelectorAll('.hero-dot');
    dots.forEach(dot => {
      dot.addEventListener('click', (e) => {
        const idx = parseInt(e.target.dataset.idx || '0', 10);
        mobileAudio.tap();
        this.renderHero(idx);
        this.startHeroCarousel();
      });
    });

    // Sound Toggle Header Button
    const btnSound = document.getElementById('btnSoundToggle');
    const soundIcon = document.getElementById('soundIcon');
    if (btnSound) {
      btnSound.addEventListener('click', () => {
        const isMuted = mobileAudio.toggleMute();
        if (soundIcon) soundIcon.textContent = isMuted ? '🔇' : '🔊';
        mobileAudio.tap();
      });
    }

    // Mobile Menu / Gamer Profile Drawer
    const btnMenu = document.getElementById('btnMobileMenu');
    const drawerOverlay = document.getElementById('drawerOverlay');
    const btnCloseDrawer = document.getElementById('btnCloseDrawer');

    if (btnMenu) {
      btnMenu.addEventListener('click', () => {
        mobileAudio.tap();
        this.openDrawer();
      });
    }

    if (btnCloseDrawer && drawerOverlay) {
      btnCloseDrawer.addEventListener('click', () => {
        mobileAudio.tap();
        drawerOverlay.classList.add('hidden');
      });
      drawerOverlay.addEventListener('click', (e) => {
        if (e.target === drawerOverlay) drawerOverlay.classList.add('hidden');
      });
    }

    // Drawer Action Buttons
    document.getElementById('btnDrawerRandom')?.addEventListener('click', () => {
      drawerOverlay?.classList.add('hidden');
      this.launchRandomGame();
    });
    document.getElementById('btnDrawerDesktop')?.addEventListener('click', () => {
      window.location.href = '/?view=desktop';
    });

    // Category Bar Pills
    const pills = document.querySelectorAll('.category-pill');
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        mobileAudio.tap();
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        pill.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        this.currentCategory = pill.dataset.cat;
        this.updateSectionHeading(this.currentCategory);
        this.renderGameList();
      });
    });

    // Live Search
    const searchInput = document.getElementById('mobileSearchInput');
    const clearBtn = document.getElementById('btnClearSearch');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        if (clearBtn) clearBtn.classList.toggle('hidden', !this.searchQuery);
        this.renderGameList();
      });

      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          searchInput.value = '';
          this.searchQuery = '';
          clearBtn.classList.add('hidden');
          this.renderGameList();
        });
      }
    }

    // Bottom Navigation Bar
    const navItems = document.querySelectorAll('.bottom-nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        mobileAudio.tap();
        navItems.forEach(n => n.classList.remove('active'));
        item.classList.add('active');
        const nav = item.dataset.nav;

        if (nav === 'home') {
          this.selectCategory('all');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (nav === 'categories') {
          document.getElementById('mobileCategoryBar')?.scrollIntoView({ behavior: 'smooth' });
        } else if (nav === 'favorites') {
          this.selectCategory('favorites');
        } else if (nav === 'recent' || nav === 'profile') {
          this.openDrawer();
        }
      });
    });

    // Game Player Modal Controls
    document.getElementById('btnExitGame')?.addEventListener('click', () => {
      mobileAudio.tap();
      this.exitActiveGame();
    });

    document.getElementById('btnPauseGame')?.addEventListener('click', () => {
      this.togglePause();
    });

    document.getElementById('btnMuteAudio')?.addEventListener('click', (e) => {
      const isMuted = mobileAudio.toggleMute();
      e.currentTarget.textContent = isMuted ? '🔇' : '🔊';
    });

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

    document.getElementById('btnPlayAgain')?.addEventListener('click', () => {
      mobileAudio.tap();
      this.restartActiveGame();
    });

    document.getElementById('btnExitFromOver')?.addEventListener('click', () => {
      mobileAudio.tap();
      this.exitActiveGame();
    });

    window.addEventListener('resize', () => {
      if (this.activeGameInstance) {
        this.resizePlayerCanvas();
      }
    });
  }

  openDrawer() {
    const drawerOverlay = document.getElementById('drawerOverlay');
    if (!drawerOverlay) return;

    const totalPlays = mobileStorage.getTotalPlayed();
    const favCount = mobileStorage.getFavorites().length;
    const recordsCount = mobileStorage.getHighScoresCount(this.allGameIds);
    const userLvl = mobileStorage.getUserLevel(this.allGameIds);
    const userXp = mobileStorage.getUserXP(this.allGameIds);
    const xpInLevel = userXp % 500;
    const xpPercent = Math.min(100, Math.max(5, Math.floor((xpInLevel / 500) * 100)));

    const rankTitles = ['CYBER RECRUIT', 'ARCADE OPERATOR', 'GRID RUNNER', 'HIGH-SCORE MASTER', 'NEON LEGEND'];
    const titleIdx = Math.min(rankTitles.length - 1, Math.floor((userLvl - 1) / 2));
    const rankTitle = rankTitles[titleIdx];

    const lvlPill = document.getElementById('drawerLvlPill');
    if (lvlPill) lvlPill.textContent = `LVL ${userLvl} • ${rankTitle}`;

    const xpText = document.getElementById('drawerXpText');
    if (xpText) xpText.textContent = `${xpInLevel} / 500 XP`;

    const xpFill = document.getElementById('drawerXpFill');
    if (xpFill) xpFill.style.width = `${xpPercent}%`;

    const playsEl = document.getElementById('drawerTotalPlayed');
    const favsEl = document.getElementById('drawerFavoritesCount');
    const recEl = document.getElementById('drawerHighScoresCount');
    if (playsEl) playsEl.textContent = totalPlays.toString();
    if (favsEl) favsEl.textContent = favCount.toString();
    if (recEl) recEl.textContent = recordsCount.toString();

    // Render Recent Games list
    const recentListEl = document.getElementById('drawerRecentList');
    if (recentListEl) {
      const recentIds = mobileStorage.getRecentGames();
      if (recentIds.length === 0) {
        recentListEl.innerHTML = `<span style="font-size:0.75rem; color:var(--text-muted);">No recent games yet. Play any title to record your history!</span>`;
      } else {
        recentListEl.innerHTML = '';
        recentIds.forEach(id => {
          const game = MOBILE_GAMES.find(g => g.id === id);
          if (!game) return;
          const score = mobileStorage.getHighScore(game.id);
          const item = document.createElement('div');
          item.className = 'drawer-recent-item';
          item.innerHTML = `
            <div class="recent-item-thumb" style="background: radial-gradient(circle, ${game.color}35 0%, #121522 80%);">
              ${game.icon}
            </div>
            <div class="recent-item-meta">
              <span class="recent-item-name">${game.title}</span>
              <span class="recent-item-score">BEST: ${score}</span>
            </div>
            <button class="recent-item-play">▶</button>
          `;
          item.addEventListener('click', () => {
            drawerOverlay.classList.add('hidden');
            this.launchGame(game);
          });
          recentListEl.appendChild(item);
        });
      }
    }

    drawerOverlay.classList.remove('hidden');
  }

  selectCategory(catKey) {
    const pills = document.querySelectorAll('.category-pill');
    pills.forEach(p => {
      const isMatch = p.dataset.cat === catKey;
      p.classList.toggle('active', isMatch);
      if (isMatch) {
        p.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    });
    this.currentCategory = catKey;
    this.updateSectionHeading(catKey);
    this.renderGameList();
  }

  updateSectionHeading(catKey) {
    const headings = {
      all: { title: 'ALL GAMES', sub: '15 Handcrafted Arcade Titles' },
      top: { title: 'TOP PLAYED', sub: 'Most popular high-octane games' },
      arcade: { title: 'ARCADE CLASSICS', sub: 'Classic 80s & 90s arcade action' },
      puzzle: { title: 'PUZZLE & LOGIC', sub: 'Challenge your mind & strategy' },
      reflex: { title: 'REFLEX & ACTION', sub: 'Test your reaction speed & timing' },
      sports: { title: 'SPORTS & PHYSICS', sub: 'Play with physical momentum' },
      racing: { title: 'RACING & SPEED', sub: 'Turbo boost highway navigation' },
      favorites: { title: 'YOUR FAVORITES', sub: 'Saved games ready for instant play' }
    };
    const info = headings[catKey] || headings.all;
    if (this.sectionTitleEl) this.sectionTitleEl.textContent = info.title;
    if (this.sectionSubtextEl) this.sectionSubtextEl.textContent = info.sub;
  }

  launchRandomGame() {
    mobileAudio.whoosh();
    const randomIndex = Math.floor(Math.random() * MOBILE_GAMES.length);
    const chosenGame = MOBILE_GAMES[randomIndex];
    if (navigator.vibrate) navigator.vibrate([20, 40, 20]);
    this.launchGame(chosenGame);
  }

  renderGameList() {
    let list = [...MOBILE_GAMES];

    // Filter by Category
    if (this.currentCategory === 'favorites') {
      const favs = mobileStorage.getFavorites();
      list = list.filter(g => favs.includes(g.id));
    } else if (this.currentCategory === 'top') {
      list = list.sort((a, b) => mobileStorage.getHighScore(b.id) - mobileStorage.getHighScore(a.id));
    } else if (this.currentCategory !== 'all') {
      list = list.filter(g => g.category === this.currentCategory);
    }

    // Filter by Search Query
    if (this.searchQuery) {
      list = list.filter(g =>
        g.title.toLowerCase().includes(this.searchQuery) ||
        g.fullName.toLowerCase().includes(this.searchQuery) ||
        g.desc.toLowerCase().includes(this.searchQuery) ||
        g.categoryName.toLowerCase().includes(this.searchQuery)
      );
    }

    if (this.gamesCountBadge) {
      this.gamesCountBadge.textContent = list.length.toString();
    }

    if (list.length === 0) {
      this.gridEl.innerHTML = `
        <div class="empty-state">
          <div style="font-size: 2.4rem; margin-bottom: 6px;">🔍</div>
          <h3>NO GAMES FOUND</h3>
          <p>Try searching another title or select "All".</p>
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
      card.className = 'game-card-2col';
      card.innerHTML = `
        <div class="card-thumb-frame" style="background: radial-gradient(circle at 50% 50%, ${game.color}28 0%, #121522 75%);">
          <span class="card-badge-pill" style="border-color: ${game.color}77; color: ${game.color}; text-shadow: 0 0 8px ${game.color}66;">${game.badge}</span>
          ${svgArt}
          <button class="card-fav-btn ${isFav ? 'is-fav' : ''}" data-id="${game.id}" title="Favorite">
            <svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          </button>
        </div>
        <div class="card-text-block">
          <span class="card-name">${game.title}</span>
          <div class="card-meta-row">
            <span class="card-cat-label" style="color: ${game.color};">${game.category.toUpperCase()}</span>
            <span class="card-score-label">BEST: <strong>${highScore}</strong></span>
          </div>
        </div>
      `;

      card.addEventListener('click', () => {
        mobileAudio.tap();
        if (navigator.vibrate) navigator.vibrate(15);
        this.launchGame(game);
      });

      const favBtn = card.querySelector('.card-fav-btn');
      if (favBtn) {
        favBtn.addEventListener('pointerdown', (e) => {
          e.stopPropagation();
        });
        favBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          mobileAudio.pop();
          if (navigator.vibrate) navigator.vibrate(20);
          const nowFav = mobileStorage.toggleFavorite(game.id);
          favBtn.classList.toggle('is-fav', nowFav);
          if (this.currentCategory === 'favorites' && !nowFav) {
            this.renderGameList();
          }
        });
      }

      this.gridEl.appendChild(card);
    });
  }

  launchGame(game) {
    // Stop any existing game instance
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

    // Add in-game class to body to hide navigation and block scroll
    document.body.classList.add('in-game');
    document.body.style.overflow = 'hidden';
    this.playerModal.classList.add('active');

    mobileStorage.recordPlay(game.id);

    // Setup Dedicated Touch Controls
    this.setupTouchControls(game);

    // Resize canvas to fit viewport perfectly
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

    // Start 60 FPS Loop
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

  setupTouchControls(game) {
    if (!this.touchControlsEl) return;
    this.touchControlsEl.innerHTML = '';

    const triggerKey = (key, code) => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key, code, bubbles: true }));
      if (navigator.vibrate) navigator.vibrate(10);
    };

    if (game.controlsType === 'dpad') {
      // Virtual D-pad for Snake / 2048
      const dpad = document.createElement('div');
      dpad.className = 'touch-dpad-layout';
      dpad.innerHTML = `
        <div></div>
        <button class="touch-btn" data-key="ArrowUp" title="Up">▲</button>
        <div></div>
        <button class="touch-btn" data-key="ArrowLeft" title="Left">◀</button>
        <button class="touch-btn" data-key="ArrowDown" title="Down">▼</button>
        <button class="touch-btn" data-key="ArrowRight" title="Right">▶</button>
      `;
      dpad.querySelectorAll('.touch-btn').forEach(btn => {
        const key = btn.dataset.key;
        btn.addEventListener('pointerdown', (e) => {
          e.preventDefault();
          triggerKey(key, key);
        });
      });
      this.touchControlsEl.appendChild(dpad);
    } else if (game.controlsType === 'racing') {
      // Racing Left / Right Steer + Turbo Boost
      const bar = document.createElement('div');
      bar.className = 'touch-action-bar';
      bar.innerHTML = `
        <button class="touch-action-btn" id="ctrlLeft">◀ STEER LEFT</button>
        <button class="touch-action-btn" id="ctrlBoost" style="border-color: #FF007A; color: #FF007A;">⚡ NITRO</button>
        <button class="touch-action-btn" id="ctrlRight">STEER RIGHT ▶</button>
      `;
      bar.querySelector('#ctrlLeft').addEventListener('pointerdown', (e) => {
        e.preventDefault();
        triggerKey('ArrowLeft', 'ArrowLeft');
      });
      bar.querySelector('#ctrlRight').addEventListener('pointerdown', (e) => {
        e.preventDefault();
        triggerKey('ArrowRight', 'ArrowRight');
      });
      bar.querySelector('#ctrlBoost').addEventListener('pointerdown', (e) => {
        e.preventDefault();
        triggerKey('ArrowUp', 'ArrowUp');
      });
      this.touchControlsEl.appendChild(bar);
    } else if (game.controlsType === 'shooter') {
      // Space Shooter Left / Right + Fire
      const bar = document.createElement('div');
      bar.className = 'touch-action-bar';
      bar.innerHTML = `
        <button class="touch-action-btn" id="ctrlShootLeft">◀ LEFT</button>
        <button class="touch-action-btn" id="ctrlShootFire" style="border-color: #FFD700; color: #FFD700;">🔥 FIRE</button>
        <button class="touch-action-btn" id="ctrlShootRight">RIGHT ▶</button>
      `;
      bar.querySelector('#ctrlShootLeft').addEventListener('pointerdown', (e) => {
        e.preventDefault();
        triggerKey('ArrowLeft', 'ArrowLeft');
      });
      bar.querySelector('#ctrlShootRight').addEventListener('pointerdown', (e) => {
        e.preventDefault();
        triggerKey('ArrowRight', 'ArrowRight');
      });
      bar.querySelector('#ctrlShootFire').addEventListener('pointerdown', (e) => {
        e.preventDefault();
        triggerKey(' ', 'Space');
      });
      this.touchControlsEl.appendChild(bar);
    } else {
      // Large Tap Area (Blade Dash, Flappy, Stack 3D, Whack-a-Mole, Bounce)
      const bar = document.createElement('div');
      bar.className = 'touch-action-bar';
      bar.innerHTML = `
        <button class="touch-action-btn" id="ctrlPrimaryAction" style="border-color: #00F2FE;">
          <span>⚡ TAP TO ACTION / JUMP</span>
        </button>
      `;
      const btn = bar.querySelector('#ctrlPrimaryAction');
      btn.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        triggerKey(' ', 'Space');
        if (this.playerCanvas) {
          const rect = this.playerCanvas.getBoundingClientRect();
          const evt = new PointerEvent('pointerdown', {
            clientX: rect.left + rect.width / 2,
            clientY: rect.top + rect.height / 2,
            bubbles: true
          });
          this.playerCanvas.dispatchEvent(evt);
        }
      });
      this.touchControlsEl.appendChild(bar);
    }
  }

  resizePlayerCanvas() {
    if (!this.playerCanvas) return;
    const wrap = document.getElementById('canvasWrap');
    if (!wrap) return;

    // Available space accounting for top HUD (50px) and bottom touch controls (100px)
    const availW = Math.max(260, wrap.clientWidth - 16);
    const availH = Math.max(300, wrap.clientHeight - 16);

    // Maintain 2:3 aspect ratio (400w x 600h)
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

  togglePause(forceState = null) {
    if (!this.activeGameInstance) return;
    mobileAudio.tap();
    this.isPaused = forceState !== null ? forceState : !this.isPaused;

    if (this.pauseDialog) {
      this.pauseDialog.classList.toggle('hidden', !this.isPaused);
    }

    if (this.isPaused) {
      if (this.activeGameLoop) {
        cancelAnimationFrame(this.activeGameLoop);
        this.activeGameLoop = null;
      }
    } else {
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
  }

  restartActiveGame() {
    if (this.gameOverDialog) this.gameOverDialog.classList.add('hidden');
    if (this.pauseDialog) this.pauseDialog.classList.add('hidden');
    if (!this.currentGame) return;
    const game = this.currentGame;
    this.launchGame(game);
  }

  showGameOver(finalScore, isNewBest) {
    if (this.activeGameLoop) {
      cancelAnimationFrame(this.activeGameLoop);
      this.activeGameLoop = null;
    }

    if (isNewBest) {
      mobileAudio.success();
      if (navigator.vibrate) navigator.vibrate([60, 100, 60, 100]);
    } else {
      mobileAudio.gameOver();
      if (navigator.vibrate) navigator.vibrate(80);
    }

    const currentBest = Math.max(finalScore, mobileStorage.getHighScore(this.currentGame?.id || ''));
    if (this.dialogFinalScore) this.dialogFinalScore.textContent = finalScore.toString();
    if (this.dialogBestScore) this.dialogBestScore.textContent = currentBest.toString();

    const banner = document.getElementById('newBestBanner');
    if (banner) banner.classList.toggle('hidden', !isNewBest);

    if (this.gameOverDialog) {
      this.gameOverDialog.classList.remove('hidden');
    }
  }

  exitActiveGame() {
    if (this.gameOverDialog) this.gameOverDialog.classList.add('hidden');
    if (this.pauseDialog) this.pauseDialog.classList.add('hidden');
    if (this.activeGameLoop) {
      cancelAnimationFrame(this.activeGameLoop);
      this.activeGameLoop = null;
    }
    if (this.activeGameInstance && typeof this.activeGameInstance.destroy === 'function') {
      this.activeGameInstance.destroy();
      this.activeGameInstance = null;
    }

    this.currentGame = null;
    document.body.classList.remove('in-game');
    document.body.style.overflow = '';
    this.playerModal.classList.remove('active');

    // Refresh game list to update high scores
    this.renderGameList();
    this.renderHero(this.heroIdx);
  }
}

// Instantiate on DOM load
window.addEventListener('DOMContentLoaded', () => {
  new MobileApp();
});
