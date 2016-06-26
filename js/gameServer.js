var gameServer = module.exports = {
    games: {},
    gameCount: 0
}

var UUID = require('node-uuid')

gameServer.playerMove = function(senderID, moveDetails) {
    var receiver = null
    var currentGame = this.games[moveDetails.gameID]
    if (currentGame.playerHost.userID == senderID) {
        receiver = currentGame.playerClient
    } else {
        receiver = currentGame.playerHost
    }
    receiver.emit("playerMove", moveDetails)
}

gameServer.createGame = function(player) {

    var newGame = {
        id: UUID(),
        playerHost: player,
        playerClient: null,
        playerCount: 1
    };

    //add to current games
    this.games[newGame.id] = newGame
    this.gameCount++

    //tell game host that a game has been created
    player.emit("message", {
        details: `New game created for ${player.userID}`
    })
    player.game = newGame
    player.hosting = true

    console.log(`Player ${player.userID} created a game with id ${player.game.id}`)

    // return newGame;
};

gameServer.startGame = function(game) {

    var randomNumber = Math.random()

    //tell the other client they are joining a game
    game.playerClient.emit("message", {
        details: `You are joining a new game with ${game.playerHost.userID}`
    })
    game.playerClient.game = game

    //now we tell both that the game is ready to start
    //clients will reset their positions in this case.
    game.playerHost.emit("message", {
        details: `Your match against ${game.playerClient.userID} is about to begin`
    })

    game.playerHost.emit("gameStart", {
        playerNumber   : randomNumber > 0.5 ,
        opponentID     : game.playerClient.userID,
        opponentNumber : 2,
        gameID         : game.id
    })

    game.playerClient.emit("message", {
        details: `Your match against ${game.playerHost.userID} is about to begin`
    })

    game.playerClient.emit("gameStart", {
        playerNumber   : 2,
        opponentID     : game.playerHost.userID,
        opponentNumber : 1,
        gameID         : game.id
    })

}

gameServer.findGame = function(player) {

    console.log(`Looking for an open game. We have: ${this.gameCount}`)

    if (this.gameCount) {

        var inGame = false

        //Check the list of games for an open game
        for (var gameId in this.games) {

            //only care about our own properties.
            if (!this.games.hasOwnProperty(gameId)) {
                continue
            }

            //get the game we are checking against
            var gameInstance = this.games[gameId]

            //If the game is a player short
            if (gameInstance.playerCount < 2) {

                //someone wants us to join!
                inGame = true;

                //increase the player count and store
                //the player as the client of this game
                gameInstance.playerClient = player
                gameInstance.playerCount++
                console.log(gameInstance.playerClient.userID)

                //start running the game on the server,
                //which will tell them to respawn/start
                this.startGame(gameInstance)
            }
        }

        //if still not in game
        if (!inGame) {
            this.createGame(player)
        }

    } else {

        //no games? create one!
        this.createGame(player)
    }
}

gameServer.endGame = function(gameID, userID) {

    var playerToDisconnect
    var currentGame = this.games[gameID]

    if (currentGame) {
        if (userID == currentGame.playerHost.userID && currentGame.playerClient) {
            playerToDisconnect = currentGame.playerClient
        } else if (currentGame.playerHost){
            playerToDisconnect = currentGame.playerHost
        }
        delete this.games[gameID]
        this.gameCount--
        playerToDisconnect.disconnect()
        console.log(`::: Game removed. There are now ${this.gameCount} games being played.`)
    } else {
        console.log(`Game not found`)
    }

}
