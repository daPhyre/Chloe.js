/**
 * Chloe.js: Canvas HTML5 Light Open Engine - Camera.js
 * @author daPhyre
 * @version 1.0.0, Fr/27/Feb/15
 */

/*jslint bitwise: true, nomen: true */
/*global _chljs, World */
function Camera(keepInWorld) {
	this.keepInWorld = (keepInWorld === undefined) ? true : keepInWorld;
}

Camera.prototype = {
	x: 0,
	y: 0,
	focus: function (spr, slide, ox, oy) {
		if (spr !== undefined) {
			slide = (isNaN(slide)) ? 0 : slide;
			ox = (isNaN(ox)) ? 0 : ox;
			oy = (isNaN(oy)) ? ox : oy;
			var cx = ~~(spr.x - _chljs.view.width / 2),
				cy = ~~(spr.y - _chljs.view.height / 2);
			if (World.width < _chljs.view.width || World.width - ox * 2 < _chljs.view.width) {
				this.x = World.width / 2 - _chljs.view.width / 2;
			} else {
				if (slide && Math.abs(cx - this.x) > slide) {
					if (cx > this.x) {
						this.x += slide;
					} else {
						this.x -= slide;
					}
				} else {
					this.x = cx;
				}
				if (this.keepInWorld && !World.loopX) {
					if (this.x < ox) {
						this.x = ox;
					} else if (this.x > World.width - _chljs.view.width - ox) {
						this.x = World.width - _chljs.view.width - ox;
					}
				}
			}
			if (World.height < _chljs.view.height || World.height - oy * 2 < _chljs.view.height) {
				this.y = World.height / 2 - _chljs.view.height / 2;
			} else {
				if (slide && Math.abs(cy - this.y) > slide) {
					if (cy > this.y) {
						this.y += slide;
					} else {
						this.y -= slide;
					}
				} else {
					this.y = cy;
				}
				if (this.keepInWorld && !World.loopY) {
					if (this.y < oy) {
						this.y = oy;
					} else if (this.y > World.height - _chljs.view.height - oy) {
						this.y = World.height - _chljs.view.height - oy;
					}
				}
			}
		} else if (window.console) {
			window.console.error('Data missing in Camera.focus(spr[, slide, offsetX, offsetY])');
		}
	}
};
