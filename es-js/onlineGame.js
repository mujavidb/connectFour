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

    //Setup socket.io and listen for messages from server
    connectToServer(userName) {
        this.socket = io.connect();

        this.socket.on('connect', () => {
            console.log(":: Sockets :: Connected to server")
        });

        this.socket.on('onconnection', this.onConnection.bind(this));

        this.socket.on('gameStart', this.onGameStart.bind(this));

        this.socket.on('disconnect', this.onDisconnection.bind(this));

        this.socket.on('message', this.onMessage.bind(this));

        this.socket.on('playerMove', this.onPlayerMove.bind(this));

        this.socket.on('error', this.onMessage.bind(this));
    }

    //Update user UUID and online state
    onConnection(response){
        this.player.id = response.id
        this.isOnline = true
    }

    //Update player numbers and get views ready
    onGameStart(response){
        this.player.number = response.playerNumber
        this.opponent.id = response.opponentID
        this.gameID = response.gameID
        console.log(this.player)
        console.log(this.opponent)

        //Clear the game search modal
        onlineGameSetup(this.player.number)
        setTimeout(() => {
            cancelSearchModal(false, true)
        }, 3000)
    }

    //When a move is received from the server
    onPlayerMove(response){

        //If a restart is requested
        if (response.restart){
            restartGame(true, false)
        } else if (response.column && response.gameID == this.gameID) {

            // If a valid move is requested
            this.playerMove(response.column)
        }
    }

    //Just prints any message sent to it
    onMessage(response) {
        console.log(response.details)
    }

    //When quitting online mode
    forceDisconnect() {
        this.socket.disconnect()
    }

    //When socket.io disconnected
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

    //Updates game model and view
    playerMove(column) {

        //If a player is allowed to make the move
        if (this.isPossibleMove(column)) {

            //Update model with new move
            this.game.addDisc(this.currentPlayer, column)

            //If own turn, then send current move to opponent
            if (this.isOwnTurn()) {
                this.socket.emit('playerMove', {
                    gameID: this.gameID,
                    column: column,
                    restart: false
                })
            }

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
                this.currentPlayer == this.players.length ? this.currentPlayer = 1 : this.currentPlayer++
            }
        }
    }

    //If user requests restart, tell opponent to restart, too
    requestRestart(){
        this.socket.emit('playerMove', {
            gameID: this.gameID,
            column: 0,
            restart: true
        })
    }

    //If told to restart
    internalRestart(sender) {
        console.log("Internal restart requested")

        //New model for game
        this.game = new GameBoard(8, 6, 4)
        this.players = Array.from(Array(2), (x, i) => i + 1)
        this.winningSequence = {}
        this.currentPlayer = 1
    }
}
