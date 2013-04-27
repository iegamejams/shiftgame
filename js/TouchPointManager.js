"use strict";

// TouchPointManager(targetElement)
// Initialize with the element that is the target of the events.
//
function TouchPointManager(targetElement) {
    this.points = [];
    this.pointCount = 0;

    // Determine correct events to register for
    if(navigator.msPointerEnabled) {
        downevent = "MSPointerDown";
        upevent = "MSPointerUp";
        moveevent = "MSPointerMove";
        document.addEventListener("MSPointerCancel", this.removeTouchPoint.bind(this), false);
        document.addEventListener("MSHoldVisual", function(e) { e.preventDefault(); }, false);
    }
    else {
        downevent = "mousedown";
        upevent = "mouseup";
        moveevent = "mousemove";
    }
    
    // Register invariant events
    targetElement.addEventListener(downevent, this.addTouchPoint.bind(this), false);
    document.addEventListener(upevent, this.removeTouchPoint.bind(this), false);
}

TouchPointManager.prototype.addTouchPoint = function(e) {
    if(this.pointCount == 0) {
        document.addEventListener(moveevent, this.moveTouchPoint.bind(this), false);
    }

    var pID = e.pointerId || 0;
    if(!this.points[pID]) {
        this.pointCount++;
        this.points[pID] = {x : e.clientX, y : e.clientY};
    }
}

TouchPointManager.prototype.removeTouchPoint = function(e) {
    var pID = e.pointerId || 0;
    if(this.points[pID]) {
        delete this.points[pID];
        this.pointCount--;
        
        if(this.pointCount == 0) {
            document.removeEventListener(moveevent, this.moveTouchPoint, false);
        }
    }
}

TouchPointManager.prototype.moveTouchPoint = function(e) {
    var pID = e.pointerId || 0;
    if(this.points[pID]) {
        this.points[pID].x = e.clientX;
        this.points[pID].y = e.clientY;
    }
}

// TouchPointManager.doAsEachPoint(funcHandle, args)
// Pass funcHandle that should be called in the context of each point, and any args required.
//
TouchPointManager.prototype.doAsEachPoint = function(funcHandle, args) {
    this.points.forEach(function(point) {
        funcHandle.bind(point, args)();
    });
}
