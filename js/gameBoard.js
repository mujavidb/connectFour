"use strict"

class GameBoard {

    constructor(width, height, connectWin) {
        this.width = width
        this.height = height
        this.board = Array.from(Array(height), x => Array.from(Array(width), x => 0))
        this.connectWin = connectWin
        this.winStatus = null
		this.lastMove = []
    }

    isPossibleMove(column) {
		if (this.winStatus) {
			return false
		}
        let i = 0
        while (i < this.height && this.board[i][column] != 0) i++
        return (i < 0 || i == this.height) ? false : true
    }

    addDisc(disc, column) {
        column -= 1
        if (this.isPossibleMove(column)) {
            let i = 0
            while (this.board[i][column] != 0) i++
            this.board[i][column] = disc
			this.lastMove = [i, column]
            return true
        } else {
            return false
        }
    }

    boardState() {
        console.log()
        for (let line of this.board) {
			let lineString = ""
            for (let element of line) {
                lineString += ` ${element} `
            }
			console.log(lineString)
        }
        console.log(`${new Array(3 * this.width).fill("-").join("")}`)
		let numberString = ""
        for (let i = 1; i <= this.width; i++) {
            numberString += ` ${i} `
        }
        console.log(numberString)
        console.log()
        console.log()
    }

    checkHorizontal() {
		var previousItem
		var sequenceStart
		var sequenceLength
        for (var i = 0; i < this.height; i++) {
            previousItem = null
            sequenceStart = null
            sequenceLength = 0
            for (var j = 0; j < this.width; j++) {
				if (sequenceLength == this.connectWin) {
	                console.log(["H", i, sequenceStart])
	                this.winStatus = {
	                    type: "H",
	                    x: i,
	                    y: sequenceStart
	                }
	                return true
	            }
                if (this.board[i][j] != 0) {
                    if (this.board[i][j] == previousItem) {
                        sequenceLength += 1
                    } else {
                        previousItem = this.board[i][j]
                        sequenceLength = 1
                        sequenceStart = j
                    }
                } else {
                    //TODO: DRY this block out
                    previousItem = this.board[i][j]
                    sequenceLength = 1
                    sequenceStart = j
                }
            }
        }
        return false
    }

    checkVertical() {
        for (var i = 0; i < this.width; i++) {
            var previousItem = null
            var sequenceStart = null
            var sequenceLength = 0
            for (var j = 0; j < this.height; j++) {
                if (this.board[j][i] != 0) {
                    if (this.board[j][i] == previousItem) {
                        sequenceLength += 1
                    } else {
                        previousItem = this.board[j][i]
                        sequenceLength = 1
                        sequenceStart = j
                    }
                } else {
                    previousItem = this.board[j][i]
                    sequenceLength = 1
                    sequenceStart = j
                }
            }
            if (sequenceLength >= this.connectWin) {
                this.winStatus = {
                    type: "V",
                    x: sequenceStart,
                    y: i
                }
                return true
            }
        }
        return false
    }

    checkLeftRightDiagonal() {
        for (var k = this.connectWin - 1; k < this.height; k++) {
            for (var i = 0; i < this.width - this.connectWin + 1; i++) {
                let m = k
                var previousItem = null
                var sequenceStart = null
                var sequenceLength = 0
                for (let j = i; j < this.width && m >= 0; j++, m--) {
                    if (this.board[m][j] != 0) {
                        if (this.board[m][j] == previousItem) {
                            sequenceLength += 1
                        } else {
                            previousItem = this.board[m][j]
                            sequenceLength = 1
                            sequenceStart = j
                        }
                    } else {
						previousItem = this.board[m][j]
						sequenceLength = 1
						sequenceStart = j
					}
                }
                if (sequenceLength >= this.connectWin) {
                    this.winStatus = {
                        type: "LR",
                        x: k,
                        y: sequenceStart
                    }
                    return true
                }
            }
        }
        return false
    }

    checkRightLeftDiagonal() {
        for (var k = this.connectWin - 1; k < this.height; k++) {
            for (var i = 0; i < this.width - this.connectWin + 1; i++) {
                let m = k
                var previousItem = null
                var sequenceStart = null
                var sequenceLength = 0
                for (let j = this.width - i - 1; j >= 0 && m >= 0; j--, m--) {
                    if (this.board[m][j] != 0) {
                        if (this.board[m][j] == previousItem) {
                            sequenceLength += 1
                        } else {
                            previousItem = this.board[m][j]
                            sequenceLength = 1
                            sequenceStart = j
                        }
                    } else {
						previousItem = this.board[m][j]
						sequenceLength = 1
						sequenceStart = j
					}
                }
                if (sequenceLength >= this.connectWin) {
                    this.winStatus = {
                        type: "RL",
                        x: k,
                        y: sequenceStart
                    }
                    return true
                }
            }
        }
        return false
    }

    checkWin() {
        if (this.checkHorizontal() || this.checkVertical() ||
            this.checkLeftRightDiagonal() || this.checkRightLeftDiagonal()) {
            return true
        } else {
            return false
        }
    }
}
