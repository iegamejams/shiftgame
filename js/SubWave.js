"use strict";

function SubWave(startTick, duration, frequencyModifier) {
    this.startTick = startTick;
    this.duration = duration;
    this.frequencyModifier = frequencyModifier;
    
    return Object.freeze(this);
}