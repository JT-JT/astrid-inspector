import Inspector from "./Inspector"

(function () {

    var app = new Inspector(window.astrid);
    app.run();

    document.addEventListener("AstridInspectorShutdownEvent", function() {
        app.shutdown();

        console.log("INSPECTOR: UNLOADED");
    }, false);

    console.log("INSPECTOR: LOADED");
}());
