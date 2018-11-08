module.exports = function(clients, lobby) {
	const World = require('./../../lib/world.js');
	const Player = require('./../../obj/player.js');
	var game = this;
	var players = [];
	var obj = [];
	var objID = { id: 0 };
	var world = World.generateWorld(6);
	var startPos = [{ x: 1 * world.size, y: 1 * world.size },
		{ x: (world.width - 2) * world.size, y: 1 * world.size },
		{ x: (world.width - 2) * world.size, y: (world.height - 2) * world.size },
		{ x: 1 * world.size, y: (world.height - 2) * world.size }
	];
	var colors = [Utils.getHSL(48, 100, 50), Utils.getHSL(168, 100, 50)];
	var tickInterval = 1000 / 64;
	var sendTick = 0;
	var lastTick;
	var updates = [];
	for (var i = 0, u = clients.length; i < u; i++) {
		var conn = clients[i];
		sendToClient(conn, {
			world: world.world,
			width: world.width,
			height: world.height,
			power: world.power,
			size: world.size
		})
		players[i] = Player.createLocal(Utils.createBox(startPos[i].x, startPos[i].y, world.size, world.size), 3, 1, conn.keys, world.power, world, obj, colors[i], objID);
	}
	console.log('Lobby ' + lobby.index + ' is Starting a new Game');
	var test = Date.now();

	function tick() {
		var now = Date.now();
		var dt = now - lastTick;
		lastTick = now;
		update(dt / 10);
		sendTick += dt;
		if (sendTick >= 20) {
			sendTick = 0;
			updateClients()
		}
	}

	function update(dt) {
		for (var i = 0, u = obj.length; i < u; i++) {
			obj[i].update(dt, updates);
		}
		obj.forEach(function(e, i) {
			if (e.isDead) {
				updates.push({ remove: e.id });
				obj[i] = obj[obj.length - 1];
				obj.length--;
			}
		});
	}

	function updateClients() {
		for (var x = 0, i = obj.length; x < i; x++) {
			var temp = obj[x];
			updates.push({ update: { box: temp.box, vel: temp.vel, id: temp.id, color: temp.color, type: temp.type } });
		}
		for (var i = 0, u = clients.length; i < u; i++) {
			sendToClient(clients[i], { updates: updates });
		}
		updates.length = 0;
	}
	lastTick = Date.now();
	setInterval(tick, tickInterval);
	//setInterval(updateClients, serverTickInterval);


}
