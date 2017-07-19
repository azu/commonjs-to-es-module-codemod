const defineTest = require('jscodeshift/dist/testUtils').defineTest;

describe('single-require', () => {
    defineTest(__dirname, 'single-require');
});
