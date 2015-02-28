/**
 * Chloe.js: Canvas HTML5 Light Open Engine - Canvas.js
 * @author daPhyre
 * @since 0.1.0, Tu/12/Jul/11
 * @version 1.0.0, Fr/27/Feb/15
 */

/*jslint bitwise: true, nomen: true */
/*global Input, Toast, Util, World */
'use strict';
Math.DEG = Math.PI / 180;
Array.prototype.insert = function (i, element) {
	this.splice(i, 0, element);
};
Array.prototype.remove = function (i) {
	return this.splice(i, 1)[0];
};
Array.prototype.removeAll = function () {
	this.length = 0;
};

var _chljs = {
	buffer: null,
	view: null,
	fullMode: 0,
	viewScale: 1,
	offsetTop: 0,
	offsetLeft: 0,
	isFullscreen: false,
	screenDebug: false,
	currentScene: 0,
	scenes: [],
	runnable: []
};

function Canvas(canvasWidth, canvasHeight, canvasId, fullMode, autoFull, autoFullOnMobile) {
	var _self = this,
		_bgcolor = '#ccc',
		_bgimg = null,
		_bgfixed = false,
		_async = false,
		_interval = 1000 / 60,
		_lastUpdate = 0,
		_deltaTime = 0,
		_acumDt = 0,
		_ctx = null,
		_g2 = null,
		_imageSmoothingEnabled = true,
		debug,
		requestAnimFrame = (function () {
			return window.requestAnimationFrame ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				function (callback) {
					window.setTimeout(callback, 17);
				};
		}());
	
	_chljs.fullMode = fullMode;
	if (autoFull === undefined) {
		autoFull = true;
	}
	if (autoFullOnMobile === undefined) {
		autoFullOnMobile = true;
	}

	this.view = null;
	this.onReady = function () {};

	function preload() {
		if (canvasId === undefined) {
			canvasId = 'canvas';
		}
		if (canvasWidth === undefined) {
			canvasWidth = 600;
		}
		if (canvasHeight === undefined) {
			canvasHeight = 400;
		}
		_chljs.buffer = document.getElementById(canvasId);
		if (_chljs.buffer === undefined) {
			_chljs.buffer = document.createElement('canvas');
			document.body.appendChild(_chljs.buffer);
		} else if (_chljs.buffer.nodeName.toLowerCase() !== 'canvas') {
			var container = _chljs.buffer;
			_chljs.buffer = document.createElement('canvas');
			container.appendChild(_chljs.buffer);
		}
		_chljs.buffer.width = canvasWidth;
		_chljs.buffer.height = canvasHeight;
		_chljs.buffer.style.cursor = 'url(\'cursor.png\') 8 8, crosshair';
	}

	this.setBackground = function (color, image, fixed) {
		if (color !== undefined) {
			_bgcolor = color;
			_bgimg = image;
			_bgfixed = (fixed === undefined) ? false : fixed;
		} else if (window.console) {
			window.console.error('Data missing in Canvas.setBackground(color[, image, fixed])');
		}
	};

	this.getAsync = function () {
		return _async;
	};

	this.setAsync = function (a) {
		_async = a;
	};

	this.toggleAsync = function () {
		_async = !_async;
	};

	this.getFullscreen = function () {
		return _chljs.isFullscreen;
	};

	this.setFullscreen = function (f) {
		_chljs.isFullscreen = f;
	};

	this.toggleFullscreen = function () {
		_chljs.isFullscreen = !_chljs.isFullscreen;
	};

	this.getInterval = function () {
		if (_async) {
			return 1000 / _interval;
		} else {
			return _deltaTime;
		}
	};
 
	this.setInterval = function (fps) {
		_interval = 1000 / fps;
		_async = true;
	};

	this.getScreenDebug = function () {
		return _chljs.screenDebug;
	};

	this.setScreenDebug = function (d) {
		_chljs.screenDebug = d;
	};

	this.toggleScreenDebug = function () {
		_chljs.screenDebug = !_chljs.screenDebug;
	};

	this.getScreenshot = function () {
		window.open(_self.view.toDataURL());
	};

	this.loadScene = function (scene) {
		_chljs.currentScene = scene.id;
		_chljs.scenes[_chljs.currentScene].load();
	};

	this.__defineGetter__("imageSmoothingEnabled", function () {
		return _imageSmoothingEnabled;
	});

	this.__defineSetter__("imageSmoothingEnabled", function s(b) {
		_g2.webkitImageSmoothingEnabled = b;
		_g2.mozImageSmoothingEnabled = b;
		_g2.imageSmoothingEnabled = b;
		_imageSmoothingEnabled = b;
	});

	debug = new function () {
		this.frames = 0;
		this.aframes = 0;
		var _FPS = 0,
			_AFPS = 0,
			_AFT = '',
			_secs = 0;

		if (window.requestAnimationFrame) {
			_AFT = 'dft';
		} else if (window.webkitRequestAnimationFrame) {
			_AFT = 'wkt';
		} else if (window.mozRequestAnimationFrame) {
			_AFT = 'moz';
		} else {
			_AFT = 'non';
		}

		this.act = function (dt) {
			_secs += dt;
			if (_secs > 1) {
				_FPS = this.frames;
				_AFPS = this.aframes;
				this.frames = 0;
				this.aframes = 0;
				_secs -= 1;
			}
		};

		this.paint = function (ctx) {
			ctx.font = '10px sans-serif';
			ctx.textAlign = 'center';
			ctx.fillStyle = '#fff';
			ctx.fillText('FPS: ' + _FPS, _self.view.width / 2, 10);
			ctx.fillText('AFPS: ' + _AFPS, _self.view.width / 2, 20);
			ctx.fillText('AFT: ' + _AFT, _self.view.width / 2, 30);
			ctx.textAlign = 'left';
		};
	}();

	function repaint() {
		_g2.fillStyle = _bgcolor;
		_g2.fillRect(0, 0, _chljs.buffer.width, _chljs.buffer.height);
		if (_bgimg !== undefined) {
			if (_bgfixed) {
				Util.fillTile(_ctx, _bgimg);
			} else {
				Util.fillTile(_ctx, _bgimg, -World.cam.x, -World.cam.y);
			}
		} else {
			_ctx.fillStyle = _bgcolor;
			_ctx.fillRect(0, 0, _self.view.width, _self.view.height);
			_ctx.fillStyle = '#000';
		}
		if (_chljs.scenes.length) {
			_chljs.scenes[_chljs.currentScene].paint(_ctx);
		} else {
			_ctx.fillText('It\'s Working!', 20, 30);
			_ctx.fillText('Chloe.js 1.0.0', 20, 50);
		}
		Toast.paint(_ctx);
		if (_chljs.screenDebug) {
			debug.paint(_ctx);
		}
		if (fullMode === 2) {
			_g2.drawImage(_self.view, 0, 0, _chljs.buffer.width, _chljs.buffer.height);
		} else {
			_g2.drawImage(_self.view, _chljs.offsetLeft, _chljs.offsetTop, _self.view.width * _chljs.viewScale, _self.view.height * _chljs.viewScale);
		}
	}

	function run() {
		//setTimeout(run,1000/_interval);
		requestAnimFrame(run);

		var now = Date.now(),
			i = 0,
			l = 0;
		_deltaTime = (now - _lastUpdate) / 1000;
		if (_deltaTime > 1) {
			_deltaTime = 0;
		}
		_lastUpdate = now;

		if (_async) {
			_acumDt += _deltaTime;
			var inter = _interval / 1000,
				lp = Input.lastPress,
				lr = Input.lastRelease,
				mm = Input.mouse.move;
			while (_acumDt > inter) {
				if (_chljs.scenes.length) {
					_chljs.scenes[_chljs.currentScene].act(inter);
				}
				for (i = 0, l = _chljs.runnable.length; i < l; i += 1) {
					_chljs.runnable[i].update(inter);
				}
				//if(_acumDt>1)_acumDt=0
				_acumDt -= inter;
				if (_chljs.screenDebug) {
					debug.aframes += 1;
				}
				Input.lastPress = null;
				Input.lastRelease = null;
				Input.mouse.move = false;
			}
			Input.lastPress = lp;
			Input.lastRelease = lr;
			Input.mouse.move = mm;
		} else {
			if (_chljs.scenes.length) {
				_chljs.scenes[_chljs.currentScene].act(_deltaTime);
			}
			for (i = 0, l = _chljs.runnable.length; i < l; i += 1) {
				_chljs.runnable[i].update(_deltaTime);
			}
		}
		Toast.update(_deltaTime);
		if (_chljs.screenDebug) {
			debug.frames += 1;
			debug.act(_deltaTime);
		}

		repaint();

		Input.lastPress = null;
		Input.lastRelease = null;
		Input.mouse.move = false;
	}

	function resize() {
		if (autoFull || autoFullOnMobile) {
			if (autoFullOnMobile && (canvasWidth > window.innerWidth || canvasHeight > window.innerHeight)) {
				_chljs.isFullscreen = true;
			} else if (autoFull && screen.width - window.innerWidth < 2 && screen.height - window.innerHeight < 2) {
				_chljs.isFullscreen = true;
			} else {
				_chljs.isFullscreen = false;
			}
		}
		if (_chljs.isFullscreen) {
			_chljs.buffer.width = window.innerWidth;
			_chljs.buffer.height = window.innerHeight;
			_chljs.buffer.style.top = '0';
			_chljs.buffer.style.left = '0';
			_chljs.buffer.style.position = 'fixed';
			if (fullMode > 2) {
				if (fullMode % 2 === 0) {
					if (fullMode !== 4 || window.innerWidth < window.innerHeight) {
						_self.view.height = ~~(canvasWidth * window.innerHeight / window.innerWidth);
					} else {
						_self.view.height = canvasHeight;
					}
				} else {
					if (fullMode !== 3 || window.innerHeight < window.innerWidth) {
						_self.view.width = ~~(canvasHeight * window.innerWidth / window.innerHeight);
					} else {
						_self.view.width = canvasWidth;
					}
				}
				if (window.console) {
					window.console.log(_self.view.width, _self.view.height);
				}
			}
			var w = window.innerWidth / _self.view.width,
				h = window.innerHeight / _self.view.height;
			_chljs.viewScale = (fullMode === 1) ? Math.max(h, w) : Math.min(h, w);
			_chljs.offsetLeft = ~~((window.innerWidth - _self.view.width * _chljs.viewScale) / 2);
			_chljs.offsetTop = ~~((window.innerHeight - _self.view.height * _chljs.viewScale) / 2);
			document.getElementsByTagName('body')[0].style.overflow = 'hidden';
		} else {
			_chljs.viewScale = 1;
			_chljs.offsetLeft = 0;
			_chljs.offsetTop = 0;
			_chljs.buffer.height = canvasHeight;
			_chljs.buffer.width = canvasWidth;
			_chljs.buffer.style.position = '';
			document.getElementsByTagName('body')[0].style.overflow = '';
		}
	}

	function init() {
		_self.view = document.createElement('canvas');
		_self.view.width = canvasWidth;
		_self.view.height = canvasHeight;
		_ctx = _self.view.getContext('2d');
		_g2 = _chljs.buffer.getContext('2d');
		_chljs.view = _self.view;
		World.setSize(canvasWidth, canvasHeight);
		_self.onReady();
		resize();
		run();
	}
	
	window.addEventListener('DOMContentLoaded', preload, false);
	window.addEventListener('load', init, false);
	window.addEventListener('resize', resize, false);
}
