const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player = {
  x: 50,
  y: 300,
  width: 20,
  height: 20,
  dx: 2
};

function drawPlayer() {
  ctx.fillStyle = "red";
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function update() {
  clearCanvas();
  drawPlayer();

  player.x += player.dx;
  if (player.x > canvas.width) player.x = -player.width;

  requestAnimationFrame(update);
}

update();
