import { BaseGame } from '../../engine/BaseGame.js';

/**
 * TicTacToeGame - Cyber Tic-Tac-Toe with heuristic AI opponent,
 * animated vector win lines, score tracking, and instant replay.
 */
export class TicTacToeGame extends BaseGame {
  constructor(session, canvas, input, audio) {
    super(session, canvas, input, audio);
    this.width = 540;
    this.height = 540;
    this.board = Array(9).fill(null);
    this.turn = 'X'; // X is player, O is AI
    this.winningCombo = null;
    this.isAiThinking = false;
  }

  create() {
    super.create();
    this.board = Array(9).fill(null);
    this.turn = 'X';
    this.winningCombo = null;
    this.isAiThinking = false;
    this.setScore(0);
  }

  update(deltaTime) {
    super.update(deltaTime);
    if (this.isGameOver || this.isPaused || this.turn !== 'X' || this.isAiThinking) return;

    if (this.input.pointer.justPressed) {
      const x = this.input.pointer.canvasX;
      const y = this.input.pointer.canvasY;

      const padding = 40;
      const cellSize = (this.width - padding * 2) / 3;

      if (x >= padding && x <= this.width - padding && y >= padding && y <= this.height - padding) {
        const col = Math.floor((x - padding) / cellSize);
        const row = Math.floor((y - padding) / cellSize);
        const index = row * 3 + col;

        if (this.board[index] === null) {
          this.makeMove(index, 'X');
        }
      }
    }
  }

  makeMove(index, player) {
    this.board[index] = player;
    if (this.audio) this.audio.playBlip(player === 'X' ? 600 : 400, 0.05);

    const win = this.checkWin();
    if (win) {
      this.winningCombo = win.combo;
      if (win.winner === 'X') {
        this.addScore(100);
        this.triggerGameOver(true);
      } else {
        this.triggerGameOver(false);
      }
      return;
    }

    if (this.board.every(cell => cell !== null)) {
      // Draw
      this.addScore(25);
      if (this.audio) this.audio.playCoin();
      this.triggerGameOver(false);
      return;
    }

    this.turn = player === 'X' ? 'O' : 'X';

    if (this.turn === 'O') {
      this.isAiThinking = true;
      setTimeout(() => {
        if (!this.isGameOver) {
          this.aiTurn();
          this.isAiThinking = false;
        }
      }, 350);
    }
  }

  aiTurn() {
    // 1. Can AI win in one move?
    for (let i = 0; i < 9; i++) {
      if (this.board[i] === null) {
        this.board[i] = 'O';
        if (this.checkWin()) {
          this.board[i] = null;
          this.makeMove(i, 'O');
          return;
        }
        this.board[i] = null;
      }
    }

    // 2. Can Player win in one move? Block it!
    for (let i = 0; i < 9; i++) {
      if (this.board[i] === null) {
        this.board[i] = 'X';
        if (this.checkWin()) {
          this.board[i] = null;
          this.makeMove(i, 'O');
          return;
        }
        this.board[i] = null;
      }
    }

    // 3. Take center
    if (this.board[4] === null) {
      this.makeMove(4, 'O');
      return;
    }

    // 4. Take random available
    const available = [];
    for (let i = 0; i < 9; i++) {
      if (this.board[i] === null) available.push(i);
    }
    if (available.length > 0) {
      const pick = available[Math.floor(Math.random() * available.length)];
      this.makeMove(pick, 'O');
    }
  }

  checkWin() {
    const combos = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
      [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    for (const combo of combos) {
      const [a, b, c] = combo;
      if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
        return { winner: this.board[a], combo };
      }
    }
    return null;
  }

  render(ctx) {
    this.clearCanvas('#080A12');

    const padding = 40;
    const size = this.width - padding * 2;
    const cellSize = size / 3;

    // Draw Grid Lines
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 3;

    ctx.beginPath();
    // Vertical
    ctx.moveTo(padding + cellSize, padding);
    ctx.lineTo(padding + cellSize, padding + size);
    ctx.moveTo(padding + cellSize * 2, padding);
    ctx.lineTo(padding + cellSize * 2, padding + size);
    // Horizontal
    ctx.moveTo(padding, padding + cellSize);
    ctx.lineTo(padding + size, padding + cellSize);
    ctx.moveTo(padding, padding + cellSize * 2);
    ctx.lineTo(padding + size, padding + cellSize * 2);
    ctx.stroke();

    // Draw X and O marks
    for (let i = 0; i < 9; i++) {
      const mark = this.board[i];
      if (!mark) continue;

      const col = i % 3;
      const row = Math.floor(i / 3);
      const cx = padding + col * cellSize + cellSize / 2;
      const cy = padding + row * cellSize + cellSize / 2;
      const r = cellSize * 0.32;

      ctx.save();
      if (mark === 'X') {
        ctx.strokeStyle = '#00F2FE';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(cx - r, cy - r);
        ctx.lineTo(cx + r, cy + r);
        ctx.moveTo(cx + r, cy - r);
        ctx.lineTo(cx - r, cy + r);
        ctx.stroke();
      } else {
        ctx.strokeStyle = '#8B5CF6';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    }

    // Draw Winning Strike Line
    if (this.winningCombo) {
      const [startIdx, , endIdx] = this.winningCombo;
      const startCol = startIdx % 3;
      const startRow = Math.floor(startIdx / 3);
      const endCol = endIdx % 3;
      const endRow = Math.floor(endIdx / 3);

      const x1 = padding + startCol * cellSize + cellSize / 2;
      const y1 = padding + startRow * cellSize + cellSize / 2;
      const x2 = padding + endCol * cellSize + cellSize / 2;
      const y2 = padding + endRow * cellSize + cellSize / 2;

      ctx.save();
      ctx.strokeStyle = '#FBBF24';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.restore();
    }

    super.render(ctx);
  }

  destroy() {
    if (this.canvas && this.clickHandler) {
      this.canvas.removeEventListener('pointerdown', this.clickHandler);
    }
    super.destroy();
  }
}
