import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

io.on('connection', socket => {
  console.log(`> User connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`> User disconnected: ${socket.id}`);
  });
});

const port = process.env.PORT;
server.listen(port, () => {
  console.log(`> Server open on port: ${port}`)
});