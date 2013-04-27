"use strict";

function WaveGenerator(levelData) {
    this.currentLevel = levelData;
    this.currentTick = 0;
    
    return Object.preventExtensions(this);
}

WaveGenerator.prototype = Object.create(null);
WaveGenerator.prototype.constructor = WaveGenerator;

Object.defineProperties(WaveGenerator.prototype, {
    processTick: {
        // Frame based tick advancement, no time delta
        value: function processTick() {
        }
    },
    progress: {
        get: function get_progress() {
            return this.currentTick / this.curentLevel.totalTicks;
        }
    }
});