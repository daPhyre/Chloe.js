/**
 * Chloe.js: Canvas HTML5 Light Open Engine - Input.js
 * @author daPhyre
 * @version 1.0.0, Fr/27/Feb/15
 */

/*jslint bitwise: true, nomen: true */
/*global _chljs */
var Input = new function () {
	this.lastPress = null;
	this.lastTouchPress = null;
	this.lastTouchRelease = null;
	this.pressing = [];
	this.touches = [];

	this.acceleration = {
		active: false,
		x: 0,
		y: 0,
		z: 0
	};

	this.mouse = {
		x: 0,
		y: 0,
		ox: 0,
		oy: 0,
		move: false,

		draw: function (ctx) {
			if (ctx !== undefined) {
				if (Input.pressing[1]) {
					ctx.strokeStyle = '#fff';
				} else {
					ctx.strokeStyle = '#f00';
				}
				ctx.beginPath();
				ctx.arc(this.x, this.y, 5, 0, Math.PI * 2, true);
				ctx.moveTo(this.x - 5, this.y);
				ctx.lineTo(this.x + 5, this.y);
				ctx.moveTo(this.x, this.y - 5);
				ctx.lineTo(this.x, this.y + 5);
				if (Input.pressing[1]) {
					ctx.moveTo(this.x, this.y);
					ctx.lineTo(this.ox, this.oy);
				}
				ctx.closePath();
				ctx.stroke();
			} else if (window.console) {
				window.console.error('Data missing in Input.mouse.draw(ctx)');
			}
		}
	};

	this.orientation = {
		active: false,
		absolute: false,
		alpha: 0,
		beta: 0,
		gamma: 0
	};

	function Vtouch(id, x, y) {
		this.id = id || 0;
		this.x = x || 0;
		this.y = y || 0;
		this.ox = this.x;
		this.oy = this.y;

		this.draw = function (ctx) {
			if (ctx !== undefined) {
				ctx.strokeStyle = '#999';
				ctx.beginPath();
				ctx.arc(this.x, this.y, 10, 0, Math.PI * 2, true);
				ctx.moveTo(this.x, this.y);
				ctx.lineTo(this.ox, this.oy);
				ctx.stroke();
			} else if (window.console) {
				window.console.error('Data missing in Input.touch[' + this.id + '].draw(ctx)');
			}
		};
	}

	function screen2viewX(evtX) {
		if (_chljs.isFullscreen && _chljs.fullMode === 2) {
			return ~~(evtX * _chljs.view.width / window.innerWidth);
		} else {
			return ~~(~~(evtX + document.documentElement.scrollLeft - (_chljs.offsetLeft || _chljs.buffer.offsetLeft)) / _chljs.viewScale);
		}
	}

	function screen2viewY(evtY) {
		if (_chljs.isFullscreen && _chljs.fullMode === 2) {
			return ~~(evtY * _chljs.view.height / window.innerHeight);
		} else {
			return ~~(~~(evtY + document.documentElement.scrollTop - (_chljs.offsetTop || _chljs.buffer.offsetTop)) / _chljs.viewScale);
		}
	}

	function deviceMotion(evt) {
		Input.acceleration.x = evt.accelerationIncludingGravity.x;
		Input.acceleration.y = evt.accelerationIncludingGravity.y;
		Input.acceleration.z = evt.accelerationIncludingGravity.z;
	}

	function deviceOrientation(evt) {
		Input.orientation.absolute = evt.absolute;
		Input.orientation.alpha = evt.alpha;
		Input.orientation.beta = evt.beta;
		Input.orientation.gamma = evt.gamma;
	}

	function keyDown(evt) {
		if (!Input.pressing[evt.keyCode]) {
			Input.lastPress = evt.keyCode;
		}
		Input.pressing[evt.keyCode] = true;
		if (Input.lastPress >= 37 && Input.lastPress <= 40) {
			evt.preventDefault();
		}
	}

	function keyUp(evt) {
		Input.lastRelease = evt.keyCode;
		Input.pressing[evt.keyCode] = false;
	}

	function mousePrevent(evt) {
		evt.stopPropagation();
		evt.preventDefault();
	}

	function mouseDown(evt) {
		mousePrevent(evt);
		Input.lastPress = evt.which;
		Input.pressing[evt.which] = true;
		if (evt.which === 1) {
			Input.mouse.ox = Input.mouse.x;
			Input.mouse.oy = Input.mouse.y;
		}
		if (Input.touches.length === 0) {
			Input.touches.push(new Vtouch(0, Input.mouse.x, Input.mouse.y));
			Input.lastTouchPress = 0;
		}
	}

	function mouseUp(evt) {
		Input.lastRelease = evt.which;
		Input.pressing[evt.which] = false;
		if (Input.touches.length > 0) {
			Input.touches.length = 0;
			Input.lastTouchRelease = 0;
		}
	}

	function mouseMove(evt) {
		Input.mouse.move = true;
		Input.mouse.x = screen2viewX(evt.pageX);
		Input.mouse.y = screen2viewY(evt.pageY);
		if (Input.touches.length > 0) {
			Input.touches[0].x = Input.mouse.x;
			Input.touches[0].y = Input.mouse.y;
		}
	}

	function touchStart(evt) {
		evt.preventDefault();
		var t = evt.changedTouches,
			i = 0,
			l = 0;
		for (i = 0, l = t.length; i < l; i += 0) {
			Input.touches.push(new Vtouch(t[i].identifier, screen2viewX(t[i].pageX), screen2viewY(t[i].pageY)));
			Input.lastTouchPress = t[i].identifier;
		}
		if (!Input.pressing[1]) {
			Input.lastPress = 1;
		}
		Input.pressing[1] = true;
		Input.mouse.ox = Input.touches[0].x;
		Input.mouse.oy = Input.touches[0].y;
		Input.mouse.move = true;
		Input.mouse.x = Input.mouse.ox;
		Input.mouse.y = Input.mouse.oy;
	}

	function touchEnd(evt) {
		evt.preventDefault();
		var t = evt.changedTouches,
			i = 0,
			j = 0,
			l = 0,
			m = 0;
		for (i = 0, l = t.length; i < l; i += 1) {
			for (j = 0, m = Input.touches.length; j < m; j += 1) {
				if (Input.touches[j].id === t[i].identifier) {
					Input.touches.remove(j);
					Input.lastTouchRelease = t[i].identifier;
					j -= 1;
					m -= 1;
				}
			}
		}
		Input.lastRelease = 1;
		Input.pressing[1] = false;
	}

	function touchMove(evt) {
		evt.preventDefault();
		var t = evt.targetTouches,
			i = 0,
			j = 0,
			l = 0,
			m = 0;
		for (i = 0, l = t.length; i < l; i += 1) {
			for (j = 0, m = Input.touches.length; j < m; j += 1) {
				if (Input.touches[j].id === t[i].identifier) {
					Input.touches[j].x = screen2viewX(t[i].pageX);
					Input.touches[j].y = screen2viewY(t[i].pageY);
				}
			}
		}
		Input.mouse.move = true;
		Input.mouse.x = Input.touches[0].x;
		Input.mouse.y = Input.touches[0].y;
	}

	this.enableAcceleration = function () {
		if (window.DeviceMotionEvent) {
			this.acceleration.active = true;
			window.addEventListener('devicemotion', deviceMotion, false);
		} else {
			if (window.console) {
				window.console.error('Device motion not supported');
			}
		}
	};

	this.enableKeyboard = function () {
		document.addEventListener('keydown', keyDown, false);
		document.addEventListener('keyup', keyUp, false);
	};

	this.enableMouse = function () {
		_chljs.buffer.addEventListener('contextmenu', mousePrevent, false);
		_chljs.buffer.addEventListener('mousedown', mouseDown, false);
		document.addEventListener('mouseup', mouseUp, false);
		document.addEventListener('mousemove', mouseMove, false);
	};

	this.enableOrientation = function () {
		if (window.DeviceOrientationEvent) {
			this.orientation.active = true;
			window.addEventListener('deviceorientation', deviceOrientation, false);
		} else {
			if (window.console) {
				window.console.error('Device orientation not supported');
			}
		}
	};

	this.enableTouch = function () {
		_chljs.buffer.addEventListener('touchstart', touchStart, false);
		_chljs.buffer.addEventListener('touchend', touchEnd, false);
		_chljs.buffer.addEventListener('touchcancel', touchEnd, false);
		_chljs.buffer.addEventListener('touchmove', touchMove, false);
	};

	this.disableAcceleration = function () {
		window.removeEventListener('devicemotion', deviceMotion, false);
		this.acceleration.active = false;
	};

	this.disableKeyboard = function () {
		document.removeEventListener('keydown', keyDown, false);
		document.removeEventListener('keyup', keyUp, false);
	};

	this.disableMouse = function () {
		_chljs.buffer.removeEventListener('contextmenu', mousePrevent, false);
		_chljs.buffer.removeEventListener('mousedown', mouseDown, false);
		document.removeEventListener('mouseup', mouseUp, false);
		document.removeEventListener('mousemove', mouseMove, false);
	};

	this.disableOrientation = function () {
		window.removeEventListener('deviceorientation', deviceOrientation, false);
		this.orientation.active = false;
	};

	this.disableTouch = function () {
		_chljs.buffer.removeEventListener('touchstart', touchStart, false);
		_chljs.buffer.removeEventListener('touchend', touchEnd, false);
		_chljs.buffer.removeEventListener('touchcancel', touchEnd, false);
		_chljs.buffer.removeEventListener('touchmove', touchMove, false);
	};

	this.virtualKey = function (key, action) {
		if (action !== undefined) {
			if (action) {
				if (!this.pressing[key]) {
					this.lastPress = key;
				}
			} else {
				if (this.pressing[key]) {
					this.lastRelease = key;
				}
			}
			this.pressing[key] = action;
		} else if (window.console) {
			window.console.error('Data missing in Input.virtualKey(key, action)');
		}
	};
}();
