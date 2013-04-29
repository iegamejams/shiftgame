"use strict"

function Blocker(uiBlockerPanel, colorEnum) {
    // "Private"
    this._active = true;
    
    // Public
    this.colorEnum = colorEnum;
    this.elm = document.createElement("div");
    this.elm.className = "blocker";
    this.elm.style.background = Shape.colors[colorEnum];
    
    uiBlockerPanel.appendChild(this.elm);
    
    return Object.preventExtensions(this);
}

Blocker.prototype = Object.create(null);
Blocker.prototype.constructor = Blocker;

Object.defineProperties(Blocker.prototype, {
    active : {
        get : function() { return this._active },
        set : function() {
            this._active = false;
            this.elm.style.background = "white";
        }
    }
});
