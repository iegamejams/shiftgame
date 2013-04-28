"use strict";

function WaveGenerator(levelData, waveProgressUIWrapper, gameEngine) {
    this.currentLevel = levelData;
    this.currentTick = 0;
    this.gameEngine = gameEngine;
    
    return Object.preventExtensions(this);
}

WaveGenerator.prototype = Object.create(null);
WaveGenerator.prototype.constructor = WaveGenerator;

Object.defineProperties(WaveGenerator.prototype, {
    processTick: {
        // Frame based tick advancement, no time delta
        value: function processTick() {
        	this.currentTick++;
        }
    },
    progress: {
        get: function get_progress() {
            return this.currentTick / this.currentLevel.totalTicks;
        }
    },
    subWaves: {
        get: function get_subWaves() {
            return this.currentLevel.subWaves;
        }
    },
    spawnBro: {
    	value: function () {
    		var row = 2
    		, shapeIndex = 3
    		, colorIndex = 4;
    		this.gameEngine.spawnBro(row, shapeIndex, colorIndex);
    	}
    }
});