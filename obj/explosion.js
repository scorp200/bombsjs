var server = typeof module !== "undefined";
var Explosion = (function() {
	function place(x, y, power, world, obj) {
		var explosiontimer = 50;
		var isDead = false;
		var index = 0;
		var box = Utils.createBox(x << power, y << power, world.size, world.size);

		function update() {
			if (--explosiontimer <= 0)
				isDead = true;
			var objects = world.getObjectsNearby(explosion);
			for (var i = 0, u = objects.length; i < u; i++) {
				var obj = objects[i];
				if (obj.type == OBJECT_TYPE.PLAYER && Utils.boxIntersectObject(box, obj.box)) {
					obj.color = Utils.getHSL(-1, 100, 50);
				} else if (obj.type == OBJECT_TYPE.BOMB && Utils.boxIntersectObject(box, obj.box)) {
					obj.explode();
				}
			}

		}

		var explosion = {
			update: update,
			box: box,
			get isDead() { return isDead },
			set isDead(val) { isDead = val },
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
		place: place,
		draw: draw
	}
})();

if (server) {
	module.exports = Explosion;
}
