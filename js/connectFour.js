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
    }, {
        key: "playerMove",
        value: function playerMove(column) {

            var userInput = parseInt(column);
            this.game.addDisc(this.currentPlayer, userInput);

            if (this.game.checkWin()) {
                console.log("Player " + this.currentPlayer + " wins!");
                this.winningSequence = this.game.winStatus;
                console.log(this.winningSequence);
                addDiscToBoard(this.game.lastMove, this.currentPlayer, this.game.height);
            } else {
                addDiscToBoard(this.game.lastMove, this.currentPlayer, this.game.height);
                this.currentPlayer == this.players.length ? this.currentPlayer = 1 : this.currentPlayer++;
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
    }, {
        key: "onConnection",
        value: function onConnection(response) {
            this.player.id = response.id;
            this.isOnline = true;
        }
    }, {
        key: "onGameStart",
        value: function onGameStart(response) {
            this.player.number = response.playerNumber;
            this.opponent.id = response.opponentID;
            this.opponent.number = response.opponentNumber;
            this.gameID = response.gameID;
            console.log(this.player);
            console.log(this.opponent);

            //clear the modal
            onlineGameSetup(this.player.number);
            setTimeout(function () {
                cancelSearchModal(false, true);
            }, 3000);
        }
    }, {
        key: "onPlayerMove",
        value: function onPlayerMove(response) {
            if (response.restart) {
                restartGame(true, false);
            } else if (response.column && response.gameID == this.gameID) {
                this.playerMove(response.column);
            }
        }
    }, {
        key: "onMessage",
        value: function onMessage(response) {
            console.log(response.details);
        }
    }, {
        key: "forceDisconnect",
        value: function forceDisconnect() {
            this.socket.disconnect();
        }
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
    }, {
        key: "playerMove",
        value: function playerMove(column) {
            if (this.game.isPossibleMove(column)) {
                this.game.addDisc(this.currentPlayer, column);

                //if own turn, then send current move to other player
                if (this.isOwnTurn()) {
                    this.socket.emit('playerMove', {
                        gameID: this.gameID,
                        column: column,
                        restart: false
                    });
                }

                //check if the move won the game
                if (this.game.checkWin()) {
                    console.log("Player " + this.currentPlayer + " wins!");
                    this.winningSequence = this.game.winStatus;
                    console.log(this.winningSequence);
                    addDiscToBoard(this.game.lastMove, this.currentPlayer, this.game.height);
                } else {
                    addDiscToBoard(this.game.lastMove, this.currentPlayer, this.game.height);
                    this.currentPlayer == this.players.length ? this.currentPlayer = 1 : this.currentPlayer++;
                }
            }
        }
    }, {
        key: "requestRestart",
        value: function requestRestart() {
            this.socket.emit('playerMove', {
                gameID: this.gameID,
                column: 0,
                restart: true
            });
        }
    }, {
        key: "internalRestart",
        value: function internalRestart(sender) {
            console.log("Internal restart requested");
            this.game = new GameBoard(8, 6, 4);
            this.players = Array.from(Array(2), function (x, i) {
                return i + 1;
            });
            this.winningSequence = {};
            this.currentPlayer = 1;
            //flip coin to see who goes first
        }
    }]);

    return OnlineGame;
}();
'use strict';

//TODO: Internationalise
//TODO: Add move authentication
//TODO: Document
//TODO: Add github url
//TODO: Compatible for iOS8
//TODO: Structure CSS
//TODO: Allow for minification of selectors and variables across all files
//TODO: Add gone offline notification
//TODO: Find all bugs and edge-cases

function _$(x) {
    return document.querySelector(x);
}

function _$$(x) {
    return document.querySelectorAll(x);
}

function _f(selected, modifier) {
    Array.prototype.forEach.call(selected, modifier);
}

function p(x) {
    console.log(x);
}

var addDiscToBoard = null;
var restartGame = null;
var cancelSearchModal = null;
var onlineGameSetup = null;

var setup = function () {

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

    addDiscToBoard = function addDiscToBoard(location, player, maxHeight) {
        var disc = document.createElementNS(svgNS, "image");
        disc.setAttributeNS("http://www.w3.org/1999/xlink", "href", player == 1 ? "img/red_disc.svg" : "img/yellow_disc.svg");
        disc.setAttribute("x", '' + (18 + location[1] * 94 + 7));
        disc.setAttribute("y", "-80");
        disc.setAttribute("width", "80");
        disc.setAttribute("height", "80");
        discArea.appendChild(disc);
        animateDiscDown(disc, location[0]);

        setTimeout(function () {
            if (theGame.winningSequence.type) {
                connectFourArea.classList.add("deselectAll");
                document.body.classList.add(player == 1 ? "redWin" : "yellowWin");
                highlightWin(theGame.winningSequence.type, theGame.winningSequence.x, theGame.winningSequence.y);
                if (player == 1) {
                    redScore.innerHTML = '' + (parseInt(redScore.innerHTML) + 1);
                } else {
                    yellowScore.innerHTML = '' + (parseInt(yellowScore.innerHTML) + 1);
                }
            } else {
                if (location[0] == maxHeight - 1) {
                    columns[location[1]].classList.add("deselect");
                }
                document.body.classList.toggle("switch");
            }
        }, 100 + 300 / 5 * (5 - location[0]));
    };

    function animateDiscDown(disc, y) {
        var finalLocation = 18 + (5 - y) * 94 + 7;
        var transitionSpeed = 'transform ' + 0.3 / 5 * (5 - y) + 's ease-in';
        disc.style.transition = transitionSpeed;
        setTimeout(function () {
            disc.style.transform = 'translateY(' + (finalLocation + 80) + 'px)';
        }, 20);
    }

    function ensureScreenSize() {
        if (screen.width < 320) {
            _$(".screenSize").classList.add("show");
        } else {
            _$(".screenSize").classList.remove("show");
        }
    }

    function highlightWin(type, x, y) {
        type == "H" ? horizontalHighlight(x, y) : type == "V" ? verticalHighlight(x, y) : diagonalHighlight(x, y, type == "RL" ? 135 : 45);
    }

    function createSVGHighlight(x, y, width, height, player) {
        var highlight = document.createElementNS(svgNS, "rect");
        var styles = "";
        highlight.setAttributeNS(null, "x", '' + x);
        highlight.setAttributeNS(null, "y", '' + y);
        highlight.setAttributeNS(null, "rx", "47");
        highlight.setAttributeNS(null, "ry", "47");
        highlight.setAttributeNS(null, "width", '' + width);
        highlight.setAttributeNS(null, "height", '' + height);
        styles += 'fill: ' + (player == 1 ? "rgba(240, 70, 95, 0.5)" : "rgba(215, 200, 40, 0.4)") + ';';
        styles += 'stroke: none;';
        highlight.setAttributeNS(null, "style", styles);
        return highlight;
    }

    function verticalHighlight(x, y) {
        var height = 376; // 4 * 94
        var width = 94;
        var boardHeight = 564;
        var left = 18 + x * width;
        var top = 18 + boardHeight - height - y * 94;
        var highlight = createSVGHighlight(left, top, width, height, theGame.currentPlayer);
        winHighlightArea.appendChild(highlight);
    }

    function horizontalHighlight(x, y) {
        var height = 94;
        var width = 376; // 4 * 94
        var left = 18 + y * height;
        var top = 18 + (6 - x - 1) * height;
        var highlight = createSVGHighlight(left, top, width, height, theGame.currentPlayer);
        winHighlightArea.appendChild(highlight);
    }

    function diagonalHighlight(x, y, angle) {
        var width = 494;
        var height = 94;
        var left = 18 + y * height;
        var top = 18 + (6 - x - 1) * height;
        var highlight = createSVGHighlight(left, top, width, height, theGame.currentPlayer);
        var transform = document.createElementNS(svgNS, "g");
        transform.setAttributeNS(null, "transform", 'rotate(' + angle + ' ' + (left + 47) + ' ' + (top + 47) + ')');
        transform.appendChild(highlight);
        winHighlightArea.appendChild(transform);
    }

    restartGame = function restartGame(isOnline) {
        var didInitiateRestart = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

        restartButton.disabled = true;

        //remove highlights
        while (winHighlightArea.firstChild) {
            winHighlightArea.removeChild(winHighlightArea.firstChild);
        } //animate discs down and out
        discArea.classList.add("moveOut");
        perspective.classList.add("active");

        setTimeout(function () {
            restartButton.disabled = false;
            //remove discs
            while (discArea.firstChild) {
                discArea.removeChild(discArea.firstChild);
            }discArea.classList.remove("moveOut");
            perspective.classList.remove("active");
            //remove deslectAll
            connectFourArea.classList.remove("deselectAll");
            //remove all deselects
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = discArea.childNodes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var disc = _step.value;

                    disc.classList.remove("deselect");
                }
                //remove win classes and return to normal
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
            //start a new game in model
            if (isOnline) {
                if (theGame.isOnline) {
                    if (didInitiateRestart) {
                        theGame.requestRestart();
                    }
                    theGame.internalRestart();
                } else {
                    theGame = new OnlineGame(2);
                }
            } else {
                if (String(playOnline.classList).indexOf("quitOnline") > -1) {
                    redScore.innerHTML = "0";
                    yellowScore.innerHTML = "0";
                    playOnline.classList.remove("quitOnline");
                    playOnline.innerHTML = "Play Online";
                }
                theGame = new OfflineGame(2);
            }
        }, 1500);
    };

    cancelSearchModal = function cancelSearchModal(cancelGame) {
        var goOnline = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

        _$(".startOnline").classList.remove("show");
        if (cancelGame) {
            // theGame.isOnline ? theGame = new OnlineGame(2) : theGame = new OfflineGame(2)
        } else if (goOnline) {
            redScore.innerHTML = "0";
            yellowScore.innerHTML = "0";
            playOnline.classList.add("quitOnline");
            playOnline.innerHTML = "Quit Online";
            restartGame(true);
        }
    };

    onlineGameSetup = function onlineGameSetup(playerNumber) {
        _$(".slideRandom").classList.add("online");
        if (playerNumber == 1) {
            _$("#playerStartInfo").innerHTML = "You are playing as Red, starting first";
            _$(".gameFound").classList.add("playerOne");
        } else {
            _$("#playerStartInfo").innerHTML = "You are playing as Yellow, starting second";
            _$(".gameFound").classList.add("playerTwo");
        }
        setTimeout(function () {
            _$(".slideRandom").classList.remove("online");
            _$(".gameFound").classList.remove("playerOne");
            _$(".gameFound").classList.remove("playerTwo");
        }, 4000);
    };

    // Setup code i.e. bind all event listeners
    (function () {

        ensureScreenSize();
        restartButton.disabled = false;

        window.addEventListener('resize', function () {
            ensureScreenSize();
        }, false);

        restartButton.addEventListener('click', function () {
            restartGame(theGame.isOnline);
        }, false);

        playOnline.addEventListener('click', function () {
            if (String(playOnline.classList).indexOf("quitOnline") > -1) {
                theGame.forceDisconnect();
            } else {
                _$('.startOnline').classList.add("show");
                theGame = new OnlineGame(2);
            }
        }, false);

        document.onkeydown = function (event) {
            if (event.keyCode == KEYCODE_ESC && String(_$(".startOnline").classList).indexOf("show") > -1) {
                theGame.forceDisconnect();
                cancelSearchModal(false);
            }
        };

        _$(".cancelRandomSearch").addEventListener("click", function () {
            //cancel actual searching in socket/server
            theGame.forceDisconnect();
            cancelSearchModal(true);
        }, false);

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            var _loop = function _loop() {
                var column = _step2.value;

                column.addEventListener('click', function () {
                    for (var i = 0; i < columns.length; i++) {
                        if (columns[i] === column) {
                            if (theGame.isPossibleMove(i)) {
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
