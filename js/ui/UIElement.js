"use strict";

function UIElement(uiElement) {
    this._uiElement = uiElement;
}

UIElement.prototype = Object.create(null);
UIElement.prototype.constructor = UIElement;

Object.defineProperties(UIElement.prototype, {
    addClass: {
        value: function addClass(className, classToAdd) {
            var classes = className.split(/\s+/);
            if (Array.contains(classes, classToAdd)) {
                return className;
            }
            else {
                return classes.push(classToAdd).join(' ');
            }
        }
    },
    removeClass: {
        value: function removeClass(className, classToRemove) {
            var classes = className.split(/\s+/);
            while (Array.remove(classes, classToRemove)) {}
            return classes.join(' ');
        }
    },
    
    updateUI: {
        value: function updateUI() {
        }
    },
});