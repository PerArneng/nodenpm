/// <reference path='../../../typings/node/node.d.ts' />

import child_process  = require("child_process");
import fs = require('fs');

var nodeArgs:string[] = process.argv.slice(2);
var jsFile:string;
var moduleDir = getUserHome() + "/.nodenpm";

var env:Object = process.env;
env['NODE_PATH'] = moduleDir + "/node_modules";

if (!fs.existsSync(moduleDir)) {
  fs.mkdirSync(moduleDir);
  fs.mkdirSync(moduleDir + "/node_modules");
}

nodeArgs.forEach( arg => {
    if (arg.indexOf(".js") > 0) {
      jsFile = arg;
    }
  }
);

if (jsFile === null) {
  log("need a .js to execute in the node argument list");
  process.exit(1);
}

if (!fs.existsSync(jsFile)) {
  log("the supplied .js file does not exist: " + jsFile);
  process.exit(1);
}

var packagesToInstall:string[] = [];

var lines = fs.readFileSync(jsFile).toString().split('\n');
lines.forEach( line => {
    var npmMatch = line.match("//npm:(.*)");
    if (npmMatch !== null) {
      var packages = npmMatch[1].split(" ")
      packages.forEach( pkg => {
        var trimmed = pkg.trim();
        if (trimmed.length > 0) {
          packagesToInstall.push(trimmed);
        }
      });
    }
  }
);

if (packagesToInstall.length > 0) {
  var npmArgs:string[] = [];

  npmArgs.push("install");
  npmArgs.push("--prefix");
  npmArgs.push(moduleDir);

  packagesToInstall.forEach(
    pkg => {npmArgs.push(pkg)}
  );

  runNPM(npmArgs)
}

runNode(nodeArgs);

function runNPM(npmArgs:string[]) {

  child_process.execFileSync("npm", npmArgs, {
    stdio: [process.stdin, 'ignore', process.stderr]
  });

}

function runNode(nodeArgs:string[]) {

  child_process.execFileSync("node", nodeArgs, {
    stdio: [process.stdin, process.stdout, process.stderr]
  });
}

function getUserHome() {
  return process.env.HOME || process.env.USERPROFILE;
}

function log(message:string) {
  console.log("nodenpm: " + message);
}
