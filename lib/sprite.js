var Sprite = (function() {
	function create(sx, sy, w, h, src) {
		var sprite = new Image();
		sprite.src = src;
		var index = {}

		function draw(ctx, i, x, y) {
			if (index[i])
				ctx.drawImage(sprite, index[i].x, index[i].y, w, h, x, y, w, h);
		}

		function addIndex(name, x, y) {
			if (x < 0 || x > sx || y < 0 || y > sy)
				return;
			index[name] = {
				x: x * w,
				y: y * h
			}
		}

		return {
			sprite: sprite,
			draw: draw,
			addIndex: addIndex
		}
	}
	return {
		create: create
	}
})();
