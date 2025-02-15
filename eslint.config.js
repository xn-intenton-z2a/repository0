import js from "@eslint/js";
import google from "eslint-config-google";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import globals from "globals";
import promise from "eslint-plugin-promise";
import security from "eslint-plugin-security";
import sonarjs from "eslint-plugin-sonarjs";
import react from "eslint-plugin-react";
import importPlugin from "eslint-plugin-import";

const modifiedGoogleConfig = { ...google, rules: { ...google.rules } };
delete modifiedGoogleConfig.rules["valid-jsdoc"];
delete modifiedGoogleConfig.rules["require-jsdoc"];

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  js.configs.recommended,
  modifiedGoogleConfig,
  eslintPluginPrettierRecommended,
  {
    plugins: {
      promise,
      security,
      sonarjs,
      react,
      import: importPlugin,
    },
    languageOptions: {
      ecmaVersion: 2023, // Specify ECMAScript version (e.g., 2023 for Node 20.11, see: node.green)
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "prettier/prettier": "error",
      ...promise.configs.recommended.rules,
      // Non-recommended Promise rules
      "promise/avoid-new": "warn",
      "promise/no-new-statics": "error",
      "promise/valid-params": "error",
      "promise/prefer-await-to-then": "warn",
      // "promise/prefer-await-to-callbacks": "warn",

      ...sonarjs.configs.recommended.rules,
      // Restored rules after resolving via Apply Fixes Sarif
      "sonarjs/no-nested-conditional": "warn", // ChatGPT was able to suggest a solution
      "sonarjs/pseudo-random": "warn", // ChatGPT was able to suggest a solution
      // Disabled recommended rules (SonarJS)
      // "sonarjs/cognitive-complexity": "off",
      // "sonarjs/no-duplicate-string": "off",
      "sonarjs/sonar-no-fallthrough": "off", // Crashes on switch statements
      "sonarjs/os-command": "off", // Fixable by ChatGPT but messy and unnecessary
      "sonarjs/todo-tag": "off",
      "sonarjs/no-commented-code": "off",
      // TODO: Disabled recommended rules (SonarJS) to enable when ready
      "sonarjs/no-empty-function": "off", // ChatGPT was able to suggest a solution
      "sonarjs/updated-loop-counter": "off", // ChatGPT was able to suggest a solution, but it should fail the tests
      "sonarjs/no-ignored-exceptions": "off", // ChatGPT was not able to suggest a useful solution
      "sonarjs/unused-import": "off", // Duplicates no-unused-vars

      // Enabled non-recommended rules (SonarJS)
      "sonarjs/no-inverted-boolean-check": "warn",
      "sonarjs/no-useless-catch": "warn",

      // Local customizations
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "no-extra-semi": 2,
      // "max-len": ["error", { code: 120, ignoreUrls: true }],
      "object-curly-newline": ["error", { consistent: true }],
      "array-element-newline": ["error", "consistent", { multiline: true, minItems: 10 }],
      "import/newline-after-import": ["error", { count: 1 }],
      "camelcase": "off",
      // Strict import rules
      "import/no-amd": "error",
      "import/no-commonjs": "error",
      "import/no-import-module-exports": "error",
      // "import/no-nodejs-modules": "error",
      // "import/unambiguous": "error",
      "import/no-cycle": "error",
      "import/no-dynamic-require": "error",
      // "import/no-internal-modules": "error",
      "import/no-self-import": "off", // ChatGPT was not able to suggest a solution
      "import/no-unresolved": "off",
      "import/no-useless-path-segments": "error",
      "import/no-duplicates": "error",
      "sonarjs/fixme-tag": "warn",
    },
  },
  {
    files: ["**/*.js"],
    ignores: ["**/tests/**/*.js", "**/*.test.js"], // <-- Added line to ignore test files for security rules
    rules: {
      ...security.configs.recommended.rules,
      // "security/detect-unsafe-regex": "off",
      // "security/detect-buffer-noassert": "off",
      // "security/detect-child-process": "off",
      // "security/detect-disable-mustache-escape": "off",
      // "security/detect-eval-with-expression": "off",
      // "security/detect-no-csrf-before-method-override": "off",
      "security/detect-non-literal-fs-filename": "off",
      "security/detect-non-literal-regexp": "off",
      // "security/detect-non-literal-require": "off",
      "security/detect-object-injection": "off",
      // "security/detect-possible-timing-attacks": "off",
      // "security/detect-pseudo-random-bytes": "off",
      // "security/detect-new-buffer": "off",
    },
  },
  {
    settings: {
      react: {
        version: "18", // With no react installed we can't use "detect"
      },
    },
  },
  {
    ignores: ["build/", "coverage/", "dist/", "exports/", "node_modules/"],
  },
];
