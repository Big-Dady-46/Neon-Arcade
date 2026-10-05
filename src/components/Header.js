import { audioManager } from '../engine/AudioManager.js';
import { storageManager } from '../engine/StorageManager.js';
import { gameRegistry } from '../app/GameRegistry.js';

/**
 * Header - High-end arcade navigation header with a custom cyber emblem logo,
 * Orbitron typography, live search, volume controls, and streak tracker.
 */
export class Header {
  constructor({ onNavigateHome, onOpenFavorites, onOpenDailyReward, onOpenAchievements, searchBarComponent }) {
    this.onNavigateHome = onNavigateHome;
    this.onOpenFavorites = onOpenFavorites;
    this.onOpenDailyReward = onOpenDailyReward;
    this.onOpenAchievements = onOpenAchievements;
    this.searchBar = searchBarComponent;
    this.element = null;
  }

  render() {
    this.element = document.createElement('header');
    this.element.className = 'arcade-header';

    const totalGames = gameRegistry.getAllGames().length;
    const favCount = storageManager.getFavorites().size;
    const dailyStatus = storageManager.getDailyRewardStatus();

    this.element.innerHTML = `
      <!-- Brand & Badass Custom Cyber Logo -->
      <a href="#/" class="header-brand" id="brandLink">
        <div class="brand-logo-emblem">
          <svg width="44" height="44" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="logoGradHex" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#00F2FE"/>
                <stop offset="50%" stop-color="#8B5CF6"/>
                <stop offset="100%" stop-color="#EC4899"/>
              </linearGradient>
              <linearGradient id="logoCoreGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#00F2FE"/>
                <stop offset="100%" stop-color="#FFFFFF"/>
              </linearGradient>
              <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur"/>
                <feComposite in="SourceGraphic" in2="blur" operator="over"/>
              </filter>
            </defs>

            <!-- Outer High-Tech Hexagonal Cyber Shield -->
            <polygon points="50,6 90,28 90,72 50,94 10,72 10,28" 
                     fill="#0C0F1D" 
                     stroke="url(#logoGradHex)" 
                     stroke-width="5" 
                     filter="url(#neonGlow)"/>

            <!-- Inner Accent Frame -->
            <polygon points="50,16 82,34 82,66 50,84 18,66 18,34" 
                     fill="#141828" 
                     stroke="rgba(0, 242, 254, 0.3)" 
                     stroke-width="1.5"/>

            <!-- Stylized Futuristic 'N' Arcade Power Core -->
            <path d="M34 68V32L66 68V32" 
                  stroke="url(#logoCoreGrad)" 
                  stroke-width="7" 
                  stroke-linecap="round" 
                  stroke-linejoin="round"
                  filter="url(#neonGlow)"/>

            <!-- Power Crystal Points -->
            <circle cx="50" cy="50" r="3.5" fill="#00F2FE" filter="url(#neonGlow)"/>
            <polygon points="50,10 53,15 47,15" fill="#00F2FE"/>
            <polygon points="50,90 53,85 47,85" fill="#EC4899"/>
          </svg>
        </div>
        <div class="brand-text-block">
          <div class="brand-title">
            <span class="brand-title-neon">NEON</span>
            <span class="brand-title-arcade">ARCADE</span>
          </div>
          <span class="brand-badge">${totalGames} RETRO & CASUAL GAMES</span>
        </div>
      </a>

      <!-- Center Search -->
      <div class="header-center" id="searchContainerSlot"></div>

      <!-- Actions -->
      <div class="header-actions">
        <!-- Favorites Shortcut -->
        <button class="btn-icon" id="headerFavBtn" title="Saved Games">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          <span id="favCounterBadge" class="fav-badge-counter">${favCount}</span>
        </button>

        <!-- Sound Settings Popover -->
        <div style="position: relative;">
          <button class="btn-icon" id="headerAudioBtn" title="Sound Volume">
            <span id="headerAudioIcon">${audioManager.isMuted ? '🔇' : '🔊'}</span>
          </button>
          <div class="volume-popover" id="volumePopover">
            <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 800; font-family: var(--font-display);">VOL</span>
            <input type="range" class="volume-slider" id="headerVolumeSlider" min="0" max="1" step="0.05" value="${audioManager.masterVolume}">
          </div>
        </div>

        <!-- Daily Reward & Streak -->
        <button class="btn btn-secondary header-streak-btn" id="headerProfileBtn">
          <span style="color: var(--neon-gold); font-size: 1.1rem;">🔥</span>
          <span class="streak-text">${dailyStatus.streak}D STREAK</span>
          ${dailyStatus.canClaim ? '<span class="streak-notification-dot"></span>' : ''}
        </button>

        <!-- White Theme Mobile App Link -->
        <a href="/mobile/" class="btn btn-secondary header-streak-btn" style="border-color: #6366F1; color: #FFF; background: rgba(99, 102, 241, 0.2); text-decoration: none;" title="Open Mobile White Theme App">
          <span>📱</span>
          <span style="font-size: 0.78rem; font-weight: 800; letter-spacing: 0.04em;">MOBILE APP</span>
        </a>
      </div>
    `;

    if (this.searchBar) {
      this.element.querySelector('#searchContainerSlot').appendChild(this.searchBar.render());
    }

    this.bindEvents();
    return this.element;
  }

  bindEvents() {
    this.element.querySelector('#brandLink').addEventListener('click', (e) => {
      e.preventDefault();
      audioManager.playClick();
      if (this.onNavigateHome) this.onNavigateHome();
    });

    this.element.querySelector('#headerFavBtn').addEventListener('click', () => {
      audioManager.playClick();
      if (this.onOpenFavorites) this.onOpenFavorites();
    });

    const audioBtn = this.element.querySelector('#headerAudioBtn');
    const popover = this.element.querySelector('#volumePopover');
    const slider = this.element.querySelector('#headerVolumeSlider');

    audioBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      popover.classList.toggle('visible');
    });

    slider.addEventListener('input', (e) => {
      const vol = parseFloat(e.target.value);
      audioManager.setMasterVolume(vol);
      if (vol === 0) {
        audioManager.setMuted(true);
        this.element.querySelector('#headerAudioIcon').textContent = '🔇';
      } else {
        if (audioManager.isMuted) audioManager.setMuted(false);
        this.element.querySelector('#headerAudioIcon').textContent = '🔊';
      }
    });

    document.addEventListener('click', (e) => {
      if (!popover.contains(e.target) && e.target !== audioBtn) {
        popover.classList.remove('visible');
      }
    });

    this.element.querySelector('#headerProfileBtn').addEventListener('click', () => {
      audioManager.playClick();
      if (this.onOpenDailyReward) this.onOpenDailyReward();
    });
  }

  updateFavoritesCount() {
    const badge = this.element.querySelector('#favCounterBadge');
    if (badge) {
      badge.textContent = storageManager.getFavorites().size;
    }
  }

  updateStreakBadge() {
    const btn = this.element.querySelector('#headerProfileBtn');
    if (btn) {
      const status = storageManager.getDailyRewardStatus();
      btn.innerHTML = `
        <span style="color: var(--neon-gold); font-size: 1.1rem;">🔥</span>
        <span class="streak-text">${status.streak}D STREAK</span>
        ${status.canClaim ? '<span class="streak-notification-dot"></span>' : ''}
      `;
    }
  }
}
