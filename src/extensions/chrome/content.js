(function() {

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

    function createInspector(tabId) {

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
        // launch the inspector
        if (message && message.type === "astrid-launch-inspector") {
            insertStyleSheet("css/inspector.css");
            insertScript("inspector.js", false);
        }
    });

    // insert the detection script
    insertScript("detection.js", true);
}());



