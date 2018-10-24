var Lobby = (function() {
	const Game = require('./games.js');
	var lobbies = [];
	var fullLobbies = [];

	function createLobby() {
		var players = [];
		var index = lobbies.length;
		var game = null;

		function addPlayer(conn) {
			console.log('Player ' + conn.id + ' has joined lobby ' + index);
			players.push(conn)
			//Remember to change to 4 for full game
			if (players.length >= 2) {
				var sLobby = lobbies[lobbies.length - 1];
				lobbies[index] = sLobby;
				sLobby.index = index;
				lobbies.length--;
				index = fullLobbies.length;
				fullLobbies.push(lobby);
				startGame();
			}
		}

		function startGame() {
			game = new Game(players, lobby);
		}

		var lobby = {
			get numPlayers() { return players.length },
			index: index,
			addPlayer: addPlayer
		}
		lobbies.push(lobby);
		return lobby;
	}

	function findLobby(conn) {
		for (var i = 0, u = lobbies.length; i < u; i++) {
			if (lobbies[i].numPlayers < 4) { lobbies[i].addPlayer(conn); return; }
		}
		var lobby = createLobby();
		lobby.addPlayer(conn);
	}

	return {
		createLobby: createLobby,
		findLobby: findLobby
	}
})();

module.exports = Lobby;
