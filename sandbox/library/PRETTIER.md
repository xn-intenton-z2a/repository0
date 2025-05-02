# PRETTIER

## Crawl Summary
Prettier is an opinionated code formatter that parses source code into an AST and reprints it according to preset rules to enforce a consistent style across multiple languages. Recent updates include options like objectWrap, experimentalOperatorPosition, and support for TypeScript configuration files. CLI commands and editor integrations are central, with flags such as --write, --cache, and --experimental-ternaries provided to control formatting behavior.

## Normalised Extract
Table of Contents:
  Supported Languages
  Formatting Behavior
  New Feature Options
  CLI and Editor Integration
  Configuration Options
  Troubleshooting

Supported Languages: JavaScript, JSX, Angular, Vue, Flow, TypeScript, CSS, Less, SCSS, HTML, Ember/Handlebars, JSON, GraphQL, Markdown (GFM and MDX v1), YAML.

Formatting Behavior:
  - Uses AST parsing to disregard most original styling and reprint code according to maximum line lengths.
  - Automatically wraps long argument lists and enforces consistent indentation.
  - Example transformation: long function call in one line is reformatted into multi-line call with proper indentation.

New Feature Options:
  - objectWrap: Enables controlled wrapping of object literals based on line length and custom rules.
  - experimentalOperatorPosition: Alters operator placement for experimental formatting scenarios.
  - --experimental-ternaries: Provides a novel formatting style for nested ternary expressions, adjusting indentation levels.

CLI and Editor Integration:
  - CLI flags include:
      --write: Overwrites file with formatted output.
      --cache: Enables caching to avoid reformatting unchanged files.
      --cache-location <path>: Specifies location for cache file.
      --loglevel debug: Outputs detailed debugging logs.
  - Editor plugins support auto-format on save (VS Code, Vim, WebStorm, Sublime Text, Emacs, etc.).

Configuration Options:
  - Use a .prettierrc file in JSON format to configure options such as printWidth, tabWidth, trailingComma, objectWrap, and experimentalOperatorPosition.
  - Key option: trailingComma default set to "all".

Troubleshooting:
  - Verify that the configuration file is correctly formatted and located in the root directory.
  - Run CLI command 'prettier --write <file>' to apply formatting explicitly.
  - Use 'prettier --check <file>' to detect unformatted code.
  - For performance and parsing issues, enable '--loglevel debug' to capture and diagnose errors.

## Supplementary Details
Configuration Details:
  - trailingComma: Default value "all"; controls trailing commas in multi-line constructs.
  - objectWrap: Boolean flag to control object literal wrapping; set in .prettierrc.
  - experimentalOperatorPosition: Boolean flag for altering operator placement; requires explicit enabling via CLI or config.
  - TypeScript Config File Support: Reads options from tsconfig.json for projects using TypeScript.

CLI Commands and Implementation Steps:
  1. Install Prettier via npm (npm install --save-dev prettier).
  2. Create and configure a .prettierrc file with desired settings.
  3. Integrate Prettier into the workflow:
       - Use editor plugins for format-on-save or add a pre-commit hook (e.g. lint-staged).
       - Use CLI commands such as 'prettier --write "src/**/*.{js,jsx,ts,tsx,json,css,md}"' for batch formatting.
  4. Troubleshoot using 'prettier --check <file>' and '--loglevel debug' for detailed feedback.

Best Practices:
  - Keep configuration minimal to avoid debates over style preferences.
  - Integrate Prettier into CI pipelines to ensure code consistency.
  - Regularly update Prettier to incorporate the latest performance improvements and new options.

## Reference Details
API Specifications and SDK Method Signatures:
  - Function: format(source: string, options?: {
      parser: string,
      printWidth?: number,
      tabWidth?: number,
      trailingComma?: 'none' | 'es5' | 'all',
      bracketSpacing?: boolean,
      jsxBracketSameLine?: boolean,
      objectWrap?: boolean,
      experimentalOperatorPosition?: boolean
    }): string
  - Throws: Error if the source cannot be parsed into an AST.

CLI Options and Flags:
  - --write: Write formatted output back to file.
  - --cache: Enable caching for faster reformatting of unchanged files.
  - --cache-location <path>: Specify path for cache storage.
  - --experimental-ternaries: Enable experimental nested ternary formatting.
  - --loglevel debug: Enable detailed logging for troubleshooting.

Example Code for Node.js Integration:
--------------------------------------------------
// Import Prettier
const prettier = require('prettier');

// Sample source code string
const code = "function foo(arg1, arg2, arg3, arg4) { return arg1 + arg2 + arg3 + arg4; }";

// Format the code using Prettier API
const formatted = prettier.format(code, {
  parser: 'babel',
  printWidth: 80,
  tabWidth: 2,
  trailingComma: 'all',
  objectWrap: true,          // Enable object wrapping if desired
  experimentalOperatorPosition: true // Enable experimental operator positioning
});

console.log(formatted);
--------------------------------------------------

Example .prettierrc Configuration File:
--------------------------------------------------
{
  "printWidth": 80,
  "tabWidth": 2,
  "trailingComma": "all",
  "objectWrap": false,
  "experimentalOperatorPosition": false
}
--------------------------------------------------

Best Practices and Troubleshooting Procedures:
  - Add a pre-commit hook using lint-staged with the command: "prettier --write 'src/**/*.{js,jsx,ts,tsx,json,css,md}'".
  - If formatting does not occur, run: "prettier --check <file>" to detect issues.
  - For detailed error outputs, run: "prettier --loglevel debug <file>" and review the command output for parse errors or configuration issues.
  - Ensure all required plugins for language support are installed as needed.

Full SDK Integration:
  - Import and use the format function as shown in the code example to integrate Prettier into custom build scripts or CI pipelines.

## Information Dense Extract
Prettier; formatter for JavaScript, JSX, Angular, Vue, Flow, TypeScript, CSS, Less, SCSS, HTML, Ember/Handlebars, JSON, GraphQL, Markdown, YAML; AST-based reprinting; options: trailingComma (all), objectWrap (boolean), experimentalOperatorPosition (boolean), experimental-ternaries flag; CLI: --write, --cache, --cache-location, --loglevel debug; API: format(source: string, options: { parser: string, printWidth?: number, tabWidth?: number, trailingComma?: 'none'|'es5'|'all', objectWrap?: boolean, experimentalOperatorPosition?: boolean }): string; configuration in .prettierrc; integration via editor plugins and pre-commit hooks; troubleshooting using 'prettier --check' and debug logs.

## Sanitised Extract
Table of Contents:
  Supported Languages
  Formatting Behavior
  New Feature Options
  CLI and Editor Integration
  Configuration Options
  Troubleshooting

Supported Languages: JavaScript, JSX, Angular, Vue, Flow, TypeScript, CSS, Less, SCSS, HTML, Ember/Handlebars, JSON, GraphQL, Markdown (GFM and MDX v1), YAML.

Formatting Behavior:
  - Uses AST parsing to disregard most original styling and reprint code according to maximum line lengths.
  - Automatically wraps long argument lists and enforces consistent indentation.
  - Example transformation: long function call in one line is reformatted into multi-line call with proper indentation.

New Feature Options:
  - objectWrap: Enables controlled wrapping of object literals based on line length and custom rules.
  - experimentalOperatorPosition: Alters operator placement for experimental formatting scenarios.
  - --experimental-ternaries: Provides a novel formatting style for nested ternary expressions, adjusting indentation levels.

CLI and Editor Integration:
  - CLI flags include:
      --write: Overwrites file with formatted output.
      --cache: Enables caching to avoid reformatting unchanged files.
      --cache-location <path>: Specifies location for cache file.
      --loglevel debug: Outputs detailed debugging logs.
  - Editor plugins support auto-format on save (VS Code, Vim, WebStorm, Sublime Text, Emacs, etc.).

Configuration Options:
  - Use a .prettierrc file in JSON format to configure options such as printWidth, tabWidth, trailingComma, objectWrap, and experimentalOperatorPosition.
  - Key option: trailingComma default set to 'all'.

Troubleshooting:
  - Verify that the configuration file is correctly formatted and located in the root directory.
  - Run CLI command 'prettier --write <file>' to apply formatting explicitly.
  - Use 'prettier --check <file>' to detect unformatted code.
  - For performance and parsing issues, enable '--loglevel debug' to capture and diagnose errors.

## Original Source
Prettier Code Formatter
https://prettier.io/docs/en/index.html

## Digest of PRETTIER

# Prettier Documentation
# Date: 2023-10-17

# Overview
Prettier is an opinionated code formatter that supports multiple languages: JavaScript (including experimental features), JSX, Angular, Vue, Flow, TypeScript, CSS, Less, SCSS, HTML, Ember/Handlebars, JSON, GraphQL, Markdown (including GFM and MDX v1) and YAML.

# Formatting Mechanism
- Parses source code into an Abstract Syntax Tree (AST) and reprints it using its own rules.
- Ignores most original styling (with exceptions for empty lines and multi-line objects) and wraps code based on the maximum line length.
- Example: 
  - Input: foo(arg1, arg2, arg3, arg4); maintains single line if within limit.
  - Input with long arguments: foo(reallyLongArg(), omgSoManyParameters(), IShouldRefactorThis(), isThereSeriouslyAnotherOne()); is reformatted into multiple lines with consistent indentation.

# New Feature Options and Recent Updates
- objectWrap option: Enables reprinting of object literals with specific wrapping rules.
- experimentalOperatorPosition option: Adjusts operator placement for experimental formatting.
- TypeScript configuration file support: Reads formatting preferences from tsconfig.json.
- --experimental-ternaries flag: Enables a novel formatting style for nested ternary expressions.

# CLI and Editor Integration
- CLI Commands: 
  --write : Writes formatted output back to file.
  --cache : Enables caching of unchanged files.
  --cache-location <path> : Specifies custom cache file location.
  --loglevel debug : Provides verbose logging for troubleshooting.
- Editor plugins available for VS Code, Vim, WebStorm, Sublime Text, Emacs, and more to enable format-on-save.

# Configuration Options
- .prettierrc JSON configuration file example:
{
  "printWidth": 80,
  "tabWidth": 2,
  "trailingComma": "all",
  "objectWrap": false,
  "experimentalOperatorPosition": false
}
- Default trailingComma option is set to "all".

# Performance Improvements and Best Practices
- CLI performance has been enhanced (refer to Prettier's CLI: A Performance Deep Dive).
- Recommended to integrate Prettier as a pre-commit hook (e.g. with lint-staged) for consistent formatting across the codebase.

# Troubleshooting
- Ensure editor integrations and configuration files are correctly set up.
- Use 'prettier --write <file>' to manually enforce formatting.
- Run 'prettier --check <file>' to verify if files follow the formatting rules.
- Use '--loglevel debug' for detailed error messages and AST parse error outputs.

# Data Attribution
- Data Size: 3143008 bytes
- Retrieved from: https://prettier.io/docs/en/index.html

## Attribution
- Source: Prettier Code Formatter
- URL: https://prettier.io/docs/en/index.html
- License: License: MIT
- Crawl Date: 2025-05-02T20:57:47.447Z
- Data Size: 3143008 bytes
- Links Found: 4123

## Retrieved
2025-05-02
