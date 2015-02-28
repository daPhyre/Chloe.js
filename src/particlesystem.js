/**
 * Chloe.js: Canvas HTML5 Light Open Engine - ParticleSystem.js
 * @author daPhyre
 * @version 1.0.0, Fr/27/Feb/15
 */

/*jslint nomen: true */
/*global _chljs, Particle, World */
function ParticleSystem() {
	this.gravity = 0;
	this.wind = 0;
	this.moveOrigin = false;
	_chljs.runnable.push(this);
}
ParticleSystem.prototype = [];

ParticleSystem.prototype.addParticle = function (p_x, y, diameter, life, speed, angle, colorStart, colorEnd) {
	if (typeof p_x === 'object') {
		this.push(p_x);
	} else {
		this.push(new Particle(p_x, y, diameter, life, speed, angle, colorStart, colorEnd));
	}
};

ParticleSystem.prototype.drawParticles = function (ctx, alpha, img) {
	var i = 0,
		l = 0;
	if (img !== undefined) {
		for (i = 0, l = this.length; i < l; i += 1) {
			ctx.save();
			if (alpha) {
				ctx.globalAlpha = this[i].life / this[i].olife;
			}
			ctx.translate(this[i].x - World.cam.x, this[i].y - World.cam.y);
			ctx.rotate(this[i].rotation * Math.DEG);
			ctx.drawImage(img, img.width * -0.5, img.height * -0.5);
			ctx.restore();
		}
	} else if (ctx !== undefined) {
		for (i = 0, l = this.length; i < l; i += 1) {
			ctx.fillStyle = this[i].color;
			ctx.save();
			if (alpha) {
				ctx.globalAlpha = this[i].life / this[i].olife;
			}
			ctx.beginPath();
			ctx.arc(this[i].x - World.cam.x, this[i].y - World.cam.y, this[i].diameter / 2, 0, Math.PI * 2, true);
			ctx.closePath();
			ctx.fill();
			ctx.restore();
		}
	} else if (window.console) {
		window.console.error('Data missing in ParticleSystem.drawParticles(ctx[, img, alpha])');
	}
};

ParticleSystem.prototype.drawParticlesO = function (ctx, alpha) {
	if (ctx !== undefined) {
		var i = 0,
			l = 0;
		for (i = 0, l = this.length; i < l; i += 1) {
			ctx.strokeStyle = this[i].color;
			ctx.fillStyle = this[i].color;
			ctx.save();
			if (alpha) {
				ctx.globalAlpha = this[i].life / this[i].olife;
			}
			ctx.beginPath();
			ctx.moveTo(this[i].ox, this[i].oy);
			ctx.lineTo(this[i].x, this[i].y);
			ctx.closePath();
			ctx.stroke();
			ctx.beginPath();
			ctx.arc(this[i].x - World.cam.x, this[i].y - World.cam.y, this[i].diameter / 2, 0, Math.PI * 2, true);
			ctx.closePath();
			ctx.fill();
			ctx.restore();
		}
	} else if (window.console) {
		window.console.error('Data missing in ParticleSystem.drawParticles0(ctx[, alpha])');
	}
};

ParticleSystem.prototype.update = function (dt) {
	dt = (dt === undefined) ? 1 : dt;
	var i = 0,
		l = 0;
	for (i = 0, l = this.length; i < l; i+= 1) {
		this[i].life -= dt;
		if (this[i].life > 0) {
			if (this.moveOrigin) {
				this[i].ox = this[i].x;
				this[i].oy = this[i].y;
			}
			this[i].x += (this[i].speed * (Math.cos(this[i].angle * Math.DEG)) + this.wind * (this[i].olife - this[i].life)) * dt;
			this[i].y += (this[i].speed * (Math.sin(this[i].angle * Math.DEG)) + this.gravity * (this[i].olife - this[i].life)) * dt;
			if (this[i].colorList.length > 0) {
				this[i].color = this[i].colorList.shift();
			}
		} else {
			this.remove(i);
			i -= 1;
			l -= 1;
		}
	}
};
