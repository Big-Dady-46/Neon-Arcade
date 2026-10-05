/**
 * MobileStorage - Persistent LocalStorage manager for Neon Arcade Mobile.
 */
class MobileStorage {
  constructor() {
    this.prefix = 'neonarcade_';
  }

  getHighScore(gameId) {
    try {
      return parseInt(localStorage.getItem(`${this.prefix}score_${gameId}`) || '0', 10);
    } catch {
      return 0;
    }
  }

  saveHighScore(gameId, score) {
    const current = this.getHighScore(gameId);
    if (score > current) {
      try {
        localStorage.setItem(`${this.prefix}score_${gameId}`, score.toString());
      } catch {}
      return true;
    }
    return false;
  }

  getFavorites() {
    try {
      return JSON.parse(localStorage.getItem(`${this.prefix}favorites`) || '[]');
    } catch {
      return [];
    }
  }

  toggleFavorite(gameId) {
    let favs = this.getFavorites();
    if (favs.includes(gameId)) {
      favs = favs.filter(id => id !== gameId);
    } else {
      favs.push(gameId);
    }
    try {
      localStorage.setItem(`${this.prefix}favorites`, JSON.stringify(favs));
    } catch {}
    return favs.includes(gameId);
  }

  isFavorite(gameId) {
    return this.getFavorites().includes(gameId);
  }

  getTotalPlayed() {
    try {
      return parseInt(localStorage.getItem(`${this.prefix}total_played`) || '0', 10);
    } catch {
      return 0;
    }
  }

  recordPlay(gameId) {
    try {
      const total = this.getTotalPlayed() + 1;
      localStorage.setItem(`${this.prefix}total_played`, total.toString());
      this.recordRecentGame(gameId);
    } catch {}
  }

  getRecentGames() {
    try {
      return JSON.parse(localStorage.getItem(`${this.prefix}recent_games`) || '[]');
    } catch {
      return [];
    }
  }

  recordRecentGame(gameId) {
    try {
      let recent = this.getRecentGames().filter(id => id !== gameId);
      recent.unshift(gameId);
      if (recent.length > 6) recent = recent.slice(0, 6);
      localStorage.setItem(`${this.prefix}recent_games`, JSON.stringify(recent));
    } catch {}
  }

  getHighScoresCount(allGameIds) {
    if (!allGameIds || !Array.isArray(allGameIds)) return 0;
    let count = 0;
    for (const id of allGameIds) {
      if (this.getHighScore(id) > 0) count++;
    }
    return count;
  }

  getUserXP(allGameIds) {
    const plays = this.getTotalPlayed();
    const hsCount = this.getHighScoresCount(allGameIds);
    // 50 XP per play + 100 XP per high score achieved
    return (plays * 50) + (hsCount * 100);
  }

  getUserLevel(allGameIds) {
    const xp = this.getUserXP(allGameIds);
    const level = Math.floor(xp / 500) + 1;
    return Math.min(level, 99);
  }
}

export const mobileStorage = new MobileStorage();
