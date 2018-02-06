module.exports = {
    "extends": "airbnb",
    "plugins": [
        "react",
        "jsx-a11y",
        "import"
    ],
    "parser": "babel-eslint",
    "rules": {
        "semi": ["error", "always"], // http://eslint.org/docs/rules/semi#always

        "indent": ["error", 4, { "SwitchCase": 1 }], //4 spaces
        "linebreak-style": 0,
        "quotes": ["error", "single", { "avoidEscape": true }], // http://eslint.org/docs/rules/quotes#avoidescape
        "max-len": ["error", 150, { "ignoreTrailingComments": true }],
        "default-case": "off",

        "comma-dangle": ["error", "always-multiline"], // http://eslint.org/docs/rules/comma-dangle#always-multiline
        "space-before-function-paren": ["error", { "anonymous": "always", "named": "never" }], // http://eslint.org/docs/rules/space-before-function-paren
        "radix": ["error", "as-needed"], // http://eslint.org/docs/rules/radix#as-needed

        "no-cond-assign": ["error", "always"], // http://eslint.org/docs/rules/no-cond-assign
        "no-console": ["error", { allow: ["warn", "error"] }],
        "prefer-template": "off", // disable template concationation
        "class-methods-use-this": [0],
        "no-plusplus": ["error", { "allowForLoopAfterthoughts": true }], // http://eslint.org/docs/rules/no-plusplus
        "no-confusing-arrow": "off",
        "new-cap": [2, { "capIsNewExceptionPattern" : "^Immutable\\.." }],
        "import/prefer-default-export": "off",
        "react/sort-comp": "off",
        "react/jsx-indent": ["error", 4],           // resets identation for jsx markup to 4 spaces
        "react/prefer-stateless-function": "off",
        "react/jsx-filename-extension": "off",      // allows jsx markup in .js files
        "react/jsx-indent-props": "off",            // resets identation for jsx props markup to 4 spaces
        "react/forbid-prop-types": [2, {forbid: ["any"]}],
        "react/no-unused-prop-types": [2, { "skipShapeProps": true }],
        "jsx-a11y/no-static-element-interactions": "off",   // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-static-element-interactions.md
        "jsx-a11y/img-has-alt": "off",
    },
    "env": {
        "browser": true,    // makes `window` and `document` variables defined for parser
        "jquery": true,
        "jest": true,
    },
};