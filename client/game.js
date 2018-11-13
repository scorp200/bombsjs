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

		Player.createLocal(Utils.createBox(world.size, world.size, world.size, world.size), 3, 1, keys, world.power, world, obj, Utils.getHSL(178, 100, 50));

		function update(dt) {
			for (var i = 0, u = obj.length; i < u; i++) {
				obj[i].update(dt);
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
		var objHolder = {};
		var updates = [];
		var keys = [
			{ key: 'ArrowUp', down: false },
			{ key: 'ArrowDown', down: false },
			{ key: 'ArrowLeft', down: false },
			{ key: 'ArrowRight', down: false },
			{ key: ' ', down: false },
			{ key: 'z', down: false }
		];
		var sendTick = 0;


		function update(dt) {
			for (var i = 0, u = obj.length; i < u; i++) {
				if (obj[i])
					obj[i].update(1);
			}
			obj.forEach(function(e, i) {
				if (e.isDead) {
					objHolder[e.id] = void 0;
					obj[i] = obj[obj.length - 1];
					obj.length--;
				}
			});
			for (var i = 0, u = updates.length; i < u; i++) {
				updateNet(updates[i]);
			}
			updates.length = 0;
			sendTick += dt;
			if (sendTick > 2) {
				console.log(sendTick * 10);
				sendToServer({ keys: keys });
				sendTick = 2;
			}
		}

		function updateNet(updates) {
			for (var i = 0, u = updates.length; i < u; i++) {
				var update = updates[i];
				if (update.remove && objHolder[update.remove]) {
					objHolder[update.remove].isDead = true;
				} else if (update.update) {
					update = update.update;
					if (objHolder[update.id]) {
						var temp = objHolder[update.id];
						if (update.box) {
							temp.newBox.x = update.box.x;
							temp.newBox.y = update.box.y;
						}
						if (update.vel) {
							temp.vel.x = update.vel.x;
							temp.vel.y = update.vel.y;
						}
						if (update.color)
							temp.color = update.color;
					} else {
						var newobj = NetObject.create(update.color, update.box, world.power, world, update.id, update.type);
						objHolder[update.id] = newobj;
						obj.push(newobj);
					}
				} else if (update.cell) {
					update = update.cell;
					world.setCellAt(update.x, update.y, update.id);
				}
			}
		}

		function render() {
			ctx.clearRect(0, 0, Canvas.width, Canvas.height);
			Grid.draw(ctx, world, color);
			ctx.beginPath();
			for (var i = 0, u = obj.length; i < u; i++) {
				var p = obj[i];
				if (p == undefined)
					continue;
				switch (p.drawType) {
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
			updates: updates,
			render: render
		}
	}

	return {
		createLocalGame: createLocalGame,
		createNetGame: createNetGame
	}
})();
