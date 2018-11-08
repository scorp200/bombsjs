var OBJECT_TYPE = {
	PLAYER: 0,
	BOMB: 1,
	EXPLOSION: 2,
	POWERUP: 3,
	NET_OBJECT: 4
}

var POWER_UPS = {
	SPEED: 0,
	BLAST: 1,
	BOMBS: 2,
	KICK: 3,
	BLANK: 4
}

var WORLD_INDEX = {
	FLOOR: 0,
	CRATE: 8,
	ISWALL: function(i) { return i > 0 && i < 8 },
	BOMB: 9
}

if (typeof module !== "undefined") {
	global.OBJECT_TYPE = OBJECT_TYPE;
	global.POWER_UPS = POWER_UPS;
	global.WORLD_INDEX = WORLD_INDEX;
}
