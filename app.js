"use strict";

var gameport = process.env.PORT || 8080;
var io = require('socket.io');
var express = require('express');
var UUID = require('node-uuid');
var verbose = false;
var http = require('http');
var app = express();
var server = http.createServer(app);

server.listen(gameport, "localhost", function () {
    console.log(':: Express :: Listening on port ' + gameport);
});

app.use(express.static('./'));

app.get('/', function (req, res) {
    console.log('Loading the homepage /index.html');
    res.sendFile('/index.html', {
        root: __dirname
    });
});

app.get('/*', function (req, res, next) {
    var file = req.params[0];
    if (verbose) console.log(':: Express :: file requested : ' + file);
    res.sendFile(__dirname + '/' + file);
});

var sio = io.listen(server);
var gameServer = require("./js/gameServer.js");

sio.on('connection', function (client) {

    client.userID = UUID();

    //Send user their UUID on connection
    client.emit('onconnection', {
        id: client.userID
    });

    console.log(':: Socket.io :: player ' + client.userID + ' connected');

    gameServer.findGame(client);

    client.on('playerMove', function (data) {
        gameServer.playerMove(client.userID, data);
    });

    //make sure the other player knows that they left and so on.
    client.on('disconnect', function () {

        //Useful to know when soomeone disconnects
        console.log(':: Socket.io :: client disconnected ' + client.userID + ' ' + client.game_id);

        // If the client was in a game, set by gameServer.findGame,
        // we can tell the game server to update that game state.
        if (client.game && client.game.id) {
            gameServer.endGame(client.game.id, client.userID);
        }
    });
});
