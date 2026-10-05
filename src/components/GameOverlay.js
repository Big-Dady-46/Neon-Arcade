import { storageManager } from '../engine/StorageManager.js';
import { audioManager } from '../engine/AudioManager.js';

/**
 * GameOverlay - Manages system modals for Daily Rewards, Achievements, and Player Stats.
 */
export class GameOverlay {
  constructor(onUpdateProfileCallback) {
    this.onUpdateProfileCallback = onUpdateProfileCallback;
    this.element = null;
  }

  render() {
    this.element = document.createElement('div');
    this.element.className = 'modal-backdrop';
    this.element.id = 'systemModalBackdrop';
    this.element.innerHTML = `
      <div class="modal-dialog">
        <div class="modal-header">
          <h3 class="modal-title" id="systemModalTitle">Modal Title</h3>
          <button class="btn-icon" id="systemModalCloseBtn" style="width: 32px; height: 32px;">✕</button>
        </div>
        <div class="modal-body" id="systemModalBody"></div>
      </div>
    `;

    this.element.querySelector('#systemModalCloseBtn').addEventListener('click', () => {
      audioManager.playClick();
      this.close();
    });

    this.element.addEventListener('click', (e) => {
      if (e.target === this.element) {
        this.close();
      }
    });

    return this.element;
  }

  open(title, htmlContent) {
    this.element.querySelector('#systemModalTitle').textContent = title;
    this.element.querySelector('#systemModalBody').innerHTML = htmlContent;
    this.element.classList.add('open');
  }

  close() {
    this.element.classList.remove('open');
  }

  openDailyReward() {
    const status = storageManager.getDailyRewardStatus();
    const html = `
      <div style="text-align: center; padding: 12px 0;">
        <div style="font-size: 3.5rem; margin-bottom: 8px;">🎁</div>
        <h4 style="font-size: 1.3rem; font-weight: 800; color: #FFF; margin-bottom: 4px;">Daily Arcade Login Reward</h4>
        <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 20px;">
          Claim your daily arcade bonus to maintain your login streak!
        </p>

        <div style="display: flex; justify-content: center; gap: 8px; margin-bottom: 24px;">
          ${[1, 2, 3, 4, 5, 6, 7].map(day => `
            <div style="flex: 1; max-width: 50px; padding: 8px 4px; background: ${day <= status.streak ? 'rgba(0, 242, 254, 0.15)' : 'var(--bg-surface)'}; border: 1px solid ${day <= status.streak ? 'var(--neon-teal)' : 'var(--border-subtle)'}; border-radius: 8px; font-size: 0.75rem;">
              <div style="color: var(--text-muted); margin-bottom: 4px;">D${day}</div>
              <div style="font-size: 1.1rem;">${day <= status.streak ? '✓' : '🪙'}</div>
            </div>
          `).join('')}
        </div>

        ${status.canClaim ? `
          <button class="btn btn-primary" id="btnClaimDaily" style="width: 100%; padding: 14px;">
            CLAIM DAILY BONUS (+100 TOKENS)
          </button>
        ` : `
          <button class="btn btn-secondary" disabled style="width: 100%; padding: 14px; opacity: 0.6; cursor: not-allowed;">
            ✓ ALREADY CLAIMED TODAY (COME BACK TOMORROW)
          </button>
        `}
      </div>
    `;

    this.open('Daily Reward & Player Profile', html);

    const claimBtn = this.element.querySelector('#btnClaimDaily');
    if (claimBtn) {
      claimBtn.addEventListener('click', () => {
        audioManager.playPowerup();
        const res = storageManager.claimDailyReward();
        if (res.success) {
          if (this.onUpdateProfileCallback) this.onUpdateProfileCallback();
          this.openDailyReward(); // refresh modal state
        }
      });
    }
  }

  openAchievements() {
    const achievementsList = [
      { id: 'first_blood', title: 'First Play', desc: 'Play your first game on the arcade.', icon: '🎯' },
      { id: 'snake_charmer', title: 'Cyber Serpent', desc: 'Score over 100 points in Cyber Snake.', icon: '🐍' },
      { id: 'arcade_junkie', title: 'Arcade Veteran', desc: 'Play 10 different games in one session.', icon: '🕹️' },
      { id: 'favorite_collector', title: 'Curator', desc: 'Add 5 games to your favorites.', icon: '⭐' },
      { id: 'daily_streak_3', title: 'Dedicated', desc: 'Reach a 3-day daily reward streak.', icon: '🔥' }
    ];

    const unlocked = new Set(storageManager.getAchievements());

    const html = `
      <div style="display: flex; flex-direction: column; gap: 12px;">
        ${achievementsList.map(a => {
          const isDone = unlocked.has(a.id);
          return `
            <div style="display: flex; align-items: center; gap: 14px; padding: 12px; background: var(--bg-surface); border: 1px solid ${isDone ? 'var(--border-neon)' : 'var(--border-subtle)'}; border-radius: 10px;">
              <div style="font-size: 2rem; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; background: ${isDone ? 'rgba(0, 242, 254, 0.15)' : 'var(--bg-surface-elevated)'}; border-radius: 8px;">
                ${a.icon}
              </div>
              <div style="flex: 1;">
                <div style="font-weight: 700; color: ${isDone ? 'var(--neon-teal)' : '#FFF'}; font-size: 0.95rem;">${a.title}</div>
                <div style="color: var(--text-muted); font-size: 0.8rem;">${a.desc}</div>
              </div>
              <span style="font-size: 0.75rem; font-weight: 700; padding: 3px 8px; border-radius: 4px; background: ${isDone ? 'rgba(16, 185, 129, 0.2)' : 'var(--bg-surface-elevated)'}; color: ${isDone ? 'var(--accent-emerald)' : 'var(--text-muted)'};">
                ${isDone ? 'UNLOCKED' : 'LOCKED'}
              </span>
            </div>
          `;
        }).join('')}
      </div>
    `;

    this.open('Player Achievements', html);
  }
}
