"use strict";

class gameBoard {
	
	constructor(width, height, connectWin){
		this.width = width;
		this.height = height;
		this.board = Array.from(Array(8), x => Array.from(Array(8), x => 0));
		this.connectWin = connectWin;
	}

	//TODO: improve this algorithm
	isPossibleMove(disc, column){
		let i = 0;
		while(this.board[i][column] != 0 && i < this.height) i++;
		if (i < 0){
			console.log("Impossible move");
			return false;
		} else {
			return true;
		}
	}

	addDisc(disc, column){
		column -= 1;
		if (this.isPossibleMove(disc, column)) {
			let i = 0;
			while(this.board[i][column] != 0 && i < this.height) i++;
			this.board[i][column] = disc;
			this.checkWin();
		}
	}

	boardState(){
		console.log(this.board);
	}

	checkHorizontal(){
		for (var i = 0; i < this.height; i++){
			var previousItem = null;
			var sequenceStart = null;
			var sequenceLength = 0;
			for (var j = 0; j < this.width; j++){
				if (this.board[i][j] != 0){
					if (this.board[i][j] == previousItem){
						sequenceLength += 1;
					} else {
						previousItem = this.board[i][j];
						sequenceLength = 1;
						sequenceStart = j;
					}
				}
			}
			if (sequenceLength >= this.connectWin){
				console.log(["H", i, sequenceStart]);
				return;
			}
		}
	}

	checkVertical(){
		for (var i = 0; i < this.width; i++){
			var previousItem = null;
			var sequenceStart = null;
			var sequenceLength = 0;
			for (var j = 0; j < this.height; j++){
				if (this.board[j][i] != 0){
					if (this.board[j][i] == previousItem){
						sequenceLength += 1;
					} else {
						previousItem = this.board[j][i];
						sequenceLength = 1;
						sequenceStart = j;
					}
				}
			}
			if (sequenceLength >= this.connectWin){
				console.log([ "V", sequenceStart, i]);
				return;
			}
		}
	}

	checkLeftRightDiagonal(){
		for (var k = this.connectWin - 1; k < this.height; k++){
			for (var i = 0; i < this.width - this.connectWin + 1; i++){
				let m = k;
				var previousItem = null;
				var sequenceStart = null;
				var sequenceLength = 0;
				for (let j = 0 + i; j < (k + i + 1) && j < this.height - 1; j++, m--){
					if (this.board[m][j] != 0){
						if (this.board[m][j] == previousItem){
							sequenceLength += 1;
						} else {
							previousItem = this.board[m][j];
							sequenceLength = 1;
							sequenceStart = j;
						}
					}
				}
				if (sequenceLength >= this.connectWin){
					console.log([ "LR", k, sequenceStart]);
					return;
				}
			}
		}	
	}

	checkRightLeftDiagonal(){
		for (var k = this.connectWin - 1; k < this.height; k++){
			for (var i = 0; i < this.width - this.connectWin + 1; i++){
				let m = k;
				var previousItem = null;
				var sequenceStart = null;
				var sequenceLength = 0;
				for (let j = this.width - i - 1; j >= 0 && m >= 0; j--, m--){
					if (this.board[m][j] != 0){
						if (this.board[m][j] == previousItem){
							sequenceLength += 1;
						} else {
							previousItem = this.board[m][j];
							sequenceLength = 1;
							sequenceStart = j;
						}
					}
				}
				if (sequenceLength >= this.connectWin){
					console.log([ "RL", k, sequenceStart]);
					return;
				}
			}
		}
	}

	checkWin(){
		this.checkHorizontal();
		this.checkVertical();
		this.checkLeftRightDiagonal();
		this.checkRightLeftDiagonal();
	}
}

var newGame = new gameBoard(8, 8, 4);
newGame.addDisc(1, 5);
newGame.addDisc(1, 6);
newGame.addDisc(1, 7);
newGame.addDisc(1, 4);
newGame.addDisc(1, 5);
newGame.addDisc(1, 6);
newGame.addDisc(1, 7);
newGame.addDisc(2, 4);
newGame.addDisc(1, 5);
newGame.addDisc(1, 6);
newGame.addDisc(1, 7);
newGame.addDisc(2, 4);
newGame.addDisc(1, 5);
newGame.addDisc(1, 4);
newGame.addDisc(1, 6);
newGame.addDisc(1, 7);
newGame.addDisc(2, 4);

newGame.boardState();