(function() {

    var runningInspectors = {};

    function getExtensionUrl() {
        return chrome.runtime.getURL("");
    }

    function insertStyleSheet(url) {
        var link = document.createElement("link");

        link.rel = "stylesheet";
        link.href = getExtensionUrl() + url;

        if (document.head) {
            document.head.appendChild(link);
        }

        return link;
    }

    function insertScript(url, removeOnLoad) {
        var script = document.createElement("script");

        script.type = "text/javascript";
        script.src = getExtensionUrl() + url;

        if (document.body) {
            document.body.appendChild(script);

            if (removeOnLoad) {
                script.onload = function() {
                    document.body.removeChild(script);
                };
            }
        }

        return script;
    }

    function toggleInspector(tabId) {
        var styleEl = null;
        var scriptEl = null;

        // if there is an inspector running for the tab then remove it
        if (runningInspectors[tabId]) {

            // dispatch event to shutdown the inspector
            var shutdownEvent = document.createEvent("Event");
            shutdownEvent.initEvent("AstridInspectorShutdownEvent", true, true);
            document.dispatchEvent(shutdownEvent);

            // remove styles and scripts
            styleEl = runningInspectors[tabId].styleEl;
            scriptEl = runningInspectors[tabId].scriptEl;

            if (styleEl) {
                document.head.removeChild(styleEl);
            }

            if (scriptEl) {
                document.body.removeChild(scriptEl);
            }

            runningInspectors[tabId].styleEl = null;
            runningInspectors[tabId].scriptEl = null;

            delete runningInspectors[tabId];
        }

        // otherwise create a new inspector
        else {
            styleEl = insertStyleSheet("css/inspector.css");
            scriptEl = insertScript("inspector.js", false);

            runningInspectors[tabId] = {
                styleEl: styleEl,
                scriptEl: scriptEl
            };
        }
    }

    window.addEventListener("message", function(e) {
        // filter out messages that are not in the same frame
        if (e.source !== window) {
            return;
        }

        // forward messages to the runtime
        if (e.data && e.data.type) {
            chrome.runtime.sendMessage(e.data);
        }
    });

    chrome.runtime.onMessage.addListener(function(message, sender) {
        if (!message) {
            return;
        }

        // launch the inspector
        if (message.type === "astrid-launch-inspector") {
            toggleInspector(message.tabId);
        }
    });

    // insert the detection script
    insertScript("detection.js", true);
}());



