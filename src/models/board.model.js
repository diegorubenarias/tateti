'use strict';

class Board {
    constructor(size = 3) {
      this.size = size;
      this.cells = Array(size * size).fill(null);
    }

    isFull() {
      return this.cells.every(cell => cell !== null);
    }
}

module.exports = Board;