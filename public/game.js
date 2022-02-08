const heading = document.querySelector('#heading');
const canvas = document.querySelector('#canvas');
const context = canvas.getContext('2d');

const width = canvas.width;
const height = canvas.height;

const snakeColors = ['#aaa','#999','#888','#777','#666','#555','#444','#333','#222','#111'];

let game;

function createGame() {
  
  const initialSnake = {
    dir: 'right',
    body: [
      {x: 1, y: 1},
      {x: 2, y: 1},
      {x: 3, y: 1}
    ]
  };

  const state = {
    isRunning: false,
    isOver: false,
    commands: [],
    fruitsEaten: 0,
    snake: {
      dir: initialSnake.dir,
      body: initialSnake.body
    },
    fruitPos: createFruit(initialSnake.body)
  };

  function giveCommand(command) {
    const possibleCommands = {
      ArrowUp: () => {
        tryAddCommand('up');
      },
      ArrowDown: () => {
        tryAddCommand('down');
      },
      ArrowRight: () => {
        tryAddCommand('right');
      },
      ArrowLeft: () => {
        tryAddCommand('left');
      }
    };

    const addCommandFunction = possibleCommands[command];
    if (addCommandFunction) {
      addCommandFunction();
    }
  }

  function tryAddCommand(command) {
    if (state.commands.length > 1) return;
    if (state.commands.length === 0 && (state.snake.dir === command || state.snake.dir === invertDirection(command))) return;
    if (state.commands[state.commands.length - 1] === command || state.commands[state.commands.length - 1] === invertDirection(command)) return;
  
    state.commands.push(command);
  }

  function invertDirection(direction) {
    switch (direction) {
      case 'up': return 'down';
      case 'down': return 'up';
      case 'right': return 'left';
      case 'left': return 'right';
    }
  }

  function moveSnake() {
    if (state.commands.length > 0) {
      state.snake.dir = state.commands.shift();
    }

    const snakeBody = state.snake.body;
    const snakeHeadPos = snakeBody[snakeBody.length - 1];
    const nextSnakeHeadPos = getNextSnakeHeadPos(snakeHeadPos);
    
    if (checkLoseCollision(nextSnakeHeadPos)) {
      state.isOver = true;
      return;
    }

    state.snake.body.push(nextSnakeHeadPos); 

    if (checkFruitCollision(nextSnakeHeadPos)) {
      console.log('Fruit eaten!');
      state.fruitsEaten++;
      state.fruitPos = createFruit(state.snake.body);
    } else {
      state.snake.body.shift();
    }
  }

  function getNextSnakeHeadPos(previousHeadPos) {
    switch (state.snake.dir) {
      case 'up': return {
        x: previousHeadPos.x,
        y: previousHeadPos.y - 1
      };
      case 'down': return {
        x: previousHeadPos.x,
        y: previousHeadPos.y + 1
      };
      case 'right': return {
        x: previousHeadPos.x + 1,
        y: previousHeadPos.y
      };
      case 'left': return {
        x: previousHeadPos.x - 1,
        y: previousHeadPos.y
      };
    };
  }

  function checkFruitCollision(newHeadPos) {
    return newHeadPos.x === state.fruitPos.x && newHeadPos.y === state.fruitPos.y
  }

  function checkLoseCollision(newHeadPos) {
    if (newHeadPos.x < 0 || newHeadPos.x >= width) return true;
    if (newHeadPos.y < 0 || newHeadPos.y >= height) return true;
    
    const snakeBody = state.snake.body;
    let collidedWithSelf = false;
    for (let i = 1; i < snakeBody.length; i++) {
      pixel = snakeBody[i];

      if (newHeadPos.x === pixel.x && newHeadPos.y === pixel.y) {
        collidedWithSelf = true;
      };
    }

    if (collidedWithSelf) return true;

    return false;
  }

  function createFruit(invalidSpaces) {
    let x, y, isInvalidPos;

    do {
      isInvalidPos = false;

      x = Math.floor(Math.random() * width);
      y = Math.floor(Math.random() * height);

      invalidSpaces.forEach(space => {
        if (x === space.x && y === space.y) {
          isInvalidPos = true;
        }
      });
    } while (isInvalidPos);
    
    return {x, y};
  }

  function start() {
    document.addEventListener('keydown', handleKeyDown);

    state.isRunning = true
    const gameInterval = setInterval(() => {
      console.log(state.commands);
      
      moveSnake();


      if (state.isOver) {
        state.isRunning = false;
        clearInterval(gameInterval);
        console.log('Game Over');

        document.addEventListener('keydown', function(event) {
          if (event.key === 'Enter') {
            this.removeEventListener('keydown', arguments.callee);
            resetPage();
          }
        });
      }
    }, 100);
  }

  function addStartListener() {
    document.addEventListener('keydown', function() {
      this.removeEventListener('keydown', arguments.callee);
      start();
    });
  }

  return {
    state,
    giveCommand,
    tryAddCommand,
    invertDirection,
    moveSnake,
    getNextSnakeHeadPos,
    checkFruitCollision,
    checkLoseCollision,
    createFruit,
    start,
    addStartListener
  };
}

function handleKeyDown(event) {
    const keyPressed = event.key;
    game.giveCommand(keyPressed);
}

function renderScreen() {
  renderHeading();
  renderCanvas();
  requestAnimationFrame(renderScreen);
}

function renderHeading() {
  if (game.state.isOver) {
    heading.textContent = 'Game Over! Press Enter to reset!';
  } else if (game.state.isRunning) {
    heading.textContent = `Fruits eaten: ${game.state.fruitsEaten}`;
  } else {
    heading.textContent = 'Press any key to start!';
  }
}

function renderCanvas() {
  context.clearRect(0, 0, width, height);

  const snakeBody = game.state.snake.body;
  
  for (let i = 0; i < snakeBody.length; i++) {
    pixel = snakeBody[i];

    pixelColor = snakeColors[Math.round((i * (snakeColors.length - 1)) / (snakeBody.length - 1))];
    context.fillStyle = pixelColor;
    context.fillRect(pixel.x, pixel.y, 1, 1);
  }

  const fruitPos = game.state.fruitPos;
  context.fillStyle = '#888';
  context.fillRect(fruitPos.x, fruitPos.y, 1, 1);
}

function resetPage() {
  game = createGame();
  game.addStartListener();
}

resetPage();
renderScreen();