var server = typeof module !== "undefined";
var Bomb = (function() {
	if (server) {
		Powerups = require('./powerups.js');
		Explosion = require('./explosion.js');
		GridCollider = require('./../lib/gridcollider.js');
	}

	function create(x, y, level, power, world, obj, id) {
		var cell = world.getCellAt(x, y);
		if (cell == WORLD_INDEX.FLOOR) {
			//world.setCellAt(x, y, 3,updates);
			var vel = Utils.Vector2D(0, 0);
			var bombTimer = 100;
			var box = Utils.createBox(x << power, y << power, world.size, world.size);
			var collider = GridCollider.create(box, 0, 0.01, power, world);
			var isDead = false;
			var index = 0;
			var _id;
			if (id)
				_id = id.id++;

			function update(dt, updates) {
				var x = (box.x + box.w / 2) >> power;
				var y = (box.y + box.h / 2) >> power;
				if (world.getCellAt(x, y) != WORLD_INDEX.BOMB) {
					var objects = world.getObjectsNearby(bomb);
					var change = true;
					for (var i = 0, u = objects.length; i < u; i++) {
						var obj = objects[i];
						if (obj.type == OBJECT_TYPE.PLAYER && Utils.boxIntersectObject(box, obj.box)) {
							change = false;
							vel.x = vel.y = 0;
						}
					}
					if (change)
						world.setCellAt(x, y, WORLD_INDEX.BOMB, updates);
				}
				if (--bombTimer <= 0) {
					world.setCellAt(x, y, WORLD_INDEX.FLOOR, updates);
					bomb.isDead = true;
					//up
					for (var i = 0; - i < level; i--) {
						if (explode(x, y + i, updates)) break;
					}
					//down
					for (var i = 0; i < level; i++) {
						if (explode(x, y + i, updates)) break;
					}
					//left
					for (var i = 0; - i < level; i--) {
						if (explode(x + i, y, updates)) break;
					}
					//right
					for (var i = 0; i < level; i++) {
						if (explode(x + i, y, updates)) break;
					}
				}
				collider.move(vel, dt);
				world.updatePosition(bomb);
			}

			function explode(x, y, updates) {
				var cell = world.getCellAt(x, y);
				if (WORLD_INDEX.ISWALL(cell))
					return true;
				Explosion.create(x, y, power, world, obj, id);
				if (cell == WORLD_INDEX.CRATE) {
					world.setCellAt(x, y, WORLD_INDEX.FLOOR, updates);
					//Powerups.spawnPowerUp(x, y, 0, power, world, obj);
					return true;
				}
				return false;
			}

			var bomb = {
				update: update,
				box: box,
				vel: vel,
				get level() { return level },
				get bombTimer() { return bombTimer },
				set bombTimer(val) { bombTimer = val },
				get id() { return _id },
				get isDead() { return isDead },
				set isDead(val) { isDead = val },
				get index() { return index },
				set index(val) { index = val },
				type: OBJECT_TYPE.BOMB
			}
			world.updatePosition(bomb);
			obj.push(bomb);
		}
	}

	function draw(bomb) {
		ctx.fillStyle = Utils.getHSL(165, 100, 50);
		var box = bomb.box;
		if (sprites) {
			sprites.draw(ctx, 'bomb', box.x, box.y);
		} else
			ctx.fillRect(box.x, box.y, box.w, box.h);
	}

	return {
		create: create,
		draw: draw
	};
})();

if (server) {
	module.exports = Bomb;
}
