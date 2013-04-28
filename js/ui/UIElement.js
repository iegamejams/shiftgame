"use strict";

function UIElement(uiElement) {
    this._uiElement = uiElement;
}

UIElement.prototype = Object.create(null);
UIElement.prototype.constructor = UIElement;

// Static functions
Object.defineProperties(UIElement, {
    addClass: {
        value: function addClass(className, classToAdd) {
            var classes = className.split(/\s+/);
            if (classes.some(function (className) { return (className === classToAdd); })) {
                return className;
            }
            else {
                classes.push(classToAdd)
                return classes.join(' ');
            }
        }
    },
    removeClass: {
        value: function removeClass(className, classToRemove) {
            var classes = className.split(/\s+/);
            classes = classes.filter(function (className) {
                return (className !== classToRemove);
            });
            return classes.join(' ');
        }
    },
});

// Instance functions    
Object.defineProperties(UIElement.prototype, {
    updateUI: {
        value: function updateUI() {
        }
    },
});