"use strict";

function GameEngine(levelData, uiBlackSquare, uiWaveProgress, uiSliders, uiGameBoard, uiPieceHints, uiBlockerPanel) {
    // Pre-define all properties because once we preventExtensions on the object we can't add anymore.
    this.level = -1;
    this.levelData = levelData;
    this.levelInProgress = false;
    this.eventHandlers = {};
    this.uiGameBoard = uiGameBoard;
    this.uiPieceHints = uiPieceHints;
    this.uiBlockerPanel = uiBlockerPanel;
    this.winCalled = false;
    this.shapeArray = [];
    this.clickSounds = ["boop1", "boop2", "boop3"];
    this.currentClickSound = 0;
    
    // The game board and wave generator will be constructed and assigned during advanceLevel.
    this.gameBoard = null;
    this.waveGenerator = null;
    this.waveProgress = new WaveProgressUI(uiWaveProgress);
    this.sliderUI = new SliderUI(uiSliders, this);
    this.healthBlock = new HealthBlock(uiBlackSquare);
    this.touchPointManager = new TouchPointManager(document);
    
    // Initialize any UI elements that need one time initialization.
    this.sliderUI.initUI();

    return Object.preventExtensions(this);
}

GameEngine.prototype = Object.create(null);
GameEngine.prototype.constructor = GameEngine;

Object.defineProperties(GameEngine.prototype, {

    // Level management functions
    advanceLevel: {
        value: function advanceLevel() {
            this.level++;
            if (this.level >= 0 && this.level < this.levelData.length) {
                this.restartLevel();
            }
            else {
                this.levelInProgress = false;
                this.winCalled = true;
                // this.dispatchEvent("Win");
            }
        }
    },
    restartLevel: {
        value: function restartLevel() {
            this.levelInProgress = true;
            
            // Gameboard UI needs to be cleaned up explicitly
            if (this.gameBoard) {
                this.gameBoard.destroyUI();
            }
            
            this.gameBoard = new GameBoard(this.uiGameBoard, this.uiPieceHints, this.uiBlockerPanel, this, 8, 7, this.levelData[this.level].pegSpawnPercent, this.levelData[this.level].shapes, this.levelData[this.level].colors);
            this.waveGenerator = new WaveGenerator(this.levelData[this.level], this);
            
            // WaveProgressUI will update its own client area
            this.waveProgress.initUI(this.waveGenerator);
            
            this.setupLevelPopup();
        }
    },
    setupLevelPopup: {
        value: function setupLevelPopup() {
            var popupLevel = PopupManager.getPopup("popupLevel");
            var levelData = this.levelData[this.level];

            popupLevel.querySelector("#popupLevel_Level").innerText = this.level + 1;
            popupLevel.querySelector("#popupLevel_StudentSaying").innerText = levelData.student;
            popupLevel.querySelector("#popupLevel_MasterSaying").innerText = levelData.teacher;
            
            PopupManager.showPopup("popupLevel");
        }
    },
    pauseGame: {
        value: function pauseGame() {
            var popupPause = PopupManager.getPopup("popupPause");
            
            // TODO: Random saying about pausing?
            
            PopupManager.showPopup("popupPause");
        }
    },

    processTick: {
        value: function processTick() {
            if (this.levelInProgress) {
                // Tick all of our dependent objects
                this.gameBoard.processTick();
                this.waveGenerator.processTick();
                
                if (this.waveGenerator.complete && this.shapeArray.length === 0) {
                    this.advanceLevel();
                }
                else {
                    // Update all of our UI states
                    this.waveProgress.updateUI(this.waveGenerator);

                    //For Each Shape Object in our collection, process Tick
                    for (var i = 0; i < this.shapeArray.length; i++) {
                        this.shapeArray[i].processTick();
                        if (this.shapeArray[i].left < -50) {
                            var shapeToRemove = this.shapeArray.splice(i, 1)[0];
                            this.gameBoard._uiElement.removeChild(shapeToRemove._uiElement);
                        }
                    }

                    //TODO: Process Collisions here
                    for (var i = 0; i < this.shapeArray.length; i++) {
                        var point = new Object();
                        point.x = this.shapeArray[i].left;
                        point.y = this.shapeArray[i].top;
                        var rowNumber = this.gameBoard.getRailIndexFromBoardCoords(point);
                        var slotNumber = this.gameBoard.getSlotIndexFromBoardCoords(point);
                        if (rowNumber === -2) { // final Row
                            var shapeToRemove = this.shapeArray.splice(i, 1)[0];
                            this.healthBlock.addColor(Shape.colorVals[shapeToRemove.colorEnum]);
                            this.gameBoard._uiElement.removeChild(shapeToRemove._uiElement);

                            if (this.healthBlock.isWhite()) {
                                //TODO: Add Game Over Here
                            }

                            continue;
                        }
                        if (rowNumber === -1) { // Blocker row
                            var blocker = this.gameBoard.blockers[slotNumber];
                            if (blocker.active) {
                                var shapeToRemove = this.shapeArray.splice(i, 1)[0];
                                this.gameBoard._uiElement.removeChild(shapeToRemove._uiElement);
                                if (shapeToRemove.colorEnum !== blocker.colorEnum) {
                                    blocker.active = false;
                                }
                            }
                            continue;
                        }
                        if (rowNumber != null && slotNumber != null && rowNumber < 8) {
                            var rail = this.gameBoard.rails[rowNumber];
                            if (!rail.animating) {
                                if (rail.children[slotNumber].children.length > 0) {
                                    if ((Math.abs((rowNumber*64) - (this.shapeArray[i].left - 256)) < 8) &&
                                        rail.children[slotNumber].children[0].className.baseVal == "shape " + this.shapeArray[i].type) {
                                        var shapeToRemove = this.shapeArray.splice(i, 1)[0];
                                        this.gameBoard._uiElement.removeChild(shapeToRemove._uiElement);
                                        rail.children[slotNumber].removeChild(rail.children[slotNumber].children[0]);
                                    }
                                }
                            }
                        }

                    }
                }

                // Determine that we need another requestAnimationFrame();
                return true;
            }
            // We don't need another requestAnimationFrame so we can stop the game loop.
            return false;
        }
    },
    
    // Gameplay management functions
    slideColumn: {
        value: function slideColumn(column) {
            // Protect input while we are paused.
            if (!PopupManager.paused) {
                SoundManager.play(this.clickSounds[this.currentClickSound++ % this.clickSounds.length]);
                this.gameBoard.slideRail(column);
            }
        }
    },
    
    // Event dispatch for the game engine
    addEventListener: {
        value: function addEventListener(eventName, callback) {
            if (!this.eventHandlers[eventName]) {
                this.eventHandlers[eventName] = [];
            }
            var eventHandlers = this.eventHandlers[eventName];
            if (!Array.contains(eventHandlers, callback)) {
                eventHandlers.push(callback);
            }
        }
    },
    removeEventListener: {
        value: function removeEventListener(eventName, callback) {
            var eventHandlers = this.eventHandlers[eventName];
            if (eventHandlers) {
                Array.remove(eventHandlers, callback);
            }
        }
    },
    dispatchEvent: {
        value: function dispatchEvent(eventName, evtObj) {
            var eventHandlersToFire = this.eventHandlers[eventName];
            if (eventHandlersToFire) {
                eventHandlersToFire = Array.clone(eventHandlersToFire);
                eventHandlersToFire.forEach(function (callback) {
                    callback(evtObj);
                });
            }
        }
    },
    spawnBro: {
        value: function spawnBro(row, shapeIndex, colorIndex, broSpeed) {
            // Spawn a bro
            var newShape = new Shape(Shape.types[shapeIndex], colorIndex);
            newShape.top = (row * 64) + 6;
            newShape.left = 700 + 256;
            newShape.speed = broSpeed;
            this.shapeArray.push(newShape);
            this.gameBoard._uiElement.appendChild(newShape._uiElement);
        }
    }
});