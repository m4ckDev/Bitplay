const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let mario = {
  x: 50,
  y: 550,
  width: 40,
  height: 40,
  dy: 0,
  gravity: 1,
  jumpPower: -15,
  onGround: true
};

function drawMario() {
  ctx.fillStyle = 'red';
  ctx.fillRect(mario.x, mario.y, mario.width, mario.height);
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function update() {
  clearCanvas();
  drawMario();

  if (!mario.onGround) {
    mario.dy += mario.gravity;
    mario.y += mario.dy;

    if (mario.y >= 550) {
      mario.y = 550;
      mario.dy = 0;
      mario.onGround = true;
    }
  }

  requestAnimationFrame(update);
}

function jump() {
  if (mario.onGround) {
    mario.dy = mario.jumpPower;
    mario.onGround = false;
  }
}

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') jump();
});

update();