"use strict";

function HealthBlock(uiElement) {
    this.red = 0;
    this.green = 0;
    this.blue = 0;

    this.uiElement = uiElement;
    
    return this;
}

HealthBlock.prototype = Object.create(null);
HealthBlock.prototype.constructor = HealthBlock;

Object.defineProperties(HealthBlock.prototype, {
    addColor: {
        // We're expecting values ranging from 0 to 255.
        value: function addColor(arrayOfColor) {
            this.red = Math.min(this.red + arrayOfColor[0], 255);
            this.green = Math.min(this.green + arrayOfColor[1], 255);
            this.blue = Math.min(this.blue + arrayOfColor[2], 255);

            this.uiElement.style.backgroundColor = "rgb(" + this.red + ", " + this.green + ", " + this.blue + ")"

            return this;
        }
    },
    isWhite: {
        value: function isWhite() {
            return (this.red === 255 && this.green === 255 && this.blue === 255);
        }
    },
});