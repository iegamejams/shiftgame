"use strict";

function GameEngine(levelData) {
    // Pre-define all properties because once we preventExtensions on the object we can't add anymore.
    this.level = -1;
    this.levelData = levelData;
    this.waveGenerator;
    this.eventHandlers = {};
    
    return Object.preventExtension(this);
}

GameEngine.prototype = Object.create(null);
GameEngine.prototype.constructor = GameEngine;

Object.defineProperties(GameEngine.prototype, {
    advanceLevel: {
        value: function advanceLevel() {
            this.level++;
            
            if (this.level >= 0 && this.level < this.levelData.length) {
            }
            else {
                this.dispatchEvent("win");
            }
        }
    },

    processTick: {
        value: function processTick() {
        }
    },
    
    addEventListener: {
        value: function addEventListener(eventName, callback) {
            if (!this.eventHandlers[eventName]) {
                this.eventHandlers[eventName] = [];
            }
            var eventHandlers = this.eventHandlers[eventName];
            if (!Array.contains(eventHandlers, callback)) {
                eventHandlers.push(callback);
            }
        }
    },
    removeEventListener: {
        value: function removeEventListener(eventName, callback) {
            var eventHandlers = this.eventHandlers[eventName];
            if (eventHandlers) {
                Array.remove(eventHandlers, callback);
            }
        }
    },
    dispatchEvent: {
        value: function dispatchEvent(eventName, evtObj) {
            var eventHandlersToFire = this.eventHandlers[eventName];
            if (eventHandlersToFire) {
                eventHandlersToFire = Array.clone(eventHandlersToFire);
                eventHandlersToFire.forEach(function (callback) {
                    callback(evtObj);
                });
            }
        }
    }
});