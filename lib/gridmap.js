var server = typeof module !== "undefined";
var Grid = (function() {
	function create(world, width, height, size, power) {
		if (world[0].cell == undefined)
			for (var i = 0, u = (width * height); i < u; i++) {
				var cell = world[i];
				world[i] = { cell: cell, objects: [] };
			}

		function getIndex(x, y) { return x + y * width }

		function getCellAt(x, y) {
			return world[y == undefined ? x : getIndex(x, y)].cell;
		}

		function setCellAt(x, y, value, updates) {
			if (server)
				updates.push({ cell: { x: x, y: y, id: 0 } })
			world[value == undefined ? x : getIndex(x, y)].cell = value == undefined ? y : value;
		}

		function updatePosition(object) {
			var box = object.box;
			var index = getIndex((box.x + box.w / 2) >> power, (box.y + box.h / 2) >> power);
			var objects = world[index].objects;
			if (index != object.index) {
				oldObjects = world[object.index].objects;
				for (var i = 0, u = oldObjects.length; i < u; i++) {
					if (oldObjects[i] == object) {
						oldObjects[i] = oldObjects[u - 1];
						oldObjects.length--;
						break;
					}
				}
				objects.push(object);
				object.index = index;
			}

		}

		function getObjectsNearby(object) {
			var x = object.box.x >> power;
			var y = object.box.y >> power;
			var newObjects = [];
			for (xx = x - 1; xx <= x + 1; xx++) {
				for (yy = y - 1; yy <= y + 1; yy++) {
					var index = getIndex(xx, yy);
					if (index < 0 || index >= width * height)
						continue;
					var objects = world[index].objects;
					big: for (i = 0, u = objects.length; i < u; i++) {
						var obj = objects[i];
						if (obj == object)
							continue;
						for (var w = 0, s = newObjects.length; w < s; w++) {
							if (newObjects[w] == obj)
								continue big;
						}
						newObjects.push(obj);
					}
				}
			}
			return newObjects;
		}

		function getCellIndexInRadius(sx, sy, r) {
			var indexes = [];
			for (x = sx - r, u = sx + r; x <= u; x++) {
				xdif = x - sx;
				yrange = Math.sqrt(r * r - xdif * xdif);
				for (y = Math.ceil(sy - yrange), i = Math.floor(sy + yrange); y <= i; y++) {
					indexes.push(getIndex(x, y));
				}
			}
			return indexes;
		}

		return {
			getCellAt: getCellAt,
			setCellAt: setCellAt,
			updatePosition: updatePosition,
			getObjectsNearby: getObjectsNearby,
			getCellIndexInRadius: getCellIndexInRadius,
			getIndex: getIndex,
			width: width,
			height: height,
			power: power,
			size: size,
			world: world
		}
	}

	function draw(ctx, world, colors) {
		ctx.beginPath();
		ctx.fillStyle = Utils.getHSL(90, 100, 50);
		for (var y = 0, u = world.height; y < u; y++) {
			for (var x = 0, o = world.width; x < o; x++) {
				if (sprites.sprite !== undefined) {
					sprites.draw(ctx, world.getCellAt(x, y), x * world.size, y * world.size);
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

	return {
		create: create,
		draw: draw
	}
})();
if (server) {
	module.exports = Grid;
}
