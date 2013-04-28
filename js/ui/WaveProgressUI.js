"use strict";

function WaveProgressUI(uiElement) {
    UIElement.call(this, uiElement);

    this.uiProgressBar = this._uiElement.querySelector("#progressBar");
    this.uiProgressIndicator = this._uiElement.querySelector("#progressIndicator");
    this.subWaveElements = new Array();
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
                subWaveElement.style.left = (this.uiProgressBar.offsetWidth - (this.uiProgressBar.offsetWidth * subWave.start)) + "px";
                this.subWaveElements.push(subWaveElement);
                this.uiProgressBar.insertBefore(subWaveElement, this.uiProgressIndicator);
                this.uiProgressIndicator.style.left = (this.uiProgressBar.offsetWidth - (this.uiProgressBar.offsetWidth * waveGenerator.progress)) + "px";
            }, this);
        }
    },
    updateUI: {
        value: function updateUI(waveGenerator) {
            var progress = waveGenerator.progress;
            var intendedLeft = (this.uiProgressBar.offsetWidth - (this.uiProgressBar.offsetWidth * progress));
            if (intendedLeft > 0) {
                this.uiProgressIndicator.style.left = intendedLeft + "px";
            }
        }
    }
});