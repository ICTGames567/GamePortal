const gameBoard = document.getElementById('game-board');
const cells = document.querySelectorAll('.cell');
const resetBtn = document.getElementById('reset-btn');
const currentPlayerSpan = document.getElementById('current-player');
const statusMessage = document.getElementById('status-message');

let currentPlayer = 'X';
let gameActive = true;
let boardState = ['', '', '', '', '', '', '', '', ''];

const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

function handleCellClick(e) {
  const cell = e.target;
  const index = cell.getAttribute('data-index');

  if (boardState[index] !== '' || !gameActive) {
    return;
  }

  boardState[index] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.classList.add(currentPlayer.toLowerCase());

  if (checkWin()) {
    statusMessage.textContent = `Spieler ${currentPlayer} hat gewonnen! 🎉`;
    gameActive = false;
    return;
  }

  if (boardState.every(cell => cell !== '')) {
    statusMessage.textContent = 'Unentschieden!';
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  currentPlayerSpan.textContent = currentPlayer;
  statusMessage.textContent = `Spieler ${currentPlayer} ist dran`;
}

function checkWin() {
  return winningConditions.some(condition => {
    return condition.every(index => boardState[index] === currentPlayer);
  });
}

function resetGame() {
  currentPlayer = 'X';
  gameActive = true;
  boardState = ['', '', '', '', '', '', '', '', ''];
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('x', 'o');
  });
  currentPlayerSpan.textContent = currentPlayer;
  statusMessage.textContent = `Spieler ${currentPlayer} ist dran`;
}

cells.forEach(cell => {
  cell.addEventListener('click', handleCellClick);
});

resetBtn.addEventListener('click', resetGame);
