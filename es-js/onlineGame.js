"use strict"

class OnlineGame {

    constructor(players, userName) {
        this.game = new GameBoard(8, 6, 4)
        this.players = Array.from(Array(players), (x, i) => i + 1)
        this.winningSequence = {}
        this.currentPlayer = 1
        this.player = {}
        this.opponent = {}
        this.gameID = null
        this.socket = null
        this.isOnline = false
        this.connectToServer(userName)
    }

    connectToServer(userName) {
        this.socket = io.connect();

        this.socket.on('connect', function() {
            console.log(":: Sockets :: Connected to server")
        }.bind(this));

        this.socket.on('onconnection', this.onConnection.bind(this));

        this.socket.on('gameStart', this.onGameStart.bind(this));

        this.socket.on('disconnect', this.onDisconnection.bind(this));

        this.socket.on('message', this.onMessage.bind(this));

        this.socket.on('playerMove', this.onPlayerMove.bind(this));

        // this.socket.on('error', this.onDisconnection.bind(this));
    }

    onConnection(response){
        this.player.id = response.id
        this.isOnline = true
    }

    onGameStart(response){
        this.player.number = response.playerNumber
        this.opponent.id = response.opponentID
        this.opponent.number = response.opponentNumber
        this.gameID = response.gameID
        console.log(this.player)
        console.log(this.opponent)

        //clear the modal
        onlineGameSetup(this.player.number)
        setTimeout(() => {
            cancelSearchModal(false, true)
        }, 3000)
    }

    onPlayerMove(response){
        if (response.restart){
            restartGame(true, false)
        } else if (response.column && response.gameID == this.gameID) {
            this.playerMove(response.column)
        }
    }

    onMessage(response) {
        console.log(response.details)
    }

    forceDisconnect() {
        this.socket.disconnect()
    }

    onDisconnection(){
        console.log(":: Sockets :: Disconnected from server")
        restartGame(false)
    }

    isPossibleMove(column) {
        return (this.isOwnTurn() ? this.game.isPossibleMove(column) : false)
    }

    isOwnTurn() {
        return (this.currentPlayer === this.player.number ? true : false)
    }

    playerMove(column) {
        if (this.game.isPossibleMove(column)) {
            this.game.addDisc(this.currentPlayer, column)

            //if own turn, then send current move to other player
            if (this.isOwnTurn()) {
                this.socket.emit('playerMove', {
                    gameID: this.gameID,
                    column: column,
                    restart: false
                })
            }

            //check if the move won the game
            if (this.game.checkWin()) {
                console.log(`Player ${this.currentPlayer} wins!`)
                this.winningSequence = this.game.winStatus
                console.log(this.winningSequence)
                addDiscToBoard(this.game.lastMove, this.currentPlayer, this.game.height)
            } else {
                addDiscToBoard(this.game.lastMove, this.currentPlayer, this.game.height)
                this.currentPlayer == this.players.length ? this.currentPlayer = 1 : this.currentPlayer++
            }
        }
    }

    requestRestart(){
        this.socket.emit('playerMove', {
            gameID: this.gameID,
            column: 0,
            restart: true
        })
    }

    internalRestart(sender) {
        console.log("Internal restart requested")
        this.game = new GameBoard(8, 6, 4)
        this.players = Array.from(Array(2), (x, i) => i + 1)
        this.winningSequence = {}
        this.currentPlayer = 1
        //flip coin to see who goes first
    }
}
