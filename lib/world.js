var server = typeof module !== "undefined";
var World = (function() {
	if (server)
		Grid = require('./gridmap.js');
	else {

	}

	function generateWorld(power) {
		var grid = 1 << power;
		var array = base.slice();
		for (x = 3, u = baseWidth - 3; x < u; x++) {
			for (y = 0, i = baseHeight; y < i; y++) {
				if (Math.random() > 0.35) {
					if (array[x + y * baseWidth] == 0)
						array[x + y * baseWidth] = 8;
				}
			}
		}
		for (x = 0, u = baseWidth; x < u; x++) {
			for (y = 3, i = baseHeight - 3; y < i; y++) {
				if (Math.random() > 0.35) {
					if (array[x + y * baseWidth] == 0)
						array[x + y * baseWidth] = 8;
				}
			}
		}

		return Grid.create(array, baseWidth, baseHeight, grid, power);
	}

	function draw(ctx, world, colors) {
		ctx.beginPath();
		ctx.fillStyle = Utils.getHSL(90, 100, 50);
		for (var y = 0, u = world.height; y < u; y++) {
			for (var x = 0, o = world.width; x < o; x++) {
				if (sprites.sprite !== undefined) {
					sprites.drawSprite(ctx, world.getCellAt(x, y), x * world.size, y * world.size);
				} else if (colors != undefined) {
					var color = colors[world.getCellAt(x, y)];
					if (!color)
						continue;
					ctx.fillStyle = color;
					ctx.fillRect(x * world.size, y * world.size, world.size, world.size);
				}
			}
		}
	}

	var base = [
		2, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 3,
		6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6,
		6, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 6,
		6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6,
		6, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 6,
		6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6,
		6, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 6,
		6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6,
		6, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 6,
		6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6,
		6, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 6,
		6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6,
		4, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 5
	];
	var baseWidth = 19;
	var baseHeight = 13;

	return {
		generateWorld: generateWorld,
		draw: draw
	}
})();
if (server) {
	module.exports = World;
}
