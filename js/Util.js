"use strict"

Object.defineProperties(Array.prototype, {
    peek : {
        value : function() { return this[this.length - 1]; }
    },
    random : {
        value : function() { return this[Math.floor(this.length * Math.random())]; }
    }
});
