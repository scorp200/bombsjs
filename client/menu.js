var Menu = (function() {
	ctx.font = "30px Arial";
	var buttons = [
		{ text: 'Local Game', box: Utils.createBox(50, 100, ctx.measureText('Local Game').width + 20, 50) },
		{ text: 'Online Game', box: Utils.createBox(50, 200, ctx.measureText('Online Game').width + 20, 50) }
	];

	function update() {
		if (Mouse.down)
			buttons.forEach(function(e, i) {
				if (Utils.pointInBoxObject(Mouse, e.box)) {
					if (i == 0) {
						game = Game.createLocalGame();
						gameState = 1;
					} else if (i == 1) {
						connect();
						gameState = 1;
					}
				}
			});
	}

	function render() {
		ctx.clearRect(0, 0, Canvas.width, Canvas.height);
		ctx.font = "30px Arial";
		buttons.forEach(function(e, i) {
			ctx.fillStyle = Utils.getHSL(37, 100, 36);
			ctx.fillRect(e.box.x, e.box.y, e.box.w, e.box.h);
			ctx.fillStyle = Utils.getHSL(0, 100, 100);
			ctx.fillText(e.text, e.box.x + 10, e.box.y + 35);
		});


	}
	return {
		render: render,
		update: update
	}
})();
