const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreSpan = document.getElementById('score');
const highScoreSpan = document.getElementById('high-score');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');

const gridSize = 20;
const tileCount = canvas.width / gridSize;
let highScore = localStorage.getItem('snakeHighScore') || 0;
highScoreSpan.textContent = highScore;

let snake = [{ x: 10, y: 10 }];
let food = { x: 15, y: 15 };
let direction = { x: 1, y: 0 };
let nextDirection = { x: 1, y: 0 };
let score = 0;
let gameRunning = false;
let gamePaused = false;
let gameLoop;

function drawGame() {
  // Clear canvas
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw grid
  ctx.strokeStyle = '#222';
  ctx.lineWidth = 0.5;
  for (let i = 0; i <= tileCount; i++) {
    ctx.beginPath();
    ctx.moveTo(i * gridSize, 0);
    ctx.lineTo(i * gridSize, canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, i * gridSize);
    ctx.lineTo(canvas.width, i * gridSize);
    ctx.stroke();
  }

  // Draw snake
  ctx.fillStyle = '#00ff00';
  snake.forEach((segment, index) => {
    ctx.fillRect(
      segment.x * gridSize + 1,
      segment.y * gridSize + 1,
      gridSize - 2,
      gridSize - 2
    );
  });

  // Draw head in different color
  ctx.fillStyle = '#00aa00';
  ctx.fillRect(
    snake[0].x * gridSize + 1,
    snake[0].y * gridSize + 1,
    gridSize - 2,
    gridSize - 2
  );

  // Draw food
  ctx.fillStyle = '#ff0000';
  ctx.fillRect(
    food.x * gridSize + 1,
    food.y * gridSize + 1,
    gridSize - 2,
    gridSize - 2
  );
}

function update() {
  if (gamePaused) return;

  direction = nextDirection;

  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  // Check collision with walls
  if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
    endGame();
    return;
  }

  // Check collision with self
  if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
    endGame();
    return;
  }

  snake.unshift(head);

  // Check if food eaten
  if (head.x === food.x && head.y === food.y) {
    score += 10;
    scoreSpan.textContent = score;
    generateFood();
  } else {
    snake.pop();
  }

  drawGame();
}

function generateFood() {
  let newFood;
  let collision = true;

  while (collision) {
    newFood = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount)
    };
    collision = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
  }

  food = newFood;
}

function startGame() {
  if (gameRunning) return;
  gameRunning = true;
  gamePaused = false;
  startBtn.textContent = 'Läuft...';
  startBtn.disabled = true;
  gameLoop = setInterval(update, 100);
  drawGame();
}

function pauseGame() {
  if (!gameRunning) return;
  gamePaused = !gamePaused;
  pauseBtn.textContent = gamePaused ? 'Fortsetzen' : 'Pause';
}

function resetGame() {
  clearInterval(gameLoop);
  snake = [{ x: 10, y: 10 }];
  food = { x: 15, y: 15 };
  direction = { x: 1, y: 0 };
  nextDirection = { x: 1, y: 0 };
  score = 0;
  gameRunning = false;
  gamePaused = false;
  scoreSpan.textContent = score;
  startBtn.textContent = 'Start';
  startBtn.disabled = false;
  pauseBtn.textContent = 'Pause';
  drawGame();
}

function endGame() {
  clearInterval(gameLoop);
  gameRunning = false;
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('snakeHighScore', highScore);
    highScoreSpan.textContent = highScore;
  }
  startBtn.textContent = 'Start';
  startBtn.disabled = false;
  pauseBtn.textContent = 'Pause';
  alert(`Spiel vorbei! Punkte: ${score}`);
}

document.addEventListener('keydown', (e) => {
  if (!gameRunning) return;

  switch (e.key) {
    case 'ArrowUp':
      if (direction.y === 0) nextDirection = { x: 0, y: -1 };
      e.preventDefault();
      break;
    case 'ArrowDown':
      if (direction.y === 0) nextDirection = { x: 0, y: 1 };
      e.preventDefault();
      break;
    case 'ArrowLeft':
      if (direction.x === 0) nextDirection = { x: -1, y: 0 };
      e.preventDefault();
      break;
    case 'ArrowRight':
      if (direction.x === 0) nextDirection = { x: 1, y: 0 };
      e.preventDefault();
      break;
  }
});

startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', pauseGame);
resetBtn.addEventListener('click', resetGame);

drawGame();
