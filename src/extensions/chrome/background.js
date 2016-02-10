(function() {
    // executed when a message is passed.
    function onMessage(message, sender, sendResponseFunc) {

        // we have an Astrid application running, show the
        // action and notify the tab content
        if (message && message.type === "astrid-version") {
            chrome.pageAction.show(sender.tab.id);
            chrome.tabs.sendMessage(sender.tab.id, {
                type: "astrid-app-running"
            });
        }

        // send so connection is cleaned up
        sendResponseFunc({});
    }

    // executed when the page action is clicked
    function onPageActionClicked(tab) {
        chrome.tabs.sendMessage(tab.id, {
            type: "astrid-launch-inspector"
        });
    }


    // listen for message from the content script
    chrome.runtime.onMessage.addListener(onMessage);

    // listen for page action click
    chrome.pageAction.onClicked.addListener(onPageActionClicked);
}());
