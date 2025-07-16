const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const tileSize = 20;
const rows = 31;
const cols = 28;

// Maze grid: 0 = dot, 1 = wall, 2 = empty space (no dot)
const maze = [
  // 31 rows of 28 columns each (example maze)
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,0,1,1,1,1,1,0,1],
  [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,0,1,1,1,1,1,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,0,1],
  [1,0,0,0,0,1,0,0,0,1,0,0,0,1,1,0,0,0,0,1,0,1,0,0,0,0,0,1],
  [1,1,1,1,0,1,1,1,0,1,0,1,0,1,1,0,1,0,1,1,0,1,0,1,1,1,1,1],
  [0,0,0,1,0,0,0,0,0,1,0,1,0,0,0,0,1,0,1,0,0,1,0,0,0,1,0,0],
  [1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,0,1,1,1,1,1],
  [1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
  [1,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1],
  [1,0,0,0,0,0,0,1,0,0,0,0,1,1,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,0,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1],
  [0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,1,0,0,0,0,0,0],
  [1,1,1,1,0,1,1,1,0,1,0,1,1,1,1,1,1,0,1,1,0,1,0,1,1,1,1,1],
  [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
  [1,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1],
  [1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
  [1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

// Entities

let pacman = {
  x: 13 * tileSize,
  y: 23 * tileSize,
  radius: tileSize / 2,
  dirX: 0,
  dirY: 0,
  speed: 2,
  score: 0,
  alive: false,
};

let ghosts = [
  { x: 13 * tileSize, y: 11 * tileSize, color: 'pink', dirX: 0, dirY: 0, speed: 1.5 },
  { x: 14 * tileSize, y: 11 * tileSize, color: 'red', dirX: 0, dirY: 0, speed: 1.5 },
  { x: 12 * tileSize, y: 11 * tileSize, color: 'cyan', dirX: 0, dirY: 0, speed: 1.5 },
  { x: 15 * tileSize, y: 11 * tileSize, color: 'orange', dirX: 0, dirY: 0, speed: 1.5 },
];

let dots = [];

// Initialize dots based on maze
function initDots() {
  dots = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (maze[row][col] === 0) {
        dots.push({ x: col * tileSize + tileSize / 2, y: row * tileSize + tileSize / 2, eaten: false });
      }
    }
  }
}

// Drawing functions

function drawMaze() {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (maze[row][col] === 1) {
        ctx.fillStyle = 'blue';
        ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
      }
    }
  }
}

function drawPacman() {
  ctx.fillStyle = 'yellow';
  ctx.beginPath();
  ctx.arc(pacman.x + pacman.radius, pacman.y + pacman.radius, pacman.radius, 0.25 * Math.PI, 1.75 * Math.PI);
  ctx.lineTo(pacman.x + pacman.radius, pacman.y + pacman.radius);
  ctx.fill();
}

function drawGhost(ghost) {
  ctx.fillStyle = ghost.color;
  ctx.beginPath();
  ctx.arc(ghost.x + tileSize / 2, ghost.y + tileSize / 2, tileSize / 2, Math.PI, 0);
  ctx.lineTo(ghost.x + tileSize, ghost.y + tileSize);
  ctx.lineTo(ghost.x, ghost.y + tileSize);
  ctx.closePath();
  ctx.fill();
}

function drawDots() {
  ctx.fillStyle = 'white';
  dots.forEach(dot => {
    if (!dot.eaten) {
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, 3, 0, 2 * Math.PI);
      ctx.fill();
    }
  });
}

// Movement and collision helpers

function isWall(x, y) {
  let col = Math.floor(x / tileSize);
  let row = Math.floor(y / tileSize);
  if (row < 0 || row >= rows || col < 0 || col >= cols) return true;
  return maze[row][col] === 1;
}

function isDot(x, y) {
  return dots.find(dot => !dot.eaten && Math.abs(dot.x - x) < tileSize / 2 && Math.abs(dot.y - y) < tileSize / 2);
}

function updatePacman() {
  let nextX = pacman.x + pacman.dirX * pacman.speed;
  let nextY = pacman.y + pacman.dirY * pacman.speed;

  if (!isWall(nextX, pacman.y) && !isWall(nextX + tileSize - 1, pacman.y) &&
      !isWall(nextX, pacman.y + tileSize - 1) && !isWall(nextX + tileSize - 1, pacman.y + tileSize - 1)) {
    pacman.x = nextX;
  }

  if (!isWall(pacman.x, nextY) && !isWall(pacman.x + tileSize - 1, nextY) &&
      !isWall(pacman.x, nextY + tileSize - 1) && !isWall(pacman.x + tileSize - 1, nextY + tileSize - 1)) {
    pacman.y = nextY;
  }

  // Eat dots
  const dot = isDot(pacman.x + pacman.radius, pacman.y + pacman.radius);
  if (dot) {
    dot.eaten = true;
    pacman.score++;
    if (pacman.score === dots.length) {
      gameOver(true);
    }
  }
}

// Ghosts chasing Pac-Man (basic AI)
function updateGhosts() {
  ghosts.forEach(ghost => {
    let dx = pacman.x - ghost.x;
    let dy = pacman.y - ghost.y;
    let dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > 0) {
      ghost.dirX = dx / dist;
      ghost.dirY = dy / dist;
      let nextX = ghost.x + ghost.dirX * ghost.speed;
      let nextY = ghost.y + ghost.dirY * ghost.speed;

      if (!isWall(nextX, ghost.y) && !isWall(nextX + tileSize - 1, ghost.y) &&
          !isWall(nextX, ghost.y + tileSize - 1) && !isWall(nextX + tileSize - 1, ghost.y + tileSize - 1)) {
        ghost.x = nextX;
      }

      if (!isWall(ghost.x, nextY) && !isWall(ghost.x + tileSize - 1, nextY) &&
          !isWall(ghost.x, nextY + tileSize - 1) && !isWall(ghost.x + tileSize - 1, nextY + tileSize - 1)) {
        ghost.y = nextY;
      }
    }
  });
}

// Check collision between Pac-Man and ghosts
function checkGhostCollisions() {
  for (let ghost of ghosts) {
    let dx = pacman.x - ghost.x;
    let dy = pacman.y - ghost.y;
    let dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < tileSize / 1.5) {
      gameOver(false);
    }
  }
}

// Game over popup
const popup = document.getElementById('popup');
const popupMessage = document.getElementById('popup-message');
const popupRestart = document.getElementById('popup-restart');

function gameOver(won) {
  pacman.alive = false;
  popup.classList.remove('hidden');
  popupMessage.textContent = won ? 'You Win! 🎉' : 'You Got Caught! 😱';
}

popupRestart.addEventListener('click', () => {
  resetGame();
  popup.classList.add('hidden');
});

function resetGame() {
  pacman.x = 13 * tileSize;
  pacman.y = 23 * tileSize;
  pacman.dirX = 0;
  pacman.dirY = 0;
  pacman.score = 0;
  pacman.alive = true;
  initDots();
  ghosts = [
    { x: 13 * tileSize, y: 11 * tileSize, color: 'pink', dirX: 0, dirY: 0, speed: 1.5 },
    { x: 14 * tileSize, y: 11 * tileSize, color: 'red', dirX: 0, dirY: 0, speed: 1.5 },
    { x: 12 * tileSize, y: 11 * tileSize, color: 'cyan', dirX: 0, dirY: 0, speed: 1.5 },
    { x: 15 * tileSize, y: 11 * tileSize, color: 'orange', dirX: 0, dirY: 0, speed: 1.5 },
  ];
  startGame();
}

let gameLoopId;

function startGame() {
  pacman.alive = true;
  document.getElementById('startButton').style.display = 'none';
  gameLoop();
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawMaze();
  drawDots();
  drawPacman();
  ghosts.forEach(drawGhost);
  if (pacman.alive) {
    updatePacman();
    updateGhosts();
    checkGhostCollisions();
    gameLoopId = requestAnimationFrame(gameLoop);
  }
}

// Controls
window.addEventListener('keydown', e => {
  switch (e.key.toLowerCase()) {
    case 'w':
      pacman.dirX = 0;
      pacman.dirY = -1;
      break;
    case 'a':
      pacman.dirX = -1;
      pacman.dirY = 0;
      break;
    case 's':
      pacman.dirX = 0;
      pacman.dirY = 1;
      break;
    case 'd':
      pacman.dirX = 1;
      pacman.dirY = 0;
      break;
  }
});

document.getElementById('startButton').addEventListener('click', () => {
  startGame();
});
