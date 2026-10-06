/**
 * Game2048 - Clean iOS style touch-swipe 2048 puzzle.
 * Vibrant pastel colors on crisp light gray board.
 */
export class Game2048Mobile {
  constructor(canvas, audio, onScore, onGameOver) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.audio = audio;
    this.onScore = onScore;
    this.onGameOver = onGameOver;

    this.width = 400;
    this.height = 400;
    this.size = 4;
    this.grid = [];
    this.score = 0;
    this.isOver = false;

    this.tileColors = {
      2: { bg: '#E2E8F0', text: '#334155' },
      4: { bg: '#CBD5E1', text: '#1E293B' },
      8: { bg: '#FDE68A', text: '#92400E' },
      16: { bg: '#FCD34D', text: '#78350F' },
      32: { bg: '#FCA5A5', text: '#991B1B' },
      64: { bg: '#F87171', text: '#FFFFFF' },
      128: { bg: '#93C5FD', text: '#1E3A8A' },
      256: { bg: '#60A5FA', text: '#FFFFFF' },
      512: { bg: '#A78BFA', text: '#FFFFFF' },
      1024: { bg: '#818CF8', text: '#FFFFFF' },
      2048: { bg: '#4F46E5', text: '#FFFFFF' }
    };

    this.touchStart = { x: 0, y: 0 };
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  start() {
    this.score = 0;
    this.isOver = false;
    this.grid = Array(this.size).fill(null).map(() => Array(this.size).fill(0));
    this.spawnTile();
    this.spawnTile();

    this.handleTouchMove = (e) => { e.preventDefault(); };
    this.canvas.addEventListener('touchstart', this.handleTouchStart, { passive: false });
    this.canvas.addEventListener('touchmove', this.handleTouchMove, { passive: false });
    this.canvas.addEventListener('touchend', this.handleTouchEnd, { passive: false });
    this.canvas.addEventListener('pointerdown', this.handleTouchStart);
    this.canvas.addEventListener('pointerup', this.handleTouchEnd);
    window.addEventListener('keydown', this.handleKeyDown);
  }

  spawnTile() {
    const empty = [];
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.grid[r][c] === 0) empty.push({ r, c });
      }
    }
    if (empty.length > 0) {
      const { r, c } = empty[Math.floor(Math.random() * empty.length)];
      this.grid[r][c] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  handleTouchStart(e) {
    if (e.touches && e.touches.length > 0) {
      this.touchStart.x = e.touches[0].clientX;
      this.touchStart.y = e.touches[0].clientY;
    } else if (e.clientX !== undefined) {
      this.touchStart.x = e.clientX;
      this.touchStart.y = e.clientY;
    }
  }

  handleTouchEnd(e) {
    const clientX = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientX : e.clientX;
    const clientY = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientY : e.clientY;
    if (clientX !== undefined && clientY !== undefined) {
      const dx = clientX - this.touchStart.x;
      const dy = clientY - this.touchStart.y;
      if (Math.abs(dx) > 18 || Math.abs(dy) > 18) {
        if (Math.abs(dx) > Math.abs(dy)) {
          if (dx > 0) this.tryMove('right');
          else this.tryMove('left');
        } else {
          if (dy > 0) this.tryMove('down');
          else this.tryMove('up');
        }
      }
    }
  }

  handleKeyDown(e) {
    if (e.code === 'ArrowUp') this.tryMove('up');
    if (e.code === 'ArrowDown') this.tryMove('down');
    if (e.code === 'ArrowLeft') this.tryMove('left');
    if (e.code === 'ArrowRight') this.tryMove('right');
  }

  tryMove(dir) {
    if (this.isOver) return;
    let moved = false;
    if (dir === 'left') moved = this.moveLeft();
    if (dir === 'right') moved = this.moveRight();
    if (dir === 'up') moved = this.moveUp();
    if (dir === 'down') moved = this.moveDown();

    if (moved) {
      this.audio.pop();
      this.spawnTile();
      if (this.checkGameOver()) {
        this.isOver = true;
        this.audio.lose();
        this.onGameOver(this.score);
      }
    }
  }

  slide(row) {
    let arr = row.filter(val => val !== 0);
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i + 1]) {
        arr[i] *= 2;
        this.score += arr[i];
        this.onScore(this.score);
        this.audio.coin();
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
      const orig = [...this.grid[r]];
      this.grid[r] = this.slide(this.grid[r]);
      if (this.grid[r].some((v, i) => v !== orig[i])) moved = true;
    }
    return moved;
  }

  moveRight() {
    let moved = false;
    for (let r = 0; r < this.size; r++) {
      const orig = [...this.grid[r]];
      this.grid[r] = this.slide([...this.grid[r]].reverse()).reverse();
      if (this.grid[r].some((v, i) => v !== orig[i])) moved = true;
    }
    return moved;
  }

  moveUp() {
    let moved = false;
    for (let c = 0; c < this.size; c++) {
      const col = [this.grid[0][c], this.grid[1][c], this.grid[2][c], this.grid[3][c]];
      const slided = this.slide(col);
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
      const slided = this.slide(col);
      for (let r = 0; r < this.size; r++) {
        if (this.grid[3 - r][c] !== slided[r]) moved = true;
        this.grid[3 - r][c] = slided[r];
      }
    }
    return moved;
  }

  checkGameOver() {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.grid[r][c] === 0) return false;
        if (c < this.size - 1 && this.grid[r][c] === this.grid[r][c + 1]) return false;
        if (r < this.size - 1 && this.grid[r][c] === this.grid[r + 1][c]) return false;
      }
    }
    return true;
  }

  update() {}

  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    const pad = 12;
    const boardSize = this.width - pad * 2;
    const cellSize = (boardSize - pad * (this.size + 1)) / this.size;

    // Board Surface
    ctx.fillStyle = '#F1F5F9';
    ctx.beginPath();
    ctx.roundRect(pad, pad, boardSize, boardSize, 18);
    ctx.fill();

    // Cells
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const x = pad + pad + c * (cellSize + pad);
        const y = pad + pad + r * (cellSize + pad);
        const val = this.grid[r][c];

        ctx.save();
        if (val === 0) {
          ctx.fillStyle = 'rgba(203, 213, 225, 0.4)';
          ctx.beginPath();
          ctx.roundRect(x, y, cellSize, cellSize, 10);
          ctx.fill();
        } else {
          const config = this.tileColors[val] || { bg: '#4F46E5', text: '#FFFFFF' };
          ctx.fillStyle = config.bg;
          ctx.shadowColor = 'rgba(0, 0, 0, 0.08)';
          ctx.shadowBlur = 8;
          ctx.shadowOffsetY = 4;
          ctx.beginPath();
          ctx.roundRect(x, y, cellSize, cellSize, 10);
          ctx.fill();
          ctx.shadowBlur = 0;

          // Value Text
          ctx.fillStyle = config.text;
          ctx.font = `bold ${val >= 1024 ? 22 : val >= 128 ? 26 : 30}px Inter, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(val, x + cellSize / 2, y + cellSize / 2);
        }
        ctx.restore();
      }
    }
  }

  destroy() {
    this.canvas.removeEventListener('touchstart', this.handleTouchStart);
    if (this.handleTouchMove) this.canvas.removeEventListener('touchmove', this.handleTouchMove);
    this.canvas.removeEventListener('touchend', this.handleTouchEnd);
    this.canvas.removeEventListener('pointerdown', this.handleTouchStart);
    this.canvas.removeEventListener('pointerup', this.handleTouchEnd);
    window.removeEventListener('keydown', this.handleKeyDown);
  }
}
