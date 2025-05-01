# ESLINT_CLI

## Crawl Summary
ESLint CLI provides a full suite of options for linting JavaScript files. It supports executing via multiple package managers, specifying config files, enabling environments, and custom rules. Key commands include npx eslint [options] [files]. Options include --no-eslintrc (flag), -c/--config (String path), --env (multiple environment names), --ext (additional file extensions), --global (global variables), --parser (parser selection), and --parser-options (key:value pairs). Other groups cover fixing issues (--fix, --fix-dry-run, --fix-type), ignore file controls (--ignore-path, --no-ignore, --ignore-pattern), STDIN handling (--stdin, --stdin-filename), warning management (--quiet, --max-warnings) and output formatting (-o/--output-file, -f/--format, --color/--no-color).

## Normalised Extract
Table of Contents:
1. CLI Execution
   - Command: npx eslint [options] [file|dir|glob]*
   - Alternatives: yarn dlx eslint, pnpm dlx eslint, bunx eslint
   - Note: Glob parameters should be quoted to prevent shell expansion issues.
2. Multiple Value Options
   - Option: --global accepts repeated values or comma-delimited list (e.g., --global describe,it).
3. Basic Configuration Options
   - --no-eslintrc: Disables .eslintrc.* and package.json configs; equivalent flat config: --no-config-lookup.
   - -c, --config <String>: Specifies configuration file. Example: -c ~/my.eslint.config.js
   - --inspect-config: Opens the configuration inspector.
   - --env <String>: Enables environments. Examples: --env browser,node or --env browser --env node.
   - --ext <String>: Adds file extensions; repeatable for multiple extensions, e.g., --ext .ts --ext .tsx or --ext .ts,.tsx.
   - --global <String>: Defines global variables (syntax: name or name:true).
   - --parser <String>: Sets the parser; default is espree; example: --parser @typescript-eslint/parser.
   - --parser-options <key:value>: Sets parser options, e.g., ecmaVersion:7.
   - --resolve-plugins-relative-to <String>: Sets plugin resolution path.
4. Rules and Plugins Specifications
   - --plugin <String>: Loads specified plugin; can omit eslint-plugin- prefix.
   - --rule <String>: Sets rule configurations in levn format. Example: 'quotes: [error, double]'.
   - --rulesdir <String>: Specifies directory for custom rules (deprecated).
5. Fixing and Auto-Repair
   - --fix: Automatically fixes problems in files (writes changes to disk).
   - --fix-dry-run: Shows fixes without writing changes; use with STDIN for piped code.
   - --fix-type <String>: Specifies fix types: problem, suggestion, layout, directive. Multiple values allowed.
6. Ignore File Options
   - --ignore-path <String>: Uses specified .eslintignore file.
   - --no-ignore: Disables ignoring files, ignoring .eslintignore and ignore-patterns.
   - --ignore-pattern <String>: Adds ignore patterns, following .gitignore syntax.
7. STDIN Handling
   - --stdin: Reads code from standard input rather than files.
   - --stdin-filename <String>: Specifies file name for STDIN content to enable filename-based rule processing.
8. Warning and Exit Code Management
   - --quiet: Reports only errors (suppresses warnings).
   - --max-warnings <Int>: Sets maximum warning count before exiting with an error status; default is -1.
9. Output Configuration
   - -o, --output-file <String>: Writes lint report output to specified file.
   - -f, --format <String>: Specifies output format; default is stylish; supports built-in JSON and custom formatters.
   - --color / --no-color: Forces colorized output on or off.


## Supplementary Details
Detailed Specifications:
--no-eslintrc: No argument flag; disables lookup of .eslintrc.* and package.json configs.
-c, --config:
   - Type: String
   - Usage: -c <path> or --config <path>
   - Example: npx eslint -c ~/my.eslint.config.js file.js
--inspect-config:
   - Type: Flag (no argument)
   - Opens the config inspector for flat config mode.
--env:
   - Type: String
   - Multiple values supported either separated by commas (e.g., browser,node) or repeated.
--ext:
   - Type: String
   - Default: .js, .mjs, .cjs (plus user-specified in config)
   - Example: --ext .ts, or --ext .ts --ext .tsx
--global:
   - Type: String
   - Syntax: variable or variable:true
   - Example: --global require,exports:true
--parser:
   - Type: String
   - Default: espree
   - Example: --parser @typescript-eslint/parser
--parser-options:
   - Type: key:value pairs
   - Example: --parser-options ecmaVersion:7
--resolve-plugins-relative-to:
   - Type: String
   - Example: --resolve-plugins-relative-to /usr/local/lib/
--plugin:
   - Type: String
   - Multiple allowed
   - Example: --plugin jquery
--rule:
   - Type: String (levn format)
   - Multiple allowed
   - Examples: '--rule "quotes: [error, double]"', '--rule "jquery/dollar-sign: error"'
--rulesdir:
   - Type: String
   - Allows multiple directories
   - Usage: --rulesdir my-rules/ (Deprecated)
--fix:
   - Type: Flag (no arguments)
   - Automatically fixes fixable issues
--fix-dry-run:
   - Type: Flag
   - Shows potential fixes without modifying files
--fix-type:
   - Type: String
   - Allowed values: problem, suggestion, layout, directive
   - Multiple values allowed (e.g., --fix-type suggestion,layout)
--ignore-path:
   - Type: String
   - Specifies the file for ignore patterns (e.g., .eslintignore)
--no-ignore:
   - Type: Flag
   - Disables all ignore behaviors
--ignore-pattern:
   - Type: String
   - Multiple allowed; supports .gitignore syntax
--stdin:
   - Type: Flag
   - Reads code from STDIN
--stdin-filename:
   - Type: String
   - Sets filename context for STDIN input
--quiet:
   - Type: Flag
   - Only report errors
--max-warnings:
   - Type: Integer
   - Example: --max-warnings 10
--output-file (-o):
   - Type: String
   - Example: -o ./test/test.html
--format (-f):
   - Type: String
   - Default: stylish
   - Examples: '-f json', '-f ./customformat.js', '-f eslint-formatter-pretty'
--color / --no-color:
   - Flags to force enable/disable color output
Implementation Steps:
1. Install ESLint via Node.js (npx, yarn, pnpm or bun).
2. Execute ESLint with desired options; for example, npx eslint --fix file.js
3. Use --stdin and --stdin-filename for piping code.
4. For multiple environments or file extensions, repeat options or use comma-separated values.
Troubleshooting:
- Error for missing file arguments in non-flat config mode.
- When using piped input, utilize --fix-dry-run with an appropriate formatter (e.g., json) to inspect changes.
- For shell glob issues, quote the glob pattern to ensure correct expansion.


## Reference Details
ESLint CLI API Specifications:
Command: npx eslint [options] [file|dir|glob]*
Options:
1. --no-eslintrc: { type: flag, description: 'Disable lookup for eslintrc files' }
2. -c, --config <String>: { type: String, description: 'Path to the configuration file', example: 'npx eslint -c ~/my.eslint.config.js file.js' }
3. --inspect-config: { type: flag, description: 'Open config inspector in flat config mode' }
4. --env <String>: { type: String, multiple: true, description: 'Enable specific environments', example: 'npx eslint --env browser,node file.js' }
5. --ext <String>: { type: String, multiple: true, description: 'Additional file extensions', example: 'npx eslint . --ext .ts,.tsx' }
6. --global <String>: { type: String, multiple: true, description: 'Define global variables, syntax: name or name:true', example: 'npx eslint --global require,exports:true file.js' }
7. --parser <String>: { type: String, default: 'espree', description: 'Parser to be used', example: 'npx eslint --parser @typescript-eslint/parser file.ts' }
8. --parser-options <key:value>: { type: Object key:value, multiple: true, description: 'Parser options', example: '--parser-options ecmaVersion:7' }
9. --resolve-plugins-relative-to <String>: { type: String, description: 'Directory for resolving plugins', example: '--resolve-plugins-relative-to /usr/local/lib/' }
10. --plugin <String>: { type: String, multiple: true, description: 'Plugin to load', example: 'npx eslint --plugin jquery file.js' }
11. --rule <String>: { type: String, multiple: true, description: 'Define rule settings in levn format', example: '--rule "quotes: [error, double]"' }
12. --rulesdir <String>: { type: String, multiple: true, description: 'Directory for custom rules (deprecated)', example: '--rulesdir my-rules/' }
13. --fix: { type: flag, description: 'Automatically fix issues; modifies files' }
14. --fix-dry-run: { type: flag, description: 'Perform fix without writing changes' }
15. --fix-type <String>: { type: String, multiple: true, allowed: ["problem", "suggestion", "layout", "directive"], description: 'Specify types of fixes', example: '--fix-type suggestion,layout' }
16. --ignore-path <String>: { type: String, description: 'Path to custom ignore file', example: '--ignore-path .eslintignore' }
17. --no-ignore: { type: flag, description: 'Disable all ignore mechanisms' }
18. --ignore-pattern <String>: { type: String, multiple: true, description: 'Ignore pattern using .gitignore syntax', example: '--ignore-pattern "/lib/"' }
19. --stdin: { type: flag, description: 'Read source from STDIN' }
20. --stdin-filename <String>: { type: String, description: 'Filename for STDIN content', example: '--stdin-filename myFile.js' }
21. --quiet: { type: flag, description: 'Report errors only, suppress warnings' }
22. --max-warnings <Int>: { type: Integer, description: 'Max warnings allowed before exit error', example: '--max-warnings 10' }
23. -o, --output-file <String>: { type: String, description: 'Output file for lint report', example: '-o ./test/test.html' }
24. -f, --format <String>: { type: String, default: 'stylish', description: 'Output format', example: '-f json' }
25. --color / --no-color: { type: flag, description: 'Force enable/disable color output' }

Code Example:
// Run ESLint on two files using npm
npx eslint file1.js file2.js

// Run ESLint with auto-fix and specific rule
npx eslint --fix --rule "quotes: [error, double]" file.js

Troubleshooting:
- For glob expansion issues, use quotes: npx eslint "lib/**"
- When using STDIN with auto-fix, combine --stdin, --fix-dry-run, and a formatter: getSomeText | npx eslint --stdin --fix-dry-run --format json
- In non-flat config mode, omitting file arguments leads to an error. Always specify a directory or file.


## Information Dense Extract
npx eslint [options] [file|dir|glob]*; Options: --no-eslintrc (flag), -c/--config <String> (path), --inspect-config (flag); --env <String> (multiple, e.g., browser,node); --ext <String> (repeatable, e.g., .ts,.tsx); --global <String> (repeatable, e.g., require,exports:true); --parser <String> (default: espree); --parser-options <key:value> (multiple, e.g., ecmaVersion:7); --resolve-plugins-relative-to <String>; --plugin <String> (multiple); --rule <levn formatted String> (multiple); --rulesdir <String> (multiple, deprecated); --fix (flag); --fix-dry-run (flag); --fix-type <String> (multiple, values: problem,suggestion,layout,directive); --ignore-path <String>; --no-ignore (flag); --ignore-pattern <String> (multiple); --stdin (flag); --stdin-filename <String>; --quiet (flag); --max-warnings <Int> (e.g., 10); -o/--output-file <String>; -f/--format <String> (default: stylish); --color/--no-color (flag).

## Sanitised Extract
Table of Contents:
1. CLI Execution
   - Command: npx eslint [options] [file|dir|glob]*
   - Alternatives: yarn dlx eslint, pnpm dlx eslint, bunx eslint
   - Note: Glob parameters should be quoted to prevent shell expansion issues.
2. Multiple Value Options
   - Option: --global accepts repeated values or comma-delimited list (e.g., --global describe,it).
3. Basic Configuration Options
   - --no-eslintrc: Disables .eslintrc.* and package.json configs; equivalent flat config: --no-config-lookup.
   - -c, --config <String>: Specifies configuration file. Example: -c ~/my.eslint.config.js
   - --inspect-config: Opens the configuration inspector.
   - --env <String>: Enables environments. Examples: --env browser,node or --env browser --env node.
   - --ext <String>: Adds file extensions; repeatable for multiple extensions, e.g., --ext .ts --ext .tsx or --ext .ts,.tsx.
   - --global <String>: Defines global variables (syntax: name or name:true).
   - --parser <String>: Sets the parser; default is espree; example: --parser @typescript-eslint/parser.
   - --parser-options <key:value>: Sets parser options, e.g., ecmaVersion:7.
   - --resolve-plugins-relative-to <String>: Sets plugin resolution path.
4. Rules and Plugins Specifications
   - --plugin <String>: Loads specified plugin; can omit eslint-plugin- prefix.
   - --rule <String>: Sets rule configurations in levn format. Example: 'quotes: [error, double]'.
   - --rulesdir <String>: Specifies directory for custom rules (deprecated).
5. Fixing and Auto-Repair
   - --fix: Automatically fixes problems in files (writes changes to disk).
   - --fix-dry-run: Shows fixes without writing changes; use with STDIN for piped code.
   - --fix-type <String>: Specifies fix types: problem, suggestion, layout, directive. Multiple values allowed.
6. Ignore File Options
   - --ignore-path <String>: Uses specified .eslintignore file.
   - --no-ignore: Disables ignoring files, ignoring .eslintignore and ignore-patterns.
   - --ignore-pattern <String>: Adds ignore patterns, following .gitignore syntax.
7. STDIN Handling
   - --stdin: Reads code from standard input rather than files.
   - --stdin-filename <String>: Specifies file name for STDIN content to enable filename-based rule processing.
8. Warning and Exit Code Management
   - --quiet: Reports only errors (suppresses warnings).
   - --max-warnings <Int>: Sets maximum warning count before exiting with an error status; default is -1.
9. Output Configuration
   - -o, --output-file <String>: Writes lint report output to specified file.
   - -f, --format <String>: Specifies output format; default is stylish; supports built-in JSON and custom formatters.
   - --color / --no-color: Forces colorized output on or off.

## Original Source
ESLint Documentation
https://eslint.org/docs/latest/use/command-line-interface

## Digest of ESLINT_CLI

# ESLINT COMMAND LINE INTERFACE

This document provides the complete technical content for the ESLint CLI usage, including command syntax, options with exact parameter types, default values, examples, and configuration details.

## Run CLI

Command examples:
- npx eslint [options] [file|dir|glob]*
- yarn dlx eslint [options] [file|dir|glob]*
- pnpm dlx eslint [options] [file|dir|glob]*
- bunx eslint [options] [file|dir|glob]*

Examples:
    npx eslint file1.js file2.js
    npx eslint "lib/**"
    npx eslint .

## Pass Multiple Values to an Option

Options that support multiple values can be repeated or provided as a comma-delimited list (except for --ignore-pattern).

Examples:
    npx eslint --global describe --global it tests/
    npx eslint --global describe,it tests/

## Options

The CLI displays all options via npx eslint -h. Major option groups include:

### Basic Configuration

--no-eslintrc
   - Flag; disables use of .eslintrc.* and package.json configurations (flat config alternative: --no-config-lookup).

-c, --config <String>
   - Specifies an alternative configuration file path. Example: npx eslint -c ~/my.eslint.config.js file.js

--inspect-config
   - Opens configuration inspector (flat config mode only) without linting.

--env <String>
   - Enables specific environments. Accepts multiple arguments. Example: npx eslint --env browser,node file.js

--ext <String>
   - Specifies additional file extensions to lint. Can be repeated. Default file extensions: .js, .mjs, .cjs.

--global <String>
   - Defines global variables (read-only by default unless appended with :true). Can be used multiple times.

--parser <String>
   - Specifies the parser to use. Defaults to espree. Example: npx eslint --parser @typescript-eslint/parser file.ts

--parser-options <key:value>
   - Provides parser options. Accepts multiple key:value pairs. Example: --parser-options ecmaVersion:7

--resolve-plugins-relative-to <String>
   - Changes the directory for resolving plugins. Example: --resolve-plugins-relative-to /usr/local/lib/

### Specify Rules and Plugins

--plugin <String>
   - Specifies a plugin to load. Use the plugin name without the eslint-plugin- prefix if desired. Repeatable.

--rule <levn formatted String>
   - Applies specific rule settings. Can specify multiple rules, e.g., --rule 'quotes: [error, double]'

--rulesdir <String>
   - (Deprecated) Specifies additional directories to load custom rules from. Accepts multiple directories.

### Fix Problems

--fix
   - Automatically fixes issues in files. Changes are written to the file system.

--fix-dry-run
   - Shows fixes without saving changes. Use with --stdin for piped code and a formatter such as json.

--fix-type <String>
   - Specifies which types of fixes to apply. Allowed values: problem, suggestion, layout, directive. Can be provided multiple times or as a comma-separated list.

### Ignore Files

--ignore-path <String>
   - Specifies a custom .eslintignore file path.

--no-ignore
   - Disables all ignore mechanisms including .eslintignore, --ignore-path, and --ignore-pattern.

--ignore-pattern <String>
   - Provides patterns for files to ignore. Can be repeated. Patterns follow .gitignore syntax and should be quoted.

### Use STDIN

--stdin
   - Reads code from standard input instead of files.

--stdin-filename <String>
   - Specifies the filename for incoming STDIN content, useful for filename-dependent rules.

### Handle Warnings

--quiet
   - Only reports errors, suppressing warnings and rules set to warn.

--max-warnings <Int>
   - Sets a warning threshold; nonzero exit if warnings exceed this value. Default: -1 (no limit).

### Output Options

-o, --output-file <String>
   - Writes linting result output to the specified file.

-f, --format <String>
   - Determines the output format (default is stylish). Custom formatters (local file or npm installed) are supported.

--color, --no-color
   - Forces enabling or disabling colorized output.

## Additional Technical Details

- ESLint CLI requires Node.js. It supports multiple package managers (npm, yarn, pnpm, bun).
- Piping source code via STDIN works with --stdin; use --fix-dry-run for auto-fixing without file modification.
- Glob parameters are shell-expanded by default; to use node glob syntax, quote the parameters.
- In non-flat config mode, running ESLint without file arguments results in an error.
- The CLI can be invoked with additional debugging (--debug) and environment inspection (--env-info) flags.

Content retrieved on: 2023-10-06
Data Size: 11915586 bytes

## Attribution
- Source: ESLint Documentation
- URL: https://eslint.org/docs/latest/use/command-line-interface
- License: License: MIT License
- Crawl Date: 2025-05-01T20:18:18.196Z
- Data Size: 11915586 bytes
- Links Found: 10079

## Retrieved
2025-05-01
