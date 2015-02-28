/**
 * Chloe.js: Canvas HTML5 Light Open Engine - Util.js
 * @author daPhyre
 * @version 1.0.0, Fr/27/Feb/15
 */

/*jslint bitwise: true, nomen: true */
/*global _chljs, Audio: false */
var Util = {
	getAngle: function (x1, y1, x2, y2) {
		if (y2 !== undefined) {
			var angle = (Math.atan2(y1 - y2, x1 - x2)) / Math.DEG + 90;
			if (angle > 360) {
				angle -= 360;
			}
			if (angle < 0) {
				angle += 360;
			}
			return angle;
		} else if (window.console) {
			window.console.error('Data missing in Util.getAngle(x1, y1, x2, y2)');
		}
	},

	getDistance: function (x1, y1, x2, y2) {
		if (y2 !== undefined) {
			var dx = x1 - x2,
				dy = y1 - y2;
			return (Math.sqrt(dx * dx + dy * dy));
		} else if (window.console) {
			window.console.error('Data missing in Util.getDistance(x1, y1, x2, y2)');
		}
	},

	getImage: function (str) {
		var img = new Image();
		if (str !== undefined) {
			img.src = str;
		}
		return img;
	},

	getAudio: function (str) {
		var aud = new Audio();
		if (str !== undefined) {
			if (aud.canPlayType('audio/ogg').replace(/no/, '')) {
				aud.src = str.substr(0, str.lastIndexOf('.')) + '.oga';
			} else {
				aud.src = str;
			}
		}
		return aud;
	},

	fillTile: function (ctx, img, x, y, repeatx, repeaty) {
		if (img !== undefined) {
			if (img.width > 0 && img.height > 0) {
				x = (isNaN(x)) ? 0 : x;
				y = (isNaN(y)) ? 0 : y;
				var a = 0,
					b = 0;
				repeatx = (repeatx === undefined) ? true : repeatx;
				repeaty = (repeaty === undefined) ? true : repeaty;
				if (repeatx) {
					a = ~~(x / img.width) * img.width;
					if (x > 0) {
						a += img.width;
					}
					while (x - a < _chljs.view.width) {
						if (repeaty) {
							b = ~~(y / img.height) * img.height;
							if (y > 0) {
								b += img.height;
							}
							while (y - b < _chljs.view.height) {
								ctx.drawImage(img, x - a, y - b);
								b -= img.height;
							}
						} else {
							ctx.drawImage(img, x - a, y - b);
						}
						a -= img.width;
					}
				} else {
					if (repeaty) {
						b = ~~(y / img.height) * img.height;
						if (y < 0) {
							b -= img.height;
						}
						while (y - b < _chljs.view.height) {
							ctx.drawImage(img, x - a, y - b);
							b -= img.height;
						}
					} else {
						ctx.drawImage(img, x - a, y - b);
					}
				}
				//console.log(a,x,b,y)
			}
		} else if (window.console) {
			window.console.error('Data missing in Util.fillTile(ctx, img[, x, y, repeatX, repeatY])');
		}
	},

	random: function (max) {
		return Math.random() * max;
	}
};
