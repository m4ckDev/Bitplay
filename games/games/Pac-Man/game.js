const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let pacman = {
  x: 50,
  y: 50,
  size: 20,
  dx: 2,
  dy: 0
};

function drawPacman() {
  ctx.beginPath();
  ctx.arc(pacman.x, pacman.y, pacman.size, 0.2 * Math.PI, 1.8 * Math.PI);
  ctx.lineTo(pacman.x, pacman.y);
  ctx.fillStyle = 'yellow';
  ctx.fill();
  ctx.closePath();
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function update() {
  clearCanvas();
  drawPacman();

  pacman.x += pacman.dx;
  pacman.y += pacman.dy;

  requestAnimationFrame(update);
}

update();