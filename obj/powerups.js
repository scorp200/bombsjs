var Powerups = (function() {
	var ups = [];
	var range = 0;

	ups[POWER_UPS.SPEED] = { weight: 20, max: 5 };
	ups[POWER_UPS.BLAST] = { weight: 15, max: 13 };
	ups[POWER_UPS.BOMBS] = { weight: 13, max: 5 };
	ups[POWER_UPS.KICK] = { weight: 9, max: 1 };
	ups[POWER_UPS.BLANK] = { weight: 25, max: 0 };

	for (var i = 0, u = ups.length; i < u; i++) {
		range += ups[i].weight;
	}

	function getDefauls() {
		var def = [];
		def[POWER_UPS.SPEED] = 0;
		def[POWER_UPS.BLAST] = 1;
		def[POWER_UPS.BOMBS] = 1;
		def[POWER_UPS.KICK] = 0;
		return def;
	}

	function getRandomItem() {
		var rand = Utils.randomRange(0, range);
		var top = 0;
		for (var i = 0, u = ups.length; i < u; i++) {
			top += ups[i].weight;
			if (rand <= top)
				return i;
		}
	}

	function spawnPowerUp(x, y, item, power, world, obj) {
		var isDead = false;
		var index = 0;
		var size = world.size * 0.5
		var box = Utils.createBox((x << power) + size / 2, (y << power) + size / 2, size, size);

		function update() {
			var objects = world.getObjectsNearby(powerup);
			for (var i = 0, u = objects.length; i < u; i++) {
				var obj = objects[i];
				if (obj.type == OBJECT_TYPE.PLAYER && Utils.boxIntersectObject(box, obj.box)) {
					if (obj.powerups[item] < ups[item].max) {
						obj.powerups[item]++;
						isDead = true;
						return;
					}
				}
			}
		}

		var powerup = {
			update: update,
			box: box,
			item: item,
			get isDead() { return isDead },
			set isDead(val) { isDead = val },
			get index() { return index },
			set index(val) { index = val },
			type: OBJECT_TYPE.POWERUP
		}
		world.updatePosition(powerup);
		obj.push(powerup);
	}

	function draw(powerup) {
		ctx.fillStyle = Utils.getHSL(35, 100, 50);
		var box = powerup.box;
		ctx.fillRect(box.x, box.y, box.w, box.h);
	}

	return {
		getDefauls: getDefauls,
		getRandomItem: getRandomItem,
		spawnPowerUp: spawnPowerUp,
		draw: draw
	}
})();

if (typeof module !== "undefined") {
	module.exports = Powerups;
}
