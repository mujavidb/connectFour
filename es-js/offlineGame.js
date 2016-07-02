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

    //Updates game model and view
    playerMove(column) {
        //If a player is allowed to make the move
        if (this.isPossibleMove(column)) {

            //Update model with new move
            this.game.addDisc(this.currentPlayer, column)

            //Check if the move won the game
            if (this.game.checkWin()) {
                console.log(`Player ${this.currentPlayer} wins!`)

                //Update internal win-state
                this.winningSequence = this.game.winStatus
                console.log(this.winningSequence)

                //Update view with the move
    			addDiscToBoard(this.game.lastMove, this.currentPlayer, this.game.height)
            } else {

                //Update view with the move
    			addDiscToBoard(this.game.lastMove, this.currentPlayer, this.game.height)

                //Change player
                this.currentPlayer == this.players.length ? this.currentPlayer = 1 : this.currentPlayer++;
            }
        }

    }
}
