# nodenpm

# Usecase 

When you just have node javascript file you want to deploy on machines but do not
want to have to manually install the npm dependencies. This program looks for npm dependencies
inside the script and installs them and adds them to the ```node``` module path on the fly.

This means thay you can just write your script and email it to your friend and she can launch
it without having to care about any dependencies.

# Scope of this tool

This is a prototype of functionality that i would like to see built in to ```node```. It is
inspired by the Groovy languages [grape](http://docs.groovy-lang.org/latest/html/documentation/grape.html) functionality.
I do not aim to develop this tool further than this. So its up to someone else to continue or do
a proper integration in to ```node``` or as an option for the ```npm``` tool.

# Overview

A ```node``` wrapper that downloads dependencies specified in the supplied script. It looks in
command line args for a ```.js``` file. It parses the ```.js``` file and tries to collect all packages
that are specified in the ```.js``` file.

```
//npm: colors@0.1.0
```

The package format follows the ```npm``` commandline package naming format. Multiple packages can
be specified with spaces inbetween and they are sent to the ```npm``` tool before node is called. It is also
possible to have multiple ```//npm:``` lines in your script. The packages are installed
in the users home directory ```$HOME/.nodenpm/node_modules```.

When the packages are installed all commandline arguments are passed on to the node commandline utility.

**Example:**
```javascript
#!/usr/bin/env nodenpm

//npm: colors@1.1.0

var colors = require('colors');
console.log("Hello, World!".green);
```

# Installing
For global install
```
$ sudo npm install nodenpm -g
```

# Running
```
$ nodenpm mynodescript.js
```
The commandline arguments are passed through to node unmodified.

# NOTES
*NOTE!: This is a prototype*

*NOTE!: Tested on OSX and Linux*

*NOTE!: Tested on node v0.12.2 . Does not work on v0.10.x*

