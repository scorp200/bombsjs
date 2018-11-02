var server = typeof module !== "undefined";
var Explosion = (function() {
	function create(x, y, power, world, obj, net, id) {
		var explosiontimer = 50;
		var isDead = false;
		var index = 0;
		var box = Utils.createBox(x << power, y << power, world.size, world.size);
		var _id;
		if (!net && id)
			_id = id.id++;
		else if (id)
			_id = id;

		function update() {
			if (--explosiontimer <= 0)
				isDead = true;
			var objects = world.getObjectsNearby(explosion);
			for (var i = 0, u = objects.length; i < u; i++) {
				var obj = objects[i];
				if (obj.type == OBJECT_TYPE.PLAYER && Utils.boxIntersectObject(box, obj.box)) {
					if (!net)
						obj.color = Utils.getHSL(-1, 100, 50);
				} else if (obj.type == OBJECT_TYPE.BOMB && Utils.boxIntersectObject(box, obj.box)) {
					obj.bombTimer = 0;
				}
			}
		}

		var explosion = {
			update: update,
			box: box,
			get id() { return _id },
			get isDead() { return isDead },
			set isDead(val) {
				if (server && val)
					updates.push({ remove: _id });
				isDead = val
			},
			get explosiontimer() { return explosiontimer },
			set explosiontimer(val) { explosiontimer = val },
			get index() { return index },
			set index(val) { index = val },
			type: OBJECT_TYPE.EXPLOSION
		};
		world.updatePosition(explosion);
		obj.push(explosion);
	}

	function draw(explosion) {
		ctx.fillStyle = Utils.getHSL(24, 100, 50);
		var box = explosion.box;
		ctx.fillRect(box.x, box.y, box.w, box.h);
	}

	return {
		create: create,
		draw: draw
	}
})();

if (server) {
	module.exports = Explosion;
}
