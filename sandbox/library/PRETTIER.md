# PRETTIER

## Crawl Summary
Prettier reformats code by stripping existing styling and reprinting using defined rules. Supports a wide range of languages including JavaScript, JSX, Angular, Vue, TypeScript, among others. Key configuration options include trailingComma (default 'all'), objectWrap, experimentalOperatorPosition, parser selection, tabWidth, and useTabs. Core API methods include format(source, options) and resolveConfig(filePath), with integrated CLI commands for checking and writing code formatting. Essential integration includes pre-commit hook configuration and editor on-save formatting.

## Normalised Extract
Table of Contents:
  1. Supported Languages
    - JavaScript, JSX, Angular, Vue, Flow, TypeScript, CSS, Less, SCSS, HTML, Ember/Handlebars, JSON, GraphQL, Markdown (GFM, MDX v1), YAML
  2. Configuration Options
    - trailingComma: 'all', values: 'none', 'es5', 'all'
    - objectWrap: Boolean controlling object wrapping
    - experimentalOperatorPosition: Boolean for operator positioning
    - parser: e.g. 'babel', 'flow', 'typescript', 'html', 'css', 'json', 'md'
    - tabWidth: e.g. 2
    - useTabs: e.g. false
  3. API Methods and SDK Integration
    - format(source: string, options: PrettierOptions): string
    - resolveConfig(filePath: string): Promise<PrettierOptions | null>
  4. Code Implementation Patterns
    - Integration in build pipelines (pre-commit hooks, editor on-save)
    - CLI commands: prettier --check . and prettier --write .
  5. Troubleshooting Procedures
    - Use --debug-check, --find-config-path, verify parser and config file

Detailed Technical Details:
Supported Languages are hard-coded; configuration options override formatting behavior. API call to format() returns the formatted string with passed options, and resolveConfig() reads configuration from a given file. CLI commands facilitate checking and correcting code formatting. Configuration file (.prettierrc) supports JSON or module exports with the same options.

## Supplementary Details
Configuration Details:
- trailingComma: (Type: string, Default: 'all') Controls comma usage in multiline constructs.
- objectWrap: (Type: boolean) Enables wrapping of object literals when line length is exceeded.
- experimentalOperatorPosition: (Type: boolean) When true, alters the placement of operators in expressions.
- parser: (Type: string) Required for specifying the language parser. Common values: 'babel', 'flow', 'typescript', 'html', 'css', 'json', 'md'.
- tabWidth: (Type: number, Default: 2) Number of spaces for indentation.
- useTabs: (Type: boolean, Default: false) Whether to use tabs for indentation.

Implementation Steps:
1. Import Prettier in your project via require or import.
2. Define configuration options inline or in a configuration file (.prettierrc).
3. Call format() with the source code and options, then handle the output.
4. Integrate using CLI commands in your npm scripts:
   - Example: 'prettier --write "src/**/*.{js,jsx,ts,tsx}"'

Troubleshooting:
- Verify configuration file validity.
- Use CLI commands: 'prettier --check .' to list unformatted files and 'prettier --debug-check' to debug parser conflicts.

## Reference Details
API Specifications:
- format(source: string, options: {
    parser: string,
    trailingComma?: 'none' | 'es5' | 'all',
    tabWidth?: number,
    useTabs?: boolean,
    objectWrap?: boolean,
    experimentalOperatorPosition?: boolean
  }): string
  Returns the formatted code string. Throws errors on parsing failures.

- resolveConfig(filePath: string): Promise<{
    parser?: string,
    trailingComma?: 'none' | 'es5' | 'all',
    tabWidth?: number,
    useTabs?: boolean,
    objectWrap?: boolean,
    experimentalOperatorPosition?: boolean
  } | null)

SDK Method Signatures (Example in Node.js):

// Import Prettier module
const prettier = require('prettier');

// Format code example
// Input: source code string, options object
const options = {
  parser: 'babel',      // use babel parser for JavaScript
  trailingComma: 'all', // insert trailing commas where valid in ES5
  tabWidth: 2,          // indentation level in spaces
  useTabs: false,       // use spaces instead of tabs
  objectWrap: true,     // enable object wrapping
  experimentalOperatorPosition: true  // experimental operator placement
};

const formatted = prettier.format('function add(a,b,c,d){ return a+b+c+d; }', options);
console.log(formatted);

// Resolve configuration from a specific file
prettier.resolveConfig('./.prettierrc').then(config => {
  if (config) {
    console.log('Loaded configuration:', config);
  } else {
    console.log('No configuration found.');
  }
});

Configuration Options with Defaults:
- parser: (Required) No default, must be specified.
- trailingComma: default is 'all'
- tabWidth: default is 2
- useTabs: default is false
- objectWrap: default is false if unspecified
- experimentalOperatorPosition: default is false if unspecified

CLI Best Practices:
- Pre-format codebase using: npm run prettier -- --write .
- Check formatting in CI with: npm run prettier -- --check .

Troubleshooting Commands:
- Check unformatted files: prettier --check .
- Debug parser issues: prettier --debug-check
- Find configuration file: prettier --find-config-path <filename>


## Information Dense Extract
Prettier: opinionated formatter; languages: JavaScript, JSX, Angular, Vue, Flow, TypeScript, CSS, Less, SCSS, HTML, Ember/Handlebars, JSON, GraphQL, Markdown, YAML. Config options: trailingComma ('all'), objectWrap (boolean), experimentalOperatorPosition (boolean), parser (string, e.g., 'babel'), tabWidth (number, default 2), useTabs (boolean, false). API: format(source: string, options): string; resolveConfig(filePath: string): Promise<config|null>. Usage: integrate via CLI (prettier --check .; --write .), use in node with require('prettier'). Best practices include configuring via .prettierrc, integrating with pre-commit hooks, and using --debug-check for troubleshooting.

## Sanitised Extract
Table of Contents:
  1. Supported Languages
    - JavaScript, JSX, Angular, Vue, Flow, TypeScript, CSS, Less, SCSS, HTML, Ember/Handlebars, JSON, GraphQL, Markdown (GFM, MDX v1), YAML
  2. Configuration Options
    - trailingComma: 'all', values: 'none', 'es5', 'all'
    - objectWrap: Boolean controlling object wrapping
    - experimentalOperatorPosition: Boolean for operator positioning
    - parser: e.g. 'babel', 'flow', 'typescript', 'html', 'css', 'json', 'md'
    - tabWidth: e.g. 2
    - useTabs: e.g. false
  3. API Methods and SDK Integration
    - format(source: string, options: PrettierOptions): string
    - resolveConfig(filePath: string): Promise<PrettierOptions | null>
  4. Code Implementation Patterns
    - Integration in build pipelines (pre-commit hooks, editor on-save)
    - CLI commands: prettier --check . and prettier --write .
  5. Troubleshooting Procedures
    - Use --debug-check, --find-config-path, verify parser and config file

Detailed Technical Details:
Supported Languages are hard-coded; configuration options override formatting behavior. API call to format() returns the formatted string with passed options, and resolveConfig() reads configuration from a given file. CLI commands facilitate checking and correcting code formatting. Configuration file (.prettierrc) supports JSON or module exports with the same options.

## Original Source
Prettier Code Formatter
https://prettier.io/docs/en/index.html

## Digest of PRETTIER

# Overview
Prettier is an opinionated code formatter that reprints source code from scratch and enforces a consistent style. It supports languages including JavaScript (with experimental features), JSX, Angular, Vue, Flow, TypeScript, CSS (Less, SCSS), HTML, Ember/Handlebars, JSON, GraphQL, Markdown (GFM, MDX v1) and YAML.

# Supported Languages and Features
- Languages: JavaScript, JSX, Angular, Vue, Flow, TypeScript, CSS, Less, SCSS, HTML, Ember/Handlebars, JSON, GraphQL, Markdown, YAML
- Behavior: Removes original styling and reprints code to respect line-length constraints by re-parsing the AST and printing it according to built-in rules.

# Configuration Options
- trailingComma: Default changed to "all". Accepts values such as "none", "es5", or "all". 
- objectWrap: New option to control wrapping of objects.
- experimentalOperatorPosition: Experimental flag to control operator positioning in expressions.
- parser: String indicating which parser to use (e.g., "babel", "flow", "typescript", "html", "css", "json", "md").
- tabWidth: Number of spaces per indentation level (default 2).
- useTabs: Boolean to switch between spaces and tabs (default false).

# API Methods
- format(source: string, options: PrettierOptions): string
  - Parameters:
    - source: Input code string.
    - options: Configuration options (parser, trailingComma, tabWidth, useTabs, etc.).
  - Returns: Formatted code as a string.
- resolveConfig(filePath: string): Promise<PrettierOptions | null>
  - Parameters:
    - filePath: Path to the file to resolve configuration from.
  - Returns: Promise resolving with configuration object or null if no configuration found.

# Code Examples
Example usage in Node.js:

// Importing Prettier
const prettier = require('prettier');

// Formatting code with custom options
const options = {
  parser: 'babel',
  trailingComma: 'all',
  tabWidth: 2,
  useTabs: false,
  objectWrap: true, // new option
  experimentalOperatorPosition: true
};

const code = "function example(arg1, arg2, arg3, arg4){ return arg1+arg2+arg3+arg4; }";

const formattedCode = prettier.format(code, options);
console.log(formattedCode);

// Resolve configuration from a file
prettier.resolveConfig('/path/to/file.js').then(config => {
  console.log(config);
});

# Implementation Patterns
1. Use Prettier as part of your build pipeline by integrating it with pre-commit hooks or editor on-save actions.
2. Use the CLI using commands such as:
   - Run check: prettier --check .
   - Write changes: prettier --write .
3. For plugin development, ensure plugins follow ECMAScript Module standards and accommodate asynchronous parser support.

# Troubleshooting Procedures
- If code is not formatting as expected, verify the following:
   1. The correct parser is specified in the options.
   2. Review configuration file (.prettierrc) for conflicting options.
   3. Run the CLI with the --debug-check flag to diagnose parsing issues.
- Command examples:
   - Check formatting: npm run prettier -- --check .
   - Debug configuration: prettier --find-config-path yourFile.js

# Attribution and Data Size
- Data Size: 3822134 bytes
- Retrieved on: 2023-10-XX (current date as of extraction)

## Attribution
- Source: Prettier Code Formatter
- URL: https://prettier.io/docs/en/index.html
- License: License: MIT
- Crawl Date: 2025-05-01T21:32:25.958Z
- Data Size: 3822134 bytes
- Links Found: 4661

## Retrieved
2025-05-01
