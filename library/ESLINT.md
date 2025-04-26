# ESLINT

## Crawl Summary
ESLint documentation outlines the usage, extension, integration, contribution, and maintenance aspects. Key technical details include CLI options such as --fix, configuration file settings, Node.js API methods with signatures lintFiles and lintText, as well as versioning information for releases v9.25.1 and v9.25.0. The documentation also includes troubleshooting commands and instructions to integrate ESLint into development pipelines.

## Normalised Extract
Table of Contents:
1. Use ESLINT in Your Project
   - Specifications: Configure core rules, use CLI options (--fix, --format, --init), and integrate with editors and CI pipelines.
2. Extend ESLINT
   - Specifications: Create custom rules by exporting rule definitions with meta properties; develop plugins; implement shareable configurations via the 'extends' key.
3. Integrate ESLINT
   - Specifications: Utilize the Node.js API; primary methods include:
       ESLint.lintFiles(patterns: string | string[]) -> Promise<LintResult[]>
       ESLint.lintText(text: string, options?: { filePath: string }) -> Promise<LintResult[]>
4. Contribute to ESLINT
   - Specifications: Follow project structure for contributions; use npm scripts (npm run build, npm test, npm run start) for development workflows.
5. Maintain ESLINT
   - Specifications: Version management (e.g., v9.25.1 patch, v9.25.0 minor); CI/CD integration; release process best practices.

Implementation Details:
- CLI: Execute ESLint with --fix to auto-correct syntax-aware errors.
- Configuration Sample: { env: { browser: true, node: true }, parserOptions: { ecmaVersion: 2021 }, extends: 'eslint:recommended', rules: { semi: ["error", "always"] } }
- Node.js API: Instantiate new ESLint({ fix: true }) and call lintFiles with file path globs.
- Troubleshooting: Use commands like 'eslint --debug' for detailed logging and 'eslint --print-config <file>' to inspect resolved configurations.

## Supplementary Details
Configuration Options and Implementation Steps:
- CLI Options:
   --fix: Automatically applies syntax-aware fixes
   --format: Specifies the output formatter
   --init: Generates a starter configuration
- ESLint.config.js Example:
   module.exports = {
     env: { browser: true, node: true },
     parserOptions: { ecmaVersion: 2021 },
     extends: 'eslint:recommended',
     rules: { 'semi': ['error', 'always'], 'quotes': ['error', 'single'] }
   };
- Node.js API:
   Class: ESLint
   Methods:
     lintFiles(patterns: string | string[]): Promise<LintResult[]>
     lintText(text: string, options?: { filePath: string }): Promise<LintResult[]>
   Default behavior: Uses latest ECMAScript settings and recommended rules if no config is provided.
- Implementation Steps:
   1. Install ESLint (npm install eslint)
   2. Initialize configuration (npx eslint --init)
   3. Customize rules in configuration file (.eslintrc.json or eslint.config.js)
   4. Integrate ESLint into CI by checking exit codes from npm scripts.
- Version Details:
   v9.25.1: Patch release fixing bugs (21 Apr 2025)
   v9.25.0: Minor release with new features (18 Apr 2025)
- Troubleshooting Procedures:
   a. Run 'eslint --debug <file>' for detailed logs
   b. Run 'eslint --print-config <file>' to check effective configurations
   c. Validate Node and npm versions and verify installation if errors occur.

## Reference Details
API Specifications and Implementation Examples:
Class: ESLint
Methods:
  1. lintFiles(patterns: string | string[]): Promise<LintResult[]>
     - Parameters: patterns (string or array of file path patterns)
     - Returns: Promise resolving to an array of LintResult objects
     - Exceptions: Throws an Error if files are not found or if configuration is invalid
  2. lintText(text: string, options?: { filePath: string }): Promise<LintResult[]>
     - Parameters: text (string), options object containing filePath (string)
     - Returns: Promise resolving to an array of LintResult objects
     - Exceptions: Throws an Error if text input is empty or misconfigured

SDK Method Signature Example:
function runLint(): Promise<LintResult[]> {
  const eslint = new ESLint({ overrideConfigFile: 'eslint.config.js', fix: true });
  return eslint.lintFiles(['src/**/*.js']);
}

Node.js Code Example:
// Import ESLint from the package
const { ESLint } = require('eslint');

(async function main() {
  const eslint = new ESLint({ fix: true });
  const results = await eslint.lintFiles(['src/**/*.js']);
  results.forEach(result => {
    console.log(`File: ${result.filePath}, Errors: ${result.errorCount}`);
  });
})();

Configuration File (eslint.config.js) Example:
module.exports = {
  env: { browser: true, node: true },
  parserOptions: { ecmaVersion: 2021 },
  extends: 'eslint:recommended',
  rules: {
    'semi': ['error', 'always'],
    'quotes': ['error', 'single']
  }
};

Best Practices and Troubleshooting:
- Always commit your configuration file and review auto-fixed changes using version control.
- Test configuration with 'eslint --print-config <file>' to confirm resolved settings.
- For debugging, run 'eslint --debug <file>' to output detailed internal logs.
- In CI/CD, use npm scripts to run ESLint and check exit codes for build failures.
- If errors persist, verify the Node.js version and dependency installation by reinstalling ESLint.


## Information Dense Extract
ESLint; CLI: --fix, --format, --init; API: ESLint.lintFiles(string|string[]) => Promise<LintResult[]>; ESLint.lintText(string, {filePath:string}) => Promise<LintResult[]>; Config: env {browser:true,node:true}, parserOptions {ecmaVersion:2021}, extends 'eslint:recommended', rules {semi:['error','always'], quotes:['error','single']}; Versions: v9.25.1 (21 Apr 2025 patch), v9.25.0 (18 Apr 2025 minor); Node example: new ESLint({fix:true}); Troubleshoot: eslint --debug; eslint --print-config <file>; Best practices: verify auto-fixes via version control, integrate in CI using npm scripts.

## Sanitised Extract
Table of Contents:
1. Use ESLINT in Your Project
   - Specifications: Configure core rules, use CLI options (--fix, --format, --init), and integrate with editors and CI pipelines.
2. Extend ESLINT
   - Specifications: Create custom rules by exporting rule definitions with meta properties; develop plugins; implement shareable configurations via the 'extends' key.
3. Integrate ESLINT
   - Specifications: Utilize the Node.js API; primary methods include:
       ESLint.lintFiles(patterns: string | string[]) -> Promise<LintResult[]>
       ESLint.lintText(text: string, options?: { filePath: string }) -> Promise<LintResult[]>
4. Contribute to ESLINT
   - Specifications: Follow project structure for contributions; use npm scripts (npm run build, npm test, npm run start) for development workflows.
5. Maintain ESLINT
   - Specifications: Version management (e.g., v9.25.1 patch, v9.25.0 minor); CI/CD integration; release process best practices.

Implementation Details:
- CLI: Execute ESLint with --fix to auto-correct syntax-aware errors.
- Configuration Sample: { env: { browser: true, node: true }, parserOptions: { ecmaVersion: 2021 }, extends: 'eslint:recommended', rules: { semi: ['error', 'always'] } }
- Node.js API: Instantiate new ESLint({ fix: true }) and call lintFiles with file path globs.
- Troubleshooting: Use commands like 'eslint --debug' for detailed logging and 'eslint --print-config <file>' to inspect resolved configurations.

## Original Source
Tooling: Code Quality & Testing Documentation
https://eslint.org/docs/latest/

## Digest of ESLINT

# ESLINT

Retrieved on: 2023-10-10

# Use ESLINT in Your Project
- Core rules configuration and command line options
- CLI options include: --fix (automatically fix errors), --format (specify formatter), and --init (generate a configuration file)
- Integration with text editors and CI systems

# Extend ESLINT
- Create custom rules by exporting rule definitions with meta properties
- Develop plugins to extend ESLint behavior
- Utilize shareable configurations using the 'extends' key in config files

# Integrate ESLINT
- Node.js API usage via the ESLint class
- Method Signatures:
  - ESLint.lintFiles(patterns: string | string[]): Promise<LintResult[]>
  - ESLint.lintText(text: string, options?: { filePath: string }): Promise<LintResult[]>
- Allows integration into custom build scripts and tooling

# Contribute to ESLINT
- Follow the established project structure (directories for packages, rules, and configurations)
- Set up development environment with npm scripts:
    * npm run build
    * npm test
    * npm run start

# Maintain ESLINT
- Manage version releases (e.g., v9.25.1, v9.25.0) including bug fixes and feature updates
- Use automated CI/CD workflows for testing and deployment

Data Size: 2121782 bytes
Attribution: Crawled from https://eslint.org/docs/latest/ (4924 links found)

## Attribution
- Source: Tooling: Code Quality & Testing Documentation
- URL: https://eslint.org/docs/latest/
- License: License if known: MIT
- Crawl Date: 2025-04-26T09:44:25.815Z
- Data Size: 2121782 bytes
- Links Found: 4924

## Retrieved
2025-04-26
