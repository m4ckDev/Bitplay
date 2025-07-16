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

let score = 0;
let level = 1;
let gameRunning = false;
let frightened = false;
let frightenedTimer = 0;

const player = {
  x: 1,
  y: 1,
  dirX: 0,
  dirY: 0,
  color: 'yellow'
};

const ghosts = [
  { x: 13, y: 2, color: 'red', dirX: 0, dirY: 0 },
  { x: 14, y: 2, color: 'pink', dirX: 0, dirY: 0 },
  { x: 13, y: 3, color: 'cyan', dirX: 0, dirY: 0 },
  { x: 14, y: 3, color: 'orange', dirX: 0, dirY: 0 }
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
        ctx.arc(x * tileSize + tileSize / 2, y * tileSize + tileSize / 2, pelletRadius, 0, 2 * Math.PI);
        ctx.fill();
      } else if (maze[y][x] === 3) {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(x * tileSize + tileSize / 2, y * tileSize + tileSize / 2, powerPelletRadius, 0, 2 * Math.PI);
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
    ctx.fillStyle = frightened ? 'blue' : g.color;
    ctx.fill();
  });
}

function drawScore() {
  const scoreEl = document.getElementById("scoreText");
  if (scoreEl) scoreEl.textContent = `Score: ${score} | Level: ${level}`;
}

function isWalkable(x, y) {
  return maze[y] && maze[y][x] !== 1;
}

function movePlayer() {
  const nextX = player.x + player.dirX;
  const nextY = player.y + player.dirY;
  if (isWalkable(nextX, nextY)) {
    player.x = nextX;
    player.y = nextY;
    if (maze[player.y][player.x] === 0) {
      maze[player.y][player.x] = 2;
      score += 10;
    } else if (maze[player.y][player.x] === 3) {
      maze[player.y][player.x] = 2;
      score += 50;
      frightened = true;
      frightenedTimer = 500;
    }
  }
}

function moveGhosts() {
  ghosts.forEach(g => {
    if (Math.random() < 0.3) {
      const dirs = [
        { dx: 0, dy: -1 },
        { dx: 0, dy: 1 },
        { dx: -1, dy: 0 },
        { dx: 1, dy: 0 }
      ];
      let best = dirs[0];
      let bestDist = Infinity;
      dirs.forEach(d => {
        const newX = g.x + d.dx;
        const newY = g.y + d.dy;
        if (isWalkable(newX, newY)) {
          const dist = Math.hypot(player.x - newX, player.y - newY);
          const chase = frightened ? -dist : dist;
          if (chase < bestDist) {
            bestDist = chase;
            best = d;
          }
        }
      });
      g.dirX = best.dx;
      g.dirY = best.dy;
    }
    const newX = g.x + g.dirX;
    const newY = g.y + g.dirY;
    if (isWalkable(newX, newY)) {
      g.x = newX;
      g.y = newY;
    }

    // Collision with player
    if (g.x === player.x && g.y === player.y) {
      if (frightened) {
        g.x = 13;
        g.y = 2;
        score += 200;
      } else {
        gameRunning = false;
        alert("Game Over! Score: " + score);
      }
    }
  });
}

function levelUpIfCleared() {
  const dotsRemaining = maze.flat().filter(cell => cell === 0 || cell === 3).length;
  if (dotsRemaining === 0) {
    level++;
    frightened = false;
    resetMaze();
  }
}

function resetMaze() {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (maze[y][x] === 2) maze[y][x] = (x === 1 && y === 1) ? 2 : 0;
    }
  }
  maze[1][1] = 2;
  maze[1][26] = 3;
  maze[1][1] = 3;
  player.x = 1;
  player.y = 1;
}

function draw() {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawMaze();
  drawPlayer();
  drawGhosts();
  drawScore();
}

function update() {
  if (frightenedTimer > 0) frightenedTimer--;
  else frightened = false;

  movePlayer();
  moveGhosts();
  levelUpIfCleared();
}

function gameLoop() {
  if (!gameRunning) return;
  update();
  draw();
  setTimeout(() => requestAnimationFrame(gameLoop), 120); // slower speed
}

function startGame() {
  gameRunning = true;
  resetMaze();
  score = 0;
  level = 1;
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
