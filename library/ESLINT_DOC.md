# ESLINT_DOC

## Crawl Summary
ESLint documentation offers technical guidelines for using, extending, integrating, contributing to, and maintaining ESLint. It specifies CLI command usage, configuration file structure, custom rule creation, Node.js API method signatures (including lintFiles, lintText, loadFormatter, and outputFixes), and release notes for versions v9.25.1 and v9.25.0, along with bulk suppression configuration instructions.

## Normalised Extract
Table of Contents:
1. Use ESLint in Your Project
   - CLI: 'eslint [options] <file|dir>' with options: --fix (auto-fix), --config (configuration file path, default .eslintrc.json), --format (output format such as stylish or json).
   - Config File: JSON structure containing 'root', 'extends', and 'rules'. Example rule: { "no-unused-vars": "error" }.
2. Extend ESLint
   - Custom Rule: Module exports object with 'meta' and 'create(context)' returning visitor functions. Pattern: { meta: { type, docs, schema }, create(context) { return { <AST Node Handlers> }; } }.
   - Plugin: Organize multiple rules and configurations in an index file.
3. Integrate ESLint
   - Node.js API: ESLint class with methods:
       • lintFiles(patterns: string|string[]): Promise<LintResult[]>
       • lintText(text: string, options?: { filePath?: string }): Promise<LintResult[]>
       • loadFormatter(name?: string): Promise<Formatter>
       • outputFixes(results: LintResult[]): void
4. Contribute to ESLint
   - Steps: Fork repository, adhere to code style, add tests, update docs; follow contribution guidelines provided in repository.
5. Maintain ESLint
   - Release Notes: v9.25.1 (patch fixes) and v9.25.0 (minor release with new features), and bulk suppression instructions allowing incremental linting strictness.

Each section details specific commands, configuration parameters, and examples ready for immediate use in development environments.

## Supplementary Details
ESLint Technical Specifications:

CLI Commands:
- Command: eslint --fix file.js
- --config: Specify configuration file; default is .eslintrc.json
- --format: Set output format (e.g., stylish, json)

Configuration File (.eslintrc.json) Options:
- root: boolean (e.g., true)
- extends: string or array (e.g., 'eslint:recommended')
- rules: object mapping rule names to severity levels and options (e.g., { 'semi': ['error', 'always'] })

Custom Rule Implementation Pattern:
- Module structure: module.exports = { meta: { type: 'problem', docs: { description: 'rule description', category: 'Best Practices' }, schema: [] }, create(context) { return { Identifier(node) { /* rule logic */ } }; } };

Node.js API Integration:
- ESLint Class Constructor Options: {
    cwd?: string,
    baseConfig?: Object,
    overrideConfigFile?: string,
    fix?: boolean,
    ignorePath?: string,
    useEslintrc?: boolean
  }
- Example Code Flow:
   1. Initialize ESLint with options (e.g., fix: true, overrideConfigFile).
   2. Call lintFiles with file glob patterns.
   3. Load formatter using loadFormatter method.
   4. Output formatted results.
   5. Use outputFixes to automatically apply fixes.

Release Management:
- Version v9.25.1: Patch addressing bug fixes.
- Version v9.25.0: Minor release adding new features.
- Bulk Suppressions: Configuration flag within ESLint plugins to enable stricter linting incrementally.

Troubleshooting:
- Run 'eslint --debug file.js' to enable detailed logging of configuration loading and rule processing.
- Inspect output for rule evaluation and file processing details.

Best Practices:
- Integrate ESLint into CI pipelines and pre-commit hooks.
- Regularly review and update ESLint configurations and plugins to align with new releases.

## Reference Details
ESLint API Specifications:

Class ESLint (from 'eslint' module):
   Constructor: new ESLint(options?: {
       cwd?: string,
       baseConfig?: Object,
       overrideConfigFile?: string,
       fix?: boolean,
       ignorePath?: string,
       useEslintrc?: boolean
   });
   Methods:
       lintFiles(patterns: string | string[]): Promise<LintResult[]>
       lintText(text: string, options?: { filePath?: string }): Promise<LintResult[]>
       loadFormatter(name?: string): Promise<Formatter>
       static outputFixes(results: LintResult[]): void

LintResult Object:
   - filePath: string
   - messages: Array<{ ruleId: string, severity: number, message: string, line: number, column: number, nodeType: string, source: string }>
   - errorCount: number
   - warningCount: number

Formatter:
   - Method: format(results: LintResult[]): string

Code Example:
   const { ESLint } = require('eslint');
   (async function main() {
       const eslint = new ESLint({
           overrideConfigFile: '.eslintrc.json',
           fix: true
       });
       const results = await eslint.lintFiles(['src/**/*.js']);
       const formatter = await eslint.loadFormatter('stylish');
       console.log(formatter.format(results));
       ESLint.outputFixes(results);
   })().catch(error => {
       console.error(error);
       process.exit(1);
   });

CLI Configuration Options:
   --config: string (Path to configuration file, default '.eslintrc.json')
   --fix: boolean (Automatically fix problems if true, default false)
   --format: string (Output formatter, e.g., stylish, json)

Troubleshooting:
   - Command: eslint --debug file.js
   - Expected Output: Detailed logging of file scanning, rule application and configuration loading

Best Practices:
   - Integrate ESLint execution into CI pipelines and pre-commit hooks
   - Maintain up-to-date configuration and dependency versions to leverage new features and fixes.

All method signatures, parameters, and examples provided are ready for direct integration into JavaScript environments using ESLint.

## Information Dense Extract
ESLint CLI: 'eslint [options] <file|dir>', Options: --fix (boolean), --config (string, default .eslintrc.json), --format (string, e.g., stylish/json); Config: { root: true, extends: 'eslint:recommended', rules: { ruleName: 'error' } }; Node.js API: ESLint class with methods: lintFiles(patterns: string|string[]):Promise<LintResult[]>, lintText(text, {filePath?:string}):Promise<LintResult[]>, loadFormatter(name?:string):Promise<Formatter>, static outputFixes(results:LintResult[]):void; Custom Rule Pattern: module.exports = { meta: { type, docs: { description, category }, schema: [] }, create(context){ return { AST_visitor_methods }; } }; Release Notes: v9.25.1 (patch), v9.25.0 (minor), Bulk Suppressions; Troubleshooting: 'eslint --debug file.js'; Best Practices: CI integration, pre-commit hooks; API: Full constructor options and method signatures as specified.

## Escaped Extract
Table of Contents:
1. Use ESLint in Your Project
   - CLI: 'eslint [options] <file|dir>' with options: --fix (auto-fix), --config (configuration file path, default .eslintrc.json), --format (output format such as stylish or json).
   - Config File: JSON structure containing 'root', 'extends', and 'rules'. Example rule: { 'no-unused-vars': 'error' }.
2. Extend ESLint
   - Custom Rule: Module exports object with 'meta' and 'create(context)' returning visitor functions. Pattern: { meta: { type, docs, schema }, create(context) { return { <AST Node Handlers> }; } }.
   - Plugin: Organize multiple rules and configurations in an index file.
3. Integrate ESLint
   - Node.js API: ESLint class with methods:
        lintFiles(patterns: string|string[]): Promise<LintResult[]>
        lintText(text: string, options?: { filePath?: string }): Promise<LintResult[]>
        loadFormatter(name?: string): Promise<Formatter>
        outputFixes(results: LintResult[]): void
4. Contribute to ESLint
   - Steps: Fork repository, adhere to code style, add tests, update docs; follow contribution guidelines provided in repository.
5. Maintain ESLint
   - Release Notes: v9.25.1 (patch fixes) and v9.25.0 (minor release with new features), and bulk suppression instructions allowing incremental linting strictness.

Each section details specific commands, configuration parameters, and examples ready for immediate use in development environments.

## Original Source
ESLint Documentation
https://eslint.org/docs/latest/

## Digest of ESLINT_DOC

# ESLINT Documentation

Content Retrieval Date: 2025-04-28

# Sections

1. Use ESLint in Your Project
   - CLI Usage: Execute with command: eslint [options] <file|dir>
   - Key Options: --fix (auto-fix issues), --config (specify configuration file, default .eslintrc.json), --format (output format, e.g., stylish, json)
   - Configuration File Example: 
     {
       "root": true,
       "extends": "eslint:recommended",
       "rules": {
         "no-unused-vars": "error",
         "semi": ["error", "always"]
       }
     }

2. Extend ESLint
   - Custom Rule Implementation: Create a module exporting an object with meta information and a create(context) method that returns visitor functions.
   - Plugin Structure: Define rules, processors and configurations in an index.js file. Example custom rule template:
     module.exports = {
       meta: {
         type: 'problem',
         docs: { description: 'disallow unused variables', category: 'Best Practices' },
         schema: []
       },
       create(context) {
         return {
           Identifier(node) {
             // rule logic
           }
         };
       }
     };

3. Integrate ESLint
   - Node.js API: Utilize the ESLint class from the 'eslint' module.
   - Key Methods:
       • lintFiles(patterns: string | string[]): Promise<LintResult[]>
       • lintText(text: string, options?: { filePath?: string }): Promise<LintResult[]>
       • loadFormatter(name?: string): Promise<Formatter>
       • static outputFixes(results: LintResult[]): void
   - Sample Usage:
     const { ESLint } = require('eslint');
     (async function() {
       const eslint = new ESLint({ overrideConfigFile: '.eslintrc.json', fix: true });
       const results = await eslint.lintFiles(['src/**/*.js']);
       const formatter = await eslint.loadFormatter('stylish');
       console.log(formatter.format(results));
       ESLint.outputFixes(results);
     })().catch(error => { console.error(error); process.exit(1); });

4. Contribute to ESLint
   - Contribution Guidelines: Fork the repository, adhere to coding standards, provide tests and comprehensive documentation updates.
   - Developer Steps: Clone repository, run build and test suites, and follow pull request protocols.

5. Maintain ESLint
   - Release Processes: Detailed release notes such as:
       • v9.25.1: Patch release focused on bug fixes.
       • v9.25.0: Minor release featuring new enhancements and additional features.
       • Announcement: Bulk suppressions enable stricter linting incrementally with specific configuration flags.

Attribution: Data crawled from ESLint Documentation at https://eslint.org/docs/latest/ (Data Size: 3373557 bytes, 6741 links found)

## Attribution
- Source: ESLint Documentation
- URL: https://eslint.org/docs/latest/
- License: License: MIT
- Crawl Date: 2025-04-22T02:29:35.832Z
- Data Size: 3373557 bytes
- Links Found: 6741

## Retrieved
2025-04-22
