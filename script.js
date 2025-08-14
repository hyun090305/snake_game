const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake, velocity, food, gameOver;

function reset() {
  snake = [{ x: 10, y: 10 }];
  velocity = { x: 0, y: 0 };
  food = randomFood();
  gameOver = false;
}

function randomFood() {
  return {
    x: Math.floor(Math.random() * tileCount),
    y: Math.floor(Math.random() * tileCount)
  };
}

function gameLoop() {
  if (gameOver) {
    draw();
    return;
  }
  update();
  draw();
}

function update() {
  const head = { x: snake[0].x + velocity.x, y: snake[0].y + velocity.y };

  if (velocity.x === 0 && velocity.y === 0) return;

  if (
    head.x < 0 ||
    head.x >= tileCount ||
    head.y < 0 ||
    head.y >= tileCount ||
    collision(head)
  ) {
    gameOver = true;
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    food = randomFood();
  } else {
    snake.pop();
  }
}

function collision(pos) {
  return snake.slice(0, -1).some((seg) => seg.x === pos.x && seg.y === pos.y);
}

function draw() {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'red';
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

  ctx.fillStyle = 'lime';
  snake.forEach((seg) =>
    ctx.fillRect(seg.x * gridSize, seg.y * gridSize, gridSize, gridSize)
  );

  if (gameOver) {
    ctx.fillStyle = 'white';
    ctx.font = '40px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);
    ctx.font = '20px sans-serif';
    ctx.fillText('Press Enter to restart', canvas.width / 2, canvas.height / 2 + 30);
  }
}

document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowUp':
      if (velocity.y === 1) break;
      velocity = { x: 0, y: -1 };
      break;
    case 'ArrowDown':
      if (velocity.y === -1) break;
      velocity = { x: 0, y: 1 };
      break;
    case 'ArrowLeft':
      if (velocity.x === 1) break;
      velocity = { x: -1, y: 0 };
      break;
    case 'ArrowRight':
      if (velocity.x === -1) break;
      velocity = { x: 1, y: 0 };
      break;
    case 'Enter':
      if (gameOver) reset();
      break;
  }
});

reset();
setInterval(gameLoop, 100);
