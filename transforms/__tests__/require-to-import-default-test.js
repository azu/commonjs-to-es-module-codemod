import { defineTest } from "jscodeshift/dist/testUtils";

const tests = [
    "bad-argument",
    "basic-case",
    "chained-requires-with-rest",
    "chained-requires",
    "too-many-arguments",
    "destructure-require",
    "destructure-multiple-require",
    "destructure-require-alias"
];

describe("require-to-import-default", () => {
    tests.forEach((test) => {
        defineTest(__dirname, "require-to-import-default", null, `require-to-import-default/${test}`);
    });
});
