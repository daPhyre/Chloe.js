/**
 * Chloe.js: Canvas HTML5 Light Open Engine - Animation.js
 * @author daPhyre
 * @version 1.0.0, Fr/27/Feb/15
 */

/*jslint nomen: true */
/*global _chljs, World */
function Animation(fps, img, frameWidth, frameHeight) {
	this.images = [];
	this.currentFrame = 0;
	var _frameTime = 20,
		_frameWidth = 0,
		_frameHeight = 0,
		_loops = 0,
		_mode = 0,
		_acum = 0,
		_playing = false,
		_isStrip = false;
	_chljs.runnable.push(this);

	this.Animation = function (fps, img, frameWidth, frameHeight) {
		_frameTime = (fps === undefined) ? 20 : 1000 / fps;
		if (frameWidth !== undefined) {
			_isStrip = true;
			this.images.length = 0;
			this.images.push(img);
			_frameWidth = frameWidth;
			_frameHeight = frameHeight;
			return true;
		} else {
			if (window.console) {
				window.console.error('Data missing in Animation(framesPerSecond, image, frameWidth[, frameHeight])');
			}
			return false;
		}
	};
	this.Animation(fps, img, frameWidth, frameHeight);

	this.addFrame = function (img) {
		if (img !== undefined) {
			_isStrip = false;
			this.images.push(img);
		} else if (window.console) {
			window.console.error('Data missing in Animation.addFrame(image)');
		}
	};

	this.draw = function (ctx, x, y, row) {
		if (y !== undefined) {
			ctx.strokeStyle = '#0f0';
			if (_isStrip) {
				var tImg = this.images[0];
				if (isNaN(row)) {
					ctx.drawImage(tImg, _frameWidth * this.currentFrame, 0, _frameWidth, tImg.height, x, y, _frameWidth, tImg.height);
					if (_chljs.screenDebug) {
						ctx.strokeRect(x, y, _frameWidth, tImg.height);
					}
				} else {
					ctx.drawImage(tImg, _frameWidth * this.currentFrame, _frameHeight * row, _frameWidth, _frameHeight, x, y, _frameWidth, _frameHeight);
					if (_chljs.screenDebug) {
						ctx.strokeRect(x, y, _frameWidth, _frameHeight);
					}
				}
			} else {
				ctx.drawImage(this.images[this.currentFrame], x, y);
				if (_chljs.screenDebug) {
					ctx.strokeRect(x, y, this.images[this.currentFrame].width, this.images[this.currentFrame].height);
				}
			}
		} else if (window.console) {
			window.console.error('Data missing in Animation.draw(ctx, x, y[, row])');
		}
	};

	this.drawSprite = function (ctx, spr, ox, oy, row) {
		if (spr !== undefined) {
			if (_isStrip) {
				ox = (isNaN(ox)) ? 0 : ox;
				oy = (isNaN(oy)) ? 0 : oy;
				var h = (spr.hflip) ? -1 : 1,
					v = (spr.vflip) ? -1 : 1,
					tImg = this.images[0];
				ctx.save();
				ctx.translate(spr.x + ox - World.cam.x, spr.y + oy - World.cam.y);
				ctx.rotate(spr.rotation * Math.DEG);
				ctx.scale(spr.scale * h, spr.scale * v);
				if (isNaN(row)) {
					ctx.drawImage(tImg, _frameWidth * this.currentFrame, 0, _frameWidth, tImg.height, _frameWidth * -0.5, tImg.height * -0.5, _frameWidth, tImg.height);
				} else {
					ctx.drawImage(tImg, _frameWidth * this.currentFrame, _frameHeight * row, _frameWidth, _frameHeight, _frameWidth * -0.5, _frameHeight * -0.5, _frameWidth, _frameHeight);
				}
				ctx.restore();
				if (_chljs.screenDebug) {
					spr.drawSprite(ctx);
				}
			} else {
				spr.drawSprite(ctx, this.images[this.currentFrame], ox, oy);
			}
		} else if (window.console) {
			window.console.error('Data missing in Animation.drawSprite(ctx, spr[, offsetX, offsetY, row])');
		}
	};

	this.getTotalFrames = function () {
		if (_isStrip) {
			return Math.round(this.images[0].width / _frameWidth);
		} else {
			return this.images.length;
		}
	};

	this.gotoFrame = function (frame) {
		if (!isNaN(frame)) {
			if (frame < 0) {
				frame = 0;
			} else if (frame > this.getTotalFrames() - 1) {
				frame = this.getTotalFrames() - 1;
			}
			this.currentFrame = frame;
			_acum = 0;
		} else if (window.console) {
			window.console.error('Data missing in Animation.gotoFrame(frame)');
		}
	};

	this.isPlaying = function () {
		return _playing;
	};

	this.nextFrame = function () {
		this.currentFrame += 1;
		if (this.currentFrame > this.getTotalFrames() - 1) {
			this.currentFrame = 0;
		}
		_acum = 0;
		return this.currentFrame;
	};

	this.prevFrame = function () {
		this.currentFrame -= 1;
		if (this.currentFrame < 0) {
			this.currentFrame = this.getTotalFrames() - 1;
		}
		_acum = 0;
		return this.currentFrame;
	};

	this.pause = function () {
		_playing = false;
	};

	this.play = function (loops, mode) {
		if (!isNaN(mode)) {
			_mode = mode;
		}
		if (!isNaN(loops)) {
			_loops = loops;
			if (loops !== 0) {
				_acum = 0;
				this.currentFrame = (_mode % 2 === 1) ? this.getTotalFrames() - 1 : 0;
			}
		}
		_playing = true;
	};

	this.setFPS = function (fps) {
		if (fps !== undefined) {
			_frameTime = 1000 / fps;
		} else if (window.console) {
			window.console.error('Data missing in Animation.setFPS(framesPerSecond)');
		}
	};

	this.update = function (dt) {
		dt = (dt === undefined) ? 1 : dt;
		if (_playing) {
			if (_mode % 2 === 1) {
				_acum -= dt;
			} else {
				_acum += dt;
			}
			if (_acum > _frameTime / 1000) {
				this.currentFrame += 1;
				if (this.currentFrame > this.getTotalFrames() - 1) {
					if (_mode === 2) {
						this.currentFrame -= 1;
						_mode = 3;
					} else if (_loops !== 0) {
						_loops -= 1;
						if (_loops === 0) {
							this.currentFrame -= 1;
							_playing = false;
						} else {
							this.currentFrame = 0;
						}
					} else {
						this.currentFrame = 0;
					}
				}
				_acum -= _frameTime / 1000;
			} else if (_acum < 0) {
				this.currentFrame -= 1;
				if (this.currentFrame < 0) {
					if (_mode === 3) {
						this.currentFrame += 1;
						_mode = 2;
						if (_loops !== 0) {
							_loops -= 1;
							if (_loops === 0) {
								_playing = false;
							}
						}
					} else if (_loops !== 0) {
						_loops -= 1;
						if (_loops === 0) {
							this.currentFrame += 1;
							_playing = false;
						} else {
							this.currentFrame = this.getTotalFrames() - 1;
						}
					} else {
						this.currentFrame = this.getTotalFrames() - 1;
					}
				}
				_acum += _frameTime / 1000;
			}
		}
	};
}
