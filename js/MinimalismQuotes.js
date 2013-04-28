"use strict";

function QuoteGenerator() {
    this.quotes = ["'There are two ways to be rich: One is by acquiring much, and the other is by desiring little.' - Jackie French Koller",
                   "'Simplicity involves unburdening your life, and living more lightly with fewer distractions that interfere with a high quality life, as defined uniquely by each individual.' - Linda Breen Pierce",
                   "'If you want to become full, let yourself be empty' - Tao Te Ching",
                   "'IF you realize that you have enough, you are truly rich'- Tao Te Ching",
                   "'Those who want the fewest things are nearest to the gods' - Socrates",
                   "'Simplicity is the ultimate sophistication' - Leonardo de Vinci",
                   "'Have nothing in your houses that you do not know to be useful or believe to be beautiful.' - William Morris",
                   "'Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away' - Antoine de Saint-Exupe",
                   "'Live simply so that others may simply live.' - Elizabeth Ann Seton",
                   "'Reduce the complexity of life by eliminating the needless wants of life, and the labors of life reduce themselves.' - Edwin Way Teale",
                   "'Small rooms or dwellings discipline the mind, large ones weaken it.' - Leonardo Da Vinci",
                   "'Any intelligent fool can make things bigger, more complex, and more violent. It takes a touch of genius – and a lot of courage – to move in the opposite direction.' - E.F. Schumacker",
                   "'The secret of happiness, you see, is not found in seeking more, but in developing the capacity to enjoy less.' - Socrates",
                   "'The simplest things are often the truest.' - Richard Bach",
                   "'Too many people spend money they haven’t earned, to buy things they don’t want, to impress people they don’t like.' - Will Rogers",
                   "'The ability to simplify means to eliminate the unnecessary so that the necessary may speak.' - Hans Hofmann",
                   "'We go on multiplying our conveniences only to multiply our cares. We increase our possessions only to the enlargement of our anxieties.' - Anna C. Brackett",
                   "'The intention of voluntary simplicity is not to dogmatically live with less. It’s a more demanding intention of living with balance. This is a middle way that moves between the extremes of poverty and indulgence.' - Duane Elgin",
                   "'Be content with what you have; rejoice in the way things are. When you realize there is nothing lacking, the whole world belongs to you.' - Lao Tzu",
                   "'Everything should be made as simple as possible, but not simpler' - Albert Einstein",
                   "'Great acts are made up of small deeds' - Lao Tzu",
                   "'Life is really simple, but we insist on making it complicated' - Confucius",
                   "'It's not always that we need to do more but rather that we need to focus on less' - Nathan W. Morris",
                   "'If you can't explain it simply, you don't understand it well enough.' - Albert Einstein"];

    return Object.preventExtensions(this);
}

QuoteGenerator.prototype = Object.create(null);
QuoteGenerator.prototype.constructor = QuoteGenerator;

(Object.defineProperties(QuoteGenerator.prototype, {
    getQuote: {
        value: function getQuote() {
            var quoteId = Math.floor(Math.random()*this.quotes.length);
            return this.quotes[quoteId];
        }
    }
});