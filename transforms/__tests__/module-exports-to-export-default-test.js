import { defineTest } from "jscodeshift/dist/testUtils";

const tests = ["basic-case", "multiple-exports"];

describe("module-exports-to-export-default", () => {
    tests.forEach((test) => {
        defineTest(__dirname, "module-exports-to-export-default", null, `module-exports-to-export-default/${test}`);
    });
});
