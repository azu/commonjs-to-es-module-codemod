#!/usr/bin/env node
"use strict";
const path = require("path");
require("codemod-cli").runTransform(
    path.join(__dirname, "../lib/index.js"),
    process.argv[2],
    process.argv.slice(3),
    "jsx,tsx"
);
