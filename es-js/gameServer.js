var UUID = require('node-uuid')

//OOP modules inspired by: http://darrenderidder.github.io/talks/ModulePatterns

class GameServer {

    //Set up properties to track current games being played
    constructor(){
        this.games = {}
        this.gameCount = 0
    }

    //When a player makes a move it is transmitted to their opponent
    playerMove(senderID, moveDetails){
        var receiver = null
        var currentGame = this.games[moveDetails.gameID]
        if (currentGame.playerHost.userID == senderID) {
            receiver = currentGame.playerClient
        } else {
            receiver = currentGame.playerHost
        }
        receiver.emit("playerMove", moveDetails)
    }
    //Create a new game and add a player to it
    createGame(player){

        var newGame = {
            id: UUID(),
            playerHost: player,
            playerClient: null,
            playerCount: 1
        };

        //Add the newGame to current games
        this.games[newGame.id] = newGame
        this.gameCount++

        //tell game host that a game has been created for them
        player.emit("message", {
            details: `New game created for ${player.userID}`
        })
        player.game = newGame
        player.hosting = true

        console.log(`Player ${player.userID} created a game with id ${player.game.id}`)
    }

    //When both players are in a game assign both playerNumbers
    //and begin the game logic on the client side
    startGame(game){

        var randomNumber = Math.random()

        //tell the other client they are joining a game
        game.playerClient.emit("message", {
            details: `You are joining a new game with ${game.playerHost.userID}`
        })
        game.playerClient.game = game

        //Now we tell both that the game is ready to start
        //Tell host
        game.playerHost.emit("message", {
            details: `Your match against ${game.playerClient.userID} is about to begin`
        })
        game.playerHost.emit("gameStart", {
            playerNumber   : randomNumber >= 0.5 ? 1 : 2,
            opponentID     : game.playerClient.userID,
            gameID         : game.id
        })

        //Tell client
        game.playerClient.emit("message", {
            details: `Your match against ${game.playerHost.userID} is about to begin`
        })
        game.playerClient.emit("gameStart", {
            playerNumber   : randomNumber < 0.5 ? 1 : 2,
            opponentID     : game.playerHost.userID,
            gameID         : game.id
        })

    }

    //Find a game and place the player inside it
    findGame(player){

        console.log(`Looking for an open game. We have: ${this.gameCount}`)

        //Check if there are any games active
        if (this.gameCount) {

            var inGame = false

            //Check the list of games for an available game
            for (var gameId in this.games) {

                //If a game instance is stored in current games
                if (!this.games.hasOwnProperty(gameId)) {
                    continue
                }

                //Get the game we are checking against
                var gameInstance = this.games[gameId]

                //If the game is a player short
                if (gameInstance.playerCount < 2) {

                    inGame = true;

                    //Increase the player count and add the player as a client
                    gameInstance.playerClient = player
                    gameInstance.playerCount++
                    console.log(gameInstance.playerClient.userID)

                    //Start running the game on the server
                    this.startGame(gameInstance)
                }
            }

            //If still not in game, i.e. some unknown error
            if (!inGame) {
                this.createGame(player)
            }

        } else {

            //If no games, create one
            this.createGame(player)
        }
    }

    //Someone has disconnected and the game needs to end
    endGame(gameID, userID){

        var playerToDisconnect
        var currentGame = this.games[gameID]

        //check who disconnected
        if (currentGame) {
            if (userID == currentGame.playerHost.userID && currentGame.playerClient) {
                playerToDisconnect = currentGame.playerClient
            } else if (currentGame.playerHost){
                playerToDisconnect = currentGame.playerHost
            }

            //Delete current game
            delete this.games[gameID]
            this.gameCount--

            //Disconnect the player that is still connected
            playerToDisconnect.disconnect()
            console.log(`::: Game removed. There are now ${this.gameCount} games being played.`)
        } else {
            console.log(`Game not found`)
        }

    }
}

module.exports = new GameServer()
