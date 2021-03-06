module.exports = {
    "env": {
        "browser": true,
        "node" : true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        'ecmaVersion': 2017,
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true
        },
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "indent": 0,
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": 0,
        "semi": [
            "error",
            "always"
        ],
        "react/jsx-uses-vars": 1,
        "no-console": 0,
        "linebreak-style": 0,
        "no-mixed-spaces-and-tabs": 0,
        'no-unused-vars': 0
    }
};
