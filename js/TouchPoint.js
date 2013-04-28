"use strict";

// TouchPoint(x, y)
// A single point of contact, stores data over time as needed to recognize gestures.  E.g. in the future might store a timestamp for down, if we need to recognize a hold.
//
function TouchPoint(x, y) {
    this._currentPosition = {x : x, y : y};
    this._downPosition = {x : null, y : null};
    this._alreadySwiped = false;
    this._swipeHandler = null;
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
            if(this.swipeHappened() && this._swipeHandler) {
                this._swipeHandler();
                if(TOUCH_DEBUG) {
                    console.log("Swipe happened!");
                }
            }
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
    },

    setSwipeHandler: {
        value: function setSwipeHandler(funcHandle) {
            this._swipeHandler = funcHandle;
        }
    },

    swipeHappened: {
        value: function swipeHappened() {
            if(!this._alreadySwiped) {
                if(this._currentPosition.y > this._downPosition.y + 32) {
                    this._alreadySwiped = true;
                    return true;
                }
            }
            return false;
        }
    }
});
