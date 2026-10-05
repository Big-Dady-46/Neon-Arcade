import { router } from './Router.js';
import { gameRegistry } from './GameRegistry.js';
import { gameLoader } from './GameLoader.js';
import { storageManager } from '../engine/StorageManager.js';
import { Header } from '../components/Header.js';
import { SearchBar } from '../components/SearchBar.js';
import { CategoryNavigation } from '../components/CategoryNavigation.js';
import { GameGrid } from '../components/GameGrid.js';
import { GameOverlay } from '../components/GameOverlay.js';
import { customCursor } from '../components/CustomCursor.js';
import { CyberIcons } from '../components/CyberIcons.js';

/**
 * App - Main Application Controller for the Neon Arcade Platform.
 */
export class App {
  constructor(rootElement) {
    this.root = rootElement;
    this.currentCategory = 'all';
    this.searchQuery = '';

    // Sub-components
    this.searchBar = null;
    this.header = null;
    this.categoryNav = null;
    this.gameGrid = null;
    this.gameOverlay = null;

    // Containers
    this.mainView = null;
    this.gameView = null;

    this.onPlayGame = this.onPlayGame.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSelectCategory = this.onSelectCategory.bind(this);
  }

  init() {
    // 1. Initialize custom gaming dot cursor
    customCursor.init();

    // 2. Build DOM layout
    this.buildBaseDOM();
    this.initComponents();
    this.setupRoutes();
    router.init();
  }

  buildBaseDOM() {
    this.root.innerHTML = `
      <div id="headerSlot"></div>
      <main class="arcade-main" id="mainContentSlot"></main>
      <div id="gameSessionSlot"></div>
      <div id="overlaySlot"></div>
      
      <!-- High-End Cyberpunk Arcade Footer -->
      <footer class="arcade-footer">
        <!-- Top Features Ticker Banner -->
        <div class="footer-features-banner">
          <div class="footer-feat-item">
            <span class="feat-icon">⚡</span>
            <span>60 FPS SMOOTH ENGINE</span>
          </div>
          <div class="footer-feat-item">
            <span class="feat-icon">🎮</span>
            <span>100+ FREE PLAYABLE GAMES</span>
          </div>
          <div class="footer-feat-item">
            <span class="feat-icon">💾</span>
            <span>LOCAL HIGH-SCORE PROGRESS</span>
          </div>
          <div class="footer-feat-item">
            <span class="feat-icon">📱</span>
            <span>MOBILE TOUCH & D-PAD READY</span>
          </div>
          <div class="footer-feat-item">
            <span class="feat-icon">🔊</span>
            <span>SYNTHESIZED WEB AUDIO</span>
          </div>
        </div>

        <div class="footer-content">
          <!-- Left Column: Brand & Info -->
          <div class="footer-brand-col">
            <div class="footer-brand-title">
              <span style="color: #FFF;">NEON</span>
              <span style="color: var(--neon-cyan);">ARCADE</span>
            </div>
            <p class="footer-brand-desc">
              Next-generation Full-HD HTML5 web arcade. Zero installation, zero loading screen delays, pure instant retro gameplay built on ultra-fast Canvas 2D and Web Audio.
            </p>
            <div class="footer-badge-row">
              <span class="footer-tag">v2.0 PRO</span>
              <span class="footer-tag" style="border-color: var(--neon-green); color: var(--neon-green);">ALL SYSTEMS NOMINAL</span>
            </div>
          </div>

          <!-- Middle Column: Quick Genre Navigation -->
          <div class="footer-nav-col">
            <h4 class="footer-col-heading">ARCADE GENRES</h4>
            <div class="footer-genre-links">
              <a href="#/category/arcade" class="footer-link">👾 Arcade Classics</a>
              <a href="#/category/reflex" class="footer-link">⚡ Reflex & Action</a>
              <a href="#/category/puzzle" class="footer-link">🧩 Puzzle & Logic</a>
              <a href="#/category/sports" class="footer-link">🏀 Sports & Physics</a>
              <a href="#/category/racing" class="footer-link">🏎️ Racing & Speed</a>
            </div>
          </div>

          <!-- Right Column: Live Telemetry & Stats -->
          <div class="footer-stats-col">
            <h4 class="footer-col-heading">ARCADE TELEMETRY</h4>
            <div class="footer-telemetry-grid">
              <div class="telemetry-box">
                <span class="telemetry-val">${gameRegistry.getAllGames().length}</span>
                <span class="telemetry-lbl">Catalog Games</span>
              </div>
              <div class="telemetry-box">
                <span class="telemetry-val" id="footerTotalPlays">${storageManager.getTotalGamesPlayed()}</span>
                <span class="telemetry-lbl">Total Plays</span>
              </div>
              <div class="telemetry-box">
                <span class="telemetry-val">60</span>
                <span class="telemetry-lbl">Target FPS</span>
              </div>
              <div class="telemetry-box">
                <span class="telemetry-val" style="color: var(--neon-green);">0ms</span>
                <span class="telemetry-lbl">Server Latency</span>
              </div>
            </div>
          </div>
        </div>

        <div class="footer-bottom-bar">
          <div>© 2026 NEON ARCADE PLATFORM • NO EXTERNAL PLUGINS REQUIRED</div>
          <div style="display: flex; gap: 16px;">
            <span>PERSISTENT HIGH-SCORES ENABLED</span>
            <span>•</span>
            <span style="color: var(--neon-cyan);">VITE ES-NEXT ENGINE</span>
          </div>
        </div>
      </footer>
    `;

    this.mainView = this.root.querySelector('#mainContentSlot');
    this.gameView = this.root.querySelector('#gameSessionSlot');
  }

  initComponents() {
    this.searchBar = new SearchBar(this.onSearchChange);

    this.gameOverlay = new GameOverlay(() => {
      if (this.header) this.header.updateStreakBadge();
    });
    this.root.querySelector('#overlaySlot').appendChild(this.gameOverlay.render());

    this.header = new Header({
      onNavigateHome: () => {
        router.navigate('/');
      },
      onOpenFavorites: () => {
        router.navigate('/favorites');
      },
      onOpenDailyReward: () => {
        this.gameOverlay.openDailyReward();
      },
      onOpenAchievements: () => {
        this.gameOverlay.openAchievements();
      },
      searchBarComponent: this.searchBar
    });
    this.root.querySelector('#headerSlot').appendChild(this.header.render());

    this.categoryNav = new CategoryNavigation(this.currentCategory, this.onSelectCategory);
    this.gameGrid = new GameGrid(this.onPlayGame);
  }

  setupRoutes() {
    router
      .on('/', () => {
        this.closeActiveGameIfAny();
        this.renderHome();
      })
      .on('/game/:id', ({ params }) => {
        this.launchGame(params.id);
      })
      .on('/category/:cat', ({ params }) => {
        this.closeActiveGameIfAny();
        this.currentCategory = params.cat;
        this.categoryNav.setActiveCategory(params.cat);
        this.renderCategoryView(params.cat);
      })
      .on('/favorites', () => {
        this.closeActiveGameIfAny();
        this.renderFavoritesView();
      });
  }

  onPlayGame(gameId) {
    router.navigate(`/game/${gameId}`);
  }

  async launchGame(gameId) {
    this.mainView.style.display = 'none';
    const session = await gameLoader.loadGame(gameId, this.gameView, () => {
      this.mainView.style.display = 'block';
      router.navigate('/');
      this.updateFooterStats();
      if (this.header) this.header.updateFavoritesCount();
    });

    if (!session) {
      this.mainView.style.display = 'block';
      router.navigate('/');
    }
  }

  closeActiveGameIfAny() {
    if (gameLoader.hasActiveSession()) {
      gameLoader.terminateActiveSession();
    }
    this.mainView.style.display = 'block';
  }

  onSearchChange(query) {
    this.searchQuery = query;
    if (query.trim().length > 0) {
      this.renderSearchResults(query);
    } else {
      if (this.currentCategory !== 'all') {
        this.renderCategoryView(this.currentCategory);
      } else {
        this.renderHome();
      }
    }
  }

  onSelectCategory(catId) {
    this.currentCategory = catId;
    this.searchQuery = '';
    this.searchBar.setValue('');
    if (catId === 'all') {
      router.navigate('/');
    } else {
      router.navigate(`/category/${catId}`);
    }
  }

  renderHome() {
    this.mainView.innerHTML = '';
    this.mainView.appendChild(this.categoryNav.render());

    const featuredGame = gameRegistry.getFeaturedGame();
    if (featuredGame) {
      this.mainView.appendChild(this.gameGrid.renderHero(featuredGame));
    }

    const recentIds = storageManager.getRecentlyPlayed();
    if (recentIds && recentIds.length > 0) {
      const recentGames = recentIds.map(id => gameRegistry.getGameById(id)).filter(Boolean);
      const recentSection = this.gameGrid.renderSection('Recently Played', CyberIcons.star, recentGames, true);
      if (recentSection) this.mainView.appendChild(recentSection);
    }

    // Category Carousels with Cyber Vector Icons
    const arcadeGames = gameRegistry.getGamesByCategory('arcade');
    const reflexGames = gameRegistry.getGamesByCategory('reflex');
    const puzzleGames = gameRegistry.getGamesByCategory('puzzle');
    const sportsGames = gameRegistry.getGamesByCategory('sports');
    const racingGames = gameRegistry.getGamesByCategory('racing');

    const sArcade = this.gameGrid.renderSection('Arcade Classics', CyberIcons.arcade, arcadeGames, true);
    if (sArcade) this.mainView.appendChild(sArcade);

    const sReflex = this.gameGrid.renderSection('Reflex & Action', CyberIcons.reflex, reflexGames, true);
    if (sReflex) this.mainView.appendChild(sReflex);

    const sPuzzle = this.gameGrid.renderSection('Puzzle & Logic', CyberIcons.puzzle, puzzleGames, true);
    if (sPuzzle) this.mainView.appendChild(sPuzzle);

    const sSports = this.gameGrid.renderSection('Sports & Physics', CyberIcons.sports, sportsGames, true);
    if (sSports) this.mainView.appendChild(sSports);

    const sRacing = this.gameGrid.renderSection('Racing & Speed', CyberIcons.racing, racingGames, true);
    if (sRacing) this.mainView.appendChild(sRacing);
  }

  renderCategoryView(catId) {
    this.mainView.innerHTML = '';
    this.mainView.appendChild(this.categoryNav.render());

    const games = gameRegistry.getGamesByCategory(catId);
    const catObj = gameRegistry.categories.find(c => c.id === catId);
    const title = catObj ? catObj.name : 'Category Games';
    const icon = catObj ? catObj.icon : CyberIcons.gamepad;

    const header = document.createElement('div');
    header.className = 'section-header';
    header.style.marginBottom = '22px';
    header.innerHTML = `
      <div class="section-title-wrap">
        <span class="section-icon">${icon}</span>
        <h2 class="section-title">${title}</h2>
        <span class="section-count">${games.length} Games</span>
      </div>
    `;
    this.mainView.appendChild(header);

    const grid = this.gameGrid.renderGrid(games);
    this.mainView.appendChild(grid);
  }

  renderSearchResults(query) {
    this.mainView.innerHTML = '';
    this.mainView.appendChild(this.categoryNav.render());

    const results = gameRegistry.searchGames(query);

    const header = document.createElement('div');
    header.className = 'section-header';
    header.style.marginBottom = '22px';
    header.innerHTML = `
      <div class="section-title-wrap">
        <span class="section-icon">🔍</span>
        <h2 class="section-title">Search Results for "${query}"</h2>
        <span class="section-count">${results.length} Found</span>
      </div>
    `;
    this.mainView.appendChild(header);

    const grid = this.gameGrid.renderGrid(results);
    this.mainView.appendChild(grid);
  }

  renderFavoritesView() {
    this.mainView.innerHTML = '';
    this.mainView.appendChild(this.categoryNav.render());

    const favIds = Array.from(storageManager.getFavorites());
    const favGames = favIds.map(id => gameRegistry.getGameById(id)).filter(Boolean);

    const header = document.createElement('div');
    header.className = 'section-header';
    header.style.marginBottom = '22px';
    header.innerHTML = `
      <div class="section-title-wrap">
        <span class="section-icon">${CyberIcons.star}</span>
        <h2 class="section-title">Your Favorite Games</h2>
        <span class="section-count">${favGames.length} Saved</span>
      </div>
    `;
    this.mainView.appendChild(header);

    if (favGames.length === 0) {
      this.mainView.appendChild(
        this.gameGrid.renderEmptyState('You have not added any games to your favorites yet. Click the heart icon on any game card!')
      );
    } else {
      const grid = this.gameGrid.renderGrid(favGames);
      this.mainView.appendChild(grid);
    }
  }

  updateFooterStats() {
    const el = this.root.querySelector('#footerTotalPlays');
    if (el) {
      el.textContent = storageManager.getTotalGamesPlayed();
    }
  }
}
