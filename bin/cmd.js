#!/usr/bin/env node
"use strict";
const path = require("path");
require("codemod-cli").runTransform(
    path.join(__dirname, "../transforms/index.js"),
    process.argv[2],
    process.argv.slice(3),
    "jsx,tsx"
);
