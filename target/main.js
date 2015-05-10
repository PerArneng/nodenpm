/// <reference path='../../../typings/node/node.d.ts' />
var child_process = require("child_process");
var fs = require('fs');
var nodeArgs = process.argv.slice(2);
var jsFile;
var moduleDir = getUserHome() + "/.nodenpm";
var env = process.env;
env['NODE_PATH'] = moduleDir + "/node_modules";
if (!fs.existsSync(moduleDir)) {
    fs.mkdirSync(moduleDir);
    fs.mkdirSync(moduleDir + "/node_modules");
}
nodeArgs.forEach(function (arg) {
    if (arg.indexOf(".js") > 0) {
        jsFile = arg;
    }
});
if (jsFile === null) {
    log("need a .js to execute in the node argument list");
    process.exit(1);
}
if (!fs.existsSync(jsFile)) {
    log("the supplied .js file does not exist: " + jsFile);
    process.exit(1);
}
var packagesToInstall = [];
var lines = fs.readFileSync(jsFile).toString().split('\n');
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
if (packagesToInstall.length > 0) {
    var npmArgs = [];
    npmArgs.push("install");
    npmArgs.push("--prefix");
    npmArgs.push(moduleDir);
    packagesToInstall.forEach(function (pkg) { npmArgs.push(pkg); });
    runNPM(npmArgs);
}
runNode(nodeArgs);
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
function getUserHome() {
    return process.env.HOME || process.env.USERPROFILE;
}
function log(message) {
    console.log("nodenpm: " + message);
}
