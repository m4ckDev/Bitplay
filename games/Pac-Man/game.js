const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const tileSize = 20;

const maze = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,0,1,1,1,1,1,0,1],
  [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,0,1,1,1,1,1,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

const rows = maze.length;
const cols = maze[0].length;

canvas.width = cols * tileSize;
canvas.height = rows * tileSize;

let score = 0;
let gameRunning = false;

let frameCount = 0;
const moveInterval = 30;

const player = {
  x: 1,
  y: 1,
  dirX: 0,
  dirY: 0,
  color: 'yellow'
};

const ghosts = [
  { x: 26, y: 1, color: 'red', name: 'Blinky' },
  { x: 26, y: 3, color: 'pink', name: 'Pinky' },
  { x: 1,  y: 3, color: 'cyan', name: 'Inky' },
  { x: 13, y: 1, color: 'orange', name: 'Clyde' }
];

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

function drawGhosts() {
  ghosts.forEach(ghost => {
    ctx.beginPath();
    ctx.arc(ghost.x * tileSize + tileSize / 2, ghost.y * tileSize + tileSize / 2, tileSize / 2 - 2, 0, Math.PI * 2);
    ctx.fillStyle = ghost.color;
    ctx.fill();
  });
}

function drawScore() {
  const scoreEl = document.getElementById("scoreText");
  if (scoreEl) scoreEl.textContent = `Score: ${score}`;
}

function update() {
  frameCount++;
  if (frameCount % moveInterval !== 0) return;

  const nextX = player.x + player.dirX;
  const nextY = player.y + player.dirY;
  if (maze[nextY][nextX] !== 1) {
    player.x = nextX;
    player.y = nextY;
    if (maze[player.y][player.x] === 0) {
      maze[player.y][player.x] = 2;
      score += 10;
    }
  }

  // Random movement for ghosts
  ghosts.forEach(ghost => {
    const dirs = [
      { x: 0, y: -1 },
      { x: 0, y: 1 },
      { x: -1, y: 0 },
      { x: 1, y: 0 }
    ];
    const valid = dirs.filter(d => maze[ghost.y + d.y] && maze[ghost.y + d.y][ghost.x + d.x] !== 1);
    if (valid.length > 0) {
      const rand = Math.floor(Math.random() * valid.length);
      ghost.x += valid[rand].x;
      ghost.y += valid[rand].y;
    }

    // Collision check
    if (ghost.x === player.x && ghost.y === player.y) {
      gameRunning = false;
      document.getElementById("popup").classList.remove("hidden");
      document.getElementById("popup-message").textContent = `Caught by ${ghost.name}!`;
    }
  });
}

function draw() {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawMaze();
  drawPlayer();
  drawGhosts();
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
  ghosts[0].x = 26; ghosts[0].y = 1;
  ghosts[1].x = 26; ghosts[1].y = 3;
  ghosts[2].x = 1;  ghosts[2].y = 3;
  ghosts[3].x = 13; ghosts[3].y = 1;
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

draw();
