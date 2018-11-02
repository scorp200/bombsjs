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
		var sendrate = 3;

		function update() {
			for (var i = 0, u = obj.length; i < u; i++) {
				if (obj[i])
					obj[i].update(1);
			}
			obj.forEach(function(e, i) {
				if (e && e.isDead) {
					objHolder[e.id] = void 0;
					obj[i] = obj[obj.length - 1];
					obj.length--;

				}
			});
			for (var i = 0, u = updates.length; i < u; i++) {
				updateNet(updates[i]);
			}
			updates.length = 0;
			if (sendrate-- <= 0) {
				sendToServer({ keys: keys });
				sendrate = 3;
			}
		}

		function updateNet(updates) {
			for (var i = 0, u = updates.length; i < u; i++) {
				var update = updates[i];
				if (update.remove) {
					objHolder[update.remove].isDead = true;
				} else if (update.object) {
					update = update.object;
					if (objHolder[update.id]) {
						var temp = objHolder[update.id];
						temp.newBox.x = update.box.x;
						temp.newBox.y = update.box.y;
						temp.vel.x = update.vel.x;
						temp.vel.y = update.vel.y;
						temp.color = update.color;
						temp.isDead = (update.isDead != undefined);
						/*
						if (temp.type == OBJECT_TYPE.PLAYER) {
							temp.newBox.x = update.box.x;
							temp.newBox.y = update.box.y;
							temp.vel.x = update.vel.x;
							temp.vel.y = update.vel.y;
							temp.color = update.color;
						} else if (temp.type == OBJECT_TYPE.BOMB) {
							temp.newBox.x = update.box.x;
							temp.newBox.y = update.box.y;
							try {
								temp.vel.x = update.vel.x;
								temp.vel.y = update.vel.y;
							} catch (e) {
								console.log(temp, update);
							}

							temp.bombTimer = update.bombTimer;
						} else if (temp.type == OBJECT_TYPE.EXPLOSION) {
							temp.explosiontimer = update.explosiontimer;
						}*/
					} else {
						var newobj = NetObject.create(update.color, update.box, world.power, world, update.id);
						objHolder[update.id] = newobj;
						obj.push(newobj);
						/*switch (update.type) {
							case OBJECT_TYPE.PLAYER:
								objHolder[update.id] = Player.createNet(update.box, update.vel, 4, 2, world.power, world, update.color || Utils.getHSL(195, 100, 50), update.id);
								obj.push(objHolder[update.id]);
								break;
							case OBJECT_TYPE.BOMB:
								objHolder[update.id] = Bomb.create(update.box.x >> world.power, update.box.y >> world.power, update.level, world.power, world, obj, true, update.id);
								obj.push(objHolder[update.id]);
								break;
							case OBJECT_TYPE.EXPLOSION:
								objHolder[update.id] = Explosion.create(update.box.x >> world.power, update.box.y >> world.power, world.power, world, obj, true, update.id);
								obj.push(objHolder[update.id]);
								break;
							default:

						}*/
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
				NetObject.draw(p);
				/*switch (p.type) {
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
				}*/
			}
		}

		return {
			update: update,
			updates: updates,
			//updateNet: updateNet,
			render: render
		}
	}

	return {
		createLocalGame: createLocalGame,
		createNetGame: createNetGame
	}
})();
