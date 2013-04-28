var SoundManager = (function () {
    var _audioManager = {};
    var _singles = {};
    var _instances = {};
    var _currentSingle;
    var _currentInstances = [];
    var _mute = false;
    var _volumeMusic = 1.0;
    var _volumeSoundEffects = 1.0;
    var _fUsingDebugSounds = false;

    function onEnded(evt) {
        var numInstances = _currentInstances.length;
        for (var i = 0; i < numInstances; i++) {
            if (_currentInstances[i] === evt.target) {
                _currentInstances.splice(i, 1);
            }
        }
    }

    function _playInternal(clipId) {
        if (_singles[clipId]) {
            if (_currentSingle) {
                _currentSingle.pause();
                try {
                    _currentSingle.currentTime = 0;
                } catch (exc) { }
                _currentSingle = undefined;
            }

            _currentSingle = _singles[clipId];
            try {
                _currentSingle.currentTime = 0;
            } catch (exc) { }

            // We can't set the volume until after we've started playing?
            _currentSingle.play();
            if (_mute) {
                _currentSingle.volume = 0;
            }
            else {
                _currentSingle.volume = _volumeMusic;
            }
        }
        else if (_instances[clipId]) {
            try {
                var originalInstance = _instances[clipId];
                var playInstance = originalInstance;
                if (_audioManager.soundInstancing) {
                    playInstance = originalInstance.cloneNode(true);
                }
                else {
                    try {
                        playInstance.currentTime = 0;
                    } catch (exc) { }
                }

                _currentInstances.push(playInstance);
                playInstance.addEventListener("ended", onEnded);
                playInstance.addEventListener("error", onEnded);
                if (_mute) {
                    playInstance.volume = 0;
                }
                else {
                    playInstance.volume = _volumeSoundEffects;
                }
                playInstance.play();
            }
            catch (exc) {
                // Ignore audio playback failures for now.
            }
        }
    }

    Object.defineProperties(_audioManager, {
        setupAudio: {
            value: function setupAudio(audioHostId, singlesContainerId, instancesContainerId) {
                this.audioHost = document.getElementById(audioHostId);

                var audioIterator = this.audioHost.firstElementChild;
                while (audioIterator !== null) {
                    switch (audioIterator.id) {
                        case singlesContainerId:
                            var singles = audioIterator.getElementsByTagName("audio");
                            if (singles) {
                                var numSingles = singles.length;
                                for (var i = 0; i < numSingles; i++) {
                                    var single = singles[i];
                                    if (!single.disabled) {
                                        _singles[single.id] = single;
                                    }
                                }
                            }
                            break;

                        case instancesContainerId:
                            var instances = audioIterator.getElementsByTagName("audio");
                            if (instances) {
                                var numInstances = instances.length;
                                for (var i = 0; i < numInstances; i++) {
                                    var instance = instances[i];
                                    _instances[instance.id] = instance;
                                }
                            }
                            break;
                    }
                    audioIterator = audioIterator.nextElementSibling;
                }
            }
        },
        playMusic: {
            value: function playMusic(clipId) {
                _playInternal(clipId);
            }
        },
        play: {
            value: function play(clipId) {
                if (_fUsingDebugSounds) {
                    console.log("Playing" + clipId + " at " + Date.now());
                }
                _playInternal(clipId);
            }
        },
        stop: {
            value: function stop(clipId) {
                for (var i = 0; i < _currentInstances.length; i++) {
                    var localInstance = _currentInstances[i];
                    if (localInstance.id === clipId) {
                        _currentInstances.splice(i, 1);
                        localInstance.removeEventListener("ended", onEnded);
                        localInstance.removeEventListener("error", onEnded);
                        localInstance.pause();
                        break;
                    }
                }
            }
        },
        stopAll: {
            value: function stopAll() {
                var localInstances = _currentInstances;
                _currentInstances = [];

                var numInstances = localInstances.length;
                for (var i = 0; i < numInstances; i++) {
                    var localInstance = localInstances[i];
                    localInstance.removeEventListener("ended", onEnded);
                    localInstance.removeEventListener("error", onEnded);
                    localInstance.pause();
                }

                if (_currentSingle) {
                    _currentSingle.pause();
                }
            },
        },
        startMusic: {
            value: function startMusic() {
                if (_currentSingle) {
                    _currentSingle.volume = _volumeMusic;
                    _currentSingle.play();
                }
            },
        },
        hasSound: {
            value: function hasSound(clipId) {
                return (_singles[clipId] || _instances[clipId]);
            },
        },
        volumeMusic: {
            get: function get_volumeMusic() {
                return _volumeMusic;
            },
            set: function set_volumeMusic(val) {
                _volumeMusic = Math.max(0, Math.min(1, val));
                if (_currentSingle) {
                    _currentSingle.volume = _volumeMusic;
                }
            }
        },
        volumeSoundEffects: {
            get: function get_volumeSoundEffects() {
                return _volumeSoundEffects;
            },
            set: function set_volumeSoundEffects(val) {
                _volumeSoundEffects = Math.max(0, Math.min(1, val));
            }
        },
        mute: {
            get: function get_mute() {
                return _mute;
            },
            set: function set_mute(muteValue) {
                if (muteValue) {
                    this.stopAll();
                    _mute = true;
                }
                else {
                    this.startMusic();
                    _mute = false;
                }
            },
        },
        soundInstancing: {
            value: false,
            writable: true
        },
        switchToDebugSounds: {
            value: function switchDebugSounds() {
                if (!_fUsingDebugSounds) {
                    for (var i in _instances) {
                        var soundEffect = _instances[i];
                        var originalSrc = soundEffect.src;
                        var newSrc = soundEffect.getAttribute("data-dynamicSrc");
                        if (newSrc) {
                            soundEffect.setAttribute("data-originalSrc", originalSrc);
                            soundEffect.src = newSrc;
                        }
                    }
                    _fUsingDebugSounds = true;
                }
            }
        },
    });
    return _audioManager;
})();