// Singleton manager pattern
PopupManager = (function () {
    var _popups = {};
    var _uiPopupMgr;
    var _popupManager = {};
    var _currentPopup;
    var _hideCallback;
    
    // Popup management
    function _popupClick(evt) {
        evt.currentTarget.removeEventListener("click", _popupClick);
        PopupManager.hidePopup(_currentPopup.id);
    }
    
    Object.defineProperties(_popupManager, {
        initPopups: {
            value: function initPopups(uiPopupMgr, popupClass) {
                _uiPopupMgr = uiPopupMgr;
            
                var popups = uiPopupMgr.querySelectorAll("." + popupClass);
                [].forEach.call(popups, function (popup) {
                    if (_popups[popup.id]) {
                        throw "Already defined popup with id " + popup.id;
                    }
                    _popups[popup.id] = popup;
                });
            }
        },
        getPopup: {
            value: function getPopup(popupId) {
                if (_popups[popupId]) {
                    return _popups[popupId];
                }
                else {
                    throw "No popup with id " + popupId + ". You should make one!";
                }
            }
        },
        showPopup: {
            value: function showPopup(popupId, hideCallback) {
                if (_currentPopup) {
                    throw "A popup is already showing with id " + _currentPopup.id;
                }
                
                if (_popups[popupId]) {
                    _currentPopup = _popups[popupId];
                    _hideCallback = hideCallback;
                
                    _uiPopupMgr.className = UIElement.addClass(_uiPopupMgr.className, "visible");
                    _currentPopup.className = UIElement.addClass(_currentPopup.className, "visible");
                    
                    _currentPopup.addEventListener("click", _popupClick);
                }
                else {
                    throw "No popup with id " + popupId + ". You should make one!";
                }
            }
        },
        hidePopup: {
            value: function hidePopup(popupId) {
                if (_currentPopup) {
                    _uiPopupMgr.className = UIElement.removeClass(_uiPopupMgr.className, "visible");
                    _currentPopup.className = UIElement.removeClass(_currentPopup.className, "visible");
                    _currentPopup = null;
                    
                    if (_hideCallback) {
                        var hideCallback = _hideCallback;
                        _hideCallback = null;
                        hideCallback();
                    }
                }
                else {
                    throw "Trying to hide a popup with id " + popupId + " that isn't showing.";
                }
            }
        },
        paused: {
            get: function get_paused() {
                if (_currentPopup) {
                    return true;
                }
                else {
                    return false;
                }
            }
        },
    });
    
    return Object.seal(_popupManager);
})();