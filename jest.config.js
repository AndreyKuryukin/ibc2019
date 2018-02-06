module.exports = {
    verbose: false,
    collectCoverage: false,
    setupTestFrameworkScriptFile: './node_modules/jest-enzyme/lib/index.js',
    moduleNameMapper: {
        '\\.(scss|png)$': 'identity-obj-proxy',
    },

    collectCoverageFrom: [
        '!**/node_modules/**',
        '!modules/services/**/containers/**/*.js',
        'modules/**/*.js',
    ],

    setupFiles: ['jest-localstorage-mock'],

    testMatch: [ '**/?(*.)(spec|test).js?(x)' ],

    coverageReporters: ['json', 'lcov', 'text', 'html'],
};

