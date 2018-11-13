var GridCollider = (function() {
	function create(box, slipSpeed, hair, power, world) {
		var slip;

		function moveHorizontal(vel, dt, y, up, down, ignore) {
			var dir = Math.sign(vel.x);
			var tempX = box.x + (dir > 0 ? box.w : 0) + vel.x;
			var cx = tempX >> power;
			var upIndex = world.getIndex(cx, ((box.y + hair) >> power) + y);
			var downIndex = world.getIndex(cx, ((box.y + box.h - hair) >> power) + y);
			up = up ? world.world[upIndex].cell : 0;
			down = down ? world.world[downIndex].cell : 0;
			if ((up != 0 && upIndex != ignore) || (down != 0 && downIndex != ignore)) {
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

		function moveVertical(vel, dt, x, left, right, ignore) {
			var dir = Math.sign(vel.y);
			var tempY = box.y + (dir > 0 ? box.h : 0) + vel.y;
			var cy = tempY >> power;
			var leftIndex = world.getIndex(((box.x + hair) >> power) + x, cy);
			var rightIndex = world.getIndex(((box.x + box.w - hair) >> power) + x, cy);
			left = left ? world.world[leftIndex].cell : 0;
			right = right ? world.world[rightIndex].cell : 0;
			if ((left != 0 && leftIndex != ignore) || (right != 0 && rightIndex != ignore)) {
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

		function move(vel, dt, ignore) {
			slip = slipSpeed * dt;
			if (vel.x != 0)
				moveHorizontal(vel, dt, 0, true, true, ignore);
			if (vel.y != 0)
				moveVertical(vel, dt, 0, true, true, ignore);

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
