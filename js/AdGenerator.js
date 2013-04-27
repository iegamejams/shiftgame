"use strict";



function AdGenerator() {
    var _ads = ["Feeling out of Shape?  Try our new Circle Peg!",
    "Are you a bit Round?  Try our new Square program! Guaranteed to tone your body in 30 days or your money back!"];
    var _adSwitch = 1875;
    var ct = 0;
    var currentAd = 0;
    this.displayAd(_ads[currentAd]);
}

AdGenerator.prototype = Object.create(null);
AdGenerator.prototype.constructor = AdGenerator;

(Object.defineProperties(AdGenerator.prototype, {
    processTick: {
        value: function processTick() {
            this.ct++;
            if (this.ct > this._adSwitch) {
                this.ct = 0;
                this.currentAd = 1;
                this.displayAd(_ads[this.currentAd]);
            }
        }
    },

    displayAd: {
        value: function displayAd(adText) {
            var element = document.createElement("a");
            var text = document.createTextNode(adText);
            element.appendChild(text);
            element.setAttribute('href', 'http://www.bing.com');
            var div = document.getElementById('panelAd');
            while (div.children.length > 0) {
                div.removeChild(div.children.item[0]);
            }
            div.appendChild(element);
        }
    },
}));