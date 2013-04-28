"use strict";



function AdGenerator() {
    this._ads = ["Feeling out of Shape?  Try our new Circle Peg!",
    "Are you a bit Round?  Try our new Square program! Guaranteed to tone your body in 30 days or your money back!",
    "Are you Blue?  We have a new Yellow for you!"];
    this._adSwitch = 1875;
    this.ct = 0;
    this.currentAd = Math.floor(Math.random()*this._ads.length);
    this.displayAd(this._ads[this.currentAd]);

    return Object.preventExtensions(this);
}

AdGenerator.prototype = Object.create(null);
AdGenerator.prototype.constructor = AdGenerator;

(Object.defineProperties(AdGenerator.prototype, {
    processTick: {
        value: function processTick() {
            this.ct++;
            if (this.ct > this._adSwitch) {
                this.ct = 0;
                var oldNumber = this.currentAd;
                while (oldNumber == this.currentAd) {
                    this.currentAd = Math.floor(Math.random() * this._ads.length);
                }
                this.displayAd(this._ads[this.currentAd]);
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
                div.removeChild(div.children[0]);
            }
            div.appendChild(element);
        }
    },
}));