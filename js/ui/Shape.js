"use strict"

function Shape(type, colorEnum) {
    // "Private"
    UIElement.call(this, document.querySelector("#templates ." + type).cloneNode(true));
    this._colorEnum;
    this._top;
    this._left;

    // Public
    this.type = type;
    this.colorEnum = colorEnum;
    this.left = 0;
    this.top = 0;

    return Object.preventExtensions(this);
}


Shape.prototype = Object.create(UIElement.prototype);
Shape.prototype.constructor = Shape;

Object.defineProperties(Shape.prototype, {
    top: {
        get: function get_top() {
            return this._top;
        },
        set: function set_top(value) {
            this._top = value;
            this._uiElement.style.top = this._top + "px";
        }
    },
    left: {
        get: function get_left() {
            return this._left;
        },
        set: function set_left(value) {
            this._left = value;
            this._uiElement.style.left = this._left + "px";
        }
    },
    colorEnum: {
        get: function get_colorEnum() {
            return this._colorEnum
        },
        set: function set_colorEnum(value) {
            this._colorEnum = value;
            this._uiElement.style.fill = Shape.colors[this._colorEnum];
        }
    },
});

Object.defineProperties(Shape, {
    types : {
        value : ["square", "circle", "triangle", "cross", "diamond", "pentagon"]
    },
    colors : {
        value: ["red", "blue", "green", "yellow", "orange", "purple", "white"]
    }
});
