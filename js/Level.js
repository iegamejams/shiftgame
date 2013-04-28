"use strict";

function Level(frequency, totalTicks, shapes, colors, aisles, broSpeed, pegSpawnPercent, subWaves, student, teacher) {
    function validateSubWaves(level) {
        level.subWaves.forEach(function (subWave) {
            if (subWave.startTick <= 0 || subWave.startTick >= this.totalTicks) {
                throw "startTick out of range";
            }
            if (subWave.duration <= 0 || (subWave.duration + subWave.startTick) >= this.totalTicks) {
                throw "duration out of range";
            }
            if (subWave.frequencyModifier < 0.2 || subWave.frequencyModifier >= 1) {
                throw "frequencyModifier must be between 0.2 and 1";
            }
        }, level);
    }

    // Setup locals
    this.frequency = frequency;
    this.totalTicks = totalTicks;
    this.shapes = shapes;
    this.colors = colors;
    this.aisles = aisles;
    this.broSpeed = broSpeed;
    this.student = student;
    this.teacher = teacher;
    this.pegSpawnPercent = pegSpawnPercent;
    this.subWaves = Object.freeze(subWaves);
    
    // Validate subWaves
    validateSubWaves(this);
    
    return Object.freeze(this);
}