const canvas = document.querySelector("#gameCanvas");
const context = canvas.getContext("2d");

function renderCanvas(state) {
  context.clearRect(0, 0, canvas.width, canvas.height);

  const snakeBody = state.snake.body;
  snakeBody.forEach(pixel => {
    context.fillStyle = "#666";
    context.fillRect(pixel.x, pixel.y, 1, 1);
  });

  const fruitPos = state.fruit;
  context.fillStyle = "#888";
  context.fillRect(fruitPos.x, fruitPos.y, 1, 1);
}

socket.on("state-changed", renderCanvas);
