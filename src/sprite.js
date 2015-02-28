/**
 * Chloe.js: Canvas HTML5 Light Open Engine - Sprite.js
 * @author daPhyre
 * @version 1.0.0, Fr/27/Feb/15
 */

/*jslint es5: true, nomen: true */
/*global _chljs, World */
function Sprite(x, y, width, height, type) {
	this.ox = (isNaN(x)) ? 0 : x;
	this.oy = (isNaN(y)) ? 0 : y;
	this.ohealth = 1;
	this.width = (isNaN(width)) ? 0 : width;
	this.height = (isNaN(height)) ? this.width : height;
	this.type = (isNaN(type)) ? 0 : type;

	this.x = 0;
	this.y = 0;
	this.vx = 0;
	this.vy = 0;
	this.health = 0;
	this.rotation = 0;
	this.scale = 1;
	this.vflip = false;
	this.hflip = false;
	this.mapOffset = 0;

	this.reset();
}

Sprite.prototype = {
	get left() {
		return this.x - this.getWidth() / 2;
	},
	set left(value) {
		this.x = value + this.getWidth() / 2;
	},
	
	get right() {
		return this.x + this.getWidth() / 2;
	},
	set right(value) {
		this.x = value - this.getWidth() / 2;
	},
	
	get top() {
		return this.y - this.getHeight() / 2;
	},
	set top(value) {
		this.y = value + this.getHeight() / 2;
	},
	
	get bottom() {
		return this.y + this.getHeight() / 2;
	},
	set bottom(value) {
		this.y = value - this.getHeight() / 2;
	},
	
	setOrigin: function (x, y) {
		if (y !== undefined) {
			this.ox = x;
			this.oy = y;
		} else if (window.console) {
			window.console.error('Data missing in Sprite.setOrigin(x, y)');
		}
	},
	
	setHealth: function (health) {
		if (health !== undefined) {
			this.ohealth = health;
			this.health = health;
		} else if (window.console) {
			window.console.error('Data missing in Sprite.setHealth(health)');
		}
	},
	
	setPosition: function (x, y) {
		if (y !== undefined) {
			this.x = x;
			this.y = y;
		} else if (window.console) {
			window.console.error('Data missing in Sprite.setPosition(x, y)');
		}
	},
	
	resetPosition: function () {
		this.x = this.ox;
		this.y = this.oy;
	},
	
	reset: function () {
		this.x = this.ox;
		this.y = this.oy;
		this.health = this.ohealth;
		this.vx = 0;
		this.vy = 0;
		this.rotation = 0;
		this.scale = 1;
	},
	
	move: function (m) {
		m = (m === undefined) ? 1 : m;
		this.x += this.vx * m;
		this.y += this.vy * m;
	},
	
	setDirection: function (angle, speed) {
		if (speed !== undefined) {
			this.vx = speed * Math.cos(angle * Math.DEG);
			this.vy = speed * Math.sin(angle * Math.DEG);
		} else if (window.console) {
			window.console.error('Data missing in Sprite.setDirection(angle, speed)');
		}
	},
	
	getAngle: function (spr) {
		var angle = 0;
		if (spr !== undefined) {
			angle = (Math.atan2(this.y - spr.y, this.x - spr.x)) / Math.DEG + 90;
		} else {
			angle = (Math.atan2(this.vy, this.vx)) / Math.DEG;
		}
		if (angle > 360) {
			angle -= 360;
		}
		if (angle < 0) {
			angle += 360;
		}
		return angle;
	},
	
	getSpeed: function () {
		return this.vx / Math.cos(Math.DEG * this.getAngle());
	},
	
	getWidth: function () {
		return this.width * this.scale;
	},
	
	getHeight: function () {
		return this.height * this.scale;
	},
	
	getDiameter: function (inner) {
		if (inner !== undefined && inner) {
			return Math.min(this.width, this.height) * this.scale;
		} else {
			return Math.max(this.width, this.height) * this.scale;
		}
	},
	
	distance: function (spr, inner) {
		if (spr !== undefined) {
			var dx = this.x - spr.x,
				dy = this.y - spr.y;
			return (Math.sqrt(dx * dx + dy * dy) - (this.getDiameter(inner) / 2 + spr.getDiameter(inner) / 2));
		} else if (window.console) {
			window.console.error('Data missing in Sprite.distance(spr[, inner])');
		}
		return false;
	},
	
	contains: function (rect_x, y, width, height) {
		if (rect_x !== undefined) {
			var x = rect_x;
			if (typeof rect_x === 'object') {
				x = rect_x.x || 0;
				y = rect_x.y || 0;
				width = rect_x.width || 0;
				height = rect_x.height || 0;
			} else if (y !== undefined) {
				width = width || 0;
				height = height || 0;
			} else {
				if (window.console) {
					window.console.error('Data missing in Sprite.contains(x, y[, width, height])');
				}
				return false;
			}
			return (this.left < x + width &&
				this.right > x + width &&
				this.top < y + height &&
				this.bottom > y + height);
		} else if (window.console) {
			window.console.error('Data missing in Sprite.contains(rect)');
		}
		return false;
	},
	
	intersects: function (rect_x, y, width, height) {
		if (rect_x !== undefined) {
			var x = rect_x;
			if (typeof rect_x === 'object') {
				x = rect_x.x || 0;
				y = rect_x.y || 0;
				width = rect_x.width || 0;
				height = rect_x.height || 0;
			} else if (height === undefined) {
				if (window.console) {
					window.console.error('Data missing in Sprite.intersects(x, y, width, height)');
				}
				return false;
			}
			return (this.left < x + width &&
				this.right > x &&
				this.top < y + height &&
				this.bottom > y);
		} else if (window.console) {
			window.console.error('Data missing in Sprite.intersects(rect)');
		}
		return false;
	},
	
	collisionCircle: function (spr, inner) {
		if (spr !== undefined) {
			return this.distance(spr, inner) < 0;
		} else if (window.console) {
			window.console.error('Data missing in Sprite.collisionCircle(spr[, inner])');
		}
		return false;
	},
	
	collisionPoint: function (x, y) {
		if (y !== undefined) {
			return this.contains(x, y);
		} else if (window.console) {
			window.console.error('Data missing in Sprite.collisionPoint(x, y)');
		}
		return false;
	},
	
	collisionBox: function (spr, hx, hy) {
		if (spr !== undefined) {
			if (hy !== undefined) {
				return spr.contains(this.x + hx, this.y + hy);
			} else {
				return this.intersects(spr.left, spr.top, spr.getWidth(), spr.getHeight());
			}
		} else if (window.console) {
			window.console.error('Data missing in Sprite.collisionBox(spr[, hotspotX, hotspotY])');
		}
		return false;
	},
	
	collisionMap: function (type, hx, hy, exception) {
		var i = 0,
			l = 0;
		if (!isNaN(hx)) {
			hx += this.x;
		}
		if (!isNaN(hy)) {
			hy += this.y;
		}
		for (i = 1, l = World.map.length; i < l; i += 1) {
			var spr = World.map[i];
			if (((type !== undefined) ? type === spr.type : true) &&
					((exception !== undefined) ? exception !== i : true) &&
					(hx || this.left) < spr.right &&
					(hx || this.right) > spr.left &&
					(hy || this.top) < spr.bottom &&
					(hy || this.bottom) > spr.top) {
				return i;
			}
		}
		return 0;
	},
	
	collisionMapClosest: function (type, hx, hy) {
		var collision = 0,
			closest = this.getDiameter() / 2,
			i = 0,
			l = 0;
		if (!isNaN(hx)) {
			hx += this.x;
		}
		if (!isNaN(hy)) {
			hy += this.y;
		}
		for (i = 1, l = World.map.length; i < l; i += 1) {
			var spr = World.map[i];
			if (((type !== undefined) ? type === spr.type : true) &&
					(hx || this.left) < spr.right &&
					(hx || this.right) > spr.left &&
					(hy || this.top) < spr.bottom &&
					(hy || this.bottom) > spr.top) {
				var d = this.distance(World.map[i]);
				if (d < closest) {
					collision = i;
					closest = d;
				}
			}
		}
		return collision;
	},
	
	collisionMapFunction: function (f) {
		if (typeof (f) === 'function') {
			var i = 0,
				l = 0;
			for (i = 1, l = World.map.length; i < l; i += 1) {
				var spr = World.map[i];
				if (this.left < spr.right &&
						this.right > spr.left &&
						this.top < spr.bottom &&
						this.bottom > spr.top) {
					f(spr);
				}
			}
		} else if (window.console) {
			window.console.error('Data missing in Sprite.collisionMapfunction (function)');
		}
	},
	
	collisionMapRange: function (typeMin, typeMax, hx, hy, exception) {
		if (!isNaN(hx)) {
			hx += this.x;
		}
		if (!isNaN(hy)) {
			hy += this.y;
		}
		if (typeMax !== undefined) {
			var i = 0,
				l = 0;
			for (i = 1, l = World.map.length; i < l; i += 1) {
				var spr = World.map[i];
				if (((exception !== undefined) ? exception !== i : true) &&
						spr.type >= typeMin &&
						spr.type <= typeMax &&
						(hx || this.left) < spr.right &&
						(hx || this.right) > spr.left &&
						(hy || this.top) < spr.bottom &&
						(hy || this.bottom) > spr.top) {
					return i;
				}
			}
			return 0;
		} else if (window.console) {
			window.console.error('Data missing in Sprite.collisionMapRange(typeMin, typeMax[, hotspotX, hotspotY, exception])');
		}
		return false;
	},
	
	collisionMapSwitch: function (type, newType, hx, hy, exception) {
		if (!isNaN(hx)) {
			hx += this.x;
		}
		if (!isNaN(hy)) {
			hy += this.y;
		}
		if (newType !== undefined) {
			var collision = false,
				i = 0,
				l = 0;
			for (i = 1, l = World.map.length; i < l; i += 1) {
				var spr = World.map[i];
				if (((exception !== undefined) ? exception !== i : true) &&
						((type !== undefined) ? type === spr.type : true) &&
						(hx || this.left) < spr.right &&
						(hx || this.right) > spr.left &&
						(hy || this.top) < spr.bottom &&
						(hy || this.bottom) > spr.top) {
					if (newType > 0) {
						spr.type = newType;
					} else {
						World.map.remove(i);
						i -= 1;
						l -= 1;
					}
					collision = true;
				}
			}
			return collision;
		} else if (window.console) {
			window.console.error('Data missing in Sprite.collisionMapSwitch(type, newType[, hotspotX, hotspotY, exception])');
		}
		return false;
	},
	
	drawSprite: function (ctx, img, ox, oy) {
		if (ctx !== undefined) {
			if (img !== undefined) {
				ox = (isNaN(ox)) ? 0 : ox;
				oy = (isNaN(oy)) ? 0 : oy;
				var h = (this.hflip) ? -1 : 1,
					v = (this.vflip) ? -1 : 1;
				ctx.save();
				ctx.translate(this.x + ox - World.cam.x, this.y + oy - World.cam.y);
				ctx.rotate(this.rotation * Math.DEG);
				ctx.scale(this.scale * h, this.scale * v);
				ctx.drawImage(img, img.width * -0.5, img.height * -0.5);
				ctx.restore();
			}
			if (_chljs.screenDebug || img === undefined || img.naturalWidth === 0) {
				ctx.strokeStyle = '#fff';
				ctx.beginPath();
				ctx.moveTo(this.left - World.cam.x, this.y - World.cam.y);
				ctx.lineTo(this.right - World.cam.x, this.y - World.cam.y);
				ctx.moveTo(this.x - World.cam.x, this.top - World.cam.y);
				ctx.lineTo(this.x - World.cam.x, this.bottom - World.cam.y);
				//ctx.closePath();
				ctx.stroke();
				ctx.strokeStyle = '#0f0';
				ctx.strokeRect(this.left - World.cam.x, this.top - World.cam.y, this.width * this.scale, this.height * this.scale);
				ctx.strokeStyle = '#0ff';
				ctx.beginPath();
				ctx.arc(this.x - World.cam.x, this.y - World.cam.y, Math.min(this.width, this.height) * this.scale / 2, 0, Math.PI * 2, true);
				ctx.closePath();
				ctx.stroke();
				ctx.strokeStyle = '#00f';
				ctx.beginPath();
				ctx.arc(this.x - World.cam.x, this.y - World.cam.y, Math.max(this.width, this.height) * this.scale / 2, 0, Math.PI * 2, true);
				ctx.closePath();
				ctx.stroke();
			}
		} else if (window.console) {
			window.console.error('Data missing in Sprite.drawSprite(ctx[, img, offsetX, offsetY])');
		}
		return false;
	}
};
