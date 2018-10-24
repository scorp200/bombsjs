var Canvas = document.getElementById("c");
var ctx = Canvas.getContext("2d", { alpha: false });

window.addEventListener("mousemove", function(e) {
	var rect = Canvas.getBoundingClientRect();
	x = e.clientX - rect.left;
	y = e.clientY - rect.top;
	vx = (x - Canvas.width / 2);
	vy = (y - Canvas.height / 2);
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

function sendToServer(data) {
	try {
		socket.send(JSON.stringify(data));
	} catch (e) {
		console.log('error sending data: ' + e);
	}
}

var game = null //Game.createLocalGame();
var socket = null;
var con = new WebSocket('ws://localhost:8667');
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
		game.updateNet(data.updates);
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
	if (game)
		game.update();
}

function render() {
	if (game)
		game.render();
}
