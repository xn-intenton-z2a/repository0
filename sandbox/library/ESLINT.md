# ESLINT

## Crawl Summary
ESLint user guide focuses on practical implementation details: installation via npm, configuration through .eslintrc files, usage of CLI with flags (--fix, --config, --ext), and a comprehensive table of built-in rules. Key functional areas include core linting concepts, detailed configuration options for environments and parserOptions, integration with editors and CI, and migration procedures with version-specific guides.

## Normalised Extract
Table of Contents:
1. Getting Started
   - Installation: npm install eslint
   - Setup: Create .eslintrc.json with env, parserOptions, plugins, and rules
2. Core Concepts
   - Static code analysis, integration with editors and CI pipelines
3. Configure ESLint
   - Supports JSON, YAML, JavaScript formats
   - Key parameters: env (browser, node), parserOptions (ECMAScript version, source type), rules (severity settings)
4. Command Line Interface Reference
   - Usage: eslint [options] [file|dir]*
   - Flags: --fix (auto-fix errors), --config <path>, --ext <extensions>
5. Rules Reference
   - Detailed list of rules; each rule configurable with error levels and options
6. Formatters Reference
   - Built-in formatters for result display (stylish, json, table)
7. Integrations
   - Plugins and extensions for editors and build systems
8. Rule Deprecation
   - Guidelines to handle deprecated rules with warnings
9. Migrating
   - Step-by-step guides for upgrading ESLint versions (e.g., migrating-to-9.x)

## Supplementary Details
ESLint Version: 9.25.1 (patch) with upcoming 9.26.0
Configuration Options:
- env: { browser: true, node: true } (default: false for unspecified envs)
- parserOptions: { ecmaVersion: 2020, sourceType: 'module' } (default ECMAScript settings)
- rules: { ruleName: ['error'|'warn'|'off', additionalOptions] } 
CLI Flags:
- --fix: Auto-correct issues; use with care
- --config: Provide a specific configuration file path
- --ext: Define file extensions (e.g., .js, .jsx)
Implementation Steps:
1. Install ESLint via npm
2. Initialize configuration (npx eslint --init)
3. Run linting (npx eslint .) with optional --fix flag for auto-corrections
Troubleshooting:
- If unexpected errors occur, run ESLint with --debug flag to get detailed logs
- Verify configuration file structure; missing keys can cause failures

## Reference Details
ESLint API/CLI Specifications:
CLI Pattern: eslint [options] [file|dir]*
Common Options:
  --fix             : boolean, automatically fix problems
  --config <path>   : string, path to configuration file
  --ext <extensions>: string, comma-separated file extensions to lint

Node.js API (using ESLint class from 'eslint' package):
Method: new ESLint(options)
  - options: { fix?: boolean, overrideConfigFile?: string, baseConfig?: object, extensions?: string[], ignore?: boolean }
Method: lintFiles(patterns: string[])
  - Returns: Promise<LintResult[]>
Method: loadFormatter(format?: string)
  - Returns: Promise<Formatter>

Example Code:
// Import ESLint from the package
const { ESLint } = require('eslint');

// Instantiate ESLint with auto-fix enabled
const eslint = new ESLint({ fix: true });

// Lint files using a glob pattern
eslint.lintFiles(['src/**/*.js']).then(results => {
  // Process linting results
  console.log(results);
  return ESLint.outputFixes(results);
}).catch(error => {
  console.error('Linting error:', error);
});

Configuration File (.eslintrc.json) Example:
{
  "env": { "browser": true, "node": true },
  "parserOptions": { "ecmaVersion": 2020, "sourceType": "module" },
  "rules": { "semi": ["error", "always"], "quotes": ["error", "double"] }
}

Best Practices:
- Always run ESLint as part of CI to catch errors early
- Use the --fix flag to streamline code consistency
- Keep configuration modular using extends and shareable configs

Troubleshooting Commands:
1. Run with debugging:
   npx eslint . --debug
2. Check configuration:
   npx eslint --print-config path/to/file.js
Expected Outputs: Detailed configuration object and debug logs indicating ESLint resolution steps

## Information Dense Extract
ESLint v9.25.1; CLI: eslint [options] [files]; --fix: auto-fix; --config <path>; --ext: specify extensions; Node API: new ESLint({fix:boolean, overrideConfigFile:string, baseConfig:object, extensions:string[]}); lintFiles(patterns:string[]):Promise<LintResult[]>; loadFormatter(format?:string):Promise<Formatter>; .eslintrc.json config includes env:{browser:true, node:true}, parserOptions:{ecmaVersion:2020, sourceType:'module'}, rules:{'semi': ['error','always'], 'quotes': ['error','double']}; Troubleshooting: --debug, --print-config commands; Integration with editors and CI; Migration guides for major versions (migrating-to-x.x)

## Sanitised Extract
Table of Contents:
1. Getting Started
   - Installation: npm install eslint
   - Setup: Create .eslintrc.json with env, parserOptions, plugins, and rules
2. Core Concepts
   - Static code analysis, integration with editors and CI pipelines
3. Configure ESLint
   - Supports JSON, YAML, JavaScript formats
   - Key parameters: env (browser, node), parserOptions (ECMAScript version, source type), rules (severity settings)
4. Command Line Interface Reference
   - Usage: eslint [options] [file|dir]*
   - Flags: --fix (auto-fix errors), --config <path>, --ext <extensions>
5. Rules Reference
   - Detailed list of rules; each rule configurable with error levels and options
6. Formatters Reference
   - Built-in formatters for result display (stylish, json, table)
7. Integrations
   - Plugins and extensions for editors and build systems
8. Rule Deprecation
   - Guidelines to handle deprecated rules with warnings
9. Migrating
   - Step-by-step guides for upgrading ESLint versions (e.g., migrating-to-9.x)

## Original Source
ESLint Documentation
https://eslint.org/docs/latest/user-guide

## Digest of ESLINT

# ESLINT USER GUIDE

Retrieved Date: 28 Apr 2025

# Table of Contents
1. Getting Started
2. Core Concepts
3. Configure ESLint
4. Command Line Interface Reference
5. Rules Reference
6. Formatters Reference
7. Integrations
8. Rule Deprecation
9. Migrating

# 1. Getting Started
Installation via npm: npm install eslint
Create a configuration file (.eslintrc.json) with settings such as env, parserOptions, plugins, and rules.

# 2. Core Concepts
ESLint uses static analysis to find problems in JavaScript code. It integrates with editors and CI pipelines for continuous linting.

# 3. Configure ESLint
Configuration is possible with various file formats (JSON, YAML, JavaScript). Key settings include:
- env: Environment definitions (e.g., browser, node)
- parserOptions: Defines ECMAScript version and source type
- rules: Object mapping rule names to severity and options

# 4. Command Line Interface Reference
ESLint CLI Usage: eslint [options] [file|dir]*
Common flags include:
- --fix: Automatically fix problems
- --config <path>: Specify configuration file
- --ext <extensions>: Specify file extensions to lint

# 5. Rules Reference
List all built-in rules and custom rules. Each rule can be set to off, warn, or error and may accept an array of options.

# 6. Formatters Reference
Built-in formatters change the presentation of linting results. Examples include stylish, table, and json formatters.

# 7. Integrations
Integrate ESLint with editors (VSCode, Sublime) and build tools. Use provided plugins and extensions for seamless integration.

# 8. Rule Deprecation
Guidelines for deprecating rules are provided to assist with upgrading. Deprecated rules may still be used with warnings.

# 9. Migrating
Migration guides exist for major version changes (e.g., migrating-to-7.0.0, migrate-to-8.0.0, migrate-to-9.x) detailing breaking changes and configuration updates.

Attribution: ESLint Documentation from https://eslint.org/docs/latest/user-guide
Data Size: 2562822 bytes

## Attribution
- Source: ESLint Documentation
- URL: https://eslint.org/docs/latest/user-guide
- License: License: MIT
- Crawl Date: 2025-05-01T17:16:55.488Z
- Data Size: 2562822 bytes
- Links Found: 5992

## Retrieved
2025-05-01
