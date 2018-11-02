var GridCollider = (function() {
	function create(box, slipSpeed, hair, power, world) {
		var slip;

		function moveHorizontal(vel, dt, y, up, down) {
			var dir = Math.sign(vel.x);
			var tempX = box.x + (dir > 0 ? box.w : 0) + vel.x;
			var cx = tempX >> power;
			up = up ? world.getCellAt(cx, ((box.y + hair) >> power) + y) : 0;
			down = down ? world.getCellAt(cx, ((box.y + box.h - hair) >> power) + y) : 0;
			if (up != 0 || down != 0) {
				box.x = (box.w == world.size) ? (cx - dir) << power : (cx << power) - (dir > 0 ? box.w : -world.size);
				vel.x = 0;
				if (vel.y == 0 && slipSpeed != 0) {
					var slipVel = Utils.Vector2D(1, up == 0 ? -slip : down == 0 ? slip : 0);
					if (slipVel.y != 0)
						moveVertical(slipVel, dt, dir, slipVel.y > 0, slipVel.y < 0);
				}
			} else {
				box.x += vel.x * dt;
			}
		}

		function moveVertical(vel, dt, x, left, right) {
			var dir = Math.sign(vel.y);
			var tempY = box.y + (dir > 0 ? box.h : 0) + vel.y;
			var cy = tempY >> power;
			left = left ? world.getCellAt(((box.x + hair) >> power) + x, cy) : 0;
			right = right ? world.getCellAt(((box.x + box.w - hair) >> power) + x, cy) : 0;
			if (left != 0 || right != 0) {
				box.y = (box.h == world.size) ? (cy - dir) << power : (cy << power) - (dir > 0 ? box.h : -world.size);
				vel.y = 0;
				if (vel.x == 0 && slipSpeed != 0) {
					var slipVel = Utils.Vector2D(left == 0 ? -slip : right == 0 ? slip : 0, 1);
					if (slipVel.x != 0)
						moveHorizontal(slipVel, dt, dir, slipVel.x > 0, slipVel.x < 0);
				}
			} else {
				box.y += vel.y * dt;
			}
		}

		function move(vel, dt) {
			slip = slipSpeed * dt;
			if (vel.x != 0)
				moveHorizontal(vel, dt, 0, true, true);
			if (vel.y != 0)
				moveVertical(vel, dt, 0, true, true);

		}

		return {
			move: move
		}
	}
	return {
		create: create
	}
})();
if (typeof module !== "undefined")
	module.exports = GridCollider;
