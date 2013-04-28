"use strict"

function Shape(type, color) {
    
    // "Private"
    this._shape = document.querySelector("#templates .shape." + type).cloneNode(true);
    
    // Public
    this.type = type;
    this.top = "0px";
    this.left = "-48px";
    this.color = color;
    
    document.body.appendChild(this._shape);
    
    return Object.preventExtensions(this);
}

Shape.prototype = Object.create(null);
Shape.prototype.constructor = Shape;

Object.defineProperties(Shape.prototype, {
    top : {
        get : function() { return this._top },
        set : function(value) {
            this._top = value;
            this._shape.style.top = value;
        }
    },
    left : {
        get : function() { return this._left },
        set : function(value) {
            this._left = value;
            this._shape.style.left = value;
        }
    },
    color : {
        get : function() { return this._color },
        set : function(value) {
            this._color = value;
            var path = this._shape.querySelector(".path");
            path.style.fill = path.style.stroke = value;
        }
    }
});
