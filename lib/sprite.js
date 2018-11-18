var Sprite = (function() {
	function create(sx, sy, w, h, src) {
		var sprite = new Image();
		sprite.src = src;
		var index = {}

		function drawSprite(ctx, i, x, y) {
			if (index[i])
				drawRaw(ctx, index[i].x, index[i].y, x, y);
		}

		function drawRaw(ctx, sx, sy, x, y) {
			ctx.drawImage(sprite, sx, sy, w, h, x, y, w, h);
		}

		function addIndex(name, x, y) {
			if (x < 0 || x > sx || y < 0 || y > sy || index[name] !== undefined)
				return;
			index[name] = {
				x: x * w,
				y: y * h
			}
		}

		return {
			sprite: sprite,
			drawSprite: drawSprite,
			drawRaw: drawRaw,
			addIndex: addIndex
		}
	}
	return {
		create: create
	}
})();
