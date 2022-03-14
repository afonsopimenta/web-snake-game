export default function createGame(socket) {
  const settings = {
    size: {x: 20, y: 10},
    interval: 100,
    maxCommands: 2
  };

  const state = {
    commands: [],
    snake: {
      body: [
        {x: 1, y: 1}
      ]
    },
    fruit: {x: 3, y: 3}
  };

  function giveCommand(command) {
    const validCommands = {
      ArrowUp: () => tryAddCommand("up"),
      ArrowDown: () => tryAddCommand("down"),
      ArrowLeft: () => tryAddCommand("left"),
      ArrowRight: () => tryAddCommand("right"),

      w: () => tryAddCommand("up"),
      s: () => tryAddCommand("down"),
      a: () => tryAddCommand("left"),
      d: () => tryAddCommand("right")
    };

    const commandFunction = validCommands[command]
    if (commandFunction) {
      commandFunction();
    }
  }

  function tryAddCommand(command) {
    const commandList = state.commands;
    if (commandList.length >= settings.maxCommands) return;
    
    state.commands.push(command);
  }

  function start() {
    const gameInterval = setInterval(() => {
      clearInterval(gameInterval);
    }, settings.interval);
  }

  return {
    settings,
    state,
    giveCommand,
    start
  }
}
