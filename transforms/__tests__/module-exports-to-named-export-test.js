import { defineTest } from "jscodeshift/dist/testUtils";

const tests = ["basic-case" /* "exports-variable" */];

describe("module-exports-to-named-export", () => {
    tests.forEach((test) => {
        defineTest(__dirname, "module-exports-to-named-export", null, `module-exports-to-named-export/${test}`);
    });
});
