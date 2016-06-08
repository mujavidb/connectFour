"use strict"

class Play {

    constructor(players) {
        this.game = new GameBoard(8, 6, 4)
        this.players = Array.from(Array(players), (x, i) => i + 1)
        this.winningSequence = []
        this.currentPlayer = 1

        this.game.boardState()
        console.log(`Player ${this.currentPlayer} to move`)
    }

	isPossibleMove(column){
		return this.game.isPossibleMove(column)
	}

    playerMove(column) {

        let userInput = parseInt(column)
        this.game.addDisc(this.currentPlayer, userInput)
		addDiscToBoard(this.game.lastMove, this.currentPlayer, this.game.height)

        if (this.game.checkWin()) {
            console.log(`Player ${this.currentPlayer} wins!`)
            this.winningSequence = this.game.winStatus
            // this.game.boardState()
            console.log(this.game.winStatus)
        } else {
            this.currentPlayer == this.players.length ? this.currentPlayer = 1 : this.currentPlayer++;
            // this.game.boardState()
            console.log(`Player ${this.currentPlayer} to move`)
        }
    }
}

//horizontal tested
//vertical tested
//rl diagonal tested
//lr diagonal tested

// theGame.playerMove(4)
// theGame.playerMove(3)
//
// theGame.playerMove(3)
// theGame.playerMove(2)
//
// theGame.playerMove(2)
// theGame.playerMove(1)
//
// theGame.playerMove(2)
// theGame.playerMove(1)
//
// theGame.playerMove(1)
// theGame.playerMove(6)
//
// theGame.playerMove(1)
