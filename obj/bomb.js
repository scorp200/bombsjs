var server = typeof module !== "undefined";
var Bomb = (function() {
	if (server) {
		Powerups = require('./powerups.js');
		Explosion = require('./explosion.js');
		GridCollider = require('./../lib/gridcollider.js');
	}

	function place(x, y, level, power, world, obj) {
		var cell = world.getCellAt(x, y);
		if (cell == 0) {
			world.setCellAt(x, y, 3);
			var vel = Utils.Vector2D(0, 0);
			var bombTimer = 100;
			var box = Utils.createBox(x << power, y << power, world.size, world.size);
			var collider = GridCollider.create(box, 0, 0.01, power, world);
			var isDead = false;
			var index = 0;

			function update(dt) {
				if (--bombTimer <= 0) {
					world.setCellAt(x, y, 0);
					isDead = true;
					//up
					for (var i = 0; - i < level; i--) {
						if (explode(x, y + i)) break;
					}
					//down
					for (var i = 0; i < level; i++) {
						if (explode(x, y + i)) break;
					}
					//left
					for (var i = 0; - i < level; i--) {
						if (explode(x + i, y)) break;
					}
					//right
					for (var i = 0; i < level; i++) {
						if (explode(x + i, y)) break;
					}
				}
				collider.move(vel, dt);
				oldIndex = index;
				world.updatePosition(bomb);
			}

			function explode(x, y) {
				var cell = world.getCellAt(x, y);
				if (cell == 1)
					return true;
				Explosion.place(x, y, power, world, obj);
				if (cell == 2) {
					world.setCellAt(x, y, 0);
					Powerups.spawnPowerUp(x, y, 0, power, world, obj);
					return true;
				}
				return false;
			}

			var bomb = {
				update: update,
				explode: function() { bombTimer = 0; },
				box: box,
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
		ctx.fillRect(box.x, box.y, box.w, box.h);
	}

	return {
		place: place,
		draw: draw
	};
})();

if (server) {
	module.exports = Bomb;
}
