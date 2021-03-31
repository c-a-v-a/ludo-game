import express, { application } from 'express';
import path from 'path';
import session from 'express-session';
import mongoose from 'mongoose';
import { nickRouteFunction } from './private/modules/nick-route.js'
import { getRoomInfo } from './private/modules/room-info-route.js'
require('dotenv').config();

// * Setting up express server
const app = express();

// Connect to mongodb
// Listen only, after server is connected to db
mongoose.connect(process.env.DB_URI!, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((res) => app.listen(process.env.PORT))
  .catch((err) => console.log(err));

// Setting up app for reading json data
app.use(express.json());

// Setting up static routes
app.use('/', express.static('./public'));

// Setting up session
app.use(session({
  name: "qid",
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24   // One day
  }
}))

//  * Set up server GET routes
app.get('/', (req, res) => {
  if ((req.session as any).playerNick)
    res.redirect('/room')
  else
    res.redirect('/login');
});

// Login route
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, './public/views', 'login.html'));
});

// Room route
app.get('/room', (req, res) => {
  res.sendFile(path.join(__dirname, './public/views', 'room.html'));
});

// * Set up server POST routes
// Get nick from client
app.post('/nick', nickRouteFunction);

// Room information route
app.post('/roomInfo', getRoomInfo);