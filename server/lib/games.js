module.exports = function(clients, lobby) {
	const World = require('./../../lib/world.js');
	const Player = require('./../../obj/player.js');
	var game = this;
	var players = [];
	var obj = [];
	var world = World.generateWorld(6);
	var startPos = [{ x: 1 * world.size, y: 1 * world.size }, { x: (world.width - 2) * world.size, y: (world.height - 2) * world.size }];
	var colors = [Utils.getHSL(48, 100, 50), Utils.getHSL(168, 100, 50)];
	var tickInterval = 1000 / 64;
	for (var i = 0, u = clients.length; i < u; i++) {
		var conn = clients[i];
		sendToClient(conn, {
			world: world.world,
			width: world.width,
			height: world.height,
			power: world.power,
			size: world.size
		})
		players[i] = Player.createLocal(Utils.createBox(startPos[i].x, startPos[i].y, world.size, world.size), 4, 2, conn.keys, world.power, world, obj, colors[i]);
	}
	console.log('Lobby ' + lobby.index + ' is Starting a new Game');

	function update() {
		for (var i = 0, u = obj.length; i < u; i++) {
			obj[i].update(1);
		}
		obj.forEach(function(e, i) {
			if (e.isDead) {
				obj[i] = obj[obj.length - 1];
				obj.length--;
			}
		});
		updateClients();
	}

	function updateClients() {
		var updates = [];
		for (var x = 0, i = obj.length; x < i; x++) {
			updates.push({ box: obj[x].box, vel: obj[x].vel, id: x, type: obj.type });
		}
		for (var i = 0, u = clients.length; i < u; i++) {
			sendToClient(clients[i], { updates: updates });
		}
	}
	setInterval(update, tickInterval);


}
