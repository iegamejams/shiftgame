"use strict";

function clamp(val, max) {
    if (val > max) {
        return max;
    }
    return val;
}

function HealthBlock(blockElementId, maskId) {
    this.red = 0;
    this.green = 0;
    this.blue = 0;

    this.element = document.getElementById(blockElementId);
    this.mask = document.getElementById(maskId);
    
    return this;
}

HealthBlock.prototype = Object.create(null);
HealthBlock.prototype.constructor = HealthBlock;

Object.defineProperties(HealthBlock.prototype, {
    addColor: {
        // We're expecting values ranging from 0 to 255.
        value: function addColor(r, g, b) {
            this.red = clamp(this.red + r, 255);
            this.green = clamp(this.green + g, 255);
            this.blue = clamp(this.blue + b, 255);

            this.element.style.backgroundColor = "rgb(" + this.red + ", " + this.green + ", " + this.blue + ")";

            if (this.isWhite()) {
                this.showDeathMask();
            }

            return this;
        }
    },
    isWhite: {
        value: function isWhite() {
            return this.red === 255 &&
                this.green === 255 &&
                this.blue === 255;
        }
    },
    getColor: {
        value: function getColor() {
            return {
                red: this.red,
                green: this.green,
                blue: this.blue
            };
        }
    },
    getLightness: {
        // Returns a value from 0.0 to 1.0 representing the lightness.
        // Intended as a one-dimensional damage indicator.
        value: function getLightness() {
            return (this.red + this.green + this.blue) / (255 * 3);
        }
    },
    showDeathMask: {
        value: function showDeathMask() {
            this.mask.style.background = 'url("images/deathmask.png")';
        }
    }

});