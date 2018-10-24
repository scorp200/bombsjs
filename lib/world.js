var server = typeof module !== "undefined";
var World = (function() {
	if (server)
		Grid = require('./gridmap.js');

	function generateWorld(power) {
		var grid = 1 << power;
		var array = base.slice();
		for (x = 3, u = baseWidth - 3; x < u; x++) {
			for (y = 0, i = baseHeight; y < i; y++) {
				if (Math.random() > 0.35) {
					if (array[x + y * baseWidth] == 0)
						array[x + y * baseWidth] = 2;
				}
			}
		}
		for (x = 0, u = baseWidth; x < u; x++) {
			for (y = 3, i = baseHeight - 3; y < i; y++) {
				if (Math.random() > 0.35) {
					if (array[x + y * baseWidth] == 0)
						array[x + y * baseWidth] = 2;
				}
			}
		}

		return Grid.create(array, baseWidth, baseHeight, grid, power);
	}

	var base = [
		1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
		1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
		1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
		1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
		1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
		1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
		1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
		1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
		1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
		1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
		1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
		1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
		1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
	];
	var baseWidth = 19;
	var baseHeight = 13;

	return {
		generateWorld: generateWorld
	}
})();
if (server) {
	module.exports = World;
}
