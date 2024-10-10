/**
 * @jest-environment jsdom
 */
const GameService = require("../services/game.service");
const Player = require("../models/player.model");
const Board = require("../models/board.model");
const Game = require("../models/game.model");

describe('GameService Class', () => {
  let board;
  let game;
  

  beforeEach(() => {
    playerX = new Player("X");
    playerO = new Player("O");
    board = new Board(3);
    isIA = false;
   
    g = new Game(playerX, playerO, board, isIA);
    this.game = new GameService(g);
    document.body.innerHTML = `    <div id="config">
    <button id="two-players">Two Players</button>
    <button id="vs-ia">Vs IA Player</button>
  </div>
  <div id="app">
    <div >
      <div id="game-status">Player X's turn</div>
      <div id="board" class="board"></div>
    </div>
    <div >
      <button id="restart-btn">Restart Game</button>
      <button id="replay-btn">Replay Last Game</button>
      <button id="new-btn">New Game</button>
    </div>
    
  </div>
`;
  });

  test('should alternate turns between X and O', () => {
   
    this.game.handleTurn(0); // Primer movimiento de 'X'
    expect(this.game.board.cells[0]).toBe('X');
    expect(this.game.currentPlayer.symbol).toBe('O'); // Turno de 'O'

    this.game.handleTurn(1); // Segundo movimiento de 'O'
    expect(this.game.board.cells[1]).toBe('O');
    expect(this.game.currentPlayer.symbol).toBe('X'); // Vuelve a 'X'
  });

  test('should detect winner correctly', () => {
    this.game.handleTurn(0); // X
    this.game.handleTurn(3); // O
    this.game.handleTurn(1); // X
    this.game.handleTurn(4); // O
    this.game.handleTurn(2); // X gana en la primera fila

    expect(this.game.checkWinner()).toBe('X');
    expect(this.game.isGameOver).toBe(true);
  });

  test('should detect tie when board is full with no winner', () => {
    const moves = [0, 1, 2, 4, 3, 5, 7, 6, 8]; // Secuencia de empate
    moves.forEach(index => this.game.handleTurn(index));

    expect(this.game.checkWinner()).toBe(null);
    expect(this.game.isGameOver).toBe(true);
    expect(this.game.board.isFull()).toBe(true);
  });
});
