import {defineTest} from "jscodeshift/dist/testUtils";

describe('single-require', () => {
    defineTest(__dirname, 'single-require');
});
