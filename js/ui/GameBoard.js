"use strict"

function GameBoard(uiElement, uiHintElement, gameEngine, width, height) {
    UIElement.call(this, uiElement);

    // Private
    var templates = {
        rail : document.querySelector("#templates .rail"),
        slot : document.querySelector("#templates .slot")
    };
    
    // Public
    Object.defineProperties(this, {
        width: {
            get: function get_width() {
                return width
            }
        },
        height: {
            get: function get_height() {
                return height
            }
        }
    });
    this.rails = [];
    this.gameEngine = gameEngine;
    this.uiHintElement = uiHintElement;
    
    // Build game board UI
    for (var i = 0; i < width; i++) {
        var rail = templates.rail.cloneNode(false);
        rail.setAttribute("index", i);
        this.rails.push(rail);
        for (var j = 0; j < height; j++) {
            rail.appendChild(this.createSlot());
        }
        this._uiElement.appendChild(rail);
    }
    
    return Object.preventExtensions(this);
}

GameBoard.prototype = Object.create(UIElement.prototype);
GameBoard.prototype.constructor = GameBoard;

Object.defineProperties(GameBoard.prototype, {
    createSlot : {
        value : function() {
            var slot = document.querySelector("#templates .slot").cloneNode(true);
            slot.appendChild(document.querySelector("#templates ." + Shape.types.random()).cloneNode(true));
            return slot;
        }
    },
    slideRail : {
        value : function(railNumber) {
            var rail = this.rails[railNumber];
            if (rail.animating) {
                return false; // Can't slide the rail if it's currently completing the previous slide
            }
            rail.animating = true;
            rail.insertBefore(this.createSlot(), rail.firstChild);
            rail.style.top = "-64px";
        }
    },
    processTick : {
        value : function() {
            this.rails.forEach(function(rail) {
                if (rail.animating) {
                    var top = parseFloat(rail.style.top) + GameBoard.SLIDE_PIXELS_PER_TICK;
                    if (top > 0) {
                        top = 0;
                        rail.animating = false;
                        rail.removeChild(rail.lastChild);
                    }
                    rail.style.top = top + "px";
                }
            });
        }
    },
    getRailIndexFromBoardCoords : {
        value : function(point) {
            // update this if the magic numbers change :)
            if(point.x >= 0 && point.x < 768 && point.y >= 0 && point.y < 448) {
                return parseInt(point.x / 64);
            }
            return null;
        }
    }
});

Object.defineProperties(GameBoard, {
    SLIDE_PIXELS_PER_TICK : {
        value : 10
    }
});
