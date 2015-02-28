/**
 * Chloe.js: Canvas HTML5 Light Open Engine - Particle.js
 * @author daPhyre
 * @version 1.0.0, Fr/27/Feb/15
 */

/*jslint bitwise: true, nomen: true */
function Particle(x, y, diameter, life, speed, angle, colorStart, colorEnd) {
	this.x = 0;
	this.y = 0;
	this.ox = 0;
	this.oy = 0;
	this.diameter = 0;
	this.life = 0;
	this.olife = 0;
	this.speed = 0;
	this.angle = 0;
	this.rotation = 0;
	this.color = '#000';
	this.colorList = [];
	this.Particle(x, y, diameter, life, speed, angle, colorStart, colorEnd);
}

Particle.prototype = {
	Particle: function (x, y, diameter, life, speed, angle, colorStart, colorEnd) {
		if (colorStart !== undefined) {
			this.x = x;
			this.y = y;
			this.ox = x;
			this.oy = y;
			this.diameter = diameter + 1;
			this.life = life;
			this.olife = life;
			this.speed = speed;
			this.angle = angle;
			this.rotation = angle;
			this.color = colorStart;

			if (colorEnd !== undefined) {
				var cStart = this._hex2rgb(colorStart),
					cEnd = this._hex2rgb(colorEnd),
					red = ~~((cStart[0] - cEnd[0]) / (life * 1000 + 1)),
					green = ~~((cStart[1] - cEnd[1]) / (life * 1000 + 1)),
					blue = ~~((cStart[2] - cEnd[2]) / (life * 1000 + 1)),
					i = 0,
					l = 0;
				for (i = 0; i < life * 1000; i += 1) {
					this.colorList.push('rgb(' + (cStart[0] - (i * red)) + ',' + (cStart[1] - (i * green)) + ',' + (cStart[2] - (i * blue)) + ')');
				}
			}
			return true;
		} else {
			if (window.console) {
				window.console.error('Data missing in Particle(x, y, diameter, life, speed, angle, colorStart[, colorEnd])');
			}
			return false;
		}
	},
	/*
	_rgb2hex: function (r, g, b) {
		return '#' + this._clr2hex(r) + this._clr2hex(g) + this._clr2hex(b);
	},
	
	_clr2hex: function (n) {
		n = parseInt(n, 10);
		if (isNaN(n)) {
			return '00';
		}
		n = Math.max(0, Math.min(n, 255));
		return '0123456789ABCDEF'.charAt((n - n % 16) / 16) + '0123456789ABCDEF'.charAt(n % 16);
	},
	*/
	_hex2rgb: function (h) {
		if (h.charAt(0) === '#') {
			var c = [];
			h = h.substring(1, 7);
			if (h.length === 3) {
				c[0] = parseInt(h.charAt(0), 16) * 17;
				c[1] = parseInt(h.charAt(1), 16) * 17;
				c[2] = parseInt(h.charAt(2), 16) * 17;
			} else {
				c[0] = parseInt(h.substr(0, 2), 16);
				c[1] = parseInt(h.substr(2, 2), 16);
				c[2] = parseInt(h.substr(4, 2), 16);
			}
			return c;
		} else if (window.console) {
			window.console.log('Error: Color is not hexadecimal');
		}
		return [0, 0, 0];
	}
};
