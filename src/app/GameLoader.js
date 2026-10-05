import { gameRegistry } from './GameRegistry.js';
import { GameSession } from './GameSession.js';

/**
 * GameLoader - Factory singleton that loads games by ID, enforces a single active session,
 * and ensures rigorous teardown of previous sessions before starting a new one.
 */
export class GameLoader {
  constructor() {
    this.currentSession = null;
    this.isLoading = false;
  }

  hasActiveSession() {
    return this.currentSession !== null;
  }

  getCurrentGameId() {
    return this.currentSession ? this.currentSession.gameEntry.id : null;
  }

  async loadGame(gameId, containerElement, onExitCallback) {
    if (this.isLoading) return null;
    this.isLoading = true;

    try {
      // If a session is already active, cleanly destroy it first
      if (this.currentSession) {
        this.currentSession.destroy();
        this.currentSession = null;
      }

      // Lookup game data in registry
      const gameEntry = gameRegistry.getGameById(gameId);
      if (!gameEntry) {
        console.error(`Game not found with ID: ${gameId}`);
        this.isLoading = false;
        return null;
      }

      // Instantiate new session
      this.currentSession = new GameSession(gameEntry, containerElement, () => {
        this.currentSession = null;
        if (typeof onExitCallback === 'function') {
          onExitCallback();
        }
      });

      this.isLoading = false;
      return this.currentSession;
    } catch (err) {
      console.error(`Failed to load game ${gameId}:`, err);
      this.isLoading = false;
      return null;
    }
  }

  terminateActiveSession() {
    if (this.currentSession) {
      this.currentSession.destroy();
      this.currentSession = null;
    }
  }
}

export const gameLoader = new GameLoader();
