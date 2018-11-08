var Canvas = document.getElementById("c");
var ctx = Canvas.getContext("2d", { alpha: false });
var sprites = Sprite.create(5, 2, 64, 64, 'sprites.png');
//Walls
sprites.addIndex(0, 4, 0);
sprites.addIndex(1, 1, 0);
sprites.addIndex(2, 2, 1);
sprites.addIndex(3, 3, 1);
sprites.addIndex(4, 2, 2);
sprites.addIndex(5, 3, 2);
sprites.addIndex(6, 4, 1);
sprites.addIndex(7, 1, 2);
//Crate
sprites.addIndex(8, 3, 0);
sprites.addIndex(9, 4, 0);
sprites.addIndex('bomb', 4, 2);
sprites.addIndex('player',5,0)
// 9 = BOMB


var Mouse = { x: 0, y: 0, vx: 0, vy: 0, down: false };
window.addEventListener("mousemove", function(e) {
	var rect = Canvas.getBoundingClientRect();
	Mouse.x = e.clientX - rect.left;
	Mouse.y = e.clientY - rect.top;
	Mouse.vx = (Mouse.x - Canvas.width / 2);
	Mouse.vy = (Mouse.y - Canvas.height / 2);
}, false);
window.addEventListener("mousedown", function(e) {
	Mouse.down = true;
}, false);
window.addEventListener("mouseup", function(e) {
	Mouse.down = false;
}, false);



window.addEventListener("contextmenu", function(e) {
	//e.preventDefault();
}, false);

resize();
window.addEventListener("resize", resize, false);

function resize() {
	Canvas.width = window.innerWidth;
	Canvas.height = window.innerHeight;
	ctx.clearRect(0, 0, Canvas.width, Canvas.height);
};

var game = null;
var gameState = 0;

function sendToServer(data) {
	try {
		socket.send(JSON.stringify(data));
	} catch (e) {
		console.log('error sending data: ' + e);
	}
}

function connect() {
	window.socket = null;
	var con = new WebSocket(ip ? ip : 'ws://localhost:8667');
	con.onopen = function() {
		socket = con;
		sendToServer({
			join: { random: true }
		});
	}

	con.onerror = function(err) {
		console.log('Socket error: ' + err);
	}

	con.onclose = function(err) {
		console.log('socket closed');
		socket = null;
		game = null;
	}

	con.onmessage = function(msg) {
		var data = JSON.parse(msg.data);
		if (data.world)
			game = Game.createNetGame(data);
		else if (data.updates)
			game.updates.push(data.updates);
	}
}

var lastTick = performance.now();
var tickInterval = 1000 / 64;
window.onload = function() {
	(function tick(timeStamp) {
		requestAnimationFrame(tick);
		var nextTick = lastTick + tickInterval;

		if (timeStamp > nextTick) {
			var timeSinceTick = timeStamp - lastTick;
			var numTicks = Math.floor(timeSinceTick / tickInterval);
			var repeat = Math.min(numTicks, 64);
			while (repeat--)
				update();
			render();
			lastTick = timeStamp;
		}
	})(lastTick);
}

function update() {
	if (gameState == 0)
		Menu.update();
	else if (gameState == 1 && game)
		game.update();
}

function render() {
	if (gameState == 0)
		Menu.render();
	else if (gameState == 1 && game)
		game.render();
}
