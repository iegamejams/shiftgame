"use strict";

// TouchPoint(x, y)
// A single point of contact, stores data over time as needed to recognize gestures.  E.g. in the future might store a timestamp for down, if we need to recognize a hold.
//
function TouchPoint(x, y) {
    this._currentPosition = {x : x, y : y};
    this._downPosition = {x : null, y : null};
}

TouchPoint.prototype = Object.create(null);
TouchPoint.prototype.constructor = TouchPoint;

Object.defineProperties(TouchPoint.prototype, {
    down: {
        value: function move(x, y) {
            this._currentPosition.x = x;
            this._currentPosition.y = y;
            this._downPosition.x = x;
            this._downPosition.y = y;
        }
    },

    move: {
        value: function move(x, y) {
            this._currentPosition.x = x;
            this._currentPosition.y = y;
        }
    },

    up: {
        value: function up(x, y) {
            this._currentPosition.x = x;
            this._currentPosition.y = y;
            this._downPosition.x = null;
            this._downPosition.y = null;
        }
    },

    getCurrentPosition: {
        value: function getCurrentPosition() {
            return this._currentPosition;
        }
    }
});
