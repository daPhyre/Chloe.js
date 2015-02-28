/**
 * Chloe.js: Canvas HTML5 Light Open Engine - Toast.js
 * @author daPhyre
 * @version 1.0.0, Fr/27/Feb/15
 */

/*jslint nomen: true */
/*global _chljs */
var Toast = {
	text: '',
	time: 0,
	offset: 0,
	
	makeText: function (string, time) {
		if (time !== undefined) {
			this.text = string;
			this.time = time;
			this.offset = 0;
		} else if (window.console) {
			window.console.error('Data missing in Toast.makeText(string, time)');
		}
	},
	
	update: function (deltaTime) {
		if (this.time > 0) {
			this.time -= deltaTime;
		}
	},
	
	paint: function (ctx) {
		if (this.time > 0) {
			ctx.font = '10px sans-serif';
			ctx.textAlign = 'center';
			if (this.offset === 0) {
				this.offset = ctx.measureText(this.text).width / 2;
			}
			if (this.time < 1) {
				ctx.globalAlpha = this.time;
			}
			var hw = _chljs.view.width / 2,
				h = _chljs.view.height;
			ctx.fillStyle = '#333';
			ctx.beginPath();
			ctx.rect(hw - this.offset, h - 20, this.offset * 2, 16);
			ctx.beginPath();
			ctx.arc(hw - this.offset, h - 12, 8, Math.PI * 1.5, Math.PI * 0.5, true);
			ctx.arc(hw + this.offset, h - 12, 8, Math.PI * 0.5, Math.PI * 1.5, true);
			ctx.fill();
			ctx.fillStyle = '#ccc';
			ctx.fillText(this.text, hw, h - 8);
			ctx.globalAlpha = 1;
			ctx.textAlign = 'left';
		}
	}
};
