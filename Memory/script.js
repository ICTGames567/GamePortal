const gameBoard = document.getElementById('game-board');
const movesSpan = document.getElementById('moves');
const pairsSpan = document.getElementById('pairs');
const resetBtn = document.getElementById('reset-btn');

const icons = ['🎮', '🎯', '🎨', '🎭', '🎪', '🎸', '🎺', '🎻'];
let cards = [];
let flipped = [];
let matched = 0;
let moves = 0;
let canFlip = true;

function shuffle(array) {
  const shuffled = [...array, ...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function createCards() {
  gameBoard.innerHTML = '';
  const shuffledIcons = shuffle(icons);
  cards = shuffledIcons.map((icon, index) => ({
    id: index,
    icon: icon,
    flipped: false,
    matched: false
  }));

  cards.forEach((card, index) => {
    const cardElement = document.createElement('button');
    cardElement.className = 'card';
    cardElement.dataset.index = index;
    cardElement.textContent = '?';
    cardElement.addEventListener('click', () => flipCard(index, cardElement));
    gameBoard.appendChild(cardElement);
  });
}

function flipCard(index, element) {
  if (!canFlip) return;
  if (cards[index].flipped || cards[index].matched) return;
  if (flipped.length >= 2) return;

  cards[index].flipped = true;
  element.textContent = cards[index].icon;
  element.classList.add('flipped');
  flipped.push(index);

  if (flipped.length === 2) {
    canFlip = false;
    moves++;
    movesSpan.textContent = moves;
    checkMatch();
  }
}

function checkMatch() {
  const [first, second] = flipped;

  if (cards[first].icon === cards[second].icon) {
    cards[first].matched = true;
    cards[second].matched = true;

    document.querySelector(`[data-index="${first}"]`).classList.add('matched');
    document.querySelector(`[data-index="${second}"]`).classList.add('matched');

    matched++;
    pairsSpan.textContent = matched;

    flipped = [];
    canFlip = true;

    if (matched === icons.length) {
      setTimeout(() => {
        alert(`Gratuliere! 🎉\nDu hast das Spiel in ${moves} Zügen gelöst!`);
      }, 300);
    }
  } else {
    setTimeout(() => {
      cards[first].flipped = false;
      cards[second].flipped = false;

      document.querySelector(`[data-index="${first}"]`).textContent = '?';
      document.querySelector(`[data-index="${first}"]`).classList.remove('flipped');
      document.querySelector(`[data-index="${second}"]`).textContent = '?';
      document.querySelector(`[data-index="${second}"]`).classList.remove('flipped');

      flipped = [];
      canFlip = true;
    }, 600);
  }
}

function resetGame() {
  matched = 0;
  moves = 0;
  flipped = [];
  canFlip = true;
  movesSpan.textContent = moves;
  pairsSpan.textContent = matched;
  createCards();
}

resetBtn.addEventListener('click', resetGame);

// Initialize game
createCards();
