# CLI Command Support

## Help

CLI Behavior

Display usage information and list available commands.

Implementation

Function showHelp prints the help text in main.js.

Testing

Covered by help-fallback.test.js.

## Mission

CLI Behavior

Print the mission statement from MISSION.md or error if missing.

Implementation

Function showMission reads and logs MISSION.md in main.js.

Testing

Covered by mission.test.js.

## Version

CLI Behavior

Show the current version from package.json.

Implementation

Function showVersion reads package.json and logs version in main.js.

Testing

Covered by tests/unit/main.test.js (process exit without error).

## Echo

CLI Behavior

Echo provided arguments joined by spaces.

Implementation

doEcho in main.js logs joined args.

Testing

Basic echo tests in unit tests.

## Features

CLI Behavior

List headings of Markdown files in sandbox/features. With --validate-mission, list only docs without mission references and fail on violations.

Implementation

showFeatures in main.js reads feature docs, filters by flags, and logs headings.

Testing

Covered by sandbox/tests/features.test.js.

## Mission-Features

CLI Behavior

Print mission statement then available feature headings.

Implementation

Combines showMission and showFeatures in main.js under mission-features.

Testing

Covered by sandbox/tests/mission-features.test.js.

## Convert

CLI Behavior

Convert between .env, JSON, and YAML formats with flags --to-json, --to-env, --to-yaml; optional --output file.

Implementation

doConvert in main.js parses input by extension, serializes output, and writes to stdout or file.

Testing

Covered by sandbox/tests/convert.test.js.

## Replace / Text-Replace

CLI Behavior

Perform search-and-replace in text files. Literal replacement of first match or all matches with --all. Regex replacement with --regex and optional --flags; default global regex when no flags.

Implementation

doTextReplace in main.js reads file, constructs regex or performs literal replace, and writes output.

Testing

Covered by sandbox/tests/text-replace.test.js.

## Validate

CLI Behavior

Validate JSON syntax and optionally a JSON Schema (Draft-07) with --schema; optional --output file for results.

Implementation

doValidateCommand in main.js reads JSON, compiles schema with AJV, collects errors, and writes messages.

Testing

Covered by sandbox/tests/validate.test.js.

## Documentation

Update README.md and sandbox/docs/CLI_USAGE.md to include usage and examples for all commands listed above.