# PRETTIER_DOC

## Crawl Summary
Prettier is an opinionated code formatter that reprints code by parsing it to an AST and formatting according to a maximum line length. The tool supports multiple languages (JavaScript, JSX, Angular, Vue, etc.) and provides CLI options such as --trailing-comma, --objectWrap, --experimentalOperatorPosition, and --experimental-ternaries. Version updates include bug fixes and new features including ECMAScript Module support and enhanced plugin interfaces.

## Normalised Extract
## Table of Contents
1. Overview and Purpose
2. Supported Languages
3. Code Formatting Process
4. CLI Options and Configuration
5. Version Updates

---

### 1. Overview and Purpose
Prettier reformats code by discarding original formatting (with exceptions for empty lines and multi-line objects) and reprinting the AST with consistent styling. It removes local styling discrepancies and aligns code with a uniform standard.

### 2. Supported Languages
- JavaScript (incl. experimental features)
- JSX
- Angular
- Vue
- Flow
- TypeScript
- CSS, Less, SCSS
- HTML
- Ember/Handlebars
- JSON
- GraphQL
- Markdown (GFM, MDX v1)
- YAML

### 3. Code Formatting Process
- **Initial Code:** `foo(arg1, arg2, arg3, arg4);`
- **After Formatting (if exceeding line length):**
  ```js
  foo(
    reallyLongArg(),
    omgSoManyParameters(),
    IShouldRefactorThis(),
    isThereSeriouslyAnotherOne(),
  );
  ```
The formatter adjusts line breaks based on maximum line length configurations.

### 4. CLI Options and Configuration
- **--trailing-comma**: 
  - **Values:** "none", "es5", "all"
  - **Default:** "all"
  - **Effect:** Determines placement of trailing commas in multi-line constructs.

- **--objectWrap**: 
  - Introduced in Prettier 3.5 to manage object wrapping behavior.

- **--experimentalOperatorPosition**: 
  - Introduced in Prettier 3.5 for alternative operator placements in expressions.

- **--experimental-ternaries**: 
  - Flag to enable experimental formatting for nested ternaries.

- **--cache & --cache-location**: 
  - Improves performance by caching formatted files. Cache writing occurs only when --write is active.

### 5. Version Updates
- **3.5:** New options (objectWrap, experimentalOperatorPosition) and TS config file support.
- **3.4:** Multiple bug fixes and improvements.
- **3.3:** New Flow features support.
- **3.2:** JSONC parser and Angular ICU expressions added.
- **3.1:** Experimental ternaries formatting and Angular control flow syntax.
- **3.0:** Transition to ECMAScript Modules and breaking changes in markdown formatting and plugin interface.
- **2.8:** Enhancements to caching and support for TypeScript 4.9 satisfies operator.


## Supplementary Details
### Detailed Configuration Options
- --trailing-comma
  - **Description:** Adds trailing commas to multi-line objects and arrays.
  - **Parameters:** Accepts "none", "es5", or "all".
  - **Default Value:** "all"
  - **Effect:** Ensures consistency in diff output and aids in cleaner git diffs.

- --objectWrap
  - **Description:** Enables or disables wrapping of object properties.
  - **Usage:** Boolean flag (introduced in 3.5)

- --experimentalOperatorPosition
  - **Description:** Alters the placement of operators in expressions.
  - **Usage:** Boolean flag (introduced in 3.5)

- --experimental-ternaries
  - **Description:** Applies a novel formatting style to nested ternary expressions.
  - **Usage:** Boolean flag; improves readability in deeply nested conditional statements.

### Implementation Steps for CLI Usage
1. Install Prettier via npm: `npm install --save-dev prettier`
2. Create a configuration file (e.g., `.prettierrc`) with desired options:
   ```json
   {
     "trailingComma": "all",
     "printWidth": 80,
     "tabWidth": 2,
     "semi": true
   }
   ```
3. Use Prettier in your project via CLI:
   ```bash
   npx prettier --write "src/**/*.{js,jsx,ts,tsx}"
   ```
4. Integrate with editor plugins for on-save formatting.


## Reference Details
### API Specifications and SDK Method Signatures
While Prettier is primarily used as a CLI tool and library, the following technical details are key for developers:

#### 1. Prettier's Core Function
```js
/**
 * Formats the given source code using Prettier's rules.
 * 
 * @param {string} source - The source code to format.
 * @param {Object} options - Configuration options for formatting.
 * @param {number} [options.printWidth=80] - Maximum line length before wrapping.
 * @param {number} [options.tabWidth=2] - Number of spaces per indentation level.
 * @param {boolean} [options.semi=true] - Whether to add semicolons at the end of statements.
 * @param {string} [options.trailingComma='all'] - Control trailing commas ('none', 'es5', 'all').
 * @param {boolean} [options.useTabs=false] - Indent lines with tabs instead of spaces.
 * @param {boolean} [options.objectWrap] - Enable wrapping for objects (introduced in 3.5).
 * @param {boolean} [options.experimentalOperatorPosition] - Enables experimental operator positioning (introduced in 3.5).
 * @param {boolean} [options.experimentalTernaries] - Enables experimental formatting for nested ternaries (introduced in 3.1).
 * @returns {string} - The formatted code.
 * @throws {Error} - Throws error if parsing fails.
 */
function format(source, options) {
  // Implementation that parses the source, builds an AST,
  // applies formatting rules based on options, and returns the formatted code.
}
```

#### 2. CLI Command Examples

- **Basic Formatting Command:**
  ```bash
  npx prettier --write "src/**/*.js"
  ```

- **Using a Custom Cache Location:**
  ```bash
  npx prettier --cache --cache-location ./tmp/cache --write "src/**/*.{js,jsx,ts,tsx}"
  ```

#### 3. Best Practices
- Always integrate Prettier with your editor (e.g., VS Code, Sublime Text, Vim) to format code on save.
- Use a pre-commit hook (e.g., lint-staged) to ensure consistent formatting before commits:
  ```json
  {
    "lint-staged": {
      "*.{js,jsx,ts,tsx}": "prettier --write"
    }
  }
  ```
- Combine Prettier with ESLint by using plugins such as `eslint-plugin-prettier` to avoid conflicts between formatting and code quality rules.

#### 4. Troubleshooting Procedures
- **Issue:** Formatting does not apply as expected.
  - **Command:** `npx prettier --debug-check "src/**/*.js"`
  - **Expected Output:** Either a list of files that need formatting or confirmation that all files are formatted.
- **Issue:** CLI performance is slow on large projects.
  - **Command:** Use `--cache` and `--cache-location` to optimize performance:
    ```bash
    npx prettier --cache --cache-location ./tmp/cache --write "src/**/*.{js,jsx,ts,tsx}"
    ```
- **Issue:** Plugin migration errors after upgrading to Prettier 3.0 or later.
  - **Procedure:** Review the migration guide provided by Prettier and adjust your plugin code to use ECMAScript Modules and async parsers.


## Original Source
Prettier Documentation
https://prettier.io/docs/en/index.html

## Digest of PRETTIER_DOC

# Prettier Documentation Digest (Retrieved: 2023-10-12)

**Data Size:** 1056300 bytes

## Overview
Prettier is an opinionated code formatter that parses your source code, builds an AST, and reprints it with its own rules, taking maximum line lengths into account. It supports a variety of languages including JavaScript (and experimental features), JSX, Angular, Vue, Flow, TypeScript, CSS, Less, SCSS, HTML, Ember/Handlebars, JSON, GraphQL, Markdown (GFM and MDX v1), and YAML.

## Technical Specifications

### 1. Formatting Process
- Parses the original code by stripping away most original styling (except for empty lines and multi-line objects when practical).
- Builds an abstract syntax tree (AST) of the code.
- Reprints the code with formatting rules that wrap code when line lengths exceed the set limits.

### 2. Supported Languages
- JavaScript (including experimental features)
- JSX
- Angular
- Vue
- Flow
- TypeScript
- CSS, Less, SCSS
- HTML
- Ember/Handlebars
- JSON
- GraphQL
- Markdown (including GFM and MDX v1)
- YAML

### 3. Code Formatting Examples
- **Single-line code example**:
  ```js
  foo(arg1, arg2, arg3, arg4);
  ```
  Remains unchanged if it fits in one line.

- **Multi-line code example**:
  ```js
  foo(  
    reallyLongArg(),
    omgSoManyParameters(),
    IShouldRefactorThis(),
    isThereSeriouslyAnotherOne(),
  );
  ```
  Prettier reformats longer function calls to wrap parameters appropriately considering the configured maximum line length.

### 4. CLI Options and Configuration
- **--trailing-comma**: 
  - **Values:** "none", "es5", "all"
  - **Default:** Changed to "all" in version 3.0
  - **Effect:** Inserts trailing commas where valid in ES5 (or all possible locations if set to "all")

- **--objectWrap** (New in Prettier 3.5): 
  - **Purpose:** Configures wrapping of objects

- **--experimentalOperatorPosition** (New in Prettier 3.5): 
  - **Purpose:** Enables experimental placement of operators

- **--experimental-ternaries** (Added in Prettier 3.1): 
  - **Purpose:** Provides a novel formatting style for nested ternaries
  - **Usage:** Pass as a flag to try the new indentation for nested ternaries

- **--cache and --cache-location** (Introduced in Prettier 2.8):
  - **Purpose:** Improves CLI performance by caching formatted files
  - **Bug Fix:** Cache now only writes when --write is specified

### 5. Version Updates and Release Notes
- **Prettier 3.5 (Feb 9, 2025):**
  - New features: objectWrap option, experimentalOperatorPosition option, and TypeScript configuration file support.

- **Prettier 3.4 (Nov 26, 2024):**
  - Numerous bug fixes and performance improvements.

- **Prettier 3.3 (Jun 1, 2024):**
  - Support for new Flow features such as component and hook declarations.

- **Prettier 3.2 (Jan 12, 2024):**
  - Added JSONC parser and Angular ICU expression support.

- **Prettier 3.1 (Nov 13, 2023):**
  - Introduced experimental ternaries formatting and Angular control flow syntax support.

- **Prettier 3.0 (Jul 5, 2023):**
  - Migration to ECMAScript Modules.
  - Breaking changes: markdown formatting adjustments and overhaul of the plugin interface.

- **Prettier 2.8 (Nov 23, 2022):**
  - Improvements to --cache CLI option and support for TypeScript 4.9 satisfies operator.

## Attribution
Extracted from the official Prettier documentation page at https://prettier.io/docs/en/index.html.


## Attribution
- Source: Prettier Documentation
- URL: https://prettier.io/docs/en/index.html
- License: MIT
- Crawl Date: 2025-04-20T21:38:19.899Z
- Data Size: 1056300 bytes
- Links Found: 2604

## Retrieved
2025-04-20
