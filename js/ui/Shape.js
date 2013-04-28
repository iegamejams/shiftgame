"use strict"

function Shape(type, colorEnum) {

    // "Private"
    this._elm = document.querySelector("#templates " + type).cloneNode(true);

    // Public
    this.type = type;
    this.top = "0px";
    this.left = "-48px";
    this.colorEnum = colorEnum;

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
    colorEnum: {
        get : function () { return this._colorEnum },
        set : function (value) {
            this._colorEnum = value;
            this.color = Shape.colors[value];
        }
    },
    color : {
        get : function() { return this._elm.style.fill }
    }
});

Object.defineProperties(Shape, {
    types : {
        value : ["square", "circle", "triangle", "cross", "diamond", "pentagon"]
    },
    colors : {
        value: ["red", "blue", "green", "yellow", "orange", "purple", "black"]
    }
});
