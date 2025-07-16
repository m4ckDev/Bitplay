const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const tileSize = 20;

let level = 1;
let moveInterval = 1;
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

const rows = maze.length;
const cols = maze[0].length;

const player = { x: 1, y: 1, dirX: 0, dirY: 0, color: 'yellow' };
const ghosts = [
  { x: 13, y: 2, color: 'red', dirX: 0, dirY: 0, penTime: 0 },
  { x: 14, y: 2, color: 'pink', dirX: 0, dirY: 0, penTime: 60 },
  { x: 13, y: 3, color: 'cyan', dirX: 0, dirY: 0, penTime: 120 },
  { x: 14, y: 3, color: 'orange', dirX: 0, dirY: 0, penTime: 180 }
];

function isWalkable(x, y) {
  return maze[y] && maze[y][x] !== 1;
}

function drawMaze() {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (maze[y][x] === 1) {
        ctx.fillStyle = 'blue';
        ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
      } else if (maze[y][x] === 0) {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(x * tileSize + 10, y * tileSize + 10, pelletRadius, 0, Math.PI * 2);
        ctx.fill();
      } else if (maze[y][x] === 3) {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(x * tileSize + 10, y * tileSize + 10, powerPelletRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}

function drawPlayer() {
  ctx.beginPath();
  ctx.arc(player.x * tileSize + 10, player.y * tileSize + 10, tileSize / 2 - 2, 0, Math.PI * 2);
  ctx.fillStyle = player.color;
  ctx.fill();
}

function drawGhosts() {
  ghosts.forEach(g => {
    if (g.penTime > 0) return;
    ctx.beginPath();
    ctx.arc(g.x * tileSize + 10, g.y * tileSize + 10, tileSize / 2 - 2, 0, Math.PI * 2);
    ctx.fillStyle = frightened ? 'blue' : g.color;
    ctx.fill();
  });
}

function drawScore() {
  const el = document.getElementById('scoreText');
  if (el) el.textContent = `Score: ${score} | Level: ${level}`;
}

function movePlayer() {
  const nx = player.x + player.dirX;
  const ny = player.y + player.dirY;
  if (isWalkable(nx, ny)) {
    player.x = nx; player.y = ny;
    if (maze[ny][nx] === 0) {
      maze[ny][nx] = 2;
      score += 10;
    } else if (maze[ny][nx] === 3) {
      maze[ny][nx] = 2;
      score += 50;
      frightened = true;
      frightenedTimer = 400;
    }
  }
}

function moveGhosts() {
  ghosts.forEach(g => {
    if (g.penTime > 0) {
      g.penTime--;
      return;
    }

    const options = [
      { dx: 1, dy: 0 }, { dx: -1, dy: 0 },
      { dx: 0, dy: 1 }, { dx: 0, dy: -1 }
    ];
    let best = options[0];
    let bestDist = Infinity;

    options.forEach(d => {
      const tx = g.x + d.dx;
      const ty = g.y + d.dy;
      if (isWalkable(tx, ty)) {
        const dist = Math.hypot(player.x - tx, player.y - ty);
        const value = frightened ? -dist : dist;
        if (value < bestDist) {
          bestDist = value;
          best = d;
        }
      }
    });

    g.x += best.dx;
    g.y += best.dy;

    if (g.x === player.x && g.y === player.y) {
      if (frightened) {
        g.x = 13; g.y = 2;
        g.penTime = 60;
        score += 200;
      } else {
        gameRunning = false;
        alert("Game Over!");
      }
    }
  });
}

function checkLevelClear() {
  const remaining = maze.flat().filter(v => v === 0 || v === 3).length;
  if (remaining === 0) {
    level++;
    resetMaze();
  }
}

function resetMaze() {
  frightened = false;
  frightenedTimer = 0;
  maze.forEach((row, y) => {
    maze[y] = row.map(cell => cell === 2 ? 0 : cell);
  });
  player.x = 1; player.y = 1;
  ghosts.forEach((g, i) => {
    g.x = 13 + (i % 2); g.y = 2 + Math.floor(i / 2);
    g.penTime = i * 60;
  });
}

function update() {
  frameCount++;
  if (frightenedTimer > 0) frightenedTimer--;
  else frightened = false;

  movePlayer();
  if (frameCount % 4 === 0) moveGhosts();
  checkLevelClear();
  draw();
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
  requestAnimationFrame(gameLoop);
}

function startGame() {
  gameRunning = true;
  score = 0;
  level = 1;
  resetMaze();
  gameLoop();
}

document.getElementById('startButton').addEventListener('click', startGame);
document.addEventListener('keydown', e => {
  switch (e.key.toLowerCase()) {
    case 'w': player.dirX = 0; player.dirY = -1; break;
    case 's': player.dirX = 0; player.dirY = 1; break;
    case 'a': player.dirX = -1; player.dirY = 0; break;
    case 'd': player.dirX = 1; player.dirY = 0; break;
  }
});
