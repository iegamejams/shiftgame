"use strict"

function GameBoard(container, width, height) {
    
    // Private
    var templates = {
        rail : document.querySelector("#templates .rail"),
        slot : document.querySelector("#templates .slot")
    };
    
    // Public
    Object.defineProperties(this, {
        width : {
            get : function() { return width }
        },
        height : {
            get : function() { return height }
        }
    });
    this.rails = [];
    
    // Build game board UI
    for (var i = 0; i < width; i++) {
        var rail = templates.rail.cloneNode(false);
        this.rails.push(rail);
        for (var j = 0; j < height; j++) {
            rail.appendChild(this.createSlot());
        }
        container.appendChild(rail);
    }
    
    return Object.preventExtensions(this);
}

GameBoard.prototype = Object.create(null);
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
            if (rail.animating) return false; // Can't slide the rail if it's currently completing the previous slide
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
    }
});

Object.defineProperties(GameBoard, {
    SLIDE_PIXELS_PER_TICK : {
        value : 10
    }
});
