import { BaseGame } from '../../engine/BaseGame.js';

/**
 * Game2048 - Authentic 2048 puzzle implementation with glowing neon cyber tiles,
 * keyboard & swipe controls, tile merging, score tracking, and game over detection.
 */
export class Game2048 extends BaseGame {
  constructor(session, canvas, input, audio) {
    super(session, canvas, input, audio);
    this.width = 560;
    this.height = 560;
    this.size = 4;
    this.grid = [];
    this.tileColors = {
      2: { bg: '#1E293B', text: '#F8FAFC' },
      4: { bg: '#334155', text: '#F8FAFC' },
      8: { bg: '#0284C7', text: '#FFFFFF' },
      16: { bg: '#00F2FE', text: '#0B0E17' },
      32: { bg: '#8B5CF6', text: '#FFFFFF' },
      64: { bg: '#A855F7', text: '#FFFFFF' },
      128: { bg: '#EC4899', text: '#FFFFFF' },
      256: { bg: '#F43F5E', text: '#FFFFFF' },
      512: { bg: '#F59E0B', text: '#0B0E17' },
      1024: { bg: '#EAB308', text: '#0B0E17' },
      2048: { bg: '#FBBF24', text: '#0B0E17' }
    };
  }

  create() {
    super.create();
    this.grid = Array(this.size).fill(null).map(() => Array(this.size).fill(0));
    this.setScore(0);
    this.spawnTile();
    this.spawnTile();
  }

  update(deltaTime) {
    super.update(deltaTime);
    if (this.isGameOver || this.isPaused) return;

    let moved = false;
    if (this.input.isActionJustPressed('up')) moved = this.moveUp();
    else if (this.input.isActionJustPressed('down')) moved = this.moveDown();
    else if (this.input.isActionJustPressed('left')) moved = this.moveLeft();
    else if (this.input.isActionJustPressed('right')) moved = this.moveRight();

    if (moved) {
      if (this.audio) this.audio.playBlip(440, 0.04);
      this.spawnTile();

      if (this.checkGameOver()) {
        this.triggerGameOver(false);
      }
    }
  }

  spawnTile() {
    const emptyCells = [];
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.grid[r][c] === 0) emptyCells.push({ r, c });
      }
    }
    if (emptyCells.length > 0) {
      const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      this.grid[r][c] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  slideArray(row) {
    let arr = row.filter(val => val !== 0);
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i + 1]) {
        arr[i] *= 2;
        this.addScore(arr[i]);
        if (this.audio) this.audio.playCoin();
        arr[i + 1] = 0;
      }
    }
    arr = arr.filter(val => val !== 0);
    while (arr.length < this.size) arr.push(0);
    return arr;
  }

  moveLeft() {
    let moved = false;
    for (let r = 0; r < this.size; r++) {
      const original = [...this.grid[r]];
      this.grid[r] = this.slideArray(this.grid[r]);
      if (this.grid[r].some((val, i) => val !== original[i])) moved = true;
    }
    return moved;
  }

  moveRight() {
    let moved = false;
    for (let r = 0; r < this.size; r++) {
      const original = [...this.grid[r]];
      const reversed = [...this.grid[r]].reverse();
      const slided = this.slideArray(reversed).reverse();
      this.grid[r] = slided;
      if (this.grid[r].some((val, i) => val !== original[i])) moved = true;
    }
    return moved;
  }

  moveUp() {
    let moved = false;
    for (let c = 0; c < this.size; c++) {
      const col = [this.grid[0][c], this.grid[1][c], this.grid[2][c], this.grid[3][c]];
      const slided = this.slideArray(col);
      for (let r = 0; r < this.size; r++) {
        if (this.grid[r][c] !== slided[r]) moved = true;
        this.grid[r][c] = slided[r];
      }
    }
    return moved;
  }

  moveDown() {
    let moved = false;
    for (let c = 0; c < this.size; c++) {
      const col = [this.grid[3][c], this.grid[2][c], this.grid[1][c], this.grid[0][c]];
      const slided = this.slideArray(col);
      for (let r = 0; r < this.size; r++) {
        if (this.grid[3 - r][c] !== slided[r]) moved = true;
        this.grid[3 - r][c] = slided[r];
      }
    }
    return moved;
  }

  checkGameOver() {
    // Check if any empty cell exists
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.grid[r][c] === 0) return false;
      }
    }
    // Check adjacent matches
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const val = this.grid[r][c];
        if (c < this.size - 1 && this.grid[r][c + 1] === val) return false;
        if (r < this.size - 1 && this.grid[r + 1][c] === val) return false;
      }
    }
    return true;
  }

  render(ctx) {
    this.clearCanvas('#080A12');

    const padding = 16;
    const boardSize = this.width - padding * 2;
    const cellSize = (boardSize - padding * (this.size + 1)) / this.size;

    // Draw Board Background
    ctx.fillStyle = '#121624';
    ctx.strokeStyle = '#00F2FE';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(padding, padding, boardSize, boardSize, 14);
    ctx.fill();
    ctx.stroke();

    // Draw Grid Cells & Numbers
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const x = padding + padding + c * (cellSize + padding);
        const y = padding + padding + r * (cellSize + padding);
        const val = this.grid[r][c];

        ctx.save();
        if (val === 0) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
          ctx.beginPath();
          ctx.roundRect(x, y, cellSize, cellSize, 8);
          ctx.fill();
        } else {
          const config = this.tileColors[val] || { bg: '#FFD700', text: '#0B0E17' };
          ctx.fillStyle = config.bg;
          ctx.beginPath();
          ctx.roundRect(x, y, cellSize, cellSize, 8);
          ctx.fill();

          // Render Number
          ctx.fillStyle = config.text;
          ctx.font = `bold ${val >= 1024 ? 26 : val >= 128 ? 32 : 38}px Orbitron, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(val, x + cellSize / 2, y + cellSize / 2);
        }
        ctx.restore();
      }
    }

    super.render(ctx);
  }

  destroy() {
    if (this.actionCleanup) this.actionCleanup();
    super.destroy();
  }
}
