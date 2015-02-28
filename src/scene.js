/**
 * Chloe.js: Canvas HTML5 Light Open Engine - Scene.js
 * @author daPhyre
 * @version 1.0.0, Fr/27/Feb/15
 */

/*jslint nomen: true */
/*global _chljs */
function Scene() {
	this.id = _chljs.scenes.length;
	_chljs.scenes.push(this);
}

Scene.prototype = {
	load: function () {},
	act: function (dt) {},
	paint: function (ctx) {
		ctx.fillText('Scene ' + this.id, 20, 30);
	}
};
