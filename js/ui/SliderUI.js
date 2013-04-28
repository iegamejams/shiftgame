"use strict";

function SliderUI(uiElement, gameEngine) {
    UIElement.call(this, uiElement);
    
    this.uiSliderButtons = this._uiElement.getElementsByClassName("sliderButtons");
    this.gameEngine = gameEngine;

    this.sounds = ["boop1", "boop2", "boop3"];
    this.currentSound = 0;
}

SliderUI.prototype = Object.create(UIElement.prototype);
SliderUI.prototype.constructor = SliderUI;

Object.defineProperties(SliderUI.prototype, {
    initUI: {
        value: function initUI() {
            [].forEach.call(this.uiSliderButtons, function (uiButton) {
                uiButton.gameEngine = this.gameEngine;
                uiButton.addEventListener("click", this.processClick.bind(this));
            }, this);
            this.uiSliderButtons[0].ownerDocument.addEventListener("keypress", this.processKey.bind(this));
        }
    },
    updateUI: {
        value: function updateUI() {
        }
    },
    
    processClick: {
        value: function processClick(evt) {
            var targetColumn = evt.target.getAttribute("data-column") >> 0;
            SoundManager.play(this.sounds[this.currentSound++ % this.sounds.length]);
            this.gameEngine.slideColumn(targetColumn);
        }
    },
    processKey: {
        value: function processKey(evt) {
            [].forEach.call(this.uiSliderButtons, function (uiButton) {
                var targetKey = uiButton.getAttribute("data-key");
                var targetColumn = uiButton.getAttribute("data-column") >> 0;
                
                if (String.fromCharCode(evt.which).toLowerCase() === targetKey.toLowerCase()) {
                    SoundManager.play(this.sounds[this.currentSound++ % this.sounds.length]);
                    this.gameEngine.slideColumn(targetColumn);
                }
            }, this);
        }
    },
});