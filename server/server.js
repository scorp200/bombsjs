const ws = require('ws');
const Lobby = require('./lib/lobby.js');
require('./../lib/constants.js');
global.Utils = require('./../lib/utils.js');
global.sendToClient = function(conn, data) {
	try {
		conn.send(JSON.stringify(data));
	} catch (e) {
		console.log(e);
	}
}
var clients = [];
var port = 8667;
//var game = new Game(6, clients);
Lobby.createLobby();
var server = new ws.Server({
	port: port
}, function() {
	console.log('Websockets server up on port ' + port);
});
server.on('connection', function(conn) {
	var cid = ArrayIndexOf(clients, undefined);
	cid = cid == -1 ? clients.length : cid;
	console.log('Client ' + cid + ' has connected');
	conn.id = cid;
	conn.keys = getKeys();
	clients[cid] = conn;
	//sendToClient(conn, { world: game.world, start: game.startPos[cid] });
	conn.on('message', function(msg) {
		var data = JSON.parse(msg);
		if (data.keys) {
			for (var i = 0, u = conn.keys.length; i < u; i++) {
				conn.keys[i].down = data.keys[i].down;
			}
		}
		if (data.join) {
			if (data.join.random) {
				Lobby.findLobby(conn);
			}
		}
	});

	conn.on('close', function() {
		delete clients[cid];
		console.log('Client ' + cid + ' has left.')
	});
});

/**
 * array.indexOf that can find undefined VALUES
 * @param {array} arr
 * @param {*} what
 */
ArrayIndexOf = function(arr, what) {
	for (var i = 0, last = arr.length; i < last; i++) {
		if (arr[i] === what)
			return i;
	}
	return -1;
}

function getKeys() {
	return [
		{ down: false },
		{ down: false },
		{ down: false },
		{ down: false },
		{ down: false },
		{ down: false }
	]
}
