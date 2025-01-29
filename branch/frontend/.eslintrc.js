const path = require("path");

const src = path.resolve(__dirname, "src");

module.exports = {
  env: {
    browser: true,
    "cypress/globals": true,
    es6: true,
  },
  extends: [
    "plugin:react/recommended",
    "airbnb",
    "plugin:cypress/recommended",
    "prettier",
  ],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parser: "@babel/eslint-parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: "module",
    babelOptions: {
      rootMode: "upward",
    },
  },
  plugins: ["react", "prettier", "cypress"],
  rules: {
    "import/no-named-as-default": "off",
    "import/no-named-as-default-member": "off",
    "import/no-cycle": "off",
    "prettier/prettier": "error",
    "react/jsx-filename-extension": [1, { extensions: [".js", ".jsx"] }],
    /* Complexity */
    "max-depth": 1,
    "max-params": 1,
    "max-lines": [1, { max: 500 }],
    complexity: 1,
    "no-underscore-dangle": 1,
    "jsx-a11y/click-events-have-key-events": 0,
    "jsx-a11y/no-static-element-interactions": 0,
    "jsx-a11y/label-has-associated-control": 0,
    "jsx-a11y/no-noninteractive-element-interactions": 0,
    "jsx-a11y/control-has-associated-label": 0,
    "no-nested-ternary": 0,
    "react/prop-types": 0,
    "react/jsx-props-no-spreading": 0,
    "no-console": [1, { allow: ["debug", "warn", "error"] }],
    "react/no-danger": 2,
    "react/no-typos": 2,
    "react/prefer-stateless-function": 2,
    "react/jsx-max-depth": [1, { max: 8 }],
    "no-unused-vars": "warn",
    "prefer-arrow-callback": "off",
    "arrow-body-style": "warn",
    camelcase: 1,
  },
  settings: {
    "import/resolver": {
      alias: {
        map: [["@inplan", src]],
        extensions: [".js", ".jsx"],
      },
    },
  },
  overrides: [
    {
      files: ["*.js", "*.jsx"],
    },
  ],
};
