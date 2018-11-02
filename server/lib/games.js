module.exports = function(clients, lobby) {
	const World = require('./../../lib/world.js');
	const Player = require('./../../obj/player.js');
	var game = this;
	var players = [];
	var obj = [];
	var objID = { id: 0 };
	var world = World.generateWorld(6);
	var startPos = [{ x: 1 * world.size, y: 1 * world.size }, { x: (world.width - 2) * world.size, y: (world.height - 2) * world.size }];
	var colors = [Utils.getHSL(48, 100, 50), Utils.getHSL(168, 100, 50)];
	var tickInterval = 1000 / 64;
	var serverTickInterval = 1000 / 20;
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
		players[i] = Player.createLocal(Utils.createBox(startPos[i].x, startPos[i].y, world.size, world.size), 4, 2, conn.keys, world.power, world, obj, colors[i], objID);
	}
	console.log('Lobby ' + lobby.index + ' is Starting a new Game');
	var sendTick = 3;

	function update() {
		for (var i = 0, u = obj.length; i < u; i++) {
			obj[i].update(1, updates);
		}
		obj.forEach(function(e, i) {
			if (e.isDead) {
				obj[i] = obj[obj.length - 1];
				obj.length--;
			}
		});
		if (sendTick-- <= 0) {
			updateClients()
			sendTick = 3;
		}
	}

	function updateClients() {
		for (var x = 0, i = obj.length; x < i; x++) {
			var temp = obj[x];
			updates.push({ object: { box: temp.box, vel: temp.vel, id: temp.id, color: temp.color } });
			/*switch (temp.type) {
				case OBJECT_TYPE.PLAYER:
					updates.push({ object: { box: temp.box, vel: temp.vel, id: temp.id, type: temp.type, color: temp.color } });
					break;
				case OBJECT_TYPE.BOMB:
					updates.push({ object: { box: temp.box, vel: temp.vel, level: temp.level, bombTimer: temp.bombTimer, id: temp.id, type: temp.type } });
					break;
				case OBJECT_TYPE.EXPLOSION:
					updates.push({ object: { box: temp.box, explosiontimer: temp.explosiontimer, id: temp.id, type: temp.type } });
					break;
				default:

			}*/
		}
		for (var i = 0, u = clients.length; i < u; i++) {
			sendToClient(clients[i], { updates: updates });
		}
		updates.length = 0;
	}
	setInterval(update, tickInterval);
	//setInterval(updateClients, serverTickInterval);


}
