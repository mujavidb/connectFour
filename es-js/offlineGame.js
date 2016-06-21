"use strict"

class OfflineGame {

    constructor(players) {
        this.game = new GameBoard(8, 6, 4)
        this.players = Array.from(Array(players), (x, i) => i + 1)
        this.winningSequence = {}
        this.currentPlayer = 1
        this.online = false
    }

	isPossibleMove(column){
		return this.game.isPossibleMove(column)
	}

    playerMove(column) {

        let userInput = parseInt(column)
        this.game.addDisc(this.currentPlayer, userInput)

        if (this.game.checkWin()) {
            console.log(`Player ${this.currentPlayer} wins!`)
            this.winningSequence = this.game.winStatus
            console.log(this.winningSequence)
			addDiscToBoard(this.game.lastMove, this.currentPlayer, this.game.height)
        } else {
			addDiscToBoard(this.game.lastMove, this.currentPlayer, this.game.height)
            this.currentPlayer == this.players.length ? this.currentPlayer = 1 : this.currentPlayer++;
        }

    }
}
