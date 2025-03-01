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
      ecmaVersion: 2023,
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "prettier/prettier": "error",
      ...promise.configs.recommended.rules,
      ...sonarjs.configs.recommended.rules,
      "sonarjs/os-command": "off",

      // Formatting and organisation
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "no-extra-semi": 2,
      "object-curly-newline": ["error", { consistent: true }],
      "array-element-newline": ["error", "consistent", { multiline: true, minItems: 10 }],
      "import/newline-after-import": ["error", { count: 1 }],
      "camelcase": "off",

      // ESM import rules
      "import/no-amd": "error",
      "import/no-commonjs": "error",
      "import/no-import-module-exports": "error",
      "import/no-cycle": "error",
      "import/no-dynamic-require": "error",
      "import/no-self-import": "off",
      "import/no-unresolved": "off",
      "import/no-useless-path-segments": "error",
      "import/no-duplicates": "error",
      "sonarjs/fixme-tag": "warn",
    },
  },
  {
    files: ["**/*.js"],
    ignores: ["**/tests/**/*.js", "**/*.test.js", "eslint.config.js"],
    rules: {
      ...security.configs.recommended.rules,
      "security/detect-non-literal-fs-filename": "off",
      "security/detect-non-literal-regexp": "off",
      "security/detect-object-injection": "off",
    },
  },
  {
    settings: {
      react: {
        version: "18",
      },
    },
  },
  {
    ignores: ["build/", "coverage/", "dist/", "exports/", "node_modules/", "eslint.config.js"],
  },
];
