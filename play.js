"use strict";
class Play {

	constructor(players){
		this.game = new GameBoard(8, 8, 4);
		this.players = Array.from(Array(players), (x, i) => i + 1);
	}

}

new Play(2);