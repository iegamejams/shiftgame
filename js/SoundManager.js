"use strict";

/// <reference path="../GameEntry.htm" />

var ScreenTransitionManager = (function () {
    function removeClass(classIn, classToRemove) {
        return classIn.split(' ').filter(function (elem) { return (elem != classToRemove); }).join(' ');
    }
    function addClass(classIn, classToAdd) {
        var classes = classIn.split(' ').filter(function (elem) { return (elem != classToAdd); });
        classes.push(classToAdd);
        return classes.join(' ');
    }
    function hasClass(classIn, classToFind) {
        var classes = classIn.split(' ').filter(function (elem) { return (elem === classToFind); });
        return (classes.length > 0);
    }

    var _screenTransitionManager = {};

    function _touchStart(evt) {
    }
    function _touchEnd(evt) {
        evt.target.click();
        evt.preventDefault();
        return false;
    }

    Object.defineProperties(_screenTransitionManager, {
        init: {
            value: function init() {
                if (Debug) {
                    Debug.init();
                }
                PlayerSaveManager.loadGameState();
                ScreenManager.setupScreens("screenHost", "uiScreen", "visible");
                PopupManager.setupPopups("popupUI", "popupWindow");

                window.addEventListener("resize", this.centerUI.bind(this));
                this.centerUI();

                SoundManager.setupAudio("soundManager", "audioSingles", "audioInstances");

                ScreenTransitionManager.loadStudioScreen();
                // ScreenTransitionManager.loadStartScreen();

                ImagePreloadManager.initImageSet(TitleImageSet);
                ImagePreloadManager.initImageSet(CharSelectImageSet);
                ImagePreloadManager.initImageSet(StageMapImageSet);
                ImagePreloadManager.initImageSet(AllImageSet);
                ImagePreloadManager.preloadImages();

                // TODO: Add an input manager
                document.addEventListener("touchstart", _touchStart);
                document.addEventListener("touchend", _touchEnd);

                // show start screen in 5 second
                setTimeout(ScreenTransitionManager.loadStartScreen, 3000);
            },
        },
        centerUI: {
            value: function centerUI() {
                var screenHost = document.getElementById("screenHost");
                var popupHost = document.getElementById("popupUI");
                var debugPanel = document.getElementById("debugPanel");

                var centerLeft = 0;
                var centerTop = 0;

                if (window.innerWidth >= 1366) {
                    centerLeft = Math.max(0, (window.innerWidth - 1366) / 2);
                    centerTop = Math.max(0, (window.innerHeight - 768) / 2);
                }
                else if (window.innerWidth >= 960) {
                    centerLeft = -Math.max(0, (1366 - window.innerWidth) / 2);
                    centerTop = -Math.max(0, (768 - window.innerHeight) / 2);
                }
                screenHost.style.left = popupHost.style.left = centerLeft + "px";
                screenHost.style.top = popupHost.style.top = centerTop + "px";
                debugPanel.style.left = centerLeft + 1380 + "px";
                debugPanel.style.top = centerTop + "px";
            }
        },
        loadStudioScreen: {
            value: function loadStudioScreen() {
                ScreenManager.transitionToScreen('studioScreen');
            },
        },
        loadStartScreen: {
            value: function loadStartScreen() {
                var continueButton = document.getElementById("button_contintueGame");
                if (PlayerSaveManager.currentGameState) {
                    continueButton.className = removeClass(continueButton.className, "locked");
                }
                else {
                    continueButton.className = addClass(continueButton.className, "locked");
                }

                function _randomParticles() {
                    /*
                    var mainScreen = document.getElementById("startScreen");
                    var logo = document.getElementById("logo");

                    var initialX = logo.offsetLeft + (logo.offsetWidth * Math.random());
                    var initialY = logo.offsetTop + (logo.offsetHeight * Math.random() * 0.5);
                    var particleCount = Math.random() * 10;

                    var particles = [];
                    var particleAnimations = [];
                    for (var i = 0; i < particleCount; i++) {
                        var uiElement = document.createElement('img');
                        uiElement.className = "particles";
                        uiElement.src = "images/effects/Particle_Sparkle.png";
                        particles.push(uiElement);
                        mainScreen.appendChild(uiElement);

                        particleAnimations.push(new ParticleAnimation(uiElement, 1, 0, initialX, initialY, 0, 2000));
                    }

                    AnimationManager.addAnimations(particleAnimations, function (group) {
                        for (var i = 0; i < particles.length; i++) {
                            mainScreen.removeChild(particles[i]);
                        }
                    }, false);
                    */
                }
                ScreenManager.transitionToScreen('startScreen', undefined, {
                    "show": function (screen) { screen.timeoutId = window.setInterval(_randomParticles, 150); },
                    "hide": function (screen) { window.clearInterval(screen.timeoutId); delete screen.timeoutId; },
                });
                SoundManager.stopAll();
                SoundManager.playMusic("bg_intro");
            },
        },
        characterSelectionSelectCharacter: {
            value: function characterSelectionSelectCharacter(characterId) {
                SoundManager.play('buttonPressSuccess');
                var popup = document.getElementById("characterSelection");
                var characters = popup.getElementsByClassName("character");
                for (var i = 0; i < characters.length; i++) {
                    var character = characters[i];
                    character.className = removeClass(character.className, "selected");
                }
                var characterSelect = document.getElementById(characterId);
                characterSelect.className = addClass(characterSelect.className, "selected");

                var description = document.getElementById("characterSelection_description");
                description.className = removeClass(description.className, "boy");
                description.className = removeClass(description.className, "girl");
                description.className = removeClass(description.className, "empty");

                var nameArray = GirlNames;
                if (characterSelect.id == "characterSelection_boy") {
                    nameArray = BoyNames;
                    description.className = addClass(description.className, "boy");
                }
                else {
                    description.className = addClass(description.className, "girl");
                }
                var textName = document.getElementById("characterSelection_playerName");
                if (textName.value == "" || !textName.disableCharacterNameGeneration) {
                    textName.value = nameArray[Math.floor(Math.random() * nameArray.length)];
                    textName.disableCharacterNameGeneration = false;
                }
            }
        },
        saveCharacterAndLoadStageMapScreen: {
            value: function saveCharacterAndLoadStageMapScreen() {
                var textName = document.getElementById("characterSelection_playerName");
                var characters = document.getElementById("characterSelection").getElementsByClassName("selected");
                if (textName.value == "" || characters.length == 0) {
                    var description = document.getElementById("characterSelection_description");
                    description.className = removeClass(description.className, "boy");
                    description.className = removeClass(description.className, "girl");
                    description.className = addClass(description.className, "empty");
                }
                else {
                    PopupManager.hidePopup("characterSelection");
                    var characterType = "girl";
                    if (characters[0].id == "characterSelection_boy") {
                        characterType = "boy";
                    }
                    PlayerSaveManager.getNewGameSave(textName.value, characterType);
                    PlayerSaveManager.saveGameState();
                    this.loadStageMapScreen();
                }
            }
        },
        loadStageMapScreen: {
            value: function loadStageMapScreen() {
                var stages = StageManager.stageArray;
                for (var i = 0; i < stages.length; i++) {
                    var stageElement = document.getElementById(stages[i].stageIconId);
                    stageElement.className = removeClass(stageElement.className, "unlocked");
                }
                var gameSaveState = PlayerSaveManager.currentGameState;
                var unlockedStages = StageManager.getUnlockedStages(gameSaveState);
                for (var i = 0; i < unlockedStages.length; i++) {
                    var stageElement = document.getElementById(unlockedStages[i].stageIconId);
                    stageElement.className = addClass(stageElement.className, "unlocked");
                }

                ScreenManager.transitionToScreen('stageMapScreen');
                if (gameSaveState.triggers["ChefSchoolUnlock"]) {
                    var chefSchoolIcon = document.getElementById("iconChefSchool");
                    chefSchoolIcon.className = addClass(chefSchoolIcon.className, "unlocked");
                }
                if (gameSaveState.triggers["MarketplaceUnlock"]) {
                    var marketplaceIcon = document.getElementById("iconMarket");
                    marketplaceIcon.className = addClass(marketplaceIcon.className, "unlocked");
                }

                ScreenManager.transitionToScreen('stageMapScreen');

                var triggers = PlayerSaveManager.currentGameState.triggers;

                TutorialManager.init("levelSelect");
                if (!ScreenTransitionManager.renderStarted) {
                    // kick off rendering loop
                    requestAnimationFrame(ScreenTransitionManager.render);                    
                    ScreenTransitionManager.renderStarted = true;
                }
            },
        },
        render: {
            value: function render() {
                AnimationManager.update();
                if (myGame && myGame.rootSprite) {
                    myGame.ctx.clearRect(0, 0, myGame.canvas.width, myGame.canvas.height);
                    myGame.rootSprite.draw(myGame.ctx);
                }
                requestAnimationFrame(ScreenTransitionManager.render);
            }
        },
        toggleStageMapOptionBanner: {
            value: function showStageMapOptionBanner() {
                SoundManager.play('buttonPressSuccess');
                var optionBannerUI = document.getElementById("stageMap_options");
                if (!optionBannerUI.isVisible) {
                    // show animation
                    AnimationManager.addAnimations([new HTMLTranslationAnimation(optionBannerUI, 1250, 35, 910, 35, 0, 250)], null, false);
                } else {
                    // hide animation
                    AnimationManager.addAnimations([new HTMLTranslationAnimation(optionBannerUI, 910, 35, 1250, 35, 0, 250)], null, false);
                }
                optionBannerUI.isVisible = !optionBannerUI.isVisible;
            }
        },
        loadGameScreen: {
            value: function loadGameScreen(levelDescription) {
                //clean up the board if there is one exsits already
                var mainGrid = document.getElementById("mainGrid");
                mainGrid.innerText = "";

                //build board
                var boardInfoArray = new Array();
                boardInfoArray.push(new BoardInfo(6, 7, null, "hex"));
                myGame = new Game(boardInfoArray);

                //set the goal from level to game
                myGame.initFromLevelDescription(levelDescription);

                //build basic layout
                myGame.BuildGridAndList();
                myGame.initializeEnergyBar();
                myGame.layoutInitialBoardState();
                myGame.updateUIForGameStateChange();

                //Register the drag funcionality
                //myGame.canvas.addEventListener("MSPointerDown", myGame.initiateDrag);

                // start screen transition
                ScreenManager.transitionToScreen('gameBoardScreen', BlendTransition.bind(new BlendAnimationOptions()));

                // start the level by starting the timer
                myGame.timer.init(myGame.levelDescription.levelConfiguration.timeLimit);
                myGame.timer.startTimer();

                // start tutorial, this will pause and unpause timer
                // note that tutorial will only be played once when the Tutorialtrigger is not set to true
                var shouldStartLevelMusic = false;
                if (myGame.levelDescription.levelConfiguration.levelIsPrepMode) {
                    shouldStartLevelMusic |= TutorialManager.init("prepMode");
                }
                else if (myGame.levelDescription.levelConfiguration.levelIsReputationMode) {
                    shouldStartLevelMusic |= TutorialManager.init("reputationMode");
                }
                else if (myGame.levelDescription.levelConfiguration.levelIsCriticMode) {
                    shouldStartLevelMusic |= TutorialManager.init("criticMode");
                }
                else if (myGame.levelDescription.levelConfiguration.levelIsServiceMode) {
                    if (myGame.levelDescription.levelConfiguration.type == "autoServe") {
                        shouldStartLevelMusic |= TutorialManager.init("serviceMode1");
                    } else if (myGame.levelDescription.levelConfiguration.type == "neverDrop") {
                        shouldStartLevelMusic |= TutorialManager.init("serviceMode2");
                    }
                }

                var triggers = PlayerSaveManager.currentGameState.triggers;

                var greyUnlocked = (triggers["Level4Unlock"] != undefined);
                var sallyUnlocked = (triggers["Stage3Unlock"] != undefined);
                var nathanUnlocked = (triggers["Stage4Unlock"] != undefined);
                var lilianUnlocked = (triggers["Stage5Unlock"] != undefined);
                if (greyUnlocked) {
                    shouldStartLevelMusic |= TutorialManager.init("grey");
                }
                if (sallyUnlocked) {
                    shouldStartLevelMusic |= TutorialManager.init("sally");
                }
                if (nathanUnlocked) {
                    shouldStartLevelMusic |= TutorialManager.init("nathan");
                }
                if (lilianUnlocked) {
                    shouldStartLevelMusic |= TutorialManager.init("lilian");
                }

                if (triggers["ChefSchoolUnlock"]) {
                    shouldStartLevelMusic |= TutorialManager.init("chefSchool");
                }
                if (triggers["MarketplaceUnlock"]) {
                    shouldStartLevelMusic |= TutorialManager.init("marketPlace");
                }


                //start the bg music for the level if we did not go into the level tutorial
                if (!shouldStartLevelMusic) {
                    ScreenTransitionManager.startLevelBackgroundMusic();
                }

            }
        },
        loadDialogueScreen: {
            value: function loadDialogueScreen(levelDesc) {
                ScreenManager.setupScreens("screenHost", "uiScreen", "visible");
                ScreenManager.transitionToScreen('dialogueScreen');
                document.getElementById("dialogueScreen").levelDescription = levelDesc;
                document.getElementById("dialogueScreen").activeWindow = 0;
                document.getElementById("dialogueScreen").currentLineNum = 0;
                document.getElementById("dialogue_text0").innerText = "";
                document.getElementById("dialogue_text1").innerText = "";
                document.getElementById("dialogue_img0").style.backgroundImage = "";
                document.getElementById("dialogue_img1").style.backgroundImage = "";
                this.playNextLine();
            },
        },
        showCharacterSelectPopup: {
            value: function showCharacterSelectPopup(fromConfirmDialog) {
                if (PlayerSaveManager.currentGameState && !fromConfirmDialog) {
                    PopupManager.showPopup("confirmSaveDelete", [
                        { "id": "confirmSaveDelete_Cancel", "close": true },
                        { "id": "confirmSaveDelete_Confirm", "userCallback": function () { ScreenTransitionManager.showCharacterSelectPopup(true); } }
                    ]);
                }
                else {
                    PopupManager.hidePopup("confirmSaveDelete");
                    PlayerSaveManager.clearGameState();
                    document.getElementById("characterSelection_playerName").value = "";
                    PopupManager.showPopup("characterSelection");
                }
            }
        },
        playSelectedLevel: {
            value: function playSelectedLevel(targetElement) {
                if (hasClass(targetElement.className, "enabled")) {
                    PopupManager.hidePopup("stageLevelsPopup");
                    ScreenTransitionManager.loadDialogueScreen(targetElement.levelDescription);
                }
            }
        },
        playNextLevel: {
            value: function playNextLevel() {
                var curLevelNumber = document.getElementById("dialogueScreen").levelDescription.levelId;
                var nextLevelDescription = LevelDescriptions["Level" + (curLevelNumber + 1)]
                ScreenTransitionManager.loadDialogueScreen(nextLevelDescription);
            }
        },
        selectLevelAndShowDescription: {
            value: function selectLevelAndShowDescription(targetElement) {
                function formatTime(seconds) {
                    var minutes = Math.floor(seconds / 60);
                    var seconds = seconds % 60;

                    return minutes + ":" + ((seconds < 10) ? '0' : '') + seconds;
                }

                if (hasClass(targetElement.className, "unlocked")) {
                    // overlay a golden highlight on the selected level UI
                    for (var i = 1; i <= 6; i++)
                    {
                        var background = document.getElementById("stageLevel" + i).style.backgroundImage;
                        document.getElementById("stageLevel" + i).style.backgroundImage = background.replace("url(\"../images/preload/popups/levelselect/mode_highlight.png\"), ", "");
                    }
                    
                    targetElement.style.backgroundImage = "url(\"../images/preload/popups/levelselect/mode_highlight.png\"), " + targetElement.style.backgroundImage;

                    // play selection sound
                    SoundManager.play('buttonPressSuccess');

                    var levelDescription = targetElement.levelDescription;

                    // Setup the play button to advance to the game screen
                    var playButton = document.getElementById("stageLevelsPopup_Play");
                    playButton.className = addClass(playButton.className, "enabled");
                    playButton.levelDescription = levelDescription;

                    // Show the level description data
                    var detailsContainer = document.getElementById("stageLevelsPopup_Details");
                    detailsContainer.className = addClass(detailsContainer.className, "enabled");

                    document.getElementById("stageLevelsPopup_LevelTitle").innerText = levelDescription.title;

                    // Show the Level Configuration Information
                    var levelConfiguration = levelDescription.levelConfiguration;
                    document.getElementById("stageLevelsPopup_LevelTime").innerText = formatTime(levelConfiguration.timeLimit);

                    document.getElementById("stageLevelsPopup_Goal1Text").innerText = levelConfiguration.goal1 + " " + levelConfiguration.goalTitle;
                    document.getElementById("stageLevelsPopup_Goal2Text").innerText = levelConfiguration.goal2 + " " + levelConfiguration.goalTitle;
                    document.getElementById("stageLevelsPopup_Goal3Text").innerText = levelConfiguration.goal3 + " " + levelConfiguration.goalTitle;
                }
                else {
                    // play selection sound
                    SoundManager.play('buttonPressFailed');
                }
            }
        },
        showLevelPopupForStage: {
            value: function showLevelPopupForStage(stage) {
                var levelPopup = document.getElementById("stageLevelsPopup");
                var stageDescription = StageManager.stageArray[stage];

                var gameSaveState = PlayerSaveManager.currentGameState;
                var levelMapIcons = levelPopup.getElementsByClassName("levelMapIcon");
                var unlockedLevels = stageDescription.getUnlockedLevels(gameSaveState);
                for (var i = 0; i < levelMapIcons.length; i++) {
                    var levelMapIcon = levelMapIcons[i];
                    levelMapIcon.className = removeClass(levelMapIcon.className, "unlocked");
                    levelMapIcon.className = removeClass(levelMapIcon.className, "level1");
                    levelMapIcon.className = removeClass(levelMapIcon.className, "level2");
                    levelMapIcon.className = removeClass(levelMapIcon.className, "level3");

                    // HACK: Should do a better job mapping unlocked levels to level icons.
                    if (i < unlockedLevels.length) {
                        levelMapIcon.className = addClass(levelMapIcon.className, "unlocked");
                        levelMapIcon.levelDescription = unlockedLevels[i];

                        if (levelMapIcon.levelDescription.levelConfiguration.levelIsServiceMode) {
                            levelMapIcon.style.backgroundImage = "url(\"../images/preload/popups/levelselect/mode_serving.png\");";
                        } else if (levelMapIcon.levelDescription.levelConfiguration.levelIsPrepMode) {
                            levelMapIcon.style.backgroundImage = "url(\"../images/preload/popups/levelselect/mode_preping.png\");";
                        } else if (levelMapIcon.levelDescription.levelConfiguration.levelIsReputationMode) {
                            levelMapIcon.style.backgroundImage = "url(\"../images/preload/popups/levelselect/mode_reputation.png\");";
                        } else {
                            levelMapIcon.style.backgroundImage = "url(\"../images/preload/popups/levelselect/mode_critic.png\");";
                        }
                        
                        var levelId = levelMapIcon.levelDescription.levelId;
                        switch (gameSaveState.levelResults[levelId]) {
                            case 1: levelMapIcon.className = addClass(levelMapIcon.className, "level1"); break;
                            case 2: levelMapIcon.className = addClass(levelMapIcon.className, "level2"); break;
                            case 3: levelMapIcon.className = addClass(levelMapIcon.className, "level3"); break;
                        }
                    }
                }

                // Reset level description information until a user selection occurs
                var playButton = document.getElementById("stageLevelsPopup_Play");
                playButton.className = removeClass(playButton.className, "enabled");
                var detailsContainer = document.getElementById("stageLevelsPopup_Details");
                detailsContainer.className = removeClass(detailsContainer.className, "enabled");

                PopupManager.showPopup("stageLevelsPopup");

                //display the last unlocked level information
                var lastUnlockedLevelUI = document.getElementById("stageLevel" + unlockedLevels.length);
                if (lastUnlockedLevelUI != null) {
                    ScreenTransitionManager.selectLevelAndShowDescription(lastUnlockedLevelUI);
                }
            },
        },
        updateChefSchoolUIForStatChange: {
            value: function updateChefSchoolUIForStatChange(gameSaveState) {
                /* Initialization code for converting game state information to player skill unlocks */
                var statsContainer = document.getElementById("chefSchool_statLevels");
                var stats = statsContainer.getElementsByClassName("statLevel");
                for (var i = 0; i < stats.length; i++) {
                    var stat = stats[i];
                    var className = stat.className;
                    className = removeClass(className, "unlocked");
                    stat.className = removeClass(className, "available");
                }

                var goldContainer = document.getElementById("chefSchool_goldOverlay");
                goldContainer.innerText = gameSaveState.money;

                function _updateStatsByPlayerStats(playerStat, statContainer, currentStatsContainer) {
                    var firstChild = statContainer.firstElementChild;
                    if (playerStat === 0) {
                        firstChild.className = addClass(firstChild.className, "available");
                    }
                    else {
                        firstChild.className = addClass(firstChild.className, "unlocked");
                        var secondChild = firstChild.nextElementSibling;
                        if (playerStat === 1) {
                            secondChild.className = addClass(secondChild.className, "available");
                        }
                        else {
                            secondChild.className = addClass(secondChild.className, "unlocked");
                            var thirdChild = secondChild.nextElementSibling;
                            if (playerStat === 2) {
                                thirdChild.className = addClass(thirdChild.className, "available");
                            }
                            else {
                                thirdChild.className = addClass(thirdChild.className, "unlocked");
                            }
                        }
                    }

                    var playerSkillData = PlayerSkills[playerStat];
                    var text = playerSkillData.capacity + " / +" + playerSkillData.matchBonus;
                    currentStatsContainer.innerText = text;
                }

                var playerSkills = gameSaveState.playerSkills;
                _updateStatsByPlayerStats(playerSkills.breadSkill, document.getElementById("chefSchool_statLevels_Bread"), document.getElementById("chefSchool_currentStats_Bread"));
                _updateStatsByPlayerStats(playerSkills.dairySkill, document.getElementById("chefSchool_statLevels_Dairy"), document.getElementById("chefSchool_currentStats_Dairy"));
                _updateStatsByPlayerStats(playerSkills.heartSkill, document.getElementById("chefSchool_statLevels_Heart"), document.getElementById("chefSchool_currentStats_Heart"));
                _updateStatsByPlayerStats(playerSkills.fruitSkill, document.getElementById("chefSchool_statLevels_Fruit"), document.getElementById("chefSchool_currentStats_Fruit"));
                _updateStatsByPlayerStats(playerSkills.meatSkill, document.getElementById("chefSchool_statLevels_Meat"), document.getElementById("chefSchool_currentStats_Meat"));
                _updateStatsByPlayerStats(playerSkills.veggieSkill, document.getElementById("chefSchool_statLevels_Vegetable"), document.getElementById("chefSchool_currentStats_Vegetable"));
            }
        },
        updateMarketplaceUIForStatChange: {
            value: function updateMarkplaceUIForStatChange(gameSaveState) {
                /* Initialization code for converting game state information to chef skill unlocks */
                var chefContainer = document.getElementById("marketplace_chefs");
                var chefs = chefContainer.getElementsByClassName("chefIcon");
                for (var i = 0; i < chefs.length; i++) {
                    var chef = chefs[i];
                    chef.className = removeClass(chef.className, "unlocked");

                    var skills = chef.getElementsByClassName("skillLevel");
                    for (var j = 0; j < skills.length; j++) {
                        var skill = skills[j];
                        var className = skill.className;
                        className = removeClass(className, "available");
                        skill.className = removeClass(className, "unlocked");
                    }
                }

                var goldContainer = document.getElementById("marketplace_goldOverlay");
                goldContainer.innerText = gameSaveState.money;

                var triggerSet = {
                    "Stage2Unlock": { "chefId": "marketplace_chefs_Grey", "chefSkillKey": "grey" },
                    "Stage3Unlock": { "chefId": "marketplace_chefs_Sally", "chefSkillKey": "sally" },
                    "Stage4Unlock": { "chefId": "marketplace_chefs_Nathan", "chefSkillKey": "nathan" },
                    "Stage5Unlock": { "chefId": "marketplace_chefs_Lilian", "chefSkillKey": "lilian" }
                }
                for (var trigger in triggerSet) {
                    if (gameSaveState.triggers[trigger]) {
                        var chef = document.getElementById(triggerSet[trigger].chefId);
                        chef.className = addClass(chef.className, "unlocked");

                        var skills = chef.getElementsByClassName("skillLevel");

                        // Make the first skill available by default
                        skills[0].className = addClass(skills[0].className, "unlocked");

                        // Remaining skills have to be bought
                        if (gameSaveState.chefSkills[triggerSet[trigger].chefSkillKey].secondSkillUnlocked) {
                            skills[1].className = addClass(skills[1].className, "unlocked");
                            if (gameSaveState.chefSkills[triggerSet[trigger].chefSkillKey].thirdSkillUnlocked) {
                                skills[2].className = addClass(skills[2].className, "unlocked");
                                if (gameSaveState.chefSkills[triggerSet[trigger].chefSkillKey].fourthSkillUnlocked) {
                                    skills[3].className = addClass(skills[3].className, "unlocked");
                                }
                                else {
                                    skills[3].className = addClass(skills[3].className, "available");
                                }
                            }
                            else {
                                skills[2].className = addClass(skills[2].className, "available");
                            }
                        }
                        else {
                            skills[1].className = addClass(skills[1].className, "available");
                        }
                    }
                }
            }
        },
        showChefSchoolPopup: {
            value: function showChefSchoolPopup() {
                // first pause the timer if we are in the middle of a game
                if (myGame != null) {
                    myGame.timer.pauseTimer();
                }
                var gameSaveState = PlayerSaveManager.currentGameState;
                var characterType = "boy";
                if (PlayerSaveManager.currentGameState) {
                    characterType = gameSaveState.playerData.character;
                }

                var character = document.getElementById("chefSchool_character");
                character.className = characterType;

                this.updateChefSchoolUIForStatChange(gameSaveState);

                PopupManager.showPopup("chefSchool", [{ "id": "chefSchool_closeButton", "close": true }]);
            }
        },
        showMarketplacePopup: {
            value: function showMarketplacePopup() {
                // first pause the timer if we are in the middle of a game
                if (myGame != null) {
                    myGame.timer.pauseTimer();
                }
                var gameSaveState = PlayerSaveManager.currentGameState;
                var characterType = "boy";
                if (PlayerSaveManager.currentGameState) {
                    characterType = gameSaveState.playerData.character;
                }

                var character = document.getElementById("marketplace_character");
                character.className = characterType;

                this.updateMarketplaceUIForStatChange(gameSaveState);

                PopupManager.showPopup("marketplace", [{ "id": "marketplace_closeButton", "close": true }]);
            }
        },
        selectMarketplaceSkill: {
            value: function selectMarketplaceSkill(targetElement) {
                function getSkillLevelByTarget(targetElement) {
                    if (hasClass(targetElement.className, "available") || hasClass(targetElement.className, "unlocked")) {
                        if (hasClass(targetElement.className, "level1")) {
                            return 0; // "secondSkillUnlocked";
                        }
                        if (hasClass(targetElement.className, "level2")) {
                            return 1; // "secondSkillUnlocked";
                        }
                        else if (hasClass(targetElement.className, "level3")) {
                            return 2; // "thirdSkillUnlocked";
                        }
                        else if (hasClass(targetElement.className, "level4")) {
                            return 3; // "fourthSkillUnlocked";
                        }
                    }
                    else {
                        SoundManager.play('buttonPressFailed');
                        return -1;
                    }
                }

                var purchaseButton = document.getElementById("marketplace_purchaseButton");
                purchaseButton.className = removeClass(purchaseButton.className, "enabled");
                delete purchaseButton.currentSkill;
                delete purchaseButton.currentLevel;

                var skillCost = document.getElementById("marketplace_skillCost");
                skillCost.className = removeClass(skillCost.className, "enabled");
                
                var level = getSkillLevelByTarget(targetElement);
                if (level > -1) {
                    var gameSaveState = PlayerSaveManager.currentGameState;
                    var chef = targetElement.parentNode;
                    var requiredGold = 1000000;
                    var skillDesc = "";
                    switch (chef.id) {
                        case "marketplace_chefs_Grey": requiredGold = ChefSkills.grey[level].requiredGold; skillDesc = ChefSkills.grey[level].description; break;
                        case "marketplace_chefs_Sally": requiredGold = ChefSkills.sally[level].requiredGold; skillDesc = ChefSkills.sally[level].description; break;
                        case "marketplace_chefs_Nathan": requiredGold = ChefSkills.nathan[level].requiredGold; skillDesc = ChefSkills.nathan[level].description; break;
                        case "marketplace_chefs_Lilian": requiredGold = ChefSkills.lilian[level].requiredGold; skillDesc = ChefSkills.lilian[level].description; break;
                    }
                    if (hasClass(targetElement.className, "available") && gameSaveState.money >= requiredGold) {
                        SoundManager.play('buttonPressSuccess');
                        purchaseButton.className = addClass(purchaseButton.className, "enabled");
                        purchaseButton.currentSkill = targetElement;
                        purchaseButton.currentLevel = level;

                        skillCost.className = addClass(skillCost.className, "enabled");
                    }
                    else {
                        SoundManager.play('buttonPressFailed');
                        if (hasClass(targetElement.className, "unlocked")) {
                            skillDesc += " - You already have this skill!"
                        } else if (gameSaveState.money < requiredGold) {
                            skillDesc += " - Not enough money!"
                        }
                    }

                    document.getElementById("marketplace_skillDescription").innerText = skillDesc;
                    document.getElementById("marketplace_skillCost").innerText = "Cost: " + requiredGold;
                    this.updateMarketplaceUIForStatChange(gameSaveState);
                }
                else {
                    document.getElementById("marketplace_skillDescription").innerText = "Purchase the previous skill to unlock this skill";
                }
            }
        },
        purchaseCurrentMarketplaceSkill: {
            value: function purchaseCurrentMarketplaceSkill(targetElement) {
                var purchaseButton = targetElement;
                if (hasClass(purchaseButton.className, "enabled")) {
                    var gameSaveState = PlayerSaveManager.currentGameState;
                    var chef = purchaseButton.currentSkill.parentNode;
                    var level = purchaseButton.currentLevel;

                    purchaseButton.className = removeClass(purchaseButton.className, "enabled");
                    delete purchaseButton.currentSkill;
                    delete purchaseButton.currentLevel;

                    var chefSkill;
                    switch (level) {
                        case 1: chefSkill = "secondSkillUnlocked"; break;
                        case 2: chefSkill = "thirdSkillUnlocked"; break;
                        case 3: chefSkill = "fourthSkillUnlocked"; break;
                    }

                    var chefProperty;
                    switch (chef.id) {
                        case "marketplace_chefs_Grey": chefProperty = "grey"; break;
                        case "marketplace_chefs_Sally": chefProperty = "sally"; break;
                        case "marketplace_chefs_Nathan": chefProperty = "nathan"; break;
                        case "marketplace_chefs_Lilian": chefProperty = "lilian"; break;
                    }

                    if (chefProperty && chefSkill) {
                        gameSaveState.money -= ChefSkills[chefProperty][level].requiredGold;
                        gameSaveState.chefSkills[chefProperty][chefSkill] = true;
                        PlayerSaveManager.saveGameState();
                    }

                    this.updateMarketplaceUIForStatChange(gameSaveState);
                }
                else {
                    SoundManager.play('buttonPressFailed');
                }
            }
        },
        selectChefSchoolSkill: {
            value: function selectChefSchoolSkill(targetElement) {
                function getLevelFromTarget(targetElement) {
                    if (hasClass(targetElement.className, "available") || hasClass(targetElement.className, "unlocked")) {
                        SoundManager.play('buttonPressSuccess');
                        if (hasClass(targetElement.className, "level0")) {
                            return 0;
                        }
                        else if (hasClass(targetElement.className, "level1")) {
                            return 1;
                        }
                        else if (hasClass(targetElement.className, "level2")) {
                            return 2;
                        }
                        else if (hasClass(targetElement.className, "level3")) {
                            return 3;
                        }
                    }
                    else {
                        SoundManager.play('buttonPressFailed');
                        return -1;
                    }
                }

                var purchaseButton = document.getElementById("chefSchool_purchaseButton");
                var purchasePrice = document.getElementById("chefSchool_statCost");
                purchaseButton.className = removeClass(purchaseButton.className, "enabled");
                purchasePrice.className = removeClass(purchasePrice.className, "enabled");
                delete purchaseButton.currentSkill;
                delete purchaseButton.currentLevel;

                var gameSaveState = PlayerSaveManager.currentGameState;
                var level = getLevelFromTarget(targetElement);
                if (level > -1) {
                    if (hasClass(targetElement.className, "available") && gameSaveState.money >= PlayerSkills[level].price) {
                        purchaseButton.className = addClass(purchaseButton.className, "enabled");
                        purchasePrice.className = addClass(purchasePrice.className, "enabled");
                        purchaseButton.currentSkill = targetElement;
                        purchaseButton.currentLevel = level;
                    }

                    this.updateChefSchoolUIForStatChange(gameSaveState);
                    var playerStat = "";
                    switch (targetElement.parentNode.id) {
                        case "chefSchool_statLevels_Bread":
                            playerStat = gameSaveState.playerSkills.breadSkill;
                            break;
                        case "chefSchool_statLevels_Dairy":
                            playerStat = gameSaveState.playerSkills.dairySkill;
                            break;
                        case "chefSchool_statLevels_Heart":
                            playerStat = gameSaveState.playerSkills.heartSkill;
                            break;
                        case "chefSchool_statLevels_Fruit":
                            playerStat = gameSaveState.playerSkills.fruitSkill;
                            break;
                        case "chefSchool_statLevels_Meat":
                            playerStat = gameSaveState.playerSkills.meatSkill;
                            break;
                        case "chefSchool_statLevels_Vegetable":
                            playerStat = gameSaveState.playerSkills.veggieSkill;
                            break;
                    };

                    var curStatUI = document.getElementById(targetElement.parentNode.id.replace("statLevels", "currentStats"));
                    curStatUI.innerText = "";

                    var greenText = document.createElement('span');
                    greenText.style.color = "green";
                    greenText.innerText = PlayerSkills[level].capacity + " / +" + level;
                    curStatUI.appendChild(greenText);

                    purchasePrice.innerText = "Cost: " + PlayerSkills[level].price;

                } else {
                    this.updateChefSchoolUIForStatChange(gameSaveState);
                    document.getElementById("chefSchool_statCost").innerText = "";
                }
            }
        },
        purchaseCurrentChefSchoolSkill: {
            value: function purchaseCurrentChefSchoolSkill(targetElement) {
                var purchaseButton = targetElement;
                if (hasClass(purchaseButton.className, "enabled")) {
                    SoundManager.play('buttonPressSuccess');
                    var gameSaveState = PlayerSaveManager.currentGameState;
                    var statContainer = purchaseButton.currentSkill.parentNode;
                    var level = purchaseButton.currentLevel;

                    purchaseButton.className = removeClass(purchaseButton.className, "enabled");
                    delete purchaseButton.currentSkill;
                    delete purchaseButton.currentLevel;

                    switch (statContainer.id) {
                        case "chefSchool_statLevels_Bread":
                            gameSaveState.playerSkills.breadSkill = level;
                            break;
                        case "chefSchool_statLevels_Dairy":
                            gameSaveState.playerSkills.dairySkill = level;
                            break;
                        case "chefSchool_statLevels_Heart":
                            gameSaveState.playerSkills.heartSkill = level;
                            break;
                        case "chefSchool_statLevels_Fruit":
                            gameSaveState.playerSkills.fruitSkill = level;
                            break;
                        case "chefSchool_statLevels_Meat":
                            gameSaveState.playerSkills.meatSkill = level;
                            break;
                        case "chefSchool_statLevels_Vegetable":
                            gameSaveState.playerSkills.veggieSkill = level;
                            break;
                    }
                    gameSaveState.money -= PlayerSkills[level].price;
                    PlayerSaveManager.saveGameState();

                    this.updateChefSchoolUIForStatChange(gameSaveState);
                }
                else {
                    SoundManager.play('buttonPressFailed');
                }
            },
        },
        showCreditsPopup: {
            value: function showCreditsPopup() {
                PopupManager.showPopup('credit', [{ 'id': 'credit_closeButton', 'close': true }]);
            }
        },
        showOptionsPopup: {
            value: function showOptionsPopup() {
                var elemMusic = document.getElementById("optionPopup_musicButton");
                var elemSfx = document.getElementById("optionPopup_sfxButton");
                var elemBarMusic = document.getElementById("optionPopup_musicBarFill");
                var elemBarSfx = document.getElementById("optionPopup_sfxBarFill");

                PopupManager.showPopup("optionPopup", [{ "id": "optionPopup_closeButton", "close": true }]);

                // Layout dependent functions need to be after we've shown the popup
                this.updateMusicBarUI(elemBarMusic, SoundManager.volumeMusic);
                this.updateMusicBarUI(elemBarSfx, SoundManager.volumeSoundEffects);
                this.updateMuteUI();
            }
        },
        registerMusicBar: {
            value: function registerMusicBar(elemBar, evt) {
                var percent = 0;
                if (evt.offsetX < 10) {
                    percent = 0;
                }
                else if (elemBar.offsetWidth - evt.offsetX < 10) {
                    percent = 1.0;
                }
                else {
                    percent = evt.offsetX / elemBar.offsetWidth;
                }

                this.updateMusicBarUI(elemBar, percent);
                PlayerSaveManager.saveGameState();
                SoundManager.play("buttonPressSuccess");
            }
        },
        updateMusicBarUI: {
            value: function updateMusicBarUI(elemBar, percentFilled) {
                var gripperUIElement = null;
                if (elemBar.id === "optionPopup_musicBarFill") {
                    SoundManager.volumeMusic = percentFilled;
                    gripperUIElement = document.getElementById("optionPopup_musicBarGripper");
                }
                else if (elemBar.id === "optionPopup_sfxBarFill") {
                    SoundManager.volumeSoundEffects = percentFilled;
                    gripperUIElement = document.getElementById("optionPopup_sfxBarGripper");
                }

                elemBar.style.backgroundSize = (percentFilled * 100) + "% 100%";

                var gripperPosX = elemBar.offsetWidth * percentFilled + parseInt(elemBar.currentStyle.left.replace("px", "")) - 15;
                gripperUIElement.style.left = gripperPosX + "px";
            }
        },
        setMuteAll: {
            value: function setMuteAll(shouldMute) {
                SoundManager.mute = shouldMute;

                this.updateMuteUI();
                PlayerSaveManager.saveGameState();
                SoundManager.play('buttonPressSuccess');
            }
        },
        updateMuteUI: {
            value: function updateMuteUI() {
                if (SoundManager.mute) {
                    document.getElementById("optionPopup_soundOn").style.backgroundImage = "url(\"images/preload/popups/options/On_Down.png\")";
                    document.getElementById("optionPopup_soundOff").style.backgroundImage = "url(\"images/preload/popups/options/Off_Up.png\")";
                } else {
                    document.getElementById("optionPopup_soundOn").style.backgroundImage = "url(\"images/preload/popups/options/On_Up.png\")";
                    document.getElementById("optionPopup_soundOff").style.backgroundImage = "url(\"images/preload/popups/options/Off_Down.png\")";
                }
            }
        },
        replaceLineKeyWord: {
            value: function replaceLineKeyWord(lineContent) {
                var playerName = PlayerSaveManager.currentGameState.playerData.name;
                var playerCharacter = PlayerSaveManager.currentGameState.playerData.character;

                /*
                    <playerSex1> = man/woman
                    <playerSex2> = him/her
                    <playerSex3> = he/she
                    <playerSexRelationship> = nephew/niece
                    <playerParentRelationship> = son/daughter
                    <playerDate> = beautiful girl/handsome guy
                    <playerDateSex> = her/him
                */
                var playerSex1 = "man";
                var playerSex2 = "him";
                var playerSex3 = "he";
                var playerSexRelationship = "nephew";
                var playerParentRelationship = "son";
                var playerDate = "beautiful girl";
                var playerDateSex = "her";

                if (playerCharacter == "girl") {
                    var playerSex1 = "woman";
                    var playerSex2 = "her";
                    var playerSex3 = "she";
                    var playerSexRelationship = "niece";
                    var playerParentRelationship = "daughter";
                    var playerDate = "handsome guy";
                    var playerDateSex = "him";
                }

                var filteredLine = lineContent.replace("<playerName>", playerName);
                filteredLine = filteredLine.replace("<playerSex1>", playerSex1);
                filteredLine = filteredLine.replace("<playerSex2>", playerSex2);
                filteredLine = filteredLine.replace("<playerSex3>", playerSex3);
                filteredLine = filteredLine.replace("<playerSexRelationship>", playerSexRelationship);
                filteredLine = filteredLine.replace("<playerParentRelationship>", playerParentRelationship);
                filteredLine = filteredLine.replace("<playerDate>", playerDate);
                filteredLine = filteredLine.replace("<playerDateSex>", playerDateSex);

                return filteredLine;
            }
        },
        playNextLine: {
            value: function playNextLine() {

                SoundManager.play('buttonPressSuccess');
                var dialogueScreenUI = document.getElementById("dialogueScreen");

                var levelDesc = dialogueScreenUI.levelDescription;
                if (levelDesc != null) {
                    var dialogueDesc = levelDesc.levelDialogue;
                    if (dialogueDesc != null) {
                        dialogueScreenUI.style.backgroundImage = dialogueDesc.backgroundUI;
                        var window = dialogueScreenUI.activeWindow;
                        var lineNumber = dialogueScreenUI.currentLineNum;
                        if (lineNumber < dialogueDesc.totalLineNum) {
                            var currentLine = dialogueDesc.lineArray[lineNumber];

                            // 6 is CHARACTER_Player, by default it is the boy image. If our character is girl, switch out the character image here.                            
                            if (currentLine.uiType == 6 && PlayerSaveManager.currentGameState.playerData.character == "girl") {
                                document.getElementById("dialogue_img" + window).style.backgroundImage = "url(../images/preload/characters/player_female_dialogue.png)";
                            }
                            else {
                                document.getElementById("dialogue_img" + window).style.backgroundImage = currentLine.ui;
                            }

                            document.getElementById("dialogue_text" + window).innerText = this.replaceLineKeyWord(currentLine.text);

                            // alternate the next update window if current next line's UI is different from the next line's update window
                            if (lineNumber + 1 < dialogueDesc.totalLineNum) {
                                var nextLine = dialogueDesc.lineArray[lineNumber + 1];
                                if (nextLine.uiType != currentLine.uiType) {
                                    if (window == 0) {
                                        dialogueScreenUI.activeWindow = 1;
                                    }
                                    else {
                                        dialogueScreenUI.activeWindow = 0;
                                    }
                                }
                            }

                            // advance the current line number
                            dialogueScreenUI.currentLineNum++;
                        }
                        else {
                            this.skipAllDialogueLines();
                        }
                    }
                }
            },
        },
        skipAllDialogueLines: {
            value: function skipAllDialogueLines() {
                SoundManager.play('buttonPressSuccess');
                var levelDesc = document.getElementById("dialogueScreen").levelDescription;
                // Transit to game screen if we are not at the final level, which is a fake level that does not have any game data but dialogue content.
                // Transit to Stage map if we are at the final level.
                if (levelDesc.levelId != 30) {
                    ScreenTransitionManager.loadGameScreen(levelDesc);                    
                }
                else {
                    ScreenTransitionManager.loadStageMapScreen();
                }
            },
        },
        startLevelBackgroundMusic: {
            value: function startLevelBackgroundMusic() {
                if (SoundManager != null && myGame != null) {
                    SoundManager.stopAll();
                    if (myGame.levelDescription.levelConfiguration.levelIsPrepMode) {
                        SoundManager.playMusic('bg_prepMode');
                    }
                    else if (myGame.levelDescription.levelConfiguration.levelIsReputationMode) {
                        SoundManager.playMusic('bg_reputationMode');
                    }
                    else if (myGame.levelDescription.levelConfiguration.levelIsCriticMode) {
                        SoundManager.playMusic('bg_criticMode');
                    }
                    else {
                        SoundManager.playMusic('bg_serviceMode');
                    }
                }
            }
        },
        showUserFeedbackPopup: {
            value: function showUserFeedbackPopup() {
                PopupManager.showPopup("userFeedback", [{ "id": "userFeedback_closeButton", "close": true }]);
            }
        },
        enableFeedbackTab: {
            value: function enableFeedbackTab(tabId) {
                var tabPanel = document.getElementById("userFeedback_TabPanel");
                if (!hasClass(tabPanel.className, "visible")) {
                    tabPanel.className = addClass(tabPanel.className, "visible");
                }

                var tabPanes = tabPanel.getElementsByClassName("userFeedbackTabPane");
                for (var i = 0; i < tabPanes.length; i++) {
                    var tabPane = tabPanes[i];
                    tabPane.className = removeClass(tabPane.className, "visible");
                    if (tabPane.id === tabId) {
                        tabPane.className = addClass(tabPane.className, "visible");
                    }
                }
            }
        },
        submitFeedback: {
            value: function submitFeedback() {
                var tabPanel = document.getElementById("userFeedback_TabPanel");
                tabPanel.className = removeClass(tabPanel.className, "visible");

                var tabPanes = tabPanel.getElementsByClassName("userFeedbackTabPane");
                for (var i = 0; i < tabPanes.length; i++) {
                    var tabPane = tabPanes[i];
                    if (hasClass(tabPane.className, "visible")) {
                        var userNameElem = document.getElementById("userFeedback_userName");
                        var userName = userNameElem.value;
                        userNameElem.value = "";

                        var userEmailElem = document.getElementById("userFeedback_contactEmail");
                        var userEmail = userEmailElem.value;
                        userEmailElem.value = "";

                        var ratingCommentsElem = document.getElementById("userFeedback_Comments");
                        var ratingComments = ratingCommentsElem.value;
                        ratingCommentsElem.value = "";

                        var requestCommentsElem = document.getElementById("userFeedback_RequestText");
                        var requestComments = requestCommentsElem.value;
                        requestCommentsElem.value = "";

                        var gameDataElem = document.getElementById("userFeedback_SubmitGameData");
                        var gameDataChecked = gameDataElem.checked;
                        gameDataElem.checked = false;

                        var bugDescElem = document.getElementById("userFeedback_BugDescription");
                        var bugDesc = bugDescElem.value;
                        bugDescElem.value = "";

                        var bugReproElem = document.getElementById("userFeedback_BugRepro");
                        var bugRepro = bugReproElem.value;
                        bugReproElem.value = "";

                        switch (tabPane.id) {
                            case "userFeedback_RatingTab":
                                var ratingControl = document.getElementById("userFeedback_RatingSelect");
                                var rating = ratingControl.options[ratingControl.selectedIndex].value;

                                Services.UserFeedback.submitUserRating(userName, userEmail, rating, ratingComments);
                                break;
                            case "userFeedback_RequestTab":
                                Services.UserFeedback.submitFeatureRequest(userName, userEmail, requestComments);
                                break;
                            case "userFeedback_BugTab":
                                var gameData = "";
                                if (gameDataChecked) {
                                    gameData = JSON.stringify(PlayerSaveManager.currentGameState);
                                }
                                Services.UserFeedback.submitBugReport(userName, userEmail, bugDesc, bugRepro, gameData);
                                break;
                        }
                    }
                    tabPane.className = removeClass(tabPane.className, "visible");
                }
                PopupManager.hidePopup("userFeedback");
            }
        }
    });

    return _screenTransitionManager;
})();