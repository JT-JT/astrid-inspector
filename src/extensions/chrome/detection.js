/**
 * This is injected into the page to determine if an Astrid
 * application is running and the Astrid runtime version that
 * is being used.
 *
 * Posts a message to the extension that contains the Astrid
 * runtime version.
 */
(function() {
    var version = (window.astrid && window.astrid.sys.version);

    if (version) {
        window.postMessage({
            type: "astrid-version",
            value: version
        }, "*");
    }
}());
