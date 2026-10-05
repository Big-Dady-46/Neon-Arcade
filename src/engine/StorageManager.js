/**
 * StorageManager - Versioned LocalStorage management for persistent scores,
 * favorites, player stats, achievements, and daily rewards.
 */
const SCHEMA_VERSION = 'v1';
const STORAGE_PREFIX = `neon_arcade_${SCHEMA_VERSION}_`;

export class StorageManager {
  constructor() {
    this.memoryFallback = new Map();
    this.isStorageAvailable = this.checkAvailability();
  }

  checkAvailability() {
    try {
      const testKey = '__arcade_test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  getItem(key, defaultValue = null) {
    if (!this.isStorageAvailable) {
      return this.memoryFallback.has(key) ? this.memoryFallback.get(key) : defaultValue;
    }
    try {
      const val = localStorage.getItem(STORAGE_PREFIX + key);
      return val !== null ? JSON.parse(val) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  setItem(key, value) {
    if (!this.isStorageAvailable) {
      this.memoryFallback.set(key, value);
      return;
    }
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    } catch (err) {
      console.warn('Storage write failed:', err);
    }
  }

  // --- High Scores ---
  getHighScore(gameId) {
    const scores = this.getItem('high_scores', {});
    return typeof scores[gameId] === 'number' ? scores[gameId] : 0;
  }

  saveHighScore(gameId, score) {
    const scores = this.getItem('high_scores', {});
    const currentHigh = scores[gameId] || 0;
    if (score > currentHigh) {
      scores[gameId] = score;
      this.setItem('high_scores', scores);
      return true; // New personal best!
    }
    return false;
  }

  // --- Favorites ---
  getFavorites() {
    return new Set(this.getItem('favorites', []));
  }

  isFavorite(gameId) {
    const favs = this.getFavorites();
    return favs.has(gameId);
  }

  toggleFavorite(gameId) {
    const favs = this.getFavorites();
    if (favs.has(gameId)) {
      favs.delete(gameId);
    } else {
      favs.add(gameId);
    }
    this.setItem('favorites', Array.from(favs));
    return favs.has(gameId);
  }

  // --- Recently Played ---
  getRecentlyPlayed() {
    return this.getItem('recently_played', []);
  }

  recordGamePlayed(gameId) {
    let recent = this.getRecentlyPlayed().filter(id => id !== gameId);
    recent.unshift(gameId);
    if (recent.length > 20) recent = recent.slice(0, 20);
    this.setItem('recently_played', recent);

    // Increment total games counter
    const total = this.getTotalGamesPlayed() + 1;
    this.setItem('total_plays', total);
  }

  getTotalGamesPlayed() {
    return this.getItem('total_plays', 0);
  }

  // --- Daily Rewards ---
  getDailyRewardStatus() {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const lastClaim = this.getItem('daily_reward_last', null);
    const streak = this.getItem('daily_streak', 0);

    const canClaim = lastClaim !== today;
    return {
      canClaim,
      streak,
      lastClaim
    };
  }

  claimDailyReward() {
    const status = this.getDailyRewardStatus();
    if (!status.canClaim) return { success: false, streak: status.streak };

    const today = new Date().toISOString().slice(0, 10);
    
    // Check if yesterday was claimed to continue streak
    let streak = 1;
    if (status.lastClaim) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().slice(0, 10);
      if (status.lastClaim === yesterdayStr) {
        streak = status.streak + 1;
      }
    }

    this.setItem('daily_reward_last', today);
    this.setItem('daily_streak', streak);

    return { success: true, streak };
  }

  // --- Achievements ---
  getAchievements() {
    return this.getItem('achievements', []);
  }

  unlockAchievement(id) {
    const list = new Set(this.getAchievements());
    if (!list.has(id)) {
      list.add(id);
      this.setItem('achievements', Array.from(list));
      return true; // newly unlocked
    }
    return false;
  }
}

export const storageManager = new StorageManager();
