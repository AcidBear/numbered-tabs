const {components} = require("chrome");
const numberRegex = /^\d: /;
var wm = components.classes["@mozilla.org/appshell/window-mediator;1"]
                   .getService(components.interfaces.nsIWindowMediator);
var NumberedTabs = (function () {
    var mainWindow = wm.getMostRecentWindow("navigator:browser");
    var gBrowser = mainWindow.gBrowser;
    var container = gBrowser.tabContainer;
    var tabBrowser = mainWindow.document.getElementById("tabbrowser-tabs");
    var tabs = tabBrowser.childNodes;

    var numberOneTab = function (tab, num) {
        var label = tab.label;
        var isNumbered = numberRegex.test(label);
        if (isNumbered === true) {
            let tabName = tab.label.slice(3);
            tab.label = num + ": " + tabName;
        } else {
            tab.label = num + ": " + tab.label;
            tab.isNumbered = true;
        }
    };

    var numberTabs = function () {
        var i, tab;

        for (i = 0; i < tabs.length; i++) {
            let tabNum = i + 1;
            numberOneTab(tabs[i], tabNum);
        }
    };

    var numberModifedTab = function (event) {
        var tab = event.target;
        numberOneTab(tab, tab._tPos + 1);
    };

    var addEventListeners = function () {
        container.addEventListener("TabAttrModified", function (event) {
            mainWindow.setTimeout(numberModifedTab, 250, event);
        }, false);
        container.addEventListener("TabOpen", function(event) {
            mainWindow.setTimeout(numberTabs, 250);
        }, false);
        container.addEventListener("TabMove", numberTabs, false);
        container.addEventListener("TabClose", numberTabs, false);
    };

    var NumberedTabs = function () {
        numberTabs();
        addEventListeners();
    };

    return NumberedTabs;
})();

var nt = new NumberedTabs();
