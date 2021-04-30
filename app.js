"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const express_session_1 = __importDefault(require("express-session"));
const mongoose_1 = __importDefault(require("mongoose"));
// ! Used @ts-ignore because of module error, works fine for now.
// @ts-ignore
const nick_route_js_1 = require("./backend-js/routes/nick-route.js");
// @ts-ignore
const room_info_route_js_1 = require("./backend-js/routes/room-info-route.js");
// @ts-ignore
const change_player_state_route_js_1 = require("./backend-js/routes/change-player-state-route.js");
// @ts-ignore
const can_game_start_route_js_1 = require("./backend-js/routes/can-game-start-route.js");
// @ts-ignore
const whose_turn_route_js_1 = require("./backend-js/routes/whose-turn-route.js");
// @ts-ignore
const dice_roll_route_js_1 = require("./backend-js/routes/dice-roll-route.js");
// @ts-ignore
const move_token_route_js_1 = require("./backend-js/routes/move-token-route.js");
// @ts-ignore
const ghost_token_route_js_1 = require("./backend-js/routes/ghost-token-route.js");
// @ts-ignore
const check_if_game_won_route_js_1 = require("./backend-js/routes/check-if-game-won-route.js");
// @ts-ignore
const skip_turn_route_js_1 = require("./backend-js/routes/skip-turn-route.js");
require('dotenv').config();
// * Setting up express server
const app = express_1.default();
// Connect to mongodb
// Listen only, after server is connected to db
mongoose_1.default
    .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then((res) => app.listen(process.env.PORT))
    .catch((err) => console.log(err));
// Setting up app for reading json data
app.use(express_1.default.json());
// Setting up static routes
app.use('/', express_1.default.static('./public'));
// Setting up session
app.use(express_session_1.default({
    name: 'qid',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // One day
    },
}));
//  * Set up server GET routes
app.get('/', (req, res) => {
    if (req.session.playerNick)
        res.redirect('/room');
    else
        res.redirect('/login');
});
// Login route
app.get('/login', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, './public/views', 'login.html'));
});
// Room route
app.get('/room', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, './public/views', 'room.html'));
});
// Winner route
app.get('/winner', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, './public/views', 'winner.html'));
});
// Looser route
app.get('/looser', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, './public/views', 'looser.html'));
});
// Game didn't finish route
// app.get('/notFinished', (req, res) => {
//   res.sendFile(path.join(__dirname, './public/views', 'not-finished.html'));
// });
// * Set up server POST routes
// Get nick from client
app.post('/nick', nick_route_js_1.nickRouteFunction);
// Room information route
app.post('/roomInfo', room_info_route_js_1.getRoomInfo);
// Room for changing player state (is ready)
app.post('/changePlayerState', change_player_state_route_js_1.changePlayerState);
// Route for checking if game can start
app.post('/canGameStart', can_game_start_route_js_1.canGameStart);
// Route for checking if it's player turn
app.post('/whoseTurn', whose_turn_route_js_1.whoseTurn);
// Route for rolling the dice
app.post('/diceRoll', dice_roll_route_js_1.diceRoll);
// Route for moving player's token
app.post('/moveToken', move_token_route_js_1.moveToken);
// Route for displaying 'ghost tokens'
app.post('/ghostToken', ghost_token_route_js_1.ghostToken);
// Route for checking if game is won
app.post('/checkIfGameWon', check_if_game_won_route_js_1.checkIfGameWon);
app.post('/whoAmI', (req, res) => {
    res.json({ nick: req.session.playerNick, color: req.session.playerColor });
});
app.post('/skipTurn', skip_turn_route_js_1.skipPlayerTurn);
