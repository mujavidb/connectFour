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

            //TODO: add listener for gameMove

            // this.socket.on('onserverupdate', this.onUpdateRecieved.bind(this));

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
            //update playOnline button
            //tell players whose turn it is
        }
    }, {
        key: "onPlayerMove",
        value: function onPlayerMove(response) {
            if (response.restart) {
                this.internalRestart();
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
        key: "onDisconnection",
        value: function onDisconnection() {
            console.log(":: Sockets :: Disconnected from server");
            this.isOnline = false;
            this.player.id = null;
            this.player.number = null;
            this.opponent.number = null;
            //activate quitOnline setting
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
                var userInput = column;
                this.game.addDisc(this.currentPlayer, userInput);

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
        key: "internalRestart",
        value: function internalRestart() {
            console.log("Internal restart requested");
            this.socket.emit('playerMove', {
                gameID: this.gameID,
                column: 0,
                restart: true
            });
            this.game = new GameBoard(8, 6, 4);
            this.players = Array.from(Array(players), function (x, i) {
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
//TODO: Document
//TODO: Add github url
//TODO: Structure JS correctly
//TODO: Compatible for iOS8
//TODO: Add ability to play opponents online, yes
//TODO: Structure CSS, yes

function _$(x) {
    return document.querySelector(x);
}

function _$$(x) {
    return document.querySelectorAll(x);
}

var addDiscToBoard = void 0;

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

    function animateDiscDown(disc, y) {
        var finalLocation = 18 + (5 - y) * 94 + 7;
        var transitionSpeed = 'transform ' + 0.3 / 5 * (5 - y) + 's ease-in';
        disc.style.transition = transitionSpeed;
        setTimeout(function () {
            disc.style.transform = 'translateY(' + (finalLocation + 80) + 'px)';
        }, 20);
    }

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
        var highlight = createSVGHighlight(left, top, 94, 376, theGame.currentPlayer);
        winHighlightArea.appendChild(highlight);
    }

    function horizontalHighlight(x, y) {
        var height = 94;
        var width = 376; // 4 * 94
        var left = 18 + y * height;
        var top = 18 + (6 - x - 1) * height;
        var highlight = createSVGHighlight(left, top, 376, 94, theGame.currentPlayer);
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

    function restartGame(isOnline) {
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
            //new game
            if (isOnline) {
                if (theGame.isOnline) {
                    theGame.internalRestart();
                } else {
                    theGame = new OnlineGame(2);
                }
            } else {
                theGame = new OfflineGame(2);
            }
        }, 1500);
    }

    // Setup code
    (function () {
        window.addEventListener('resize', function () {
            ensureScreenSize();
        }, false);

        ensureScreenSize();

        restartButton.addEventListener('click', function () {
            restartGame(false);
        }, false);

        playOnline.addEventListener('click', function () {
            _$('.startOnline').classList.add("show");
        }, false);

        _$('.slideOptions_choices .random').addEventListener('click', function () {
            _$('.startOnline .slideOptions').classList.add('random');
            restartGame(true);
        }, false);

        _$(".cancelRandomSearch").addEventListener("click", function () {
            //cancel actual searching
            _$(".close").parentNode.classList.remove("show");
            _$('.startOnline .slideOptions').classList.remove('random');
            _$('.startOnline .slideOptions').classList.remove('friend');
        }, false);

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            var _loop = function _loop() {
                var button = _step2.value;

                button.addEventListener('click', function () {
                    button.parentNode.classList.remove("show");
                    _$('.startOnline .slideOptions').classList.remove('random');
                    _$('.startOnline .slideOptions').classList.remove('friend');
                }, false);
            };

            for (var _iterator2 = document.querySelectorAll('button.close')[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
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

        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
            var _loop2 = function _loop2() {
                var column = _step3.value;

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

            for (var _iterator3 = columns[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                _loop2();
            }
        } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                    _iterator3.return();
                }
            } finally {
                if (_didIteratorError3) {
                    throw _iteratorError3;
                }
            }
        }
    })();
}();

document.addEventListener("DOMContentLoaded", setup, false);
