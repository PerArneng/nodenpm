/// <reference path='../../../typings/node/node.d.ts' />
var child_process = require("child_process");
var fs = require('fs');
var version = "0.1.6";
var nodeArgs = process.argv.slice(2);
var jsFile;
var moduleDir = getUserHome() + "/.nodenpm";
process.env['NODE_PATH'] = moduleDir + "/node_modules";
if (!fs.existsSync(moduleDir)) {
    fs.mkdirSync(moduleDir);
    fs.mkdirSync(moduleDir + "/node_modules");
}
nodeArgs.forEach(function (arg) {
    if (arg.indexOf(".js") > 0) {
        jsFile = arg;
    }
    if (arg === "-h" || arg === "--help") {
        printHelp();
        process.exit(1);
    }
    if (arg === "-v" || arg === "--version") {
        printVersion();
        process.exit(1);
    }
});
checkJSFile(jsFile);
var packagesToInstall = parsePackages(jsFile);
if (packagesToInstall.length > 0) {
    installPackages(packagesToInstall);
}
runNode(nodeArgs);
function checkJSFile(jsFile) {
    if (jsFile === null) {
        log("need a .js to execute in the node argument list");
        process.exit(1);
    }
    if (!fs.existsSync(jsFile)) {
        log("the supplied .js file does not exist: " + jsFile);
        process.exit(1);
    }
}
function installPackages(packages) {
    var npmArgs = [];
    npmArgs.push("install");
    npmArgs.push("--prefix");
    npmArgs.push(moduleDir);
    packagesToInstall.forEach(function (pkg) { npmArgs.push(pkg); });
    runNPM(npmArgs);
}
function parsePackages(file) {
    var packagesToInstall = [];
    var lines = fs.readFileSync(file).toString().split('\n');
    lines.forEach(function (line) {
        var npmMatch = line.match("//npm:(.*)");
        if (npmMatch !== null) {
            var packages = npmMatch[1].split(" ");
            packages.forEach(function (pkg) {
                var trimmed = pkg.trim();
                if (trimmed.length > 0) {
                    packagesToInstall.push(trimmed);
                }
            });
        }
    });
    return packagesToInstall;
}
function runNPM(npmArgs) {
    child_process.execFileSync("npm", npmArgs, {
        stdio: [process.stdin, 'ignore', process.stderr]
    });
}
function runNode(nodeArgs) {
    child_process.execFileSync("node", nodeArgs, {
        stdio: [process.stdin, process.stdout, process.stderr]
    });
}
function printHelp() {
    console.log("Usage: nodenpm [options] [ script.js ] [arguments]");
    console.log("See node help bellow for details. nodepm takes the");
    console.log("same options but does not eval or support interractive mode.");
    console.log("");
    runNode(["--help"]);
}
function printVersion() {
    console.log("nodenpm version:");
    console.log("v" + version);
    console.log("node version:");
    runNode(["--version"]);
}
function getUserHome() {
    return process.env.HOME || process.env.USERPROFILE;
}
function log(message) {
    console.log("nodenpm: " + message);
}
