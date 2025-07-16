const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const tileSize = 20;

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

let frameCount = 0;
const moveInterval = 18; // slow down movement to match classic

const player = {
  x: 1,
  y: 1,
  dirX: 0,
  dirY: 0,
  color: 'yellow'
};

const ghost = {
  x: 26,
  y: 17,
  color: 'red'
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

function drawGhost() {
  ctx.beginPath();
  ctx.arc(ghost.x * tileSize + tileSize / 2, ghost.y * tileSize + tileSize / 2, tileSize / 2 - 2, 0, Math.PI * 2);
  ctx.fillStyle = ghost.color;
  ctx.fill();
}

function drawScore() {
  const scoreEl = document.getElementById("scoreText");
  if (scoreEl) scoreEl.textContent = `Score: ${score}`;
}

function update() {
  frameCount++;

  if (frameCount % moveInterval !== 0) return;

  // Pac-Man movement
  const nextX = player.x + player.dirX;
  const nextY = player.y + player.dirY;

  if (maze[nextY][nextX] !== 1) {
    player.x = nextX;
    player.y = nextY;

    if (maze[player.y][player.x] === 0) {
      maze[player.y][player.x] = 2; // dot eaten
      score += 10;
    }
  }

  // Ghost movement (random)
  const directions = [
    { x: 0, y: -1 }, { x: 0, y: 1 },
    { x: -1, y: 0 }, { x: 1, y: 0 }
  ];

  const validDirs = directions.filter(dir => {
    const newX = ghost.x + dir.x;
    const newY = ghost.y + dir.y;
    return maze[newY][newX] !== 1;
  });

  if (validDirs.length > 0) {
    const rand = Math.floor(Math.random() * validDirs.length);
    ghost.x += validDirs[rand].x;
    ghost.y += validDirs[rand].y;
  }

  // Game Over check
  if (ghost.x === player.x && ghost.y === player.y) {
    gameRunning = false;
    document.getElementById("popup").classList.remove("hidden");
    document.getElementById("popup-message").textContent = "Game Over!";
  }
}

function draw() {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawMaze();
  drawPlayer();
  drawGhost();
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
  score = 0;
  frameCount = 0;
  player.x = 1;
  player.y = 1;
  player.dirX = 0;
  player.dirY = 0;
  ghost.x = 26;
  ghost.y = 17;
  document.getElementById("popup").classList.add("hidden");
  gameLoop();
}

document.getElementById("startButton").addEventListener("click", startGame);
document.getElementById("popup-restart").addEventListener("click", startGame);

document.addEventListener("keydown", (e) => {
  switch (e.key.toLowerCase()) {
    case 'w': player.dirX = 0; player.dirY = -1; break;
    case 's': player.dirX = 0; player.dirY = 1; break;
    case 'a': player.dirX = -1; player.dirY = 0; break;
    case 'd': player.dirX = 1; player.dirY = 0; break;
  }
});

// Draw the initial maze before game starts
draw();
