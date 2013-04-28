"use strict";

// TouchPoint(x, y)
// A single point of contact, stores data over time as needed to recognize gestures.  E.g. in the future might store a timestamp for down, if we need to recognize a hold.
//
function TouchPoint(x, y) {
    this._x = x;
    this._y = y;
}

TouchPoint.prototype = Object.create(null);
TouchPoint.prototype.constructor = TouchPoint;

Object.defineProperties(TouchPoint.prototype, {
    down: {
        value: function move(x, y) {
            this._x = x;
            this._y = y;
        }
    },

    move: {
        value: function move(x, y) {
            this._x = x;
            this._y = y;
        }
    },

    up: {
        value: function up(x, y) {
            this._x = x;
            this._y = y;
        }
    },

    getCoordinates: {
        value: function getCoordinates() {
            return {x : this._x, y : this._y};
        }
    }
});
