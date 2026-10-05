/**
 * TicTacToeMobile - Minimalist clean pastel AI Tic-Tac-Toe.
 */
export class TicTacToeMobile {
  constructor(canvas, audio, onScore, onGameOver) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.audio = audio;
    this.onScore = onScore;
    this.onGameOver = onGameOver;

    this.width = 400;
    this.height = 420;

    this.board = Array(9).fill(null);
    this.turn = 'X';
    this.isAiThinking = false;
    this.score = 0;
    this.isOver = false;

    this.handleTap = this.handleTap.bind(this);
  }

  start() {
    this.board = Array(9).fill(null);
    this.turn = 'X';
    this.isAiThinking = false;
    this.isOver = false;

    this.canvas.addEventListener('pointerdown', this.handleTap);
  }

  handleTap(e) {
    if (this.isOver || this.turn !== 'X' || this.isAiThinking) return;
    const rect = this.canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * this.width;
    const y = ((e.clientY - rect.top) / rect.height) * this.height;

    const pad = 30;
    const size = (this.width - pad * 2) / 3;

    if (x >= pad && x <= this.width - pad && y >= pad && y <= this.height - pad) {
      const col = Math.floor((x - pad) / size);
      const row = Math.floor((y - pad) / size);
      const idx = row * 3 + col;

      if (this.board[idx] === null) {
        this.makeMove(idx, 'X');
      }
    }
  }

  makeMove(idx, player) {
    this.board[idx] = player;
    this.audio.slice();

    const win = this.checkWin();
    if (win) {
      this.isOver = true;
      if (win === 'X') {
        this.score += 50;
        this.onScore(this.score);
        this.audio.win();
      } else {
        this.audio.lose();
      }
      this.onGameOver(this.score);
      return;
    }

    if (this.board.every(cell => cell !== null)) {
      this.isOver = true;
      this.score += 15;
      this.onScore(this.score);
      this.audio.coin();
      this.onGameOver(this.score);
      return;
    }

    this.turn = player === 'X' ? 'O' : 'X';

    if (this.turn === 'O') {
      this.isAiThinking = true;
      setTimeout(() => {
        if (!this.isOver) {
          this.aiMove();
          this.isAiThinking = false;
        }
      }, 300);
    }
  }

  aiMove() {
    // Check if AI can win
    for (let i = 0; i < 9; i++) {
      if (this.board[i] === null) {
        this.board[i] = 'O';
        if (this.checkWin() === 'O') {
          this.board[i] = null;
          this.makeMove(i, 'O');
          return;
        }
        this.board[i] = null;
      }
    }
    // Block Player
    for (let i = 0; i < 9; i++) {
      if (this.board[i] === null) {
        this.board[i] = 'X';
        if (this.checkWin() === 'X') {
          this.board[i] = null;
          this.makeMove(i, 'O');
          return;
        }
        this.board[i] = null;
      }
    }
    // Center or random
    if (this.board[4] === null) {
      this.makeMove(4, 'O');
      return;
    }
    const empty = [];
    for (let i = 0; i < 9; i++) {
      if (this.board[i] === null) empty.push(i);
    }
    if (empty.length > 0) {
      this.makeMove(empty[Math.floor(Math.random() * empty.length)], 'O');
    }
  }

  checkWin() {
    const lines = [
      [0,1,2], [3,4,5], [6,7,8],
      [0,3,6], [1,4,7], [2,5,8],
      [0,4,8], [2,4,6]
    ];
    for (const [a, b, c] of lines) {
      if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
        return this.board[a];
      }
    }
    return null;
  }

  update() {}

  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, this.width, this.height);

    const pad = 30;
    const boardW = this.width - pad * 2;
    const cellSize = boardW / 3;

    // Draw Grid Lines (Clean Slate)
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';

    ctx.beginPath();
    ctx.moveTo(pad + cellSize, pad);
    ctx.lineTo(pad + cellSize, pad + boardW);
    ctx.moveTo(pad + cellSize * 2, pad);
    ctx.lineTo(pad + cellSize * 2, pad + boardW);

    ctx.moveTo(pad, pad + cellSize);
    ctx.lineTo(pad + boardW, pad + cellSize);
    ctx.moveTo(pad, pad + cellSize * 2);
    ctx.lineTo(pad + boardW, pad + cellSize * 2);
    ctx.stroke();

    // Draw X and O
    for (let i = 0; i < 9; i++) {
      const mark = this.board[i];
      if (!mark) continue;
      const c = i % 3;
      const r = Math.floor(i / 3);
      const cx = pad + c * cellSize + cellSize / 2;
      const cy = pad + r * cellSize + cellSize / 2;

      ctx.save();
      if (mark === 'X') {
        ctx.strokeStyle = '#4F46E5'; // Indigo
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(cx - 22, cy - 22);
        ctx.lineTo(cx + 22, cy + 22);
        ctx.moveTo(cx + 22, cy - 22);
        ctx.lineTo(cx - 22, cy + 22);
        ctx.stroke();
      } else {
        ctx.strokeStyle = '#F43F5E'; // Rose
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(cx, cy, 24, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  destroy() {
    this.canvas.removeEventListener('pointerdown', this.handleTap);
  }
}
