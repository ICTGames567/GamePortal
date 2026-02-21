const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const currentPlayerSpan = document.getElementById('current-player');
const statusMessage = document.getElementById('status-message');
const newGameBtn = document.getElementById('new-game-btn');
const undoBtn = document.getElementById('undo-btn');

const ROWS = 6;
const COLS = 7;
const RED = 1;
const YELLOW = 2;
const EMPTY = 0;

let board = Array(ROWS).fill().map(() => Array(COLS).fill(EMPTY));
let currentPlayer = RED;
let gameActive = true;
let history = [];

const CELL_SIZE = canvas.width / COLS;
const CELL_HEIGHT = canvas.height / ROWS;

function drawBoard() {
  // Draw blue background
  ctx.fillStyle = '#0984e3';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw holes
  ctx.fillStyle = '#001f3f';
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const x = c * CELL_SIZE + CELL_SIZE / 2;
      const y = r * CELL_HEIGHT + CELL_HEIGHT / 2;
      ctx.beginPath();
      ctx.arc(x, y, CELL_SIZE * 0.35, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Draw chips
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const x = c * CELL_SIZE + CELL_SIZE / 2;
      const y = r * CELL_HEIGHT + CELL_HEIGHT / 2;

      if (board[r][c] === RED) {
        ctx.fillStyle = '#d63031';
      } else if (board[r][c] === YELLOW) {
        ctx.fillStyle = '#fdcb6e';
      } else {
        continue;
      }

      ctx.beginPath();
      ctx.arc(x, y, CELL_SIZE * 0.32, 0, Math.PI * 2);
      ctx.fill();

      // Gloss effect
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.beginPath();
      ctx.arc(x - CELL_SIZE * 0.1, y - CELL_SIZE * 0.1, CELL_SIZE * 0.12, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function findEmptyRow(col) {
  for (let r = ROWS - 1; r >= 0; r--) {
    if (board[r][col] === EMPTY) {
      return r;
    }
  }
  return -1;
}

function canPlay(col) {
  return findEmptyRow(col) !== -1;
}

function play(col) {
  if (!gameActive || !canPlay(col)) return;

  const row = findEmptyRow(col);
  history.push(JSON.stringify(board));

  board[row][col] = currentPlayer;

  if (checkWin(row, col)) {
    statusMessage.textContent = `${currentPlayer === RED ? 'Rot' : 'Gelb'} hat gewonnen! 🎉`;
    gameActive = false;
    drawBoard();
    return;
  }

  if (isBoardFull()) {
    statusMessage.textContent = 'Unentschieden!';
    gameActive = false;
    drawBoard();
    return;
  }

  currentPlayer = currentPlayer === RED ? YELLOW : RED;
  currentPlayerSpan.textContent = currentPlayer === RED ? 'Rot' : 'Gelb';
  statusMessage.textContent = `${currentPlayer === RED ? 'Rot' : 'Gelb'} ist dran`;

  drawBoard();

  // Bot move if playing against computer
  if (currentPlayer === YELLOW && gameActive) {
    setTimeout(botMove, 500);
  }
}

function botMove() {
  const bestCol = findBestMove();
  if (bestCol !== -1) {
    play(bestCol);
  }
}

function findBestMove() {
  const validCols = [];
  for (let c = 0; c < COLS; c++) {
    if (canPlay(c)) validCols.push(c);
  }

  // Check if bot can win
  for (const col of validCols) {
    const row = findEmptyRow(col);
    board[row][col] = YELLOW;
    if (checkWin(row, col)) {
      board[row][col] = EMPTY;
      return col;
    }
    board[row][col] = EMPTY;
  }

  // Block player win
  for (const col of validCols) {
    const row = findEmptyRow(col);
    board[row][col] = RED;
    if (checkWin(row, col)) {
      board[row][col] = EMPTY;
      return col;
    }
    board[row][col] = EMPTY;
  }

  // Prefer center columns
  const centerCols = validCols.sort((a, b) => {
    return Math.abs(a - COLS / 2) - Math.abs(b - COLS / 2);
  });

  return centerCols[Math.floor(Math.random() * Math.min(2, centerCols.length))];
}

function checkWin(row, col) {
  const player = board[row][col];

  // Check horizontal
  let count = 1;
  for (let c = col - 1; c >= 0 && board[row][c] === player; c--) count++;
  for (let c = col + 1; c < COLS && board[row][c] === player; c++) count++;
  if (count >= 4) return true;

  // Check vertical
  count = 1;
  for (let r = row - 1; r >= 0 && board[r][col] === player; r--) count++;
  for (let r = row + 1; r < ROWS && board[r][col] === player; r++) count++;
  if (count >= 4) return true;

  // Check diagonal (top-left to bottom-right)
  count = 1;
  for (let r = row - 1, c = col - 1; r >= 0 && c >= 0 && board[r][c] === player; r--, c--) count++;
  for (let r = row + 1, c = col + 1; r < ROWS && c < COLS && board[r][c] === player; r++, c++) count++;
  if (count >= 4) return true;

  // Check diagonal (top-right to bottom-left)
  count = 1;
  for (let r = row - 1, c = col + 1; r >= 0 && c < COLS && board[r][c] === player; r--, c++) count++;
  for (let r = row + 1, c = col - 1; r < ROWS && c >= 0 && board[r][c] === player; r++, c--) count++;
  if (count >= 4) return true;

  return false;
}

function isBoardFull() {
  for (let c = 0; c < COLS; c++) {
    if (board[0][c] === EMPTY) return false;
  }
  return true;
}

function resetGame() {
  board = Array(ROWS).fill().map(() => Array(COLS).fill(EMPTY));
  currentPlayer = RED;
  gameActive = true;
  history = [];
  currentPlayerSpan.textContent = 'Rot';
  statusMessage.textContent = 'Rot beginnt!';
  drawBoard();
}

function undoMove() {
  if (history.length === 0) return;
  board = JSON.parse(history.pop());
  currentPlayer = currentPlayer === RED ? YELLOW : RED;
  currentPlayerSpan.textContent = currentPlayer === RED ? 'Rot' : 'Gelb';
  statusMessage.textContent = `${currentPlayer === RED ? 'Rot' : 'Gelb'} ist dran`;
  gameActive = true;
  drawBoard();
}

canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const col = Math.floor(x / CELL_SIZE);
  if (col >= 0 && col < COLS) {
    play(col);
  }
});

newGameBtn.addEventListener('click', resetGame);
undoBtn.addEventListener('click', undoMove);

drawBoard();
