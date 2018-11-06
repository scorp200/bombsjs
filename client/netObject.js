var NetObject = (function() {
	function create(color, box, power, world, id, drawType) {
		var vel = Utils.Vector2D(0, 0);
		var newBox = Utils.createBox(box.x, box.y, box.w, box.h);
		var collider = GridCollider.create(box, 0, 0.01, power, world);
		var isDead = false;
		var _id;
		var index = 0;

		function update(dt, updates) {
			box.x += Utils.ease(box.x, newBox.x, 3);
			box.y += Utils.ease(box.y, newBox.y, 3);
			collider.move(vel, dt);
			world.updatePosition(netObject);
		}

		var netObject = {
			update: update,
			box: box,
			vel: vel,
			newBox: newBox,
			color: color,
			id: id,
			drawType: drawType,
			get isDead() { return isDead },
			set isDead(val) { isDead = val },
			get index() { return index },
			set index(val) { index = val },
			type: OBJECT_TYPE.NET_OBJECT
		}
		world.updatePosition(netObject);
		return netObject;
	}

	function draw(newobject) {
		ctx.fillStyle = newobject.color;
		var box = newobject.box;
		ctx.fillRect(box.x, box.y, box.w, box.h);
	}

	return {
		create: create,
		draw: draw
	}
})();
