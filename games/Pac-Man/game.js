const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const tileSize = 20;

// Maze layout (0 = dot/path, 1 = wall)
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

const rows = maze.length;
const cols = maze[0].length;
canvas.width = cols * tileSize;
canvas.height = rows * tileSize;

let score = 0;
let gameRunning = false;

const player = {
  x: 1,
  y: 1,
  dirX: 0,
  dirY: 0,
  color: 'yellow'
};

function drawMaze() {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (maze[y][x] === 1) {
        ctx.fillStyle = 'blue';
        ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
      } else if (maze[y][x] === 0) {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(x * tileSize + tileSize / 2, y * tileSize + tileSize / 2, 3, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  }
}

function drawPlayer() {
  ctx.beginPath();
  ctx.arc(player.x * tileSize + tileSize / 2, player.y * tileSize + tileSize / 2, tileSize / 2 - 2, 0, Math.PI * 2);
  ctx.fillStyle = player.color;
  ctx.fill();
}

function drawScore() {
const scoreEl = document.getElementById("scoreText");
  if (scoreEl) scoreEl.textContent = `Score: ${score}`;
}

function update() {
  const nextX = player.x + player.dirX;
  const nextY = player.y + player.dirY;

  if (maze[nextY][nextX] !== 1) {
    player.x = nextX;
    player.y = nextY;

    if (maze[player.y][player.x] === 0) {
      maze[player.y][player.x] = 2; // Collected
      score += 10;
    }
  }
}

function draw() {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawMaze();
  drawPlayer();
  drawScore();
}

function gameLoop() {
  if (!gameRunning) return;
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

function startGame() {
  gameRunning = true;
  player.x = 1;
  player.y = 1;
  score = 0;
  gameLoop();
}

document.getElementById("startButton").addEventListener("click", startGame);

document.addEventListener("keydown", (e) => {
  switch (e.key.toLowerCase()) {
    case 'w': player.dirX = 0; player.dirY = -1; break;
    case 's': player.dirX = 0; player.dirY = 1; break;
    case 'a': player.dirX = -1; player.dirY = 0; break;
    case 'd': player.dirX = 1; player.dirY = 0; break;
  }
});
