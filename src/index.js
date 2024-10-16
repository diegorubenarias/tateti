import "./styles.css";
const Player = require("./models/player.model");
const Board = require("./models/board.model");
const Game = require("./models/game.model");
const GameService = require("./services/game.service");

class TicTacToeGame {

  
  constructor() {
    document.getElementById("two-players").addEventListener("click", () => this.startGame());
    document.getElementById("vs-ia").addEventListener("click", () => this.startGame(true));
  }

  startGame(isIA = false)  {
    const playerX = new Player("X");
    const playerO = new Player("O");
    const board = new Board(3);
   
    const game = new Game(playerX, playerO, board, isIA);
    const gameService = new GameService(game);
    gameService.init(game);  

    document.getElementById("config").style.visibility  = "hidden";
    document.getElementById("app").style.visibility  = "visible";
    

  }

}

const game = new TicTacToeGame();