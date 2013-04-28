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
            if(this.currentTick % this.currentBrodensity === 0) {
                this.spawnBro();
            }
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
            var row = this.random(/*number of rows*/7)
            , shapeIndex = this.random(this.currentLevel.maxShapeIndex)
            , colorIndex = this.random(this.currentLevel.maxColorIndex);
            this.gameEngine.spawnBro(row, shapeIndex, colorIndex);
        }
    },
    random: {
        value: function (max) {
            return Math.floor(Math.random() * max);
        }
    }
});