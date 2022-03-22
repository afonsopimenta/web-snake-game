import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

const app = express();
const server = http.createServer(app);
const io = new Server(server);
app.use(express.static('public'));
dotenv.config();

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;
mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.d8zj4.mongodb.net/snakeGameDB?retryWrites=true&w=majority`);

const Score = new mongoose.model('Score', {
  userID: String,
  score: Number
});

io.on('connection', socket => {
  console.log(`> User connected: ${socket.id}`);

  socket.on('game-over', score => {
    ScoreRecord.findOne({}).sort('-score').exec((err, currentHighScore) => {
      const scoreRecord = new Score({
        userID: socket.id,
        score: score
      });
      
      if (err) {
        console.log(err);
        return;
      }

      scoreRecord.save(err => {
        if (err) {
          console.log(err);
          return;
        }
      });

      const highScore = currentHighScore === null || score > highScore ? score : currentHighScore;
      socket.emit('high-score-found', newHighScore);
      console.log(`> New user score: ${score}`);
    });
  });

  socket.on('disconnect', () => {
    console.log(`> User disconnected: ${socket.id}`);
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`> Server open on port: ${port}`);
});