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
    var rails = [];
    
    // Build game board UI
    for (var i = 0; i < width; i++) {
        var rail = templates.rail.cloneNode(false);
        rails.push(rail);
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
    }
});
