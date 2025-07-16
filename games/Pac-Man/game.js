const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const popup = document.getElementById('popup');
const popupMessage = document.getElementById('popup-message');
const popupRestart = document.getElementById('popup-restart');

const tileSize = 20;
const rows = 31;
const cols = 28;

// Maze array: 0-empty, 1-wall, 2-dot
const maze = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,2,1,1,1,1,1,1,2,1,1,2,1,1,2,1,1,2,1,1,1,1,1,1,2,1,2,1],
  [1,2,1,1,1,1,1,1,2,1,1,2,1,1,2,1,1,2,1,1,1,1,1,1,2,1,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,2,1,1,1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1,1,1,1,2,1],
  [1,2,2,2,1,2,2,2,2,2,2,1,1,1,1,1,2,2,2,2,1,2,2,2,2,2,2,1],
  [1,1,1,2,1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1,1,1,1,1,1],
  [0,0,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,0,0,0,0],
  [1,1,1,2,1,2,1,1,1,1,1,1,0,0,0,1,1,1,1,1,2,1,1,1,1,1,1,1],
  [0,0,0,2,1,2,2,2,2,2,2,0,0,0,0,0,0,2,2,2,1,2,0,0,0,0,0,0],
  [1,1,1,2,1,2,1,1,1,1,2,0,0,0,0,0,0,2,1,1,1,2,1,1,1,1,1,1],
  [1,2,2,2,2,2,2,2,2,2,2,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,2,1],
  [1,2,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,2,1],
  [1,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,1],
  [1,1,1,1,1,1,1,1,2,1,1,1,1,0,1,1,1,1,1,2,1,1,1,1,1,1,1,1],
  [0,0,0,0,0,0,0,1,2,0,0,0,0,0,0,0,0,0,1,2,1,0,0,0,0,0,0,0],
  [1,1,1,1,1,1,1,1,2,1,1,1,0,0,0,1,1,1,1,2,1,1,1,1,1,1,1,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,2,1,1,1,1,1,1,1,1,1,2,0,0,0,2,1,1,1,1,1,1,1,1,1,1,2,1],
  [1,2,2,2,2,2,2,2,2,2,1,2,0,0,0,2,1,2,2,2,2,2,2,2,2,2,2,1],
  [1,1,1,1,1,1,1,1,1,2,1,2,0,0,0,2,1,2,1,1,1,1,1,1,1,1,1,1],
  [0,0,0,0,0,0,0,0,1,2,2,2,2,2,2,2,1,2,1,0,0,0,0,0,0,0,0,0],
  [1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

let pacman = {
  x: 14 * tileSize,
  y: 23 * tileSize,
  dirX: 0,
  dirY: 0,
  speed: 2,
  radius: tileSize / 2,
};

class Ghost {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.dirX = 0;
    this.dirY = 0;
    this.speed = 1.5;
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x + pacman.radius, this.y + pacman.radius, pacman.radius, Math.PI, 0);
    ctx.lineTo(this.x + tileSize, this.y + tileSize);
    ctx.lineTo(this.x, this.y + tileSize);
    ctx.closePath();
    ctx.fill();
  }
  move() {
    // Simple random movement AI
    if (Math.random() < 0.02) {
      const directions = [
        { x: 1, y: 0 },
        { x: -1, y: 0 },
        { x: 0, y: 1 },
        { x: 0, y: -1 },
      ];
      let dir = directions[Math.floor(Math.random() * directions.length)];
      if (!isWall(this.x + dir.x * tileSize, this.y + dir.y * tileSize)) {
        this.dirX = dir.x;
        this.dirY = dir.y;
      }
    }
    let nextX = this.x + this.dirX * this.speed;
    let nextY = this.y + this.dirY * this.speed;
    if (!isWall(nextX, nextY)) {
      this.x = nextX;
      this.y = nextY;
    } else {
      this.dirX = 0;
      this.dirY = 0;
    }
  }
}

let dots = [];
let ghosts = [];

function initDots() {
  dots = [];
  for (let r = 0; r < maze.length; r++) {
    for (let c = 0; c < maze[r].length; c++) {
      if (maze[r][c] === 2) {
        dots.push({ x: c * tileSize + tileSize / 2, y: r * tileSize + tileSize / 2, eaten: false });
      }
    }
  }
}

function drawMaze() {
  for (let r = 0; r < maze.length; r++) {
    for (let c = 0; c < maze[r].length; c++) {
      if (maze[r][c] === 1) {
        ctx.fillStyle = 'blue';
        ctx.fillRect(c * tileSize, r * tileSize, tileSize, tileSize);
      }
    }
  }
}

function drawDots() {
  ctx.fillStyle = 'white';
  dots.forEach((dot) => {
    if (!dot.eaten) {
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, 4, 0, 2 * Math.PI);
      ctx.fill();
    }
  });
}

function drawPacman() {
  ctx.fillStyle = 'yellow';
  ctx.beginPath();
  ctx.arc(pacman.x + pacman.radius, pacman.y + pacman.radius, pacman.radius, 0.25 * Math.PI, 1.75 * Math.PI);
  ctx.lineTo(pacman.x + pacman.radius, pacman.y + pacman.radius);
  ctx.fill();
}

function isWall(x, y) {
  let col = Math.floor(x / tileSize);
  let row = Math.floor(y / tileSize);
  if (maze[row] && maze[row][col] === 1) return true;
  return false;
}

function update() {
  // Move Pacman
  let nextX = pacman.x + pacman.dirX * pacman.speed;
  let nextY = pacman.y + pacman.dirY * pacman.speed;

  if (
    !isWall(nextX, pacman.y) &&
    !isWall(nextX + tileSize - 1, pacman.y) &&
    !isWall(nextX, pacman.y + tileSize - 1) &&
    !isWall(nextX + tileSize - 1, pacman.y + tileSize - 1)
  ) {
    pacman.x = nextX;
  }
  if (
    !isWall(pacman.x, nextY) &&
    !isWall(pacman.x + tileSize - 1, nextY) &&
    !isWall(pacman.x, nextY + tileSize - 1) &&
    !isWall(pacman.x + tileSize - 1, nextY + tileSize - 1)
  ) {
    pacman.y = nextY;
  }

  // Eat dots
  dots.forEach((dot) => {
    if (!dot.eaten) {
      let dx = dot.x - (pacman.x + pacman.radius);
      let dy = dot.y - (pacman.y + pacman.radius);
      let dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < pacman.radius) {
        dot.eaten = true;
      }
    }
  });

  // Update ghosts
  ghosts.forEach((ghost) => {
    ghost.move();
  });

  // Check collisions with ghosts
  ghosts.forEach((ghost) => {
    let dx = ghost.x - pacman.x;
    let dy = ghost.y - pacman.y;
    let dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < tileSize - 4) {
      showPopup('👻 Boo! Pac-Man got spooked! Try again!');
      stopGame();
    }
  });

  // Win condition
  if (dots.every((dot) => dot.eaten)) {
    showPopup('🎉 You ate all the dots! Pac-Man’s on a snack spree! 🍕😄');
    stopGame();
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawMaze();
  drawDots();
  drawPacman();
  ghosts.forEach((ghost) => ghost.draw());
}

let gameInterval = null;
function gameLoop() {
  update();
  draw();
}

function startGame() {
  pacman.x = 14 * tileSize;
  pacman.y = 23 * tileSize;
  pacman.dirX = 0;
  pacman.dirY = 0;
  initDots();

  ghosts = [
    new Ghost(13 * tileSize, 11 * tileSize, 'red'),
    new Ghost(14 * tileSize, 11 * tileSize, 'pink'),
    new Ghost(15 * tileSize, 11 * tileSize, 'cyan'),
    new Ghost(16 * tileSize, 11 * tileSize, 'orange'),
  ];

  popup.classList.add('hidden');

  if (gameInterval) clearInterval(gameInterval);
  gameInterval = setInterval(gameLoop, 1000 / 60);
}

function stopGame() {
  if (gameInterval) clearInterval(gameInterval);
  popup.classList.remove('hidden');
}

function showPopup(message) {
  popupMessage.textContent = message;
  popup.classList.remove('hidden');
}

popupRestart.addEventListener('click', () => {
  startGame();
});

window.addEventListener('keydown', (e) => {
  // WASD controls
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

startGame();
