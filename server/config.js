"use strict";

var nconf = require("nconf");

nconf.argv();                           // top precedence: command-line arguments
nconf.env();                            // next : OS environment variables
nconf.file("dev", {file: "configuration.json", dir: __dirname, search: true});  // last: config file

module.exports = nconf.get.bind(nconf);