# nodenpm
A ``node``` wrapper that downloads dependencies specified in the supplied script. It looks in
command line args for a ```.js``` file. It parses the ```.js``` file and tries to collect all packages
that are specified in the ```.js``` file.

```
//npm: colors@0.1.0
```

The package format follows the ```npm``` commandline package naming format. Multiple packages can
be specified with spaces inbetween and they are sent to the ```npm``` tool before node is called. It is also
possible to have multiple ```//npm:``` lines in your script. The packags are installed
in the users home directory ```$HOME/.nodenpm/node_modules```.

When the packages are installed all commandline arguments are passed on to the node commandline utility.

```javascript
#!/usr/bin/env nodenpm

//npm: colors@1.1.0

var colors = require('colors');
console.log("Hello, World!".green);
```
