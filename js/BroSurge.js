"use strict";

function BroSurge(start, broticks) {
	this._start = start;
	this._broticks = broticks;
	return Object.preventExtensions(this);
}

BroSurge.prototype = Object.create(null);
BroSurge.prototype.constructor = BroSurge;

Object.defineProperties(BroSurge.prototype, {
	start: {
		get: function get_start() {
			return this._start;
		}
	},
	broticks: {
		get: function get_brotensity() {
			return this._broticks;
		}
	}
});