/**
 * Chloe.js: Canvas HTML5 Light Open Engine - Button.js
 * @author daPhyre
 * @version 1.0.0, Fr/27/Feb/15
 */

/*jslint nomen: true */
/*global _chljs, Input, World */
function Button(x, y, width, height) {
	this.x = (isNaN(x)) ? 0 : x;
	this.y = (isNaN(y)) ? 0 : y;
	this.width = (isNaN(width)) ? 0 : width;
	this.height = (isNaN(height)) ? this.width : height;
}

Button.prototype = {
	up: function () {
		return (
			this.x >= Input.mouse.x && this.x + this.width <= Input.mouse.x &&
			this.y >= Input.mouse.y && this.y + this.height <= Input.mouse.y
		);
	},
	over: function () {
		return (
			this.x < Input.mouse.x && this.x + this.width > Input.mouse.x &&
			this.y < Input.mouse.y && this.y + this.height > Input.mouse.y
		);
	},
	down: function () {
		return (
			Input.pressing[1] &&
			this.x < Input.mouse.x && this.x + this.width > Input.mouse.x &&
			this.y < Input.mouse.y && this.y + this.height > Input.mouse.y
		);
	},
	hit: function () {
		return (
			Input.lastRelease === 1 &&
			this.x < Input.mouse.ox && this.x + this.width > Input.mouse.ox &&
			this.y < Input.mouse.oy && this.y + this.height > Input.mouse.oy &&
			this.x < Input.mouse.x && this.x + this.width > Input.mouse.x &&
			this.y < Input.mouse.y && this.y + this.height > Input.mouse.y
		);
	},
	touch: function () {
		var i = 0,
			l = 0;
		for (i = 0, l = Input.touches.length; i < l; i += 1) {
			if (this.x < Input.touches[i].x && this.x + this.width > Input.touches[i].x &&
					this.y < Input.touches[i].y && this.y + this.height > Input.touches[i].y) {
				return true;
			}
		}
		return false;
	},
	tap: function () {
		if (Input.lastPress === 1) {
			var i = 0,
				l = 0;
			for (i = 0, l = Input.touches.length; i < l; i += 1) {
				if (this.x < Input.touches[i].x && this.x + this.width > Input.touches[i].x &&
						this.y < Input.touches[i].y && this.y + this.height > Input.touches[i].y) {
					return true;
				}
			}
		}
		return false;
	},
	draw: function (ctx, img, ox, oy) {
		if (ctx !== undefined) {
			if (img !== undefined) {
				ox = (isNaN(ox)) ? 0 : ox;
				oy = (isNaN(oy)) ? 0 : oy;
				ctx.drawImage(img, this.x + World.cam.x + ox, this.y + World.cam.y + oy);
			}
			if (_chljs.screenDebug || img === undefined || img.naturalWidth === 0) {
				if (this.over()) {
					if (Input.pressing[1]) {
						ctx.strokeStyle = '#fff';
					} else {
						ctx.strokeStyle = '#0ff';
					}
				} else {
					ctx.strokeStyle = '#00f';
				}
				ctx.strokeRect(this.x + World.cam.x, this.y + World.cam.y, this.width, this.height);
			}
		} else if (window.console) {
			window.console.error('Data missing in Button.draw(ctx[, img, offsetX, offsetY])');
		}
	}
};
