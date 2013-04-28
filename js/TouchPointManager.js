"use strict";

var TOUCH_DEBUG = false;

// TouchPointManager(targetElement)
// Initialize with the element that is the target of the events.
//
function TouchPointManager(targetElement) {
    this._targetElement = targetElement;
    this._points = [];
    this._pointCount = 0;

    // Determine correct events to register for
    if(navigator.msPointerEnabled) {
        this._downevent = "MSPointerDown";
        this._upevent = "MSPointerUp";
        this._moveevent = "MSPointerMove";
        document.addEventListener("MSPointerCancel", this.removeTouchPoint.bind(this), false);
        document.addEventListener("MSHoldVisual", function(e) { e.preventDefault(); }, false);
    }
    else {
        this._downevent = "mousedown";
        this._upevent = "mouseup";
        this._moveevent = "mousemove";
    }

    // Register invariant events
    this._targetElement.addEventListener(this._downevent, this.addTouchPoint.bind(this), false);
    document.addEventListener(this._upevent, this.removeTouchPoint.bind(this), false);
}

TouchPointManager.prototype = Object.create(null);
TouchPointManager.prototype.constructor = TouchPointManager;

Object.defineProperties(TouchPointManager.prototype, {
    addTouchPoint: {
        value: function addTouchPoint(e) {
            if(this._pointCount == 0) {
                document.addEventListener(this._moveevent, this.moveTouchPoint.bind(this), false);
            }

            var pID = e.pointerId || 0;
            if(!this._points[pID]) {
                this._pointCount++;
                this._points[pID] = new TouchPoint(e.clientX, e.clientY);
                this._points[pID].down(e.clientX, e.clientY);
                if(TOUCH_DEBUG) {
                    console.log("Created touch point for pID: " + pID + ", at: " + this._points[pID].getCurrentPosition().x + ", " + this._points[pID].getCurrentPosition().y)
                }
            }
        }
    },

    removeTouchPoint: {
        value: function removeTouchPoint(e) {
            var pID = e.pointerId || 0;
            if(this._points[pID]) {
                if(TOUCH_DEBUG) {
                    console.log("Removing touch point for pID: " + pID + ", at: " + this._points[pID].getCurrentPosition().x + ", " + this._points[pID].getCurrentPosition().y)
                }

                this._points[pID].up(e.clientX, e.clientY);

                delete this._points[pID];
                this._pointCount--;
                
                if(this._pointCount == 0) {
                    document.removeEventListener(this._moveevent, this.moveTouchPoint, false);
                }
            }
        }
    },

    moveTouchPoint: {
        value: function moveTouchPoint(e) {
            var pID = e.pointerId || 0;
            if(this._points[pID]) {
                this._points[pID].move(e.clientX, e.clientY);
            }

            if(TOUCH_DEBUG) {
                console.log("Moving touch point for pID: " + pID + ", to: " + this._points[pID].getCurrentPosition().x + ", " + this._points[pID].getCurrentPosition().y)
            }
        }
    },

    // TouchPointManager.doAsEachPoint(funcHandle, args)
    // Pass funcHandle that should be called in the context of each point, and any args required.
    //
    doAsEachPoint: {
        value: function doAsEachPoint(funcHandle, args) {
            this._points.forEach(function(point) {
                funcHandle.bind(point.getCurrentPosition(), args)();
            });
        }
    }
});
