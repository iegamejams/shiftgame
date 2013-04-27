"use strict";

function WaveProgressUI(uiElement) {
    UIElement.call(this, uiElement);

    this.uiProgressBar = this._uiElement.querySelector("#progressBar");
    this.subWaveElements;
}

WaveProgressUI.prototype = Object.create(UIElement.prototype);
WaveProgressUI.prototype.constructor = WaveProgressUI;

Object.defineProperties(WaveProgressUI.prototype, {
    initUI: {
        value: function initUI(waveGenerator) {
            if (this.subWaveElements) {
                // Remove existing subWaveElements
            }

            // Add new sub-wave elements
            this.subSaveElements = [];
            var subWaves = waveGenerator.subWaves;
            subWaves.forEach(function (subWave) {
                var subWaveElement = document.createElement("div");
                
                subWaveElement.className = "subWaveBar";
                subWaveElement.style.left = (this.uiProgressBar.offsetWidth - (this.uiProgressBar.offsetWidth * subWave)) + "px";
                this.subWaveElements.push(subWaveElement);
            }, this);
        }
    },
    updateUI: {
        value: function updateUI(waveGenerator) {
        }
    }
});