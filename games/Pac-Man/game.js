const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const tileSize = 20;
const rows = 31;
const cols = 28;

// Full classic maze array (0 = path/dot, 1 = wall)
const maze = [
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
  x: 13 * tileSize + tileSize/2,
  y: 23 * tileSize + tileSize/2,
  size: tileSize,
  dirX: 0,
  dirY: 0,
  speed: 3,
  score: 0,
  alive: false,
};

let dots = [];
let ghosts = [];

function generateDots() {
  dots = [];
  for(let r = 0; r < rows; r++) {
    for(let c = 0; c < cols; c++) {
      if(maze[r][c] === 0) {
        dots.push({x: c * tileSize + tileSize/2, y: r * tileSize + tileSize/2, eaten: false});
      }
    }
  }
}

function drawMaze() {
  for(let r=0; r<rows; r++) {
    for(let c=0; c<cols; c++) {
      if(maze[r][c] === 1) {
        ctx.fillStyle = 'blue';
        ctx.fillRect(c*tileSize, r*tileSize, tileSize, tileSize);
      } else {
        ctx.fillStyle = 'black';
        ctx.fillRect(c*tileSize, r*tileSize, tileSize, tileSize);
      }
    }
  }
}

function drawDots() {
  ctx.fillStyle = 'white';
  dots.forEach(dot => {
    if(!dot.eaten) {
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, 3, 0, 2*Math.PI);
      ctx.fill();
    }
  });
}

function drawPacman() {
  ctx.fillStyle = 'yellow';
  ctx.beginPath();
  ctx.arc(pacman.x, pacman.y, pacman.size/2, 0.25*Math.PI, 1.75*Math.PI);
  ctx.lineTo(pacman.x, pacman.y);
  ctx.fill();
}

function drawGhost(ghost) {
  ctx.fillStyle = ghost.color;
  ctx.beginPath();
  ctx.arc(ghost.x, ghost.y, tileSize/2, Math.PI, 0);
  ctx.lineTo(ghost.x + tileSize/2, ghost.y + tileSize/2);
  ctx.lineTo(ghost.x - tileSize/2, ghost.y + tileSize/2);
  ctx.closePath();
  ctx.fill();
}

function isWall(x, y) {
  let col = Math.floor(x / tileSize);
  let row = Math.floor(y / tileSize);
  if(row < 0 || row >= rows || col < 0 || col >= cols) return true;
  return maze[row][col] === 1;
}

function isDot(x, y) {
  return dots.find(dot => !dot.eaten && Math.abs(dot.x - x) < tileSize/2 && Math.abs(dot.y - y) < tileSize/2);
}

function updatePacman() {
  if(!pacman.alive) return;

  let nextX = pacman.x + pacman.dirX * pacman.speed;
  let nextY = pacman.y + pacman.dirY * pacman.speed;

  if(!isWall(nextX - pacman.size/2, pacman.y - pacman.size/2) &&
     !isWall(nextX + pacman.size/2, pacman.y - pacman.size/2) &&
     !isWall(nextX - pacman.size/2, pacman.y + pacman.size/2) &&
     !isWall(nextX + pacman.size/2, pacman.y + pacman.size/2)) {
    pacman.x = nextX;
  }

  if(!isWall(pacman.x - pacman.size/2, nextY - pacman.size/2) &&
     !isWall(pacman.x + pacman.size/2, nextY - pacman.size/2) &&
     !isWall(pacman.x - pacman.size/2, nextY + pacman.size/2) &&
     !isWall(pacman.x + pacman.size/2, nextY + pacman.size/2)) {
    pacman.y = nextY;
  }

  let dot = isDot(pacman.x, pacman.y);
  if(dot) {
    dot.eaten = true;
    pacman.score++;
    if(pacman.score === dots.length) {
      gameOver(true);
    }
  }
}

class Ghost {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.size = tileSize;
    this.color = color;
    this.dirX = 0;
    this.dirY = 0;
    this.speed = 2;
    this.chooseRandomDirection();
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size/2, Math.PI, 0);
    ctx.lineTo(this.x + this.size/2, this.y + this.size/2);
    ctx.lineTo(this.x - this.size/2, this.y + this.size/2);
    ctx.closePath();
    ctx.fill();
  }
  chooseRandomDirection() {
    const directions = [
      {x: 1, y: 0},
      {x: -1, y: 0},
      {x: 0, y: 1},
      {x: 0, y: -1}
    ];
    const choice = directions[Math.floor(Math.random() * directions.length)];
    this.dirX = choice.x;
    this.dirY = choice.y;
  }
  update() {
    let nextX = this.x + this.dirX * this.speed;
    let nextY = this.y + this.dirY * this.speed;
    if(!isWall(nextX - this.size/2, nextY - this.size/2) &&
       !isWall(nextX + this.size/2, nextY - this.size/2) &&
       !isWall(nextX - this.size/2, nextY + this.size/2) &&
       !isWall(nextX + this.size/2, nextY + this.size/2)) {
      this.x = nextX;
      this.y = nextY;
    } else {
      this.chooseRandomDirection();
    }
    // Check collision with Pac-Man
    if(Math.abs(this.x - pacman.x) < this.size/2 && Math.abs(this.y - pacman.y) < this.size/2) {
      gameOver(false);
    }
  }
}

function drawGhosts() {
  ghosts.forEach(g => g.draw());
}

function updateGhosts() {
  ghosts.forEach(g => g.update());
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function draw() {
  clearCanvas();
  drawMaze();
  drawDots();
  drawPacman();
  drawGhosts();
  drawScore();
}

function drawScore() {
  ctx.fillStyle = 'white';
  ctx.font = '20px monospace';
  ctx.fillText('Score: ' + pacman.score, 10, canvas.height - 10);
}

const popup = document.getElementById('popup');
const popupMessage = document.getElementById('popup-message');
const popupRestart = document.getElementById('popup-restart');

function gameOver(won) {
  pacman.alive = false;
  popup.classList.remove('hidden');
  popupMessage.textContent = won ? 'You won! 🎉' : 'Game over! 👻';
  cancelAnimationFrame(animationId);
}

popupRestart.addEventListener('click', () => {
  popup.classList.add('hidden');
  resetGame();
  animationId = requestAnimationFrame(gameLoop);
});

function resetGame() {
  pacman.x = 13 * tileSize + tileSize/2;
  pacman.y = 23 * tileSize + tileSize/2;
  pacman.dirX = 0;
  pacman.dirY = 0;
  pacman.score = 0;
  pacman.alive = true;
  generateDots();
  ghosts = [
    new Ghost(tileSize*13 + tileSize/2, tileSize*11 + tileSize/2, 'red'),
    new Ghost(tileSize*14 + tileSize/2, tileSize*11 + tileSize/2, 'pink'),
    new Ghost(tileSize*13 + tileSize/2, tileSize*12 + tileSize/2, 'cyan'),
    new Ghost(tileSize*14 + tileSize/2, tileSize*12 + tileSize/2, 'orange'),
  ];
  document.getElementById('startButton').style.display = 'block';
}

let animationId;

function gameLoop() {
  updatePacman();
  updateGhosts();
  draw();
  if(pacman.alive) {
    animationId = requestAnimationFrame(gameLoop);
  }
}

document.getElementById('startButton').addEventListener('click', () => {
  resetGame();
  animationId = requestAnimationFrame(gameLoop);
  document.getElementById('startButton').style.display = 'none';
});

// Initialize dots and draw initial screen
generateDots();
draw();
