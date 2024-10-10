
'use strict';

class Game {
    constructor(playerX, playerO, board, isAI) {
        this.playerX = playerX;
        this.playerO = playerO;
        this.isAI = isAI;
        this.board = board;
        this.gameHistory = []; 
     
    }

    resetHistory() {
        this.gameHistory = [];
    }
}

module.exports = Game;