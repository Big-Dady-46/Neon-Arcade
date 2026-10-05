/**
 * MobileStorage - Persistent LocalStorage manager for White Mobile Arcade.
 */
class MobileStorage {
  constructor() {
    this.prefix = 'arcademobile_';
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
    } catch {}
  }
}

export const mobileStorage = new MobileStorage();
