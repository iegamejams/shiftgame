/* constants */
var STEP_HZ = 60;
var TOUCH_POINT_RADIUS = 60;
var TWO_PI = 2 * Math.PI;
var DEGREES_PER_RADIAN = 180 / Math.PI;

/* mode switches */
var BLUR_MODE_OFF = 0;
var BLUR_MODE_ON = 1;

/* finals */
var CANVAS_WIDTH;
var CANVAS_HEIGHT;
var CANVAS_LEFT;
var CANVAS_TOP;

/* globals (sorry) */
var canvasElm, context, downevent, upevent, moveevent;
var touchPoints = [];
var touchCount = 0;
var pointManager;

/* initial settings */
var blurMode = BLUR_MODE_OFF;

document.addEventListener("DOMContentLoaded", sizeCanvas, false);

function sizeCanvas() {
    canvasElm = document.getElementById("canvas");
    canvasElm.width = document.documentElement.clientWidth;
    canvasElm.height = document.documentElement.clientHeight;
    CANVAS_WIDTH = parseInt(canvasElm.width);
    CANVAS_HEIGHT = parseInt(canvasElm.height);
    CANVAS_LEFT = canvasElm.offsetLeft;
    CANVAS_TOP = canvasElm.offsetTop;
}

// Initialize the world
function setupWorld() {
    // Get canvas info
    context = canvasElm.getContext("2d");

    pointManager = new TouchPointManager(canvasElm);

    document.addEventListener("contextmenu", function(e){ e.preventDefault(); }, false);
    document.addEventListener("selectstart", function(e){ e.preventDefault(); }, false);
    window.addEventListener("resize", function(e){ sizeCanvas(); }, false);
    
    paint();
}

function paint() {
    context.globalAlpha = (blurMode == BLUR_MODE_ON ? 0.2 : 1);

    context.fillStyle = "rgb(0, 0, 0)";
    context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    context.globalAlpha = 1;
    
    // draw glows for active contacts
    drawTouchGlows();
    
    // Future-proof: when feature is fully standardized
    if (window.requestAnimationFrame) window.requestAnimationFrame(paint);
    // IE implementation
    else if (window.msRequestAnimationFrame) window.msRequestAnimationFrame(paint);
    // Firefox implementation
    else if (window.mozRequestAnimationFrame) window.mozRequestAnimationFrame(paint);
    // Chrome implementation
    else if (window.webkitRequestAnimationFrame) window.webkitRequestAnimationFrame(paint);
    // Other browsers that do not yet support feature
    else setTimeout(paint, 1000 / STEP_HZ);
}

/*************** Start draws ***************/
function drawGlow() {
    var gradient;
    var alpha = (blurMode == BLUR_MODE_ON ? .1 : .6);

    context.beginPath();
    gradient = context.createRadialGradient(this.x, this.y, 0, this.x, this.y, TOUCH_POINT_RADIUS);
    gradient.addColorStop(0, "rgba(255, 255, 255, " + alpha + ")");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    context.fillStyle = gradient;
    context.arc(this.x, this.y, TOUCH_POINT_RADIUS, 0, 2 * Math.PI, false);
    context.fill();
}

function drawTouchGlows() {
    pointManager.doAsEachPoint(drawGlow);
}
/*************** End draws ***************/
