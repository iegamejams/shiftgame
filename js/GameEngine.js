"use strict";

function GameEngine(levelData, waveProgressUIWrapper) {
    // Pre-define all properties because once we preventExtensions on the object we can't add anymore.
    this.level = -1;
    this.levelData = levelData;
    
    // The wave generator will be constructed and assigned during advanceLevel.
    this.waveGenerator;
    this.waveProgress = waveProgressUIWrapper;
    
    this.eventHandlers = {};
    
    return Object.preventExtensions(this);
}

GameEngine.prototype = Object.create(null);
GameEngine.prototype.constructor = GameEngine;

Object.defineProperties(GameEngine.prototype, {

    // Level management functions
    advanceLevel: {
        value: function advanceLevel() {
            this.level++;
            if (this.level >= 0 && this.level < this.levelData.length) {
                this.restartLevel();
            }
            else {
                this.levelInProgress = false;
                this.dispatchEvent("Win");
            }
        }
    },
    restartLevel: {
        value: function restartLevel() {
            this.levelInProgress = true;
            this.waveGenerator = new WaveGenerator(this.levelData[this.level]);
            this.waveProgressUIWrapper.initUI(this.waveGenerator);
        }
    },

    processTick: {
        value: function processTick() {
            if (this.levelInProgress) {
                // Tick all of our dependent objects
                this.waveGenerator.processTick();
                
                // Update all of our UI states
                this.waveProgress.updateUI(this.waveGenerator);
                
                // Determine that we need another requestAnimationFrame();
                return true;
            }
            // We don't need another requestAnimationFrame so we can stop the game loop.
            return false;
        }
    },
    
    // Gameplay management functions
    slideColumn: {
        value: function slideColumn(column) {
            alert('Sliding Column: ' + column);
        }
    },
    
    // Event dispatch for the game engine
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
    },
    spawnBro: {
        value: function spawnBro(row, shapeIndex, colorIndex) {
            // Spawn a bro
        }
    }
});