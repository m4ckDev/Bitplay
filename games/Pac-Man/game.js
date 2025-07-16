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
  [1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
];

// Pacman state
let pacman = {
  x: 14 * tileSize,
  y: 23 * tileSize,
  dirX: 0,
  dirY: 0,
  speed: 2,
  radius: tileSize / 2
};

// Ghost class
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
    ctx.lineTo(this.x + tileSize * 1, this.y + tileSize);
    ctx.lineTo(this.x, this.y + tileSize);
    ctx.closePath();
    ctx.fill();
  }
  move() {
    // Simple AI: move randomly for now
    if (Math.random() < 0.02) {
      const directions = [
        {x: 1, y: 0},
        {x: -1, y: 0},
        {x: 0, y: 1},
        {x: 0, y: -1}
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

function initDots() {
  dots = [];
  for (let r = 0; r < maze.length; r++) {
    for (let c = 0; c < maze[r].length; c++) {
      if (maze[r][c] === 2) {
        dots.push({x: c * tileSize + tileSize / 2, y: r * tileSize + tileSize / 2, eaten: false});
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
  dots.forEach(dot => {
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

  if (!isWall(nextX, pacman.y) && !isWall(nextX + tileSize - 1, pacman.y) &&
      !isWall(nextX, pacman.y + tileSize - 1) && !isWall(nextX + tileSize - 1, pacman.y + tileSize - 1)) {
    pacman.x = nextX;
  }
  if (!isWall(pacman.x, nextY) && !isWall(pacman.x + tileSize - 1, nextY) &&
      !isWall(pacman.x, nextY + tileSize - 1) && !isWall(pacman.x + tileSize - 1, nextY + tileSize - 1)) {
    pacman.y = nextY;
  }

  // Eat dots
  dots.forEach(dot => {
    if (!dot.eaten) {
      let dx = dot.x - (pacman.x + pacman.radius);
      let dy = dot.y - (pacman.y + pacman.radius);
      let dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < pacman.radius) {
        dot.eaten = true;
      }
    }
  });

  // Update ghosts
  ghosts.forEach(ghost => {
    ghost.move();
  });

  // Check collisions with ghosts
  ghosts.forEach(ghost => {
    let dx = ghost.x - pacman.x;
    let dy = ghost.y - pacman.y;
    let dist = Math.sqrt(dx*dx + dy*dy);
    if (dist < tileSize - 4) {
      showPopup("👻 Boo! Pac-Man got spooked! Try again!");
      stopGame();
    }
  });

  // Win condition
  if (dots.every(dot => dot.eaten)) {
    showPopup("🎉 You ate
