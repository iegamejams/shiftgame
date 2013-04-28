"use strict"

function Shape(type, color) {
    
    // "Private"
    this._elm = document.querySelector("#templates .shape." + type).cloneNode(true);
    
    // Public
    this.type = type;
    this.top = "0px";
    this.left = "-48px";
    this.color = color;
    
    document.body.appendChild(this._elm);
    
    return Object.preventExtensions(this);
}

Shape.prototype = Object.create(null);
Shape.prototype.constructor = Shape;

Object.defineProperties(Shape.prototype, {
    top : {
        get : function() { return this._elm.style.top },
        set : function(value) {
            this._elm.style.top = value;
        }
    },
    left : {
        get : function() { return this._elm.style.left },
        set : function(value) {
            this._elm.style.left = value;
        }
    },
    color : {
        get : function() { return this._elm.style.fill },
        set : function(value) {
            var path = this._elm.querySelector(".path");
            path.style.fill = path.style.stroke = value;
        }
    }
});
