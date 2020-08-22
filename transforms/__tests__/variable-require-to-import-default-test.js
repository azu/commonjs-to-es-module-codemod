import { defineTest } from "jscodeshift/dist/testUtils";

const tests = ["bad-argument", "basic-case", "chained-requires-with-rest", "chained-requires", "too-many-arguments"];

describe("variable-require-to-import-default", () => {
    tests.forEach((test) => {
        defineTest(__dirname, "variable-require-to-import-default", null, `variable-require-to-import-default/${test}`);
    });
});
