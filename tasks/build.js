#!/usr/bin/env node
var fs = require("fs-extra");
var path = require("path");
var browserify = require("browserify");
var babelify = require("babelify");
var chalk = require("chalk");

const PLATFORMS = {
    WEBSOCKET: "websocket",
    CHROME: "chrome",
    FIREFOX: "firefox",
    SAFARI: "safari",
    IE: "ie"
};

const SCRIPT_DIR = __dirname;
const SOURCE_DIR = path.resolve(SCRIPT_DIR, "../src");
const DIST_DIR = path.resolve(SCRIPT_DIR, "../dist");
const EXTENSIONS_DIR = path.resolve(SOURCE_DIR, "extensions");

var i;
var args = process.argv;
var buildConfig = {
    debug: false,
    platform: PLATFORMS.WEBSOCKET,
    entryScript: "js/main.js"
};

for (i = 0; i < args.length; i++) {
    if (args[i] === "--help") {
        printHelp();
        process.exit();
        break;
    }

    if (args[i] === "--debug") {
        buildConfig.debug = true;
        continue;
    }

    if (args[i] === "--chrome") {
        buildConfig.platform = PLATFORMS.CHROME;
        continue;
    }

    if (args[i] === "--firefox") {
        buildConfig.platform = PLATFORMS.FIREFOX;
        continue;
    }

    if (args[i] === "--safari") {
        buildConfig.platform = PLATFORMS.SAFARI;
        continue;
    }

    if (args[i] === "--ie") {
        buildConfig.platform = PLATFORMS.IE;
    }
}

// remove output directory
fs.removeSync(DIST_DIR);

// make sure destination directory exists
fs.mkdirsSync(DIST_DIR);

// copy images
fs.copySync(path.join(SOURCE_DIR, "images"), path.join(DIST_DIR, "images"), {clobber:true});

// copy css
fs.copySync(path.join(SOURCE_DIR, "css"), path.join(DIST_DIR, "css"), {clobber:true});

// copy over extension files
fs.copySync(path.join(EXTENSIONS_DIR, buildConfig.platform), DIST_DIR, {clobber:true});

// copy inspector html
fs.copySync(path.join(SOURCE_DIR, "inspector.html"), path.join(DIST_DIR, "inspector.html"), {clobber:true});

// build main script
build(path.join(SOURCE_DIR, buildConfig.entryScript), path.join(DIST_DIR, "inspector.js"));


function build(srcFilePath, outFilePath) {
    var babelConfig = babelify.configure({
        presets: ["es2015-loose"],
        sourceMaps: false
    });

    var b = browserify({debug: buildConfig.debug});
    var isFirstFile = true;

    // make sure destination directory exists
    fs.ensureDirSync(path.dirname(outFilePath));

    // print the file being processed
    b.on("file", function (fileName) {
        if (isFirstFile) {
            isFirstFile = false;
            console.log(chalk.bold.green("BUILDING: %s -> %s"), chalk.white(path.relative(SCRIPT_DIR, srcFilePath)), chalk.white(path.relative(SCRIPT_DIR, outFilePath)));
        }

        console.log(chalk.bold.blue("  PROCESSING: %s"), chalk.white(fileName));
    });

    // print out bundling errors
    b.on("bundle", function (bundle) {
        bundle.on("error", function (err) {
            console.log(chalk.bold.red("  ERROR: %s"), err.toString());
            console.log(err.stack);

            if (err.codeFrame) {
                console.log(err.codeFrame);
            }

            process.exit();
        });
    });

    // transform, bundle and pipe to output file
    b.transform(babelConfig)
     .require(srcFilePath, {entry: true})
     .bundle()
     .pipe(fs.createWriteStream(outFilePath));
}

function printHelp() {
    console.log("");
    console.log(chalk.bold("Usage:"));
    console.log(chalk.white("  node build [--debug]"));
    console.log("");
    console.log(chalk.white("  --debug:               Flag indicating whether or not to produce a build for debugging."));

    process.exit();
}
