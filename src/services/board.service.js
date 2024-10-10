'use strict';

class BoardService{

    constructor(board) {
        this.board = board;
    }

    /**
     * Render board
     */
    render() {
        const boardElement = document.getElementById('board');
        boardElement.innerHTML = ''; // clean board
        this.board.cells.forEach((cell, index) => {
          const cellElement = document.createElement('div');
          cellElement.setAttribute("role", "gricell");
          cellElement.setAttribute("tabindex", "0");
          cellElement.setAttribute("aria-live","polite");
          //cellElement.setAttribute("aria-label","Empty");
          // Actualizar el aria-label para los lectores de pantalla
          cellElement.setAttribute('aria-label',cell ? `in cell ${index}` : "Empty");
         
          cellElement.classList.add('cell');
          cellElement.dataset.index = index; // set index for cell
          cellElement.textContent = cell ? cell : '';
          cellElement.addEventListener('click', (event) => this.handleCellClick(event));
          cellElement.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              //game.handleTurn(index);
              const event = new CustomEvent("keyMark", {detail: {index: parseInt(index)}});
              document.dispatchEvent(event);
            }
          });

          boardElement.appendChild(cellElement);
        });
      }

      handleCellClick(event) {
        const index = event.target.dataset.index; // Obtener el índice de la celda clicada
        if (index !== undefined && !this.board.cells[index]) {
          // Notificar al objeto 'GameService' para que procese el turno
          const event = new CustomEvent("handleTurn", {detail: {index: parseInt(index)}});
          document.dispatchEvent(event);
        }
      }

      handleCellAssistive(event) {
        document.querySelectorAll('.cell').forEach((cell, index) => {
            cell.addEventListener('keydown', (event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                game.handleTurn(index);
              }
            });
          });
      }
      

      markCell(index, symbol) {
        if (!this.board.cells[index]) {
          this.board.cells[index] = symbol;
          this.render(); // render board again
          return true;
        }
        return false;
      }
    
      resetBoard() {
        this.board.cells.fill(null);
        this.render();
      }
    
      isFull() {
        return this.board.cells.every(cell => cell !== null);
      }
    
      checkWinningCombination(symbol) {
        const winningCombinations = [
          [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
          [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
          [0, 4, 8], [2, 4, 6]  // Diagonal
        ];
        
        return winningCombinations.some(combination =>
          combination.every(index => this.board.cells[index] === symbol)
        );
      }

};

module.exports = BoardService;