let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");
let box = 20;
let score = 0;

let snake = [];
snake[0] = { x: 10 * box, y: 10 * box };

let food = {
  x: Math.floor(Math.random() * (canvas.width / box)) * box,
  y: Math.floor(Math.random() * (canvas.height / box)) * box,
};

let direction = null;
let game;

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "green" : "white";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  let headX = snake[0].x;
  let headY = snake[0].y;

  if (direction === "left") headX -= box;
  if (direction === "up") headY -= box;
  if (direction === "right") headX += box;
  if (direction === "down") headY += box;

  if (
    headX < 0 || headY < 0 ||
    headX >= canvas.width || headY >= canvas.height ||
    collision(headX, headY, snake)
  ) {
    clearInterval(game);
    alert("Game Over");
    return;
  }

  if (headX === food.x && headY === food.y) {
    score++;
    food = {
      x: Math.floor(Math.random() * (canvas.width / box)) * box,
      y: Math.floor(Math.random() * (canvas.height / box)) * box,
    };
  } else {
    snake.pop();
  }

  const newHead = { x: headX, y: headY };
  snake.unshift(newHead);

  document.getElementById("score").innerText = "Score: " + score;
}

function collision(x, y, array) {
  for (let i = 0; i < array.length; i++) {
    if (x === array[i].x && y === array[i].y) return true;
  }
  return false;
}

function changeDirection(dir) {
  if (dir === "left" && direction !== "right") direction = "left";
  if (dir === "up" && direction !== "down") direction = "up";
  if (dir === "right" && direction !== "left") direction = "right";
  if (dir === "down" && direction !== "up") direction = "down";
}

function startGame() {
  score = 0;
  snake = [{ x: 10 * box, y: 10 * box }];
  direction = null;
  food = {
    x: Math.floor(Math.random() * (canvas.width / box)) * box,
    y: Math.floor(Math.random() * (canvas.height / box)) * box,
  };
  clearInterval(game);
  game = setInterval(draw, 120);
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") changeDirection("left");
  else if (e.key === "ArrowUp") changeDirection("up");
  else if (e.key === "ArrowRight") changeDirection("right");
  else if (e.key === "ArrowDown") changeDirection("down");
});
