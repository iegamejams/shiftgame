"use strict";

function WaveGenerator(levelData, gameEngine) {
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
            
            var frequency = this.currentLevel.frequency;
            if (this.currentLevel.subWaves) {
                var currentSubWave;
                this.currentLevel.subWaves.some(function (subWave) {
                    if (this.currentTick >= subWave.startTick && this.currentTick <= (subWave.startTick + subWave.duration)) {
                        currentSubWave = subWave;
                        
                        // Early terminate the loop since we found our guy
                        return true;
                    }
                }, this);
                
                if (currentSubWave) {
                    frequency *= currentSubWave.frequencyModifier;
                }
            }
            
            
            if(this.currentTick % frequency === 0) {
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
            if (this.currentLevel.subWaves) {
                return this.currentLevel.subWaves.map(function (subWave) {
                    return (subWave.startTick / this.totalTicks);
                }, this.currentLevel);
            }
            return [];
        }
    },
    spawnBro: {
        value: function () {
            var row = this.random(this.currentLevel.aisles);
            var shapeIndex = this.random(this.currentLevel.shapes);
            var colorIndex = this.random(this.currentLevel.colors);
            
            this.gameEngine.spawnBro(row, shapeIndex, colorIndex);
        }
    },
    random: {
        value: function (max) {
            return Math.floor(Math.random() * max);
        }
    }
});