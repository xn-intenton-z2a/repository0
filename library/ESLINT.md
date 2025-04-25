# ESLINT

## Crawl Summary
ESLint documentation crawled includes sections for using ESLint, extending functionality with custom rules and plugins, integrating via Node.js API, contribution guidelines, and maintenance release processes. CLI options include --fix, --config, and file extensions filtering. API integration involves instantiating the ESLint class and using methods like lintFiles and lintText with precise configuration options.

## Normalised Extract
Table of Contents:
1. Use ESLINT in Your Project
   - CLI commands: eslint [options] file.js, options include --fix for automatic fixes, --config for specifying configuration files, and --ext to specify file extensions.
2. Extend ESLINT
   - Custom Rule Format: module.exports = { meta: { docs: { description: 'rule description', recommended: true } }, create(context) { return { CallExpression(node) { // rule logic } }; } }.
   - Plugin Structure: A plugin must export an object with 'rules' and optionally 'configs'.
3. Integrate ESLINT
   - Node API: Import ESLint class from 'eslint'; instantiate using new ESLint(options) where options may include overrideConfig (object), useEslintrc (boolean), and baseConfig (object). Methods:
     a. lintFiles(patterns: string | Array<string>): Promise<LintResult[]>
     b. lintText(text: string, options?: { filePath?: string }): Promise<LintResult[]>
     c. loadFormatter(format: string): Promise<Formatter>
     d. outputFixes(results: LintResult[]): Promise<void>
4. Contribute and Maintain
   - Contribution Guidelines: Follow the project structure, use npm install, npm test, and adhere to the release notes for versioning. Release process details each version's changes.
Directly usable configurations, parameter values, and commands are provided for setting up and running ESLint effectively.

## Supplementary Details
Essential Technical Specifications:
- CLI Configuration Options:
  --fix              Automatically fix problems
  --config <path>    Specify configuration file (default: .eslintrc.json)
  --ext <extensions> Comma separated list (default: .js, .jsx)
- Node API Options Object for ESLint constructor:
  {
    overrideConfig: { parserOptions: { ecmaVersion: 2020 }, rules: { 'no-unused-vars': 'error' } },
    useEslintrc: true,
    baseConfig: { env: { browser: true, node: true } }
  }
- Custom Rule Structure:
  meta: { type: 'problem', docs: { description: '...', category: 'Possible Errors', recommended: true } },
  create: function(context) { return { Identifier(node) { /* implementation */ } } };
- Implementation Steps:
  1. Install ESLint using npm install eslint --save-dev
  2. Initialize configuration using npx eslint --init
  3. Run linting via CLI or integrate using ESLint API in JavaScript files
  4. Use ESLint fixes with --fix or outputFixes() in API
- Default values and effects:
  useEslintrc: true -> enables reading configuration from file system
  overrideConfig: {} -> allows runtime configuration overriding

## Reference Details
API Specifications for Node.js Integration:
ESLint Class Constructor:
  ESLint(options: {
    cwd?: string,
    overrideConfig?: object,
    baseConfig?: object,
    useEslintrc?: boolean,
    extensions?: string[],
    ignore?: boolean
  }): ESLint

Methods:
  lintFiles(patterns: string | string[]): Promise<LintResult[]>
    - Parameters: patterns can be a glob pattern or an array of file paths
    - Returns: Promise resolving to an array of LintResult objects

  lintText(text: string, options?: { filePath?: string }): Promise<LintResult[]>
    - Parameters: text to lint and optional filePath for context
    - Returns: Promise resolving to an array of LintResult objects

  loadFormatter(format: string): Promise<Formatter>
    - Parameters: format name (e.g., 'stylish', 'json')
    - Returns: Promise resolving to a formatter instance with a format(results: LintResult[]): string method

  outputFixes(results: LintResult[]): Promise<void>
    - Parameters: results from linting which may include fixes
    - Behavior: Writes fixed code to disk

SDK Method Signatures in Code:
// Example usage:
const { ESLint } = require('eslint');
(async function main() {
  const eslint = new ESLint({
    overrideConfig: {
      parserOptions: { ecmaVersion: 2020 },
      rules: { 'no-unused-vars': 'error' }
    },
    useEslintrc: true
  });
  const results = await eslint.lintFiles(['src/**/*.js']);
  const formatter = await eslint.loadFormatter('stylish');
  const resultText = formatter.format(results);
  console.log(resultText);
  await ESLint.outputFixes(results);
})();

Configuration File Example (.eslintrc.json):
{
  "env": { "browser": true, "node": true },
  "extends": "eslint:recommended",
  "parserOptions": { "ecmaVersion": 2020, "sourceType": "module" },
  "rules": {
    "no-unused-vars": "error",
    "semi": ["error", "always"]
  }
}

Troubleshooting Procedures:
1. Command: npx eslint src/app.js
   Expected Output: List of linting errors/warnings with file and line numbers.
2. For configuration errors, run: npx eslint --print-config src/app.js
   Expected Output: JSON of resolved configuration.
3. For API usage errors, check stack trace and verify options object keys and types.

Best Practices:
- Always include a .eslintrc file at the project root.
- Use --fix to automatically correct minor issues.
- Integrate ESLint in continuous integration pipelines using npm scripts.
- Regularly update ESLint to benefit from new rules and fixes.

## Information Dense Extract
ESLint CLI: eslint [options] file.js, Options: --fix, --config, --ext; Node API: new ESLint({ overrideConfig:{ parserOptions:{ecmaVersion:2020}, rules:{'no-unused-vars':'error'}}, useEslintrc:true, baseConfig:{env:{browser:true,node:true}} }), Methods: lintFiles(patterns: string|Array<string>)=>Promise<LintResult[]>, lintText(text:string,{filePath?:string})=>Promise<LintResult[]>, loadFormatter(format: string)=>Promise<Formatter>, outputFixes(results:LintResult[])=>Promise<void>; Custom Rule: module.exports={meta:{docs:{description:'...',recommended:true}},create(context){return {Identifier(node){}}}}; Config File (.eslintrc.json): {"env":{"browser":true,"node":true},"extends":"eslint:recommended","parserOptions":{"ecmaVersion":2020,"sourceType":"module"},"rules":{"no-unused-vars":"error","semi":["error","always"]}}; Troubleshooting: npx eslint src/app.js; npx eslint --print-config src/app.js

## Sanitised Extract
Table of Contents:
1. Use ESLINT in Your Project
   - CLI commands: eslint [options] file.js, options include --fix for automatic fixes, --config for specifying configuration files, and --ext to specify file extensions.
2. Extend ESLINT
   - Custom Rule Format: module.exports = { meta: { docs: { description: 'rule description', recommended: true } }, create(context) { return { CallExpression(node) { // rule logic } }; } }.
   - Plugin Structure: A plugin must export an object with 'rules' and optionally 'configs'.
3. Integrate ESLINT
   - Node API: Import ESLint class from 'eslint'; instantiate using new ESLint(options) where options may include overrideConfig (object), useEslintrc (boolean), and baseConfig (object). Methods:
     a. lintFiles(patterns: string | Array<string>): Promise<LintResult[]>
     b. lintText(text: string, options?: { filePath?: string }): Promise<LintResult[]>
     c. loadFormatter(format: string): Promise<Formatter>
     d. outputFixes(results: LintResult[]): Promise<void>
4. Contribute and Maintain
   - Contribution Guidelines: Follow the project structure, use npm install, npm test, and adhere to the release notes for versioning. Release process details each version's changes.
Directly usable configurations, parameter values, and commands are provided for setting up and running ESLint effectively.

## Original Source
ESLint
https://eslint.org/docs/latest/

## Digest of ESLINT

# ESLINT Documentation Digest

Retrieved on: 2025-04-28

## Use ESLINT in Your Project
- Description: ESLint helps you detect problems in your JavaScript code and supports fixing many issues automatically.
- CLI Syntax: eslint [options] file.js
- Key Options: --fix, --config, --ext
- Example: eslint --fix src/app.js

## Extend ESLINT
- Custom Rules: Create rules using JavaScript. Export an object with meta and create functions.
- Plugin Structure: A plugin exports rules and configurations.
- Configuration File: .eslintrc.json with key "rules" containing rule ids and severity.

## Integrate ESLINT
- Node API: Use the ESLint class from the ESLint package.
- Method Example: new ESLint(options) where options may include overrideConfig, useEslintrc, and baseConfig.
- API Methods: lintFiles, lintText, loadFormatter, and outputFixes.

## Contribute to ESLINT
- Project Structure: Follow contribution guidelines provided in CONTRIBUTING.md
- Set up dev environment: npm install, npm test, and ESLint run on source files.

## Maintain ESLINT
- Release Process: Patch, minor, and major releases with respective changelog and release notes.
- Versioning: Releases like v9.25.1, v9.25.0, with detailed release notes included in documentation.

## Retrieval Data and Attribution
- Data Size: 2353021 bytes
- Links Found: 5037
- Source: https://eslint.org/docs/latest/


## Attribution
- Source: ESLint
- URL: https://eslint.org/docs/latest/
- License: License if known: MIT
- Crawl Date: 2025-04-25T23:24:34.305Z
- Data Size: 2353021 bytes
- Links Found: 5037

## Retrieved
2025-04-25
