/**
 * Chloe.js: Canvas HTML5 Light Open Engine - SpriteSheet.js
 * @author daPhyre
 * @version 1.0.0, Fr/27/Feb/15
 */

/*jslint bitwise: true, nomen: true */
/*global _chljs, World */
function SpriteSheet(img, spriteWidth, spriteHeight) {
	this.img = null;
	var _spriteWidth,
		_spriteHeight;

	this.SpriteSheet = function (img, spriteWidth, spriteHeight) {
		if (spriteWidth !== undefined) {
			this.img = img;
			_spriteWidth = spriteWidth;
			_spriteHeight = (spriteHeight === undefined) ? spriteWidth : spriteHeight;
		} else if (window.console) {
			window.console.error('Data missing in SpriteSheet(image, spriteWidth[, _spriteHeight])');
		}
	};
	this.SpriteSheet(img, spriteWidth, spriteHeight);

	this.draw = function (ctx, x, y, col, row) {
		if (y !== undefined) {
			col = (isNaN(col)) ? 0 : col;
			if (isNaN(row) && this.img.width) {
				var ipr = col * Math.round(this.img.width / _spriteWidth);
				if (col > ipr) {
					col = col % ipr;
					row = ~~(col / ipr);
				} else {
					row = 0;
				}
			}
			try {
				ctx.drawImage(this.img, col * _spriteWidth, row * _spriteHeight, _spriteWidth, _spriteHeight, x, y, _spriteWidth, _spriteHeight);
			} catch (e) {
				if (window.console) {
					window.console.error(e + ' Area: ' + col * _spriteWidth + ',' + row * _spriteHeight + ',' + _spriteWidth + ',' + _spriteHeight);
				}
			}
		} else if (window.console) {
			window.console.error('Data missing in SpriteSheet.draw(ctx, x, y[, col, row])');
		}
	};

	this.drawArea = function (ctx, x, y, ax, ay, aw, ah) {
		if (ah !== undefined) {
			try {
				ctx.drawImage(this.img, ax, ay, aw, ah, x, y, aw, ah);
			} catch (e) {
				if (window.console) {
					window.console.error(e + ' Area: ' + ax + ',' + ay + ',' + aw + ',' + ah);
				}
			}
		} else if (window.console) {
			window.console.error('Data missing in SpriteSheet.drawArea(ctx ,x, y, areaX, areaY, areaWidth, areaHeight)');
		}
	};

	this.drawSprite = function (ctx, spr, col, row, ox, oy) {
		if (spr !== undefined) {
			col = (isNaN(col)) ? 0 : col;
			ox = (isNaN(ox)) ? 0 : ox;
			oy = (isNaN(oy)) ? 0 : oy;
			var h = (spr.hflip) ? -1 : 1,
				v = (spr.vflip) ? -1 : 1;
			if (isNaN(row) && this.img.width) {
				var ipr = Math.round(this.img.width / _spriteWidth);
				if (col > ipr) {
					col = col % ipr;
					row = ~~(col / ipr);
				} else {
					row = 0;
				}
			}
			ctx.save();
			ctx.translate(spr.x + ox - World.cam.x, spr.y + oy - World.cam.y);
			ctx.rotate(spr.rotation * Math.DEG);
			ctx.scale(spr.scale * h, spr.scale * v);
			try {
				ctx.drawImage(this.img, _spriteWidth * col, _spriteHeight * row, _spriteWidth, _spriteHeight, _spriteWidth * -0.5, _spriteHeight * -0.5, _spriteWidth, _spriteHeight);
			} catch (e) {
				if (window.console) {
					window.console.error(e + ' Area: ' + col * _spriteWidth + ',' + row * _spriteHeight + ',' + _spriteWidth + ',' + _spriteHeight);
				}
			}
			ctx.restore();
			if (_chljs.screenDebug) {
				spr.drawSprite(ctx);
			}
		} else if (window.console) {
			window.console.error('Data missing in SpriteSheet.drawSprite(ctx,spr[,col,row,offsetX,offsetY])');
		}
	};

	this.drawSpriteFromArea = function (ctx, spr, ax, ay, aw, ah, ox, oy) {
		if (ah !== undefined) {
			ox = (isNaN(ox)) ? 0 : ox;
			oy = (isNaN(oy)) ? 0 : oy;
			var h = (spr.hflip) ? -1 : 1,
				v = (spr.vflip) ? -1 : 1;
			ctx.save();
			ctx.translate(spr.x + ox - World.cam.x, spr.y + oy - World.cam.y);
			ctx.rotate(spr.rotation * Math.DEG);
			ctx.scale(spr.scale * h, spr.scale * v);
			try {
				ctx.drawImage(this.img, ax, ay, aw, ah, aw * -0.5, ah * -0.5, aw, ah);
			} catch (e) {
				if (window.console) {
					window.console.error(e + ' Area: ' + ax + ',' + ay + ',' + aw + ',' + ah);
				}
			}
			ctx.restore();
			if (_chljs.screenDebug) {
				spr.drawSprite(ctx);
			}
		} else if (window.console) {
			window.console.error('Data missing in SpriteSheet.drawSprite(ctx, spr, areaX, areaY, areaWidth, areaHeight[, offsetX, offsetY])');
		}
	};
}
