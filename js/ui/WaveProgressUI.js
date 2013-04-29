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
                [].forEach.call(this.subWaveElements, function (subWaveElement) {
                    this.uiProgressBar.removeChild(subWaveElement);
                }, this);
            }

            // Add new sub-wave elements
            this.subWaveElements = [];
            var subWaves = waveGenerator.subWaves;
            subWaves.forEach(function (subWave) {
                var subWaveElement = document.createElement("div");
                
                subWaveElement.className = "subWaveBar";
                subWaveElement.style.left = (this.uiProgressBar.offsetWidth - (this.uiProgressBar.offsetWidth * subWave)) + "px";
                this.subWaveElements.push(subWaveElement);
                this.uiProgressBar.insertBefore(subWaveElement, this.uiProgressIndicator);
                this.uiProgressIndicator.style.left = (this.uiProgressBar.offsetWidth - (this.uiProgressBar.offsetWidth * waveGenerator.progress)) + "px";
            }, this);
        }
    },
    updateUI: {
        value: function updateUI(waveGenerator) {
            var progress = waveGenerator.progress;
            var intendedLeft = (this.uiProgressBar.offsetWidth - (this.uiProgressBar.offsetWidth * progress)) - (this.uiProgressIndicator.offsetWidth / 2);

            this.uiProgressIndicator.style.display = "block";
            this.uiProgressIndicator.style.left = intendedLeft + "px";
        }
    }
});