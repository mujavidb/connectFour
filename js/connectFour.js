"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function p(x) {
    console.log(x);
}

var GameBoard = function () {
    function GameBoard(width, height, connectWin) {
        _classCallCheck(this, GameBoard);

        this.width = width;
        this.height = height;
        this.board = Array.from(Array(height), function (x) {
            return Array.from(Array(width), function (x) {
                return 0;
            });
        });
        this.connectWin = connectWin;
        this.winStatus = null;
        this.lastMove = [];
    }

    _createClass(GameBoard, [{
        key: "isPossibleMove",
        value: function isPossibleMove(column) {
            if (this.winStatus) {
                return false;
            }
            var i = 0;
            while (i < this.height && this.board[i][column] != 0) {
                i++;
            }return i < 0 || i == this.height ? false : true;
        }
    }, {
        key: "addDisc",
        value: function addDisc(disc, column) {
            column -= 1;
            if (this.isPossibleMove(column)) {
                var i = 0;
                while (this.board[i][column] != 0) {
                    i++;
                }this.board[i][column] = disc;
                this.lastMove = [i, column];
                return true;
            } else {
                return false;
            }
        }
    }, {
        key: "boardState",
        value: function boardState() {
            console.log();
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.board[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var line = _step.value;

                    var lineString = "";
                    var _iteratorNormalCompletion2 = true;
                    var _didIteratorError2 = false;
                    var _iteratorError2 = undefined;

                    try {
                        for (var _iterator2 = line[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                            var element = _step2.value;

                            lineString += " " + element + " ";
                        }
                    } catch (err) {
                        _didIteratorError2 = true;
                        _iteratorError2 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                _iterator2.return();
                            }
                        } finally {
                            if (_didIteratorError2) {
                                throw _iteratorError2;
                            }
                        }
                    }

                    console.log(lineString);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            console.log("" + new Array(3 * this.width).fill("-").join(""));
            var numberString = "";
            for (var i = 1; i <= this.width; i++) {
                numberString += " " + i + " ";
            }
            console.log(numberString);
            console.log();
            console.log();
        }
    }, {
        key: "checkHorizontal",
        value: function checkHorizontal() {
            for (var i = 0; i < this.height; i++) {
                var previousItem = null;
                var sequenceStart = null;
                var sequenceLength = 0;
                for (var j = 0; j < this.width; j++) {
                    if (this.board[i][j] != 0) {
                        if (this.board[i][j] == previousItem) {
                            sequenceLength += 1;
                        } else {
                            previousItem = this.board[i][j];
                            sequenceLength = 1;
                            sequenceStart = j;
                        }
                    } else {
                        previousItem = this.board[i][j];
                        sequenceLength = 1;
                        sequenceStart = j;
                    }
                    if (sequenceLength == this.connectWin) {
                        console.log(["H", i, sequenceStart]);
                        this.winStatus = {
                            type: "H",
                            x: i,
                            y: sequenceStart
                        };
                        return true;
                    }
                }
            }
            return false;
        }
    }, {
        key: "checkVertical",
        value: function checkVertical() {
            for (var i = 0; i < this.width; i++) {
                var previousItem = null;
                var sequenceStart = null;
                var sequenceLength = 0;
                for (var j = 0; j < this.height; j++) {
                    if (this.board[j][i] != 0) {
                        if (this.board[j][i] == previousItem) {
                            sequenceLength += 1;
                        } else {
                            previousItem = this.board[j][i];
                            sequenceLength = 1;
                            sequenceStart = j;
                        }
                    } else {
                        previousItem = this.board[j][i];
                        sequenceLength = 1;
                        sequenceStart = j;
                    }
                    if (sequenceLength == this.connectWin) {
                        this.winStatus = {
                            type: "V",
                            x: i,
                            y: sequenceStart
                        };
                        return true;
                    }
                }
            }
            return false;
        }
    }, {
        key: "checkLeftRightDiagonal",
        value: function checkLeftRightDiagonal() {
            for (var k = this.connectWin - 1; k < this.height; k++) {
                for (var i = 0; i < this.width - this.connectWin + 1; i++) {
                    var m = k;
                    var previousItem = null;
                    var sequenceStart = null;
                    var sequenceLength = 0;
                    for (var j = i; j < this.width && m >= 0; j++, m--) {
                        if (this.board[m][j] != 0) {
                            if (this.board[m][j] == previousItem) {
                                sequenceLength += 1;
                            } else {
                                previousItem = this.board[m][j];
                                sequenceLength = 1;
                                sequenceStart = j;
                            }
                        } else {
                            previousItem = this.board[m][j];
                            sequenceLength = 1;
                            sequenceStart = j;
                        }
                        if (sequenceLength >= this.connectWin) {
                            this.winStatus = {
                                type: "LR",
                                x: k,
                                y: sequenceStart
                            };
                            return true;
                        }
                    }
                }
            }
            return false;
        }
    }, {
        key: "checkRightLeftDiagonal",
        value: function checkRightLeftDiagonal() {
            for (var k = this.connectWin - 1; k < this.height; k++) {
                for (var i = 0; i < this.width - this.connectWin + 1; i++) {
                    var m = k;
                    var previousItem = null;
                    var sequenceStart = null;
                    var sequenceLength = 0;
                    for (var j = this.width - i - 1; j >= 0 && m >= 0; j--, m--) {
                        if (this.board[m][j] != 0) {
                            if (this.board[m][j] == previousItem) {
                                sequenceLength += 1;
                            } else {
                                previousItem = this.board[m][j];
                                sequenceLength = 1;
                                sequenceStart = j;
                            }
                        } else {
                            previousItem = this.board[m][j];
                            sequenceLength = 1;
                            sequenceStart = j;
                        }
                        if (sequenceLength >= this.connectWin) {
                            this.winStatus = {
                                type: "RL",
                                x: k,
                                y: sequenceStart
                            };
                            return true;
                        }
                    }
                }
            }
            return false;
        }
    }, {
        key: "checkWin",
        value: function checkWin() {
            if (this.checkHorizontal() || this.checkVertical() || this.checkLeftRightDiagonal() || this.checkRightLeftDiagonal()) {
                return true;
            } else {
                return false;
            }
        }
    }]);

    return GameBoard;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var OfflineGame = function () {
    function OfflineGame(players) {
        _classCallCheck(this, OfflineGame);

        this.game = new GameBoard(8, 6, 4);
        this.players = Array.from(Array(players), function (x, i) {
            return i + 1;
        });
        this.winningSequence = {};
        this.currentPlayer = 1;
        this.online = false;
    }

    _createClass(OfflineGame, [{
        key: "isPossibleMove",
        value: function isPossibleMove(column) {
            return this.game.isPossibleMove(column);
        }

        //Updates game model and view

    }, {
        key: "playerMove",
        value: function playerMove(column) {
            //If a player is allowed to make the move
            if (this.isPossibleMove(column)) {

                //Update model with new move
                this.game.addDisc(this.currentPlayer, column);

                //Check if the move won the game
                if (this.game.checkWin()) {
                    console.log("Player " + this.currentPlayer + " wins!");

                    //Update internal win-state
                    this.winningSequence = this.game.winStatus;
                    console.log(this.winningSequence);

                    //Update view with the move
                    addDiscToBoard(this.game.lastMove, this.currentPlayer, this.game.height);
                } else {

                    //Update view with the move
                    addDiscToBoard(this.game.lastMove, this.currentPlayer, this.game.height);

                    //Change player
                    this.currentPlayer == this.players.length ? this.currentPlayer = 1 : this.currentPlayer++;
                }
            }
        }
    }]);

    return OfflineGame;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var OnlineGame = function () {
    function OnlineGame(players, userName) {
        _classCallCheck(this, OnlineGame);

        this.game = new GameBoard(8, 6, 4);
        this.players = Array.from(Array(players), function (x, i) {
            return i + 1;
        });
        this.winningSequence = {};
        this.currentPlayer = 1;
        this.player = {};
        this.opponent = {};
        this.gameID = null;
        this.socket = null;
        this.isOnline = false;
        this.connectToServer(userName);
    }

    //Setup socket.io and listen for messages from server


    _createClass(OnlineGame, [{
        key: "connectToServer",
        value: function connectToServer(userName) {
            this.socket = io.connect();

            this.socket.on('connect', function () {
                console.log(":: Sockets :: Connected to server");
            }.bind(this));

            this.socket.on('onconnection', this.onConnection.bind(this));

            this.socket.on('gameStart', this.onGameStart.bind(this));

            this.socket.on('disconnect', this.onDisconnection.bind(this));

            this.socket.on('message', this.onMessage.bind(this));

            this.socket.on('playerMove', this.onPlayerMove.bind(this));

            // this.socket.on('error', this.onDisconnection.bind(this));
        }

        //Update user UUID and online state

    }, {
        key: "onConnection",
        value: function onConnection(response) {
            this.player.id = response.id;
            this.isOnline = true;
        }

        //Update player numbers and get views ready

    }, {
        key: "onGameStart",
        value: function onGameStart(response) {
            this.player.number = response.playerNumber;
            this.opponent.id = response.opponentID;
            this.gameID = response.gameID;
            console.log(this.player);
            console.log(this.opponent);

            //Clear the game search modal
            onlineGameSetup(this.player.number);
            setTimeout(function () {
                cancelSearchModal(false, true);
            }, 3000);
        }

        //When a move is received from the server

    }, {
        key: "onPlayerMove",
        value: function onPlayerMove(response) {

            //If a restart is requested
            if (response.restart) {
                restartGame(true, false);
            } else if (response.column && response.gameID == this.gameID) {

                // If a valid move is requested
                this.playerMove(response.column);
            }
        }

        //Just prints any message sent to it

    }, {
        key: "onMessage",
        value: function onMessage(response) {
            console.log(response.details);
        }

        //When quitting online mode

    }, {
        key: "forceDisconnect",
        value: function forceDisconnect() {
            this.socket.disconnect();
        }

        //When socket.io disconnected

    }, {
        key: "onDisconnection",
        value: function onDisconnection() {
            console.log(":: Sockets :: Disconnected from server");
            restartGame(false);
        }
    }, {
        key: "isPossibleMove",
        value: function isPossibleMove(column) {
            return this.isOwnTurn() ? this.game.isPossibleMove(column) : false;
        }
    }, {
        key: "isOwnTurn",
        value: function isOwnTurn() {
            return this.currentPlayer === this.player.number ? true : false;
        }

        //Updates game model and view

    }, {
        key: "playerMove",
        value: function playerMove(column) {

            //If a player is allowed to make the move
            if (this.isPossibleMove(column)) {

                //Update model with new move
                this.game.addDisc(this.currentPlayer, column);

                //If own turn, then send current move to opponent
                if (this.isOwnTurn()) {
                    this.socket.emit('playerMove', {
                        gameID: this.gameID,
                        column: column,
                        restart: false
                    });
                }

                //Check if the move won the game
                if (this.game.checkWin()) {

                    console.log("Player " + this.currentPlayer + " wins!");

                    //Update internal win-state
                    this.winningSequence = this.game.winStatus;
                    console.log(this.winningSequence);

                    //Update view with the move
                    addDiscToBoard(this.game.lastMove, this.currentPlayer, this.game.height);
                } else {

                    //Update view with the move
                    addDiscToBoard(this.game.lastMove, this.currentPlayer, this.game.height);

                    //Change player
                    this.currentPlayer == this.players.length ? this.currentPlayer = 1 : this.currentPlayer++;
                }
            }
        }

        //If user requests restart, tell opponent to restart, too

    }, {
        key: "requestRestart",
        value: function requestRestart() {
            this.socket.emit('playerMove', {
                gameID: this.gameID,
                column: 0,
                restart: true
            });
        }

        //If told to restart

    }, {
        key: "internalRestart",
        value: function internalRestart(sender) {
            console.log("Internal restart requested");

            //New model for game
            this.game = new GameBoard(8, 6, 4);
            this.players = Array.from(Array(2), function (x, i) {
                return i + 1;
            });
            this.winningSequence = {};
            this.currentPlayer = 1;
        }
    }]);

    return OnlineGame;
}();
//TODO: Internationalise
//TODO: Add move authentication
//TODO: Allow for minification of selectors and variables across all files
//TODO: Improve modal design
//TODO: Add gone offline notification
//TODO: Account for inability to connect to server

//Shorthand to select element
function _$(x) {
    return document.querySelector(x);
}

//Shorthand to select multiple elements
function _$$(x) {
    return document.querySelectorAll(x);
}

//Apply a function to multiple elements
function _f(selected, modifier) {
    Array.prototype.forEach.call(selected, modifier);
}

//Ease of debugging
function p(x) {
    console.log(x);
}

//View functions to expose to controller
var addDiscToBoard = null;
var restartGame = null;
var cancelSearchModal = null;
var onlineGameSetup = null;

var setup = function () {

    //Setup variables
    var theGame = new OfflineGame(2);
    var connectFourArea = _$(".gameContainer");
    var columns = _$$('.column');
    var discSVG = _$('#discArea');
    var discArea = _$('#discAreaGroup');
    var winHighlightArea = _$("#winHighlight");
    var redScore = _$("#redScore");
    var yellowScore = _$("#yellowScore");
    var perspective = _$(".perspectiveChild");
    var restartButton = _$(".restartGame");
    var playOnline = _$('.playOnline');
    var svgNS = "http://www.w3.org/2000/svg";
    var KEYCODE_ESC = 27;

    //Does what it says on the tin
    addDiscToBoard = function addDiscToBoard(location, player, maxHeight) {

        //Creates an SVG image element and places it above the board
        var disc = document.createElementNS(svgNS, "image");
        disc.setAttributeNS("http://www.w3.org/1999/xlink", "href", player == 1 ? "img/red_disc.svg" : "img/yellow_disc.svg");
        disc.setAttribute("x", '' + (18 + location[1] * 94 + 7));
        disc.setAttribute("y", "-80");
        disc.setAttribute("width", "80");
        disc.setAttribute("height", "80");
        discArea.appendChild(disc);

        //Animate disc down the board to its position
        animateDiscDown(disc, location[0]);

        //Wait till piece is down
        setTimeout(function () {

            //Check if the move won the game for the player
            if (theGame.winningSequence.type) {

                //Prevent any columns from being clicked
                connectFourArea.classList.add("deselectAll");

                //Display winning player sign
                document.body.classList.add(player == 1 ? "redWin" : "yellowWin");

                //Highlight the winning set of four on the board
                highlightWin(theGame.winningSequence.type, theGame.winningSequence.x, theGame.winningSequence.y);

                //Increment the player's score
                if (player == 1) {
                    redScore.innerHTML = '' + (parseInt(redScore.innerHTML) + 1);
                } else {
                    yellowScore.innerHTML = '' + (parseInt(yellowScore.innerHTML) + 1);
                }
            } else {

                //If no win
                //If the column is now full, prevent it from being clicked
                if (location[0] == maxHeight - 1) {
                    columns[location[1]].classList.add("deselect");
                }

                //Change the player in UI
                document.body.classList.toggle("switch");
            }

            //Length of time equal to animation length
        }, 100 + 300 / 5 * (5 - location[0]));
    };

    //Literally cant explain this name further
    function animateDiscDown(disc, y) {

        //Calculate location to animate disc down to
        var finalLocation = 18 + (5 - y) * 94 + 7;

        //Depending on row the disc goes down to, animation length changes
        //so that the speed of descent is constant
        var transitionSpeed = 'transform ' + 0.3 / 5 * (5 - y) + 's ease-in';
        disc.style.transition = transitionSpeed;

        //Allow 20ms for DOM to update
        setTimeout(function () {

            //Translate the disc to finalLocation so that
            //animation is passed to css
            disc.style.transform = 'translateY(' + (finalLocation + 80) + 'px)';
        }, 20);
    }

    //Display message if screen width too small
    function ensureScreenSize() {

        //If screensize is too small throw up a modal
        if (screen.width < 320) {
            _$(".screenSize").classList.add("show");
        } else {
            _$(".screenSize").classList.remove("show");
        }
    }

    //Depending on type of victory (H, V, LR, RL) activate different function
    function highlightWin(type, x, y) {
        type == "H" ? horizontalHighlight(x, y) : type == "V" ? verticalHighlight(x, y) : diagonalHighlight(x, y, type == "RL" ? 135 : 45);
    }

    //Creates the physical svg rounded rect
    function createSVGHighlight(x, y, width, height, player) {

        //Create the rect
        var highlight = document.createElementNS(svgNS, "rect");
        var styles = "";
        highlight.setAttributeNS(null, "x", '' + x);
        highlight.setAttributeNS(null, "y", '' + y);
        highlight.setAttributeNS(null, "rx", "47");
        highlight.setAttributeNS(null, "ry", "47");
        highlight.setAttributeNS(null, "width", '' + width);
        highlight.setAttributeNS(null, "height", '' + height);

        //Depending on player apply different fill
        styles += 'fill: ' + (player == 1 ? "rgba(240, 70, 95, 0.5)" : "rgba(215, 200, 40, 0.4)") + ';';
        styles += 'stroke: none;';
        highlight.setAttributeNS(null, "style", styles);

        //Send finished product out to be used
        return highlight;
    }

    //Place vertical highlight
    function verticalHighlight(x, y) {
        var height = 376; // 4 * 94
        var width = 94;
        var boardHeight = 564;
        var left = 18 + x * width;
        var top = 18 + boardHeight - height - y * 94;
        var highlight = createSVGHighlight(left, top, width, height, theGame.currentPlayer);
        winHighlightArea.appendChild(highlight);
    }

    //Place horizontal highlight
    function horizontalHighlight(x, y) {
        var height = 94;
        var width = 376; // 4 * 94
        var left = 18 + y * height;
        var top = 18 + (6 - x - 1) * height;
        var highlight = createSVGHighlight(left, top, width, height, theGame.currentPlayer);
        winHighlightArea.appendChild(highlight);
    }

    //Place diagonal highlight on board
    function diagonalHighlight(x, y, angle) {

        //Set up SVG
        var width = 494;
        var height = 94;
        var left = 18 + y * height;
        var top = 18 + (6 - x - 1) * height;
        var highlight = createSVGHighlight(left, top, width, height, theGame.currentPlayer);

        //Create container to rotate
        var transform = document.createElementNS(svgNS, "g");
        transform.setAttributeNS(null, "transform", 'rotate(' + angle + ' ' + (left + 47) + ' ' + (top + 47) + ')');
        transform.appendChild(highlight);
        winHighlightArea.appendChild(transform);
    }

    //Removes all pieces from board and run a function if passed
    function clearBoard(restartLogic) {

        //Disable restart button to prevent re-clicks during the process
        restartButton.disabled = true;

        //remove highlights
        while (winHighlightArea.firstChild) {
            winHighlightArea.removeChild(winHighlightArea.firstChild);
        } //animate discs container out of view
        discArea.classList.add("moveOut");
        perspective.classList.add("active");

        setTimeout(function () {
            restartButton.disabled = false;

            //Remove discs from view
            while (discArea.firstChild) {
                discArea.removeChild(discArea.firstChild);
            } //Move disc container back into view
            discArea.classList.remove("moveOut");
            perspective.classList.remove("active");

            //Remove deslectAll from columns to allow for clicking anew
            connectFourArea.classList.remove("deselectAll");

            //Remove individual deselect classes from columns
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = discArea.childNodes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var disc = _step.value;

                    disc.classList.remove("deselect");
                }

                //Remove win classes and return game to default start
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            document.body.classList.remove("redWin");
            document.body.classList.remove("yellowWin");
            document.body.classList.add("switch");

            //If internal restart logic is supplied, run it
            if (restartLogic != null) {
                restartLogic();
            }
        }, 1500);
    }

    //clears board then adds internal restart logic
    restartGame = function restartGame(isOnline) {
        var didInitiateRestart = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

        clearBoard(function () {

            //If restarting to a new OnlineGame
            if (isOnline) {

                //If the user is connected to the server
                if (theGame.isOnline) {

                    //If the user requested restart themselves
                    if (didInitiateRestart) {

                        //Get opponent to restart their game, too
                        theGame.requestRestart();
                    }

                    //Restart game logic internally, i.e. create a new model
                    theGame.internalRestart();
                } else {

                    //If playing an online game but not connected to server yet
                    theGame = new OnlineGame(2);
                }
            } else {

                //If restarting to a new OfflineGame
                //If user is currently in an OnlineGame
                if (String(playOnline.classList).indexOf("quitOnline") > -1) {

                    //Restart counters
                    redScore.innerHTML = "0";
                    yellowScore.innerHTML = "0";

                    //Change button in view
                    playOnline.classList.remove("quitOnline");
                    playOnline.innerHTML = "Play Online";
                }

                //Create a new game
                theGame = new OfflineGame(2);
            }
        });
    };

    //Cancels the online game search
    cancelSearchModal = function cancelSearchModal(cancelGame) {
        var goOnline = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];


        //Cancels the modal
        _$(".startOnline").classList.remove("show");

        //If user is about to go online
        if (goOnline) {

            //Clear scores
            redScore.innerHTML = "0";
            yellowScore.innerHTML = "0";

            //Update playOnline button for online gameplay
            playOnline.classList.add("quitOnline");
            playOnline.innerHTML = "Quit Online";
            clearBoard();
        }
    };

    //When game is found and the user connect to their opponent
    //tell the player which piece they are playing as
    onlineGameSetup = function onlineGameSetup(playerNumber) {

        //
        _$(".slideRandom").classList.add("online");

        //Update search-online-modal with user's color and player order
        if (playerNumber == 1) {
            _$("#playerStartInfo").innerHTML = "You are playing as Red, starting first";
            _$(".gameFound").classList.add("playerOne");
        } else {
            _$("#playerStartInfo").innerHTML = "You are playing as Yellow, starting second";
            _$(".gameFound").classList.add("playerTwo");
        }

        //Remove classes after the modal has gone
        setTimeout(function () {
            _$(".slideRandom").classList.remove("online");
            _$(".gameFound").classList.remove("playerOne");
            _$(".gameFound").classList.remove("playerTwo");
        }, 4000);
    };

    // Setup code i.e. bind all event listeners
    (function () {

        //Check screen size
        ensureScreenSize();

        //Bugfix for incorrect server disconnection + restart event
        restartButton.disabled = false;

        //To ensure the game is displayed correctly to all users
        window.addEventListener('resize', function () {
            ensureScreenSize();
        }, false);

        //No really... it restarts the game
        restartButton.addEventListener('click', function () {
            restartGame(theGame.isOnline);
        }, false);

        playOnline.addEventListener('click', function () {

            //If already online triggers a two-player disconnect
            if (String(playOnline.classList).indexOf("quitOnline") > -1) {
                theGame.forceDisconnect();
            } else {

                //If not online, starts online game search
                _$('.startOnline').classList.add("show");
                theGame = new OnlineGame(2);
            }
        }, false);

        //If ESC key pressed
        document.onkeydown = function (event) {

            //If during search modal, cancel search
            if (event.keyCode == KEYCODE_ESC && String(_$(".startOnline").classList).indexOf("show") > -1) {
                theGame.forceDisconnect();
                cancelSearchModal(false);
            }
        };

        //Cancel actual searching in socket/server
        _$(".cancelRandomSearch").addEventListener("click", function () {
            theGame.forceDisconnect();
            cancelSearchModal(true);
        }, false);

        //Add functionality to column buttons
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            var _loop = function _loop() {
                var column = _step2.value;

                column.addEventListener('click', function () {
                    for (var i = 0; i < columns.length; i++) {
                        if (columns[i] === column) {

                            //If the move is possible
                            if (theGame.isPossibleMove(i)) {

                                //Play move on board
                                theGame.playerMove(i + 1);
                                break;
                            } else {
                                console.log("Move not possible");
                            }
                        }
                    }
                }, false);
            };

            for (var _iterator2 = columns[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                _loop();
            }
        } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    _iterator2.return();
                }
            } finally {
                if (_didIteratorError2) {
                    throw _iteratorError2;
                }
            }
        }
    })();
}();

document.addEventListener("DOMContentLoaded", setup, false);
