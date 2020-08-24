import { defineTest } from "jscodeshift/dist/testUtils";

const tests = ["basic-case"];

describe("require-with-props-to-named-import", () => {
    tests.forEach((test) => {
        defineTest(__dirname, "require-with-props-to-named-import", null, `require-with-props-to-named-import/${test}`);
    });
});
