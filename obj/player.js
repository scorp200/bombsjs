var server = typeof module !== "undefined";
var Player = (function() {
	if (server) {
		GridCollider = require('./../lib/gridcollider.js');
		Powerups = require('./powerups.js');
		Bomb = require('./bomb.js');
	}

	function createNet(box, vel, speed, slipSpeed, power, world, color, id) {
		var collider = GridCollider.create(box, slipSpeed, 0.01, power, world);
		var isDead = false;
		var index = 0;
		var newBox = Utils.createBox(box.x, box.y, box.w, box.h);

		function update(dt) {
			box.x += Utils.ease(box.x, newBox.x, 3);
			box.y += Utils.ease(box.y, newBox.y, 3);
			collider.move(vel, dt);
			world.updatePosition(player);
		}

		var player = {
			box: box,
			newBox: newBox,
			vel: vel,
			update: update,
			color: color,
			get local() { return false },
			get id() { return id },
			get isDead() { return isDead },
			set isDead(val) { isDead = val },
			get index() { return index },
			set index(val) { index = val },
			type: OBJECT_TYPE.PLAYER
		}
		world.updatePosition(player);
		return player;
	}

	function createLocal(box, speed, slipSpeed, keys, power, world, obj, color, id) {
		var vel = Utils.Vector2D(0, 0);
		var collider = GridCollider.create(box, slipSpeed, 0.01, power, world);
		var bombKey = false;
		var isDead = false;
		var index = 0;
		var powerups = Powerups.getDefauls();
		var _id;
		if (id)
			_id = id.id++;

		function update(dt) {
			var upspeed = speed + powerups[POWER_UPS.SPEED] * 0.7;
			if (keys[0].down) vel.y = -upspeed;
			else if (keys[1].down) vel.y = upspeed;
			else vel.y = 0;
			if (keys[2].down) vel.x = -upspeed;
			else if (keys[3].down) vel.x = upspeed;
			else vel.x = 0;
			if (keys[4].down && !bombKey) {
				bombKey = true;
				Bomb.create((box.x + box.w / 2) >> power, (box.y + box.h / 2) >> power, 3, power, world, obj, id);
			} else if (!keys[4].down) bombKey = false;
			collider.move(vel, dt);
			world.updatePosition(player);
		}

		var player = {
			box: box,
			vel: vel,
			keys: keys,
			update: update,
			color: color,
			powerups: powerups,
			get local() { return true },
			get id() { return _id },
			get isDead() { return isDead },
			set isDead(val) { isDead = val },
			get index() { return index },
			set index(val) { index = val },
			type: OBJECT_TYPE.PLAYER
		}
		world.updatePosition(player);
		obj.push(player);
		return player;
	}

	function draw(player) {
		ctx.fillStyle = player.color;
		var box = player.box;
		ctx.fillRect(box.x, box.y, box.w, box.h);
	}

	return {
		createLocal: createLocal,
		createNet: createNet,
		draw: draw
	}
})();
if (server) {
	module.exports = Player;
}
