"use strict";

class GameBoard {

    constructor(width, height, connectWin) {
        this.width = width;
        this.height = height;
        this.board = Array.from(Array(height), x => Array.from(Array(width), x => 0));
        this.connectWin = connectWin;
        this.winStatus = null;
        this.lastMove = [];
    }

    isPossibleMove(column) {
        if (this.winStatus) {
            return false;
        }
        let i = 0;
        while (i < this.height && this.board[i][column] != 0) i++;
        return i < 0 || i == this.height ? false : true;
    }

    addDisc(disc, column) {
        column -= 1;
        if (this.isPossibleMove(column)) {
            let i = 0;
            while (this.board[i][column] != 0) i++;
            this.board[i][column] = disc;
            this.lastMove = [i, column];
            return true;
        } else {
            return false;
        }
    }

    boardState() {
        console.log();
        for (let line of this.board) {
            let lineString = "";
            for (let element of line) {
                lineString += ` ${ element } `;
            }
            console.log(lineString);
        }
        console.log(`${ new Array(3 * this.width).fill("-").join("") }`);
        let numberString = "";
        for (let i = 1; i <= this.width; i++) {
            numberString += ` ${ i } `;
        }
        console.log(numberString);
        console.log();
        console.log();
    }

    checkHorizontal() {
        var previousItem;
        var sequenceStart;
        var sequenceLength;
        for (var i = 0; i < this.height; i++) {
            previousItem = null;
            sequenceStart = null;
            sequenceLength = 0;
            for (var j = 0; j < this.width; j++) {
                if (sequenceLength == this.connectWin) {
                    console.log(["H", i, sequenceStart]);
                    this.winStatus = {
                        type: "H",
                        x: i,
                        y: sequenceStart
                    };
                    return true;
                }
                if (this.board[i][j] != 0) {
                    if (this.board[i][j] == previousItem) {
                        sequenceLength += 1;
                    } else {
                        previousItem = this.board[i][j];
                        sequenceLength = 1;
                        sequenceStart = j;
                    }
                } else {
                    //TODO: DRY this block out
                    previousItem = this.board[i][j];
                    sequenceLength = 1;
                    sequenceStart = j;
                }
            }
        }
        return false;
    }

    checkVertical() {
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
            }
            if (sequenceLength >= this.connectWin) {
                this.winStatus = {
                    type: "V",
                    x: sequenceStart,
                    y: i
                };
                return true;
            }
        }
        return false;
    }

    checkLeftRightDiagonal() {
        for (var k = this.connectWin - 1; k < this.height; k++) {
            for (var i = 0; i < this.width - this.connectWin + 1; i++) {
                let m = k;
                var previousItem = null;
                var sequenceStart = null;
                var sequenceLength = 0;
                for (let j = i; j < this.width && m >= 0; j++, m--) {
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
        return false;
    }

    checkRightLeftDiagonal() {
        for (var k = this.connectWin - 1; k < this.height; k++) {
            for (var i = 0; i < this.width - this.connectWin + 1; i++) {
                let m = k;
                var previousItem = null;
                var sequenceStart = null;
                var sequenceLength = 0;
                for (let j = this.width - i - 1; j >= 0 && m >= 0; j--, m--) {
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
        return false;
    }

    checkWin() {
        if (this.checkHorizontal() || this.checkVertical() || this.checkLeftRightDiagonal() || this.checkRightLeftDiagonal()) {
            return true;
        } else {
            return false;
        }
    }
}
"use strict";

class Play {

    constructor(players) {
        this.game = new GameBoard(8, 6, 4);
        this.players = Array.from(Array(players), (x, i) => i + 1);
        this.winningSequence = {};
        this.currentPlayer = 1;

        this.game.boardState();
        console.log(`Player ${ this.currentPlayer } to move`);
    }

    isPossibleMove(column) {
        return this.game.isPossibleMove(column);
    }

    playerMove(column) {

        let userInput = parseInt(column);
        this.game.addDisc(this.currentPlayer, userInput);

        if (this.game.checkWin()) {
            console.log(`Player ${ this.currentPlayer } wins!`);
            this.winningSequence = this.game.winStatus;
            console.log(this.winningSequence);
            addDiscToBoard(this.game.lastMove, this.currentPlayer, this.game.height);
        } else {
            addDiscToBoard(this.game.lastMove, this.currentPlayer, this.game.height);
            this.currentPlayer == this.players.length ? this.currentPlayer = 1 : this.currentPlayer++;
            console.log(`Player ${ this.currentPlayer } to move`);
        }
    }
}

//horizontal tested
//vertical tested
//rl diagonal tested
//lr diagonal tested

// theGame.playerMove(4)
// theGame.playerMove(3)
//
// theGame.playerMove(3)
// theGame.playerMove(2)
//
// theGame.playerMove(2)
// theGame.playerMove(1)
//
// theGame.playerMove(2)
// theGame.playerMove(1)
//
// theGame.playerMove(1)
// theGame.playerMove(6)
//
// theGame.playerMove(1)
//ViewController

let theGame = new Play(2);

var connectFourArea = document.querySelector('.connectFourBoard');
var columns = document.querySelectorAll('.connectFourBoard .column');
var discArea = document.querySelector('.discArea');

let previousPosition = connectFourArea.getBoundingClientRect();

window.addEventListener('resize', () => {
    let newBasePosition = connectFourArea.getBoundingClientRect();
    let discsInBoard = discArea.childNodes;
    let leftAdjust = parseFloat(newBasePosition.left) - parseFloat(previousPosition.left);

    Array.prototype.forEach.call(discsInBoard, disc => {
        disc.style.left = `${ parseFloat(disc.style.left.slice(0, -2)) + leftAdjust }px`;
    });

    previousPosition = newBasePosition;
}, false);

Array.prototype.forEach.call(columns, column => {
    column.addEventListener('click', () => {
        for (let i = 0; i < columns.length; i++) {
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
});

function addDiscToBoard(location, player, maxHeight) {
    let disc = document.createElement("img");
    let basePosition = connectFourArea.getBoundingClientRect();
    disc.classList.add("disc");
    disc.style.top = `${ basePosition.top + 15 + (5 - location[0]) * 94 + 7 }px`;
    disc.style.left = `${ basePosition.left + 15 + location[1] * 94 + 7 }px`;
    disc.src = player == 1 ? "img/red_disc.png" : "img/yellow_disc.png";
    discArea.appendChild(disc);

    if (theGame.winningSequence.type) {
        document.getElementsByClassName("connectFourBoard")[0].classList.add("deselectAll");
        document.body.classList.add(player == 1 ? "redWin" : "yellowWin");
    } else {
        if (location[0] == maxHeight - 1) {
            columns[location[1]].classList.add("deselect");
        }
        document.body.classList.toggle("switch");
    }
}
