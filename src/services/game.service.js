const BoardService = require("./board.service");

class GameService {
    constructor(game) {
        this.game = game;
        this.playerX = game.playerX;
        this.playerO = game.playerO;
        this.board = game.board;
        this.currentPlayer = this.playerX;
        this.boardService = new BoardService(this.board);
        this.isGameOver = false;
      }
    
      init() {
        
        this.boardService.render();
        document.getElementById('restart-btn').addEventListener('click', () => this.restart());
        document.getElementById('replay-btn').addEventListener('click', () => this.replayLastGame());
        document.getElementById('new-btn').addEventListener('click', () => this.newGame());
        document.addEventListener("handleTurn", event => this.handleTurn(event.detail.index));
        document.addEventListener("keyMark", event => this.handleTurn(event.detail.index));
        if (this.game.isAI && this.currentPlayer === 'O') {
            this.aiMove();
          }
        this.updateGameStatus();
      }
    
      updateGameStatus() {
        document.getElementById('game-status').textContent = `Player ${this.currentPlayer.symbol}'s turn`;
      }
    
      handleTurn(index) {
        this.game.gameHistory.push({ index, player: this.currentPlayer.symbol }); // Guardar la jugada actual

        if (!this.isGameOver && this.boardService.markCell(index, this.currentPlayer.symbol)) {
          if (this.boardService.checkWinningCombination(this.currentPlayer.symbol)) {
            this.endGame(`${this.currentPlayer.symbol} wins!`);
          } else if (this.boardService.isFull()) {
            this.endGame("It's a tie!");
          } else {
            this.switchPlayer();
          }
        }
        if (this.game.isAI && this.currentPlayer.symbol === 'O') {
            this.aiMove();
        }
      }
    
      switchPlayer() {
        this.currentPlayer = this.currentPlayer === this.playerX ? this.playerO : this.playerX;
        this.updateGameStatus();
      }
    
      endGame(message) {
        const statusElement = document.getElementById('game-status');
        statusElement.textContent = message;
        statusElement.setAttribute('aria-label', message);
        this.isGameOver = true;
      }
    
      restart() {
        this.boardService.resetBoard();
        this.game.resetHistory();
        this.isGameOver = false;
        this.currentPlayer = this.playerX;
        this.updateGameStatus();
      }

      replayLastGame() {
        this.boardService.resetBoard(); // Reiniciamos el tablero
        let moveIndex = 0;
      
        const replayInterval = setInterval(() => {
          if (moveIndex >= this.game.gameHistory.length) {
            clearInterval(replayInterval); // Detener el replay cuando se terminen los movimientos
            return;
          }
      
          const { index, player } = this.game.gameHistory[moveIndex];
          this.boardService.markCell(index, player); // Marcar la celda con el jugador adecuado
          moveIndex++;
        }, 1000); // 1 segundo entre cada movimiento
      }

      newGame() {
        this.boardService.resetBoard();
        this.game.resetHistory();
        document.getElementById("app").style.visibility  = "hidden";
        document.getElementById("config").style.visibility  = "visible";
      }

      aiMove() {
        let bestScore = -Infinity;
        let bestMove;
    
        for (let i = 0; i < this.board.cells.length; i++) {
          if (this.board.cells[i] === null) {
            // Simular la jugada
            this.board.cells[i] = 'O';
            let score = this.minimax(this.board, 0, false);
            this.board.cells[i] = null; // Deshacer la jugada
            if (score > bestScore) {
              bestScore = score;
              bestMove = i;
            }
          }
        }
    
        this.handleTurn(bestMove);
      }

      minimax(board, depth, isMaximizing) {
        let winner = this.checkWinner();
    
        if (winner === 'O') return 10 - depth;
        if (winner === 'X') return -10 + depth;
        if (board.isFull()) return 0;
    
        if (isMaximizing) {
          let bestScore = -Infinity;
          for (let i = 0; i < board.cells.length; i++) {
            if (board.cells[i] === null) {
              board.cells[i] = 'O';
              let score = this.minimax(board, depth + 1, false);
              board.cells[i] = null;
              bestScore = Math.max(score, bestScore);
            }
          }
          return bestScore;
        } else {
          let bestScore = Infinity;
          for (let i = 0; i < board.cells.length; i++) {
            if (board.cells[i] === null) {
              board.cells[i] = 'X';
              let score = this.minimax(board, depth + 1, true);
              board.cells[i] = null;
              bestScore = Math.min(score, bestScore);
            }
          }
          return bestScore;
        }
      }

      checkWinner() {
        const winningCombinations = [
          [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontales
          [0, 3, 6], [1, 4, 7], [2, 5, 8], // Verticales
          [0, 4, 8], [2, 4, 6]             // Diagonales
        ];
    
        for (let combination of winningCombinations) {
          const [a, b, c] = combination;
          if (this.board.cells[a] && this.board.cells[a] === this.board.cells[b] && this.board.cells[a] === this.board.cells[c]) {
            return this.board.cells[a];
          }
        }
    
        return null;
      }
    
    
};

module.exports = GameService;