# PRETTIER

## Crawl Summary
Prettier is an opinionated code formatter that supports multiple languages including JavaScript, JSX, Angular, Vue, Flow, TypeScript, CSS variants, HTML, JSON, GraphQL, Markdown, and YAML. It works by discarding original styling and reprinting code based on maximum line length. Key options include trailingComma (default 'all'), objectWrap, experimentalOperatorPosition, and parser settings. It integrates via CLI (--write, --parser) and through editor plugins, and includes recent updates in versions 3.5 and earlier with performance improvements and enhanced configuration support.

## Normalised Extract
Table of Contents:
1. Supported Languages and Frameworks
   - List: JavaScript, JSX, Angular, Vue, Flow, TypeScript, CSS, Less, SCSS, HTML, Ember/Handlebars, JSON, GraphQL, Markdown (GFM, MDX v1), YAML
2. Reprinting Algorithm
   - Parses source code to AST, discards original formatting, reprints code following maximum line length rules
   - Example: Maintains single line if within limit, wraps function calls if too long
3. Configuration and CLI Options
   - --trailing-comma: Sets trailing comma behavior, default value 'all' in v3.0
   - --objectWrap: New option in v3.5 to control object wrapping
   - --experimentalOperatorPosition: Experimental operator placement
   - --parser: Specify parser type (e.g. babel, flow, typescript)
   - CLI usage: prettier --write <filename>
4. Integration Patterns
   - Use pre-commit hooks, editor on-save configurations, and minimal config files (.prettierrc) for consistency
5. Release and Feature Updates
   - Version 3.5 introduces new options; previous releases include bug fixes and performance enhancements

Detailed Topics:
1. Supported Languages: Prettier supports a wide range of languages ensuring consistent style across various codebases.
2. Reprinting Algorithm: Implements AST parsing and maximum line length enforcement. Code is reprinted even if original formatting is preserved in some cases for empty lines or multi-line objects.
3. CLI and Configurations: Command-line interface supports options that allow overriding default formatting rules via flags and configuration files.
4. Integration: Designed to integrate smoothly with development workflows including git hooks and editor plugins to ensure uniform code style.
5. Releases: Documents incremental improvements in each version, detailing added options and bug fixes.

## Supplementary Details
Technical Specifications:
- Trailing Comma Option: Accepts values such as 'none', 'es5', or 'all' (default set to 'all' in v3.0). Affects comma insertion at the end of multi-line structures.
- objectWrap Option: Boolean flag introduced in version 3.5 to control whether objects should wrap in a new line based on configured width.
- experimentalOperatorPosition Option: Boolean flag for testing alternative formatting of operators; usage via --experimentalOperatorPosition flag.
- Parser Option: Must be set to one of the supported parsers like 'babel', 'flow', or 'typescript'.
- CLI Commands:
  * To format a file and overwrite: prettier --write filename
  * To check formatting: prettier --check filename
- Configuration Files: The .prettierrc file supports JSON, YAML, or JavaScript formats where these options can be directly set:
  {
    "trailingComma": "all",
    "objectWrap": true,
    "experimentalOperatorPosition": false,
    "parser": "babel"
  }
- Best Practices: Integrate Prettier with version control via pre-commit hooks; combine with linters strictly for code quality rules; use explicit parser definitions for clarity; update configuration with each release to adopt new features.
- Implementation Steps: Install Prettier via npm, configure CLI commands in package.json scripts, and set up editor integrations with provided extensions.
- Troubleshooting: Run 'prettier --debug-check filename' to verify configuration; inspect output differences between --check and --write modes; ensure configuration file is in correct format and in the project root.

## Reference Details
API Specifications and SDK Method Signatures:

Method: format
Signature: format(sourceCode: string, options?: PrettierOptions) => string
Parameters:
- sourceCode: string - The code to be formatted
- options: PrettierOptions (object) with properties:
  * parser: string (e.g., 'babel', 'flow', 'typescript')
  * trailingComma: 'none' | 'es5' | 'all' (default: 'all')
  * objectWrap: boolean (introduced in v3.5, default: false)
  * experimentalOperatorPosition: boolean (default: false)
Return Type: string (formatted code)

Example Usage:
// Example: Format code using Prettier API
// Comments: This code snippet shows how to call the format method with explicit options
const formattedCode = format("function foo(){return bar;}", {
  parser: "babel",
  trailingComma: "all",
  objectWrap: true,
  experimentalOperatorPosition: false
});

CLI Commands:
- Format file and write changes: prettier --write <filename>
- Check file for formatting issues: prettier --check <filename>

Configuration Options in .prettierrc:
{
  "trailingComma": "all",
  "objectWrap": true,
  "experimentalOperatorPosition": false,
  "parser": "babel"
}

Best Practices:
1. Integrate with git pre-commit hooks using tools like husky to run 'prettier --write'.
2. Use editor integrations to automatically format code on save.
3. Use the debug check command for troubleshooting configuration issues: prettier --debug-check <filename>

Troubleshooting Procedures:
- Run: prettier --debug-check <filename> to identify misconfigurations.
- Use: prettier --loglevel debug for verbose output if formatting does not behave as expected.
- Confirm the configuration file (.prettierrc) is in the project root and correctly formatted in JSON or YAML.
- Update CLI and plugins to the latest version to avoid compatibility issues.

Additional SDK Integration Patterns:
- When integrating into Node.js projects, require Prettier as a module and call the format method as shown above.
- Ensure that all files with supported extensions are included in formatting scripts.
- For multi-language projects, set specific parser options in configuration overrides.

Exceptions and Error Handling:
- The format method may throw exceptions if the source code cannot be parsed; wrap calls in try-catch blocks for resilience.
- Validate configuration file syntax if errors are encountered during CLI execution.

## Information Dense Extract
Prettier: opinionated code formatter for JS, JSX, Angular, Vue, Flow, TS, CSS/LESS/SCSS, HTML, Ember/Handlebars, JSON, GraphQL, Markdown (GFM, MDX), YAML. Reprints AST with max line length enforcement; preserves empty lines and multi-line objects. CLI: --write, --check; config via .prettierrc supports { trailingComma: 'all', objectWrap: bool, experimentalOperatorPosition: bool, parser: string } API: format(sourceCode: string, options: PrettierOptions): string. Latest v3.5 introduces objectWrap and experimentalOperatorPosition. Best practices: integrate with git hooks, use editor on-save; troubleshoot via --debug-check and verbose logging. SDK integration requires try-catch for parsing errors.

## Sanitised Extract
Table of Contents:
1. Supported Languages and Frameworks
   - List: JavaScript, JSX, Angular, Vue, Flow, TypeScript, CSS, Less, SCSS, HTML, Ember/Handlebars, JSON, GraphQL, Markdown (GFM, MDX v1), YAML
2. Reprinting Algorithm
   - Parses source code to AST, discards original formatting, reprints code following maximum line length rules
   - Example: Maintains single line if within limit, wraps function calls if too long
3. Configuration and CLI Options
   - --trailing-comma: Sets trailing comma behavior, default value 'all' in v3.0
   - --objectWrap: New option in v3.5 to control object wrapping
   - --experimentalOperatorPosition: Experimental operator placement
   - --parser: Specify parser type (e.g. babel, flow, typescript)
   - CLI usage: prettier --write <filename>
4. Integration Patterns
   - Use pre-commit hooks, editor on-save configurations, and minimal config files (.prettierrc) for consistency
5. Release and Feature Updates
   - Version 3.5 introduces new options; previous releases include bug fixes and performance enhancements

Detailed Topics:
1. Supported Languages: Prettier supports a wide range of languages ensuring consistent style across various codebases.
2. Reprinting Algorithm: Implements AST parsing and maximum line length enforcement. Code is reprinted even if original formatting is preserved in some cases for empty lines or multi-line objects.
3. CLI and Configurations: Command-line interface supports options that allow overriding default formatting rules via flags and configuration files.
4. Integration: Designed to integrate smoothly with development workflows including git hooks and editor plugins to ensure uniform code style.
5. Releases: Documents incremental improvements in each version, detailing added options and bug fixes.

## Original Source
Prettier Documentation
https://prettier.io/docs/en/index.html

## Digest of PRETTIER

# PRETTIER DOCUMENTATION

Retrieved Date: 2023-10-12

## Supported Languages and Frameworks
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

## Reprinting and Formatting Behavior
- Prettier reprints source code entirely by parsing the AST and then printing it according to its built-in rules.
- Takes maximum line length into account. When a function call or statement exceeds the limit, it automatically reformats by wrapping code accordingly.
- Preserves some aspects (e.g., empty lines and multi-line objects) while always discarding original styling choices.

## Example of Reformatting
- Input: foo(arg1, arg2, arg3, arg4);
- If the line is within limits, the code remains unchanged.
- For long calls: foo(reallyLongArg(), omgSoManyParameters(), IShouldRefactorThis(), isThereSeriouslyAnotherOne());
- Reformatted output: 
  foo(
    reallyLongArg(),
    omgSoManyParameters(),
    IShouldRefactorThis(),
    isThereSeriouslyAnotherOne(),
  );

## Configuration Options and CLI Usage
- Minimal configuration: Designed to work out-of-the-box with few options.
- Common options include:
  --trailing-comma: Specifies if trailing commas should be used (default in v3.0 changed to "all").
  --objectWrap: New in version 3.5 for controlling object wrapping behavior.
  --experimentalOperatorPosition: Experimental option for operator placement.
  --parser: To explicitly set the parser (e.g., babel, flow, typescript).
  --write: CLI flag to write the formatted code back to file.
- Config files such as .prettierrc or package.json can be used to store configuration.

## Recent Release Features
- Version 3.5: Added support for objectWrap and experimentalOperatorPosition options; TypeScript configuration file support.
- Earlier releases include bug fixes, performance improvements (CLI optimizations), and support for new language features.

## Integration and Best Practices
- Use with pre-commit hooks or editor integrations (e.g., VS Code extension, Sublime Text, Vim plugins) for automatic formatting on save.
- Recommended to use in conjunction with linters for code quality rules; Prettier focuses solely on code formatting.

## Attribution and Data Size
- Data Size Obtained: 1101496 bytes
- Crawled from: https://prettier.io/docs/en/index.html
- Number of Links Found: 2632

## Attribution
- Source: Prettier Documentation
- URL: https://prettier.io/docs/en/index.html
- License: License: MIT License
- Crawl Date: 2025-05-02T20:08:57.847Z
- Data Size: 1101496 bytes
- Links Found: 2632

## Retrieved
2025-05-02
