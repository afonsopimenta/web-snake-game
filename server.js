import express from "express";
import http from "http";
import {Server} from "socket.io";

import createGame from "./scripts/game.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

io.on("connection", socket => {
  console.log(`> User connected: ${socket.id}`);

  const game = createGame(socket);

  socket.on("start-game", () => {
    game.start();

    socket.on("command-received", command => {
      game.giveCommand(command);
    });
  })

  socket.on("disconnect", () => {
    console.log(`> User disconnected: ${socket.id}`);
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`> Server listening on port: ${port}`);
});
