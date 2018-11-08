var Utils = (function() {
	function extend(f1, f2) {
		return function() {
			f1();
			f2();
		}
	}

	// Rename "getDistanceSquared"
	function getDistanceRaw(o1, o2) {
		var x = o1.x - o2.x;
		var y = o1.y - o2.y;
		return x * x + y * y;
	}

	function getDistance(o1, o2) {
		return Math.sqrt(getDistanceRaw(o1, o2));
	}

	function getAngle(p1, p2) {
		return Math.atan2(p1.y - p2.y, p1.x - p2.x);
	}

	function getAngleDifference(a1, a2) {
		return mod((a1 - a2) + PI, TAU) - PI;
	}

	function mod(a, n) {
		return a - Math.floor(a / n) * n;
	}

	function randomRange(min, max) {
		return Math.random() * (max - min) + min;
	}

	function getHSL(h, s, l) {
		return 'hsl(' +
			(h < 0 ? Math.random() * 360 : h) + ',' +
			(s < 0 ? Math.random() * 100 : s) + '%,' +
			(l < 0 ? Math.random() * 100 : l) + '%)';
	}

	function ease(value, target, ease, precision) {
		if (Math.abs(value - target) < precision)
			return 0;
		return (target - value) / ease;
	}

	function clamp(value, min, max) {
		return value > max ? max : value < min ? min : value;
	}

	function shuffleArray(array) {
		var currentIndex = array.length;
		var tempValue;
		var randomIndex;
		while (0 !== currentIndex) {
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex--;
			tempValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = tempValue;
		}
		return array;
	}

	function indexOf(arr, what) {
		for (var i = 0, last = arr.length; i < last; i++) {
			if (arr[i] === what)
				return i;
		}
		return -1;
	}

	/**
	 *
	 */
	function wrapText(context, text, x, y, maxWidth, lineHeight) {
		var words = text.split(' ');
		var line = '';

		for (var n = 0; n < words.length; n++) {
			var testLine = line + words[n] + ' ';
			var metrics = ctx.measureText(testLine);
			var testWidth = metrics.width;
			if (testWidth > maxWidth && n > 0) {
				ctx.fillText(line, x, y);
				line = words[n] + ' ';
				y += lineHeight;
			} else {
				line = testLine;
			}
		}
		context.fillText(line, x, y);
	}

	/**
	 * @param {number} x
	 * @param {number} y
	 * @return {Object} Vector2D
	 */
	function Vector2D(x, y) {
		return {
			x: x,
			y: y
		}
	}

	/**
	 *@return returns point C at % between point A and B
	 */
	function getPercentPoint(a, b, p) {
		return (p * (b - a) + a);
	}

	/**
	 *@return returns % value of point C between point A and B
	 */
	function getPointPercent(a, b, c) {
		return (c - a) / (b - a);
	}

	/**
	 *@return returns if 2 squares intersect, from top left corner.
	 */
	function boxIntersect(ax, ay, aw, ah, bx, by, bw, bh) {
		return ax < bx + bw && ay < by + bh && ax + aw > bx && ay + ah > by;
	}

	/**
	 *@return returns if 2 squares intersect, from top left corner.
	 */
	function boxIntersectObject(a, b, c) {
		return a.x < b.x + b.w && a.y < b.y + b.h && a.x + a.w > b.x && a.y + a.h > b.y;
	}

	/**
	 *@return returns if 2 circles intersect.
	 */
	function circleIntersect(ax, ay, ar, bx, by, br) {
		return getDistance({ x: ax, y: ay }, { x: bx, y: by }) < ar + br;
	}

	/**
	 *@return returns if 2 circles intersect.
	 */
	function circleIntersectObject(a, b) {
		return getDistance(a, b) < a.r + b.r;
	}

	/**
	 *@return returns if a point is inside a box.
	 */
	function pointInBox(px, py, bx, by, bw, bh) {
		return px > bx && px < bx + bw && py > by && py < by + bh;
	}

	/**
	 *@return returns if a point is inside a box.
	 */
	function pointInBoxObject(p, b) {
		return p.x > b.x && p.x < b.x + b.w && p.y > b.y && p.y < b.y + b.h;
	}

	/**
	 *@return returns if a point is inside a circle.
	 */
	function pointInCircle(px, py, cx, cy, cr) {
		return getDistance({ x: px, y: py }, { x: cx, y: cy }) < cr;
	}

	/**
	 *@return returns if a point is inside a circle.
	 */
	function pointInCircleObject(p, c) {
		return getDistance(p, c) < c.r;
	}

	function pointInObject(p, o) {
		if (o.r != undefined)
			return pointInCircleObject(p, o);
		else
			return pointInBoxObject(p, o);
	}

	function createBox(x, y, w, h) {
		return { x: x, y: y, w: w, h: h };
	}

	function createCircle(x, y, r) {
		return { x: x, y: y, r: r };
	}

	/**
	@return returns object with distance from origin to object hit or distance and object hit if any
	*/
	function rayCastHit(x, y, angle, stepSize, distance, objects) {
		'use strict';
		var point = Vector2D(x, y);
		var cos = Math.cos(angle);
		var sin = Math.sin(angle)
		for (var i = 0, end = objects.length; i < end; i++) {
			var obj = objects[i];
			for (var u = 0; u < distance; u += stepSize) {
				point.x = cos * u + x;
				point.y = sin * u + y;
				if (pointInObject(point, obj)) {
					return { distance: u, object: obj };
				}
			}
		}
		return { distance: distance, obj: undefined };
	}

	return {
		extend: extend,
		getDistanceRaw: getDistanceRaw,
		getDistance: getDistance,
		getAngle: getAngle,
		getAngleDifference: getAngleDifference,
		mod: mod,
		randomRange: randomRange,
		getHSL: getHSL,
		ease: ease,
		clamp: clamp,
		shuffleArray: shuffleArray,
		wrapText: wrapText,
		Vector2D: Vector2D,
		getPercentPoint: getPercentPoint,
		getPointPercent: getPointPercent,
		boxIntersect: boxIntersect,
		boxIntersectObject: boxIntersectObject,
		circleIntersect: circleIntersect,
		circleIntersectObject: circleIntersectObject,
		pointInBox: pointInBox,
		pointInBoxObject: pointInBoxObject,
		pointInCircle: pointInCircle,
		pointInCircleObject: pointInCircleObject,
		pointInObject: pointInObject,
		createBox: createBox,
		createCircle: createCircle,
		rayCastHit: rayCastHit,
		indexOf: indexOf
	}
})();

if (typeof module !== "undefined")
	module.exports = Utils;
