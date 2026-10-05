import { GameLoop } from '../engine/GameLoop.js';
import { InputManager } from '../engine/InputManager.js';
import { audioManager } from '../engine/AudioManager.js';
import { storageManager } from '../engine/StorageManager.js';
import { performanceMonitor } from '../engine/PerformanceMonitor.js';
import { SpaceShooterGame } from '../games/arcade/SpaceShooterGame.js';
import { HighwayRacerGame } from '../games/racing/HighwayRacerGame.js';
import { DunkBasketballGame } from '../games/sports/DunkBasketballGame.js';
import { MemoryCardsGame } from '../games/puzzle/MemoryCardsGame.js';

/**
 * GameSession - Manages active game session with instant 1-click launch,
 * crisp DPI scaling, clean HUD, and effortless controls.
 */
export class GameSession {
  constructor(gameEntry, containerElement, onExitCallback) {
    this.gameEntry = gameEntry;
    this.container = containerElement;
    this.onExitCallback = onExitCallback;

    this.canvas = null;
    this.ctx = null;
    this.game = null;
    this.input = null;
    this.loop = null;

    this.score = 0;
    this.highScore = storageManager.getHighScore(gameEntry.id);
    this.isPaused = false;
    this.isGameOver = false;

    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.handleResize = this.handleResize.bind(this);

    this.init();
  }

  init() {
    storageManager.recordGamePlayed(this.gameEntry.id);

    // Build HUD & Viewport DOM
    this.buildDOM();

    // Init unified InputManager
    this.input = new InputManager(this.canvas);

    // Instantiate game scene
    if (typeof this.gameEntry.factory === 'function') {
      this.game = this.gameEntry.factory(this, this.canvas, this.input, audioManager);
    } else {
      const cat = this.gameEntry.category;
      if (cat === 'racing') {
        this.game = new HighwayRacerGame(this, this.canvas, this.input, audioManager);
      } else if (cat === 'sports') {
        this.game = new DunkBasketballGame(this, this.canvas, this.input, audioManager);
      } else if (cat === 'puzzle') {
        this.game = new MemoryCardsGame(this, this.canvas, this.input, audioManager);
      } else {
        this.game = new SpaceShooterGame(this, this.canvas, this.input, audioManager);
      }
    }

    // Attach logical dimensions to canvas for input coordinate mapping
    const targetW = this.game ? this.game.width : 800;
    const targetH = this.game ? this.game.height : 600;
    this.canvas._gameWidth = targetW;
    this.canvas._gameHeight = targetH;
    this.canvas.setAttribute('tabindex', '0');

    // Blur active buttons to prevent key interference
    if (document.activeElement && typeof document.activeElement.blur === 'function') {
      document.activeElement.blur();
    }

    this.setupCanvasDimensions();
    window.addEventListener('resize', this.handleResize);

    // Also run setupCanvasDimensions on next frame to guarantee full container layout
    requestAnimationFrame(() => {
      this.setupCanvasDimensions();
      if (this.canvas) this.canvas.focus();
    });

    // Set up Loop
    this.loop = new GameLoop(
      (dt) => {
        performanceMonitor.recordFrame();
        if (this.game && !this.isPaused && !this.isGameOver) {
          this.game.update(dt);
        }
        if (this.input) {
          this.input.endFrame();
        }
      },
      () => {
        if (this.game && this.ctx) {
          this.ctx.save();
          const scaleX = this.canvas.width / this.game.width;
          const scaleY = this.canvas.height / this.game.height;
          this.ctx.scale(scaleX, scaleY);
          this.game.render(this.ctx);
          this.ctx.restore();
        }
      }
    );

    // INSTANT LAUNCH: Start game immediately!
    this.start();
  }

  createInteractiveArcadeGame() {
    // High-octane interactive cyber shooter/dodge game for all catalog games
    const session = this;
    const themeColor = this.gameEntry.themeColor || '#00F2FE';
    const accentColor = this.gameEntry.accentColor || '#8B5CF6';

    return {
      width: 800,
      height: 600,
      create() {
        this.player = {
          x: 400,
          y: 520,
          w: 48,
          h: 48,
          speed: 460
        };
        this.bullets = [];
        this.targets = [];
        this.particles = [];
        this.targetTimer = 0;
        this.fireTimer = 0;
        this.score = 0;
        session.setScore(0);
      },
      update(dt) {
        // Player movement
        if (session.input.isActionActive('left')) {
          this.player.x -= this.player.speed * dt;
        }
        if (session.input.isActionActive('right')) {
          this.player.x += this.player.speed * dt;
        }
        if (session.input.isActionActive('up')) {
          this.player.y -= this.player.speed * dt;
        }
        if (session.input.isActionActive('down')) {
          this.player.y += this.player.speed * dt;
        }

        // Pointer / touch steering
        if (session.input.pointer.isDown && session.input.pointer.canvasX > 0) {
          this.player.x += (session.input.pointer.canvasX - this.player.x) * 0.15;
          this.player.y += (session.input.pointer.canvasY - this.player.y) * 0.15;
        }

        // Clamp player
        this.player.x = Math.max(30, Math.min(this.width - 30, this.player.x));
        this.player.y = Math.max(80, Math.min(this.height - 40, this.player.y));

        // Automatic / action laser fire
        this.fireTimer += dt;
        if (this.fireTimer >= 0.22) {
          this.fireTimer = 0;
          this.bullets.push({
            x: this.player.x,
            y: this.player.y - 20,
            vy: -600,
            color: themeColor
          });
          audioManager.playBlip(750, 0.04, 'square');
        }

        // Update bullets
        for (let i = this.bullets.length - 1; i >= 0; i--) {
          const b = this.bullets[i];
          b.y += b.vy * dt;
          if (b.y < -10) this.bullets.splice(i, 1);
        }

        // Spawn targets / obstacles
        this.targetTimer += dt;
        if (this.targetTimer >= 0.8) {
          this.targetTimer = 0;
          this.targets.push({
            x: Math.random() * (this.width - 80) + 40,
            y: -30,
            vy: Math.random() * 120 + 140,
            radius: Math.random() * 10 + 16,
            hp: 2,
            color: accentColor
          });
        }

        // Update targets & collision checks
        for (let i = this.targets.length - 1; i >= 0; i--) {
          const t = this.targets[i];
          t.y += t.vy * dt;

          // Check collision with bullets
          for (let j = this.bullets.length - 1; j >= 0; j--) {
            const b = this.bullets[j];
            const dist = Math.hypot(t.x - b.x, t.y - b.y);
            if (dist < t.radius + 6) {
              this.bullets.splice(j, 1);
              t.hp--;

              // Sparkle particles
              for (let p = 0; p < 8; p++) {
                const angle = Math.random() * Math.PI * 2;
                const spd = Math.random() * 100 + 40;
                this.particles.push({
                  x: t.x, y: t.y,
                  vx: Math.cos(angle) * spd,
                  vy: Math.sin(angle) * spd,
                  life: 0.3,
                  maxLife: 0.3,
                  color: t.color
                });
              }

              if (t.hp <= 0) {
                this.targets.splice(i, 1);
                this.score += 15;
                session.onScoreUpdate(this.score);
                audioManager.playCoin();
                break;
              }
            }
          }

          // Check collision with player
          const pDist = Math.hypot(t.x - this.player.x, t.y - this.player.y);
          if (pDist < t.radius + 18) {
            audioManager.playHit();
            audioManager.playExplosion();
            session.onGameOver(this.score, false);
            return;
          }

          // Remove passed targets
          if (t.y > this.height + 40) {
            this.targets.splice(i, 1);
          }
        }

        // Update particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
          const p = this.particles[i];
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.life -= dt;
          if (p.life <= 0) this.particles.splice(i, 1);
        }
      },
      render(ctx) {
        ctx.fillStyle = '#080A12';
        ctx.fillRect(0, 0, this.width, this.height);

        // Cyber grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
        ctx.lineWidth = 1;
        for (let x = 0; x < this.width; x += 30) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, this.height);
          ctx.stroke();
        }
        for (let y = 0; y < this.height; y += 30) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(this.width, y);
          ctx.stroke();
        }

        // Draw Arena border
        ctx.strokeStyle = themeColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(2, 2, this.width - 4, this.height - 4);

        // Draw Player Ship
        ctx.save();
        ctx.translate(this.player.x, this.player.y);
        ctx.fillStyle = themeColor;
        ctx.beginPath();
        ctx.moveTo(0, -22);
        ctx.lineTo(18, 16);
        ctx.lineTo(0, 8);
        ctx.lineTo(-18, 16);
        ctx.closePath();
        ctx.fill();

        // Thruster flame
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.moveTo(-6, 12);
        ctx.lineTo(0, 24 + Math.random() * 6);
        ctx.lineTo(6, 12);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Draw Bullets
        ctx.fillStyle = themeColor;
        for (const b of this.bullets) {
          ctx.fillRect(b.x - 2, b.y, 4, 12);
        }

        // Draw Targets
        for (const t of this.targets) {
          ctx.save();
          ctx.fillStyle = t.color;
          ctx.beginPath();
          ctx.arc(t.x, t.y, t.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.restore();
        }

        // Draw Particles
        for (const p of this.particles) {
          ctx.save();
          ctx.globalAlpha = p.life / p.maxLife;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      },
      destroy() {
        this.bullets = [];
        this.targets = [];
        this.particles = [];
      }
    };
  }

  buildDOM() {
    this.container.innerHTML = `
      <div class="game-session-container">
        <!-- Top HUD -->
        <header class="game-hud">
          <div class="hud-left">
            <button class="btn-exit-game" id="hudExitBtn" title="Back to Arcade">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              <span>EXIT</span>
            </button>
            <div class="hud-game-info">
              <span class="hud-game-title">${this.gameEntry.title}</span>
              <span class="hud-game-category">${this.gameEntry.categoryName}</span>
            </div>
          </div>

          <div class="hud-center">
            <div class="hud-stat-box">
              <span class="hud-stat-label">Score</span>
              <span class="hud-stat-value score" id="hudScoreVal">0</span>
            </div>
            <div class="hud-stat-box">
              <span class="hud-stat-label">Best</span>
              <span class="hud-stat-value best" id="hudBestVal">${this.highScore}</span>
            </div>
          </div>

          <div class="hud-right">
            <button class="btn-icon" id="hudMuteBtn" title="Sound">
              <span id="hudMuteIcon">${audioManager.isMuted ? '🔇' : '🔊'}</span>
            </button>
            <button class="btn-icon" id="hudPauseBtn" title="Pause (Esc)">
              <span>⏸</span>
            </button>
            <button class="btn-icon" id="hudFullscreenBtn" title="Fullscreen">
              <span>⛶</span>
            </button>
          </div>
        </header>

        <!-- Viewport Holder -->
        <div class="game-viewport-wrap" id="viewportWrap">
          <!-- Quick Animated Start Notification -->
          <div class="start-countdown-banner">
            ⚡ START: ${this.gameEntry.title.toUpperCase()}
          </div>

          <div class="game-canvas-holder" id="canvasHolder">
            <canvas class="game-canvas" id="activeGameCanvas"></canvas>
          </div>

          <!-- Quick Controls Hint Bar -->
          <div class="game-controls-hint-bar">
            <span>Controls:</span>
            <span class="hint-pill">${this.gameEntry.controls.join(' / ').toUpperCase()}</span>
            <span>•</span>
            <span>${this.gameEntry.instructions}</span>
          </div>

          <!-- Dialog Overlays (Pause, GameOver) -->
          <div class="game-dialog-overlay hidden" id="dialogOverlay">
            <div class="dialog-card" id="dialogContent"></div>
          </div>

          <!-- Virtual Touch Controls Layer -->
          <div class="touch-controls-layer" id="touchControlsLayer">
            <div class="touch-dpad-container" id="dpadContainer">
              <button class="dpad-btn dpad-up" data-action="up">▲</button>
              <button class="dpad-btn dpad-left" data-action="left">◀</button>
              <div class="dpad-center"></div>
              <button class="dpad-btn dpad-right" data-action="right">▶</button>
              <button class="dpad-btn dpad-down" data-action="down">▼</button>
            </div>
            <div class="touch-actions-container" id="actionsContainer">
              <button class="touch-act-btn btn-b" data-action="action2">B</button>
              <button class="touch-act-btn" data-action="action1">A</button>
            </div>
          </div>
        </div>
      </div>
    `;

    this.canvas = this.container.querySelector('#activeGameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.dialogOverlay = this.container.querySelector('#dialogOverlay');
    this.dialogContent = this.container.querySelector('#dialogContent');
    this.touchLayer = this.container.querySelector('#touchControlsLayer');

    if (window.matchMedia('(pointer: coarse)').matches || window.innerWidth <= 900) {
      this.touchLayer.classList.add('enabled');
    }

    this.bindHUDButtons();
    this.bindVirtualTouchControls();
  }

  bindHUDButtons() {
    this.container.querySelector('#hudExitBtn').addEventListener('click', () => {
      audioManager.playClick();
      this.exit();
    });

    this.container.querySelector('#hudMuteBtn').addEventListener('click', () => {
      const muted = audioManager.toggleMute();
      this.container.querySelector('#hudMuteIcon').textContent = muted ? '🔇' : '🔊';
    });

    this.container.querySelector('#hudPauseBtn').addEventListener('click', () => {
      audioManager.playClick();
      this.togglePause();
    });

    this.container.querySelector('#hudFullscreenBtn').addEventListener('click', () => {
      audioManager.playClick();
      this.toggleFullscreen();
    });
  }

  bindVirtualTouchControls() {
    const buttons = this.container.querySelectorAll('.dpad-btn, .touch-act-btn');
    buttons.forEach(btn => {
      const action = btn.dataset.action;
      if (!action) return;

      const press = (e) => {
        e.preventDefault();
        btn.classList.add('pressed');
        if (this.input) this.input.setActionState(action, true);
      };

      const release = (e) => {
        e.preventDefault();
        btn.classList.remove('pressed');
        if (this.input) this.input.setActionState(action, false);
      };

      btn.addEventListener('touchstart', press, { passive: false });
      btn.addEventListener('touchend', release, { passive: false });
      btn.addEventListener('mousedown', press);
      btn.addEventListener('mouseup', release);
      btn.addEventListener('mouseleave', release);
    });
  }

  setupCanvasDimensions() {
    const wrap = this.container.querySelector('#viewportWrap');
    if (!wrap || !this.canvas) return;

    // Use wrap dimensions, falling back to window inner dimensions if not yet measured
    const availW = Math.max(300, (wrap.clientWidth || window.innerWidth) - 24);
    const availH = Math.max(300, (wrap.clientHeight || (window.innerHeight - 80)) - 70);

    const targetW = this.game ? this.game.width : 800;
    const targetH = this.game ? this.game.height : 600;
    const targetAspect = targetW / targetH;

    let displayW = availW;
    let displayH = availW / targetAspect;

    if (displayH > availH) {
      displayH = availH;
      displayW = availH * targetAspect;
    }

    const holder = this.container.querySelector('#canvasHolder');
    if (holder) {
      holder.style.width = `${Math.floor(displayW)}px`;
      holder.style.height = `${Math.floor(displayH)}px`;
    }

    this.canvas.width = Math.floor(targetW * this.dpr);
    this.canvas.height = Math.floor(targetH * this.dpr);
  }

  handleResize() {
    this.setupCanvasDimensions();
  }

  showPauseDialog() {
    this.dialogOverlay.classList.remove('hidden');
    this.dialogContent.innerHTML = `
      <h2 class="dialog-title">GAME PAUSED</h2>
      <p class="dialog-desc">Take a breather, hit resume when ready.</p>

      <div class="dialog-score-summary">
        <div class="dialog-score-item">
          <span class="dialog-score-val" style="color: var(--neon-cyan);">${this.score}</span>
          <span class="dialog-score-lbl">Current Score</span>
        </div>
        <div class="dialog-score-item">
          <span class="dialog-score-val" style="color: var(--neon-gold);">${this.highScore}</span>
          <span class="dialog-score-lbl">Best Score</span>
        </div>
      </div>

      <div class="dialog-btn-group">
        <button class="btn btn-primary" id="btnResume">RESUME (ESC)</button>
        <button class="btn btn-secondary" id="btnRestart">RESTART (R)</button>
        <button class="btn btn-secondary" id="btnExitPause">EXIT TO ARCADE</button>
      </div>
    `;

    this.dialogContent.querySelector('#btnResume').addEventListener('click', () => {
      audioManager.playClick();
      this.togglePause();
    });

    this.dialogContent.querySelector('#btnRestart').addEventListener('click', () => {
      audioManager.playClick();
      this.restart();
    });

    this.dialogContent.querySelector('#btnExitPause').addEventListener('click', () => {
      audioManager.playClick();
      this.exit();
    });
  }

  showGameOverDialog(score, isVictory) {
    const isNewHigh = storageManager.saveHighScore(this.gameEntry.id, score);
    if (isNewHigh) {
      this.highScore = score;
      this.container.querySelector('#hudBestVal').textContent = score;
    }

    this.dialogOverlay.classList.remove('hidden');
    this.dialogContent.innerHTML = `
      <h2 class="dialog-title ${isVictory ? 'victory' : 'gameover'}">
        ${isVictory ? 'VICTORY!' : 'GAME OVER'}
      </h2>
      <p class="dialog-desc">${isVictory ? 'Phenomenal run! You cleared the challenge.' : 'Good attempt! Hit replay to beat your score.'}</p>

      ${isNewHigh ? '<div class="dialog-highscore-notice">★ NEW PERSONAL BEST! ★</div>' : ''}

      <div class="dialog-score-summary">
        <div class="dialog-score-item">
          <span class="dialog-score-val" style="color: var(--neon-cyan);">${score}</span>
          <span class="dialog-score-lbl">Final Score</span>
        </div>
        <div class="dialog-score-item">
          <span class="dialog-score-val" style="color: var(--neon-gold);">${this.highScore}</span>
          <span class="dialog-score-lbl">Best Score</span>
        </div>
      </div>

      <div class="dialog-btn-group">
        <button class="btn btn-primary" id="btnPlayAgain">PLAY AGAIN</button>
        <button class="btn btn-secondary" id="btnExitGameOver">BACK TO ARCADE</button>
      </div>
    `;

    this.dialogContent.querySelector('#btnPlayAgain').addEventListener('click', () => {
      audioManager.playClick();
      this.restart();
    });

    this.dialogContent.querySelector('#btnExitGameOver').addEventListener('click', () => {
      audioManager.playClick();
      this.exit();
    });
  }

  hideDialog() {
    this.dialogOverlay.classList.add('hidden');
  }

  start() {
    this.hideDialog();
    if (this.game && typeof this.game.create === 'function') {
      this.game.create();
    }
    this.loop.start();
  }

  onScoreUpdate(newScore) {
    this.score = newScore;
    const scoreEl = this.container.querySelector('#hudScoreVal');
    if (scoreEl) scoreEl.textContent = this.score;

    if (this.score > this.highScore) {
      const bestEl = this.container.querySelector('#hudBestVal');
      if (bestEl) bestEl.textContent = this.score;
    }
  }

  onGameOver(finalScore, isVictory) {
    this.isGameOver = true;
    this.showGameOverDialog(finalScore, isVictory);
  }

  togglePause() {
    if (this.isGameOver) return;
    this.isPaused = !this.isPaused;
    if (this.isPaused) {
      this.loop.pause();
      if (this.game && typeof this.game.pause === 'function') {
        this.game.pause();
      }
      this.showPauseDialog();
    } else {
      this.hideDialog();
      if (this.game && typeof this.game.resume === 'function') {
        this.game.resume();
      }
      this.loop.resume();
    }
  }

  restart() {
    this.hideDialog();
    this.isPaused = false;
    this.isGameOver = false;
    this.score = 0;
    this.onScoreUpdate(0);
    if (this.game && typeof this.game.restart === 'function') {
      this.game.restart();
    }
    this.loop.resume();
  }

  toggleFullscreen() {
    const elem = this.container.querySelector('.game-session-container');
    if (!document.fullscreenElement) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(() => {});
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  }

  exit() {
    this.destroy();
    if (typeof this.onExitCallback === 'function') {
      this.onExitCallback();
    }
  }

  destroy() {
    window.removeEventListener('resize', this.handleResize);

    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }

    if (this.loop) {
      this.loop.stop();
      this.loop = null;
    }

    if (this.input) {
      this.input.destroy();
      this.input = null;
    }

    if (this.game && typeof this.game.destroy === 'function') {
      this.game.destroy();
      this.game = null;
    }

    this.container.innerHTML = '';
  }
}
