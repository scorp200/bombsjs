var Game = (function() {
	function createLocalGame() {
		window.addEventListener("keydown", function(e) {
			for (var i = 0, u = obj.length; i < u; i++) {
				if (!obj[i].keys)
					continue;
				var keys = obj[i].keys;
				for (var p = 0, o = keys.length; p < o; p++) {
					if (keys[p].key == e.key) keys[p].down = true;
				}
			}
		}, false);

		window.addEventListener("keyup", function(e) {
			for (var i = 0, u = obj.length; i < u; i++) {
				if (!obj[i].keys)
					continue;
				var keys = obj[i].keys;
				for (var p = 0, o = keys.length; p < o; p++) {
					if (keys[p].key == e.key) keys[p].down = false
				}
			}
		}, false);
		var world = World.generateWorld(6);
		var color = [Utils.getHSL(100, 0, 50), Utils.getHSL(90, 100, 50), Utils.getHSL(200, 100, 50), undefined];
		var obj = [];

		var keys = [
			{ key: 'ArrowUp', down: false },
			{ key: 'ArrowDown', down: false },
			{ key: 'ArrowLeft', down: false },
			{ key: 'ArrowRight', down: false },
			{ key: ' ', down: false },
			{ key: 'z', down: false }
		];

		Player.createLocal(Utils.createBox(world.size, world.size, world.size, world.size), 4, 2, keys, world.power, world, obj, Utils.getHSL(178, 100, 50));

		function update() {
			for (var i = 0, u = obj.length; i < u; i++) {
				obj[i].update(1);
			}
			obj.forEach(function(e, i) {
				if (e.isDead) {
					obj[i] = obj[obj.length - 1];
					obj.length--;
				}
			});
		}

		function render() {
			ctx.clearRect(0, 0, Canvas.width, Canvas.height);
			Grid.draw(ctx, world, color);
			ctx.beginPath();
			for (var i = 0, u = obj.length; i < u; i++) {
				var p = obj[i];
				switch (p.type) {
					case OBJECT_TYPE.PLAYER:
						Player.draw(p);
						break;
					case OBJECT_TYPE.BOMB:
						Bomb.draw(p);
						break;
					case OBJECT_TYPE.EXPLOSION:
						Explosion.draw(p);
						break;
					case OBJECT_TYPE.POWERUP:
						Powerups.draw(p);
						break;
				}
			}
		}

		return {
			update: update,
			render: render
		}
	}

	function createNetGame(world) {
		window.addEventListener("keydown", function(e) {
			for (var p = 0, o = keys.length; p < o; p++) {
				if (keys[p].key == e.key) keys[p].down = true;
			}
		}, false);

		window.addEventListener("keyup", function(e) {
			for (var p = 0, o = keys.length; p < o; p++) {
				if (keys[p].key == e.key) keys[p].down = false
			}
		}, false);
		var world = Grid.create(world.world, world.width, world.height, world.size, world.power);
		var color = [Utils.getHSL(100, 0, 50), Utils.getHSL(90, 100, 50), Utils.getHSL(200, 100, 50), undefined];
		var obj = [];
		var keys = [
			{ key: 'ArrowUp', down: false },
			{ key: 'ArrowDown', down: false },
			{ key: 'ArrowLeft', down: false },
			{ key: 'ArrowRight', down: false },
			{ key: ' ', down: false },
			{ key: 'z', down: false }
		];

		function update() {
			for (var i = 0, u = obj.length; i < u; i++) {
				obj[i].update(1);
			}
			obj.forEach(function(e, i) {
				if (e.isDead) {
					obj[i] = obj[obj.length - 1];
					obj.length--;
				}
			});
			sendToServer({ keys: keys });
		}

		function updateNet(updates) {
			for (var i = 0, u = updates.length; i < u; i++) {
				var update = updates[i];
				if (obj[update.id]) {
					var temp = obj[update.id];
					temp.box.x += Utils.ease(temp.box.x, update.box.x, 5, 0.01);
					temp.box.y += Utils.ease(temp.box.y, update.box.y, 5, 0.01);
					temp.vel.x = update.vel.x;
					temp.vel.y = update.vel.y;
				} else {
					var temp = Player.createNet(update.box, update.vel, 4, 2, world.power, world, Utils.getHSL(195, 100, 50));
					obj[update.id] = temp;
				}
			}
		}

		function render() {
			ctx.clearRect(0, 0, Canvas.width, Canvas.height);
			Grid.draw(ctx, world, color);
			ctx.beginPath();
			for (var i = 0, u = obj.length; i < u; i++) {
				var p = obj[i];
				switch (p.type) {
					case OBJECT_TYPE.PLAYER:
						Player.draw(p);
						break;
					case OBJECT_TYPE.BOMB:
						Bomb.draw(p);
						break;
					case OBJECT_TYPE.EXPLOSION:
						Explosion.draw(p);
						break;
					case OBJECT_TYPE.POWERUP:
						Powerups.draw(p);
						break;
				}
			}
		}

		return {
			update: update,
			updateNet: updateNet,
			render: render
		}
	}

	return {
		createLocalGame: createLocalGame,
		createNetGame: createNetGame
	}
})();
