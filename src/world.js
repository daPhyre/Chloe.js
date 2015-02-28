/**
 * Chloe.js: Canvas HTML5 Light Open Engine - World.js
 * @author daPhyre
 * @version 1.0.0, Fr/27/Feb/15
 */

/*jslint nomen: true */
/*global _chljs, Camera, Input, Sprite, SpriteSheet, SpriteVector */
var World = {
	width: 0,
	height: 0,
	map: new SpriteVector(),
	cam: new Camera(),
	loopX: false,
	loopY: false,

	setMap: function (map, width, height, cols) {
		if (width !== undefined) {
			height = (height === undefined) ? width : height;
			var _c = (cols === undefined) ? map.shift() : cols;
			this.width = _c * width;
			this.height = Math.ceil(map.length / _c) * height;
			this.map.length = 0;
			this.map.push(new Sprite(0, 0, 0)); //dummy
			this.map.addMap(map, width, height, _c);
			if (cols) {
				map.unshift(_c);
			}
		} else if (window.console) {
			window.console.error('Data missing in World.setMap(map, cols, width[, height])');
		}
	},

	setSize: function (width, height) {
		if (height !== undefined) {
			this.width = width;
			this.height = height;
		} else if (window.console) {
			window.console.error('Data missing in World.setSize(width, height)');
		}
	},

	drawMap: function (ctx, img) {
		if (ctx !== undefined) {
			var i = 0,
				l = 0;
			ctx.strokeStyle = '#f00';
			ctx.fillStyle = '#f00';
			for (i = 1, l = this.map.length; i < l; i += 1) {
				var spr = this.map[i];
				if (img !== undefined) {
					if (img instanceof SpriteSheet) {
						img.draw(ctx, spr.left - this.cam.x, spr.top - this.cam.y, spr.type + spr.mapOffset);
						if (this.loopX) {
							if (this.cam.x < 0) {
								img.draw(ctx, spr.left - this.width - this.cam.x, spr.top - this.cam.y, spr.type + spr.mapOffset);
							} else {
								img.draw(ctx, spr.left + this.width - this.cam.x, spr.top - this.cam.y, spr.type + spr.mapOffset);
							}
						}
						if (this.loopY) {
							if (this.cam.y < 0) {
								img.draw(ctx, spr.left - this.cam.x, spr.top - this.height - this.cam.y, spr.type + spr.mapOffset);
							} else {
								img.draw(ctx, spr.left - this.cam.x, spr.top + this.height - this.cam.y, spr.type + spr.mapOffset);
							}
						}
					} else {
						var tImg;
						if (img instanceof Array) {
							tImg = img[spr.type + spr.mapOffset];
						} else {
							tImg = img;
						}
						ctx.drawImage(tImg, spr.left - this.cam.x, spr.top - this.cam.y);
						if (this.loopX) {
							if (this.cam.x < 0) {
								ctx.drawImage(tImg, spr.left - this.width - this.cam.x, spr.top - this.cam.y);
							} else {
								ctx.drawImage(tImg, spr.left + this.width - this.cam.x, spr.top - this.cam.y);
							}
						}
						if (this.loopY) {
							if (this.cam.y < 0) {
								ctx.drawImage(tImg, spr.left - this.cam.x, spr.top - this.height - this.cam.y);
							} else {
								ctx.drawImage(tImg, spr.left - this.cam.x, spr.top + this.height - this.cam.y);
							}
						}
					}
				}
				if (_chljs.screenDebug || img === undefined || img.naturalWidth === 0) {
					ctx.strokeRect(spr.left - this.cam.x, spr.top - this.cam.y, spr.width, spr.height);
					ctx.fillText(i, spr.left - this.cam.x, spr.top + spr.width - this.cam.y);
				}
			}
			if (_chljs.screenDebug) {
				ctx.strokeStyle = '#999';
				ctx.strokeRect(-this.cam.x, -this.cam.y, this.width, this.height);
				for (i = 0, l = Input.touches.length; i < l; i += 1) {
					Input.touches[i].draw(ctx);
				}
				Input.mouse.draw(ctx);
			}
		} else if (window.console) {
			window.console.error('Data missing in World.drawMap(ctx[, img, imagesPerRow])');
		}
	}
};
