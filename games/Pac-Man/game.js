const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const tileSize = 20;

let level = 1;
let moveInterval = 30;
let frameCount = 0;
let score = 0;
let gameRunning = false;

const baseMaze = [
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
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

let maze = JSON.parse(JSON.stringify(baseMaze));
const rows = maze.length;
const cols = maze[0].length;
canvas.width = cols * tileSize;
canvas.height = rows * tileSize;

const player = {
  x: 1, y: 1,
  dirX: 0, dirY: 0,
  color: 'yellow'
};

const ghosts = [
  { x: 26, y: 1, color: 'red', name: 'Blinky', ai: 'chase' },
  { x: 26, y: 3, color: 'pink', name: 'Pinky', ai: 'ambush' },
  { x: 1,  y: 3, color: 'cyan', name: 'Inky', ai: 'predict' },
  { x: 13, y: 1, color: 'orange', name: 'Clyde', ai: 'scatter' }
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
  ghosts.forEach(g => {
    ctx.beginPath();
    ctx.arc(g.x * tileSize + tileSize / 2, g.y * tileSize + tileSize / 2, tileSize / 2 - 2, 0, Math.PI * 2);
    ctx.fillStyle = g.color;
    ctx.fill();
  });
}

function drawScore() {
  const scoreEl = document.getElementById("scoreText");
  if (scoreEl) scoreEl.textContent = `Score: ${score} | Level: ${level}`;
}

function updateGhost(g) {
  let targetX = player.x;
  let targetY = player.y;

  switch (g.ai) {
    case 'ambush':
      targetX += player.dirX * 4;
      targetY += player.dirY * 4;
      break;
    case 'predict':
      const blinky = ghosts[0];
      targetX = (player.x + blinky.x) >> 1;
      targetY = (player.y + blinky.y) >> 1;
      break;
    case 'scatter':
      const dx = player.x - g.x;
      const dy = player.y - g.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 5) { targetX = 0; targetY = rows - 1; }
      break;
  }

  const dirs = [
    { x: 0, y: -1 }, { x: 0, y: 1 },
    { x: -1, y: 0 }, { x: 1, y: 0 }
  ];
  let best = { x: 0, y: 0 }, minDist = Infinity;

  dirs.forEach(d => {
    const nx = g.x + d.x;
    const ny = g.y + d.y;
    if (maze[ny] && maze[ny][nx] !== 1) {
      const dist = Math.hypot(targetX - nx, targetY - ny);
      if (dist < minDist) {
        best = d;
        minDist = dist;
      }
    }
  });

  g.x += best.x;
  g.y += best.y;

  if (g.x === player.x && g.y === player.y) {
    gameRunning = false;
    document.getElementById("popup").classList.remove("hidden");
    document.getElementById("popup-message").textContent = `Caught by ${g.name}!`;
  }
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

  ghosts.forEach(updateGhost);

  // Check for level completion
  const remainingDots = maze.flat().filter(cell => cell === 0).length;
  if (remainingDots === 0) {
    level++;
    moveInterval = Math.max(8, moveInterval - 2);
    maze = JSON.parse(JSON.stringify(baseMaze));
    player.x = 1;
    player.y = 1;
    ghosts.forEach((g, i) => {
      g.x = [26, 26, 1, 13][i];
      g.y = [1, 3, 3, 1][i];
    });
    document.getElementById("popup").classList.remove("hidden");
    document.getElementById("popup-message").textContent = `Level ${level - 1} complete!`;
  }
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
  frameCount = 0;
  maze = JSON.parse(JSON.stringify(baseMaze));
  player.x = 1;
  player.y = 1;
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
