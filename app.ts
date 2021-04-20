import express from 'express';
import path from 'path';
import session from 'express-session';
import mongoose from 'mongoose';
// ! Used @ts-ignore because of module error, works fine for now.
// @ts-ignore
import { nickRouteFunction } from './backend-js/routes/nick-route.js';
// @ts-ignore
import { getRoomInfo } from './backend-js/routes/room-info-route.js';
// @ts-ignore
import { changePlayerState } from './backend-js/routes/change-player-state-route.js'
// @ts-ignore
import { canGameStart } from './backend-js/routes/can-game-start-route.js';
// @ts-ignore
import { whoseTurn } from './backend-js/routes/whose-turn-route.js';
// @ts-ignore
import { diceRoll } from './backend-js/routes/dice-roll-route.js';
// @ts-ignore
import { moveToken } from './backend-js/routes/move-token-route.js';
// @ts-ignore
import { ghostToken } from './backend-js/routes/ghost-token-route.js';
// @ts-ignore
import { checkIfCanMove } from './backend-js/routes/check-if-can-move-route.js';
// @ts-ignore
import { checkIfGameWon } from './backend-js/routes/check-if-game-won-route.js';

require('dotenv').config();

// * Setting up express server
const app = express();

// Connect to mongodb
// Listen only, after server is connected to db
mongoose
  .connect(process.env.DB_URI!, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => app.listen(process.env.PORT))
  .catch((err) => console.log(err));

// Setting up app for reading json data
app.use(express.json());

// Setting up static routes
app.use('/', express.static('./public'));

// Setting up session
app.use(
  session({
    name: 'qid',
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // One day
    },
  })
);

//  * Set up server GET routes
app.get('/', (req, res) => {
  if ((req.session as any).playerNick) res.redirect('/room');
  else res.redirect('/login');
});

// Login route
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, './public/views', 'login.html'));
});

// Room route
app.get('/room', (req, res) => {
  res.sendFile(path.join(__dirname, './public/views', 'room.html'));
});

// Winner route
app.get('/winner', (req, res) => {
  res.sendFile(path.join(__dirname, './public/views', 'winner.html'));
});

// Looser route
app.get('/looser', (req, res) => {
  res.sendFile(path.join(__dirname, './public/views', 'looser.html'));
});

// Game didn't finish route
app.get('/notFinished', (req, res) => {
  res.sendFile(path.join(__dirname, './public/views', 'not-finished.html'));
});

// TODO Setup not finish,winner and looser views.
// * Set up server POST routes
// Get nick from client
app.post('/nick', nickRouteFunction);

// Room information route
app.post('/roomInfo', getRoomInfo);

// Room for changing player state (is ready)
app.post('/changePlayerState', changePlayerState);

// Route for checking if game can start
app.post('/canGameStart', canGameStart);

// Route for checking if it's player turn
app.post('/whoseTurn', whoseTurn);

// Route for rolling the dice
app.post('/diceRoll', diceRoll); 

// Route for moving player's token
app.post('/moveToken', moveToken);

// Route for displaying 'ghost tokens'
app.post('/ghostToken', ghostToken);

// Route for checking if player can move
app.post('/checkIfCanMove', checkIfCanMove);

// Route for checking if game is won
app.post('/checkIfGameWon', checkIfGameWon)