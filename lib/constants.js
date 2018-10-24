var OBJECT_TYPE = {
	PLAYER: 0,
	BOMB: 1,
	EXPLOSION: 2,
	POWERUP: 3
}

var POWER_UPS = {
	SPEED: 0,
	BLAST: 1,
	BOMBS: 2,
	KICK: 3,
	BLANK: 4
}

if (typeof module !== "undefined") {
	global.OBJECT_TYPE = OBJECT_TYPE;
	global.POWER_UPS = POWER_UPS;
}
