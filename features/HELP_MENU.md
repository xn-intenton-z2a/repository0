# HELP_MENU Feature Specification

## Overview
This feature introduces a command-line help functionality to assist users in understanding available usage options. When a user runs the CLI with either `help` or `--help` as an argument, a detailed help message will be displayed covering the available commands and usage examples. This feature improves the usability of the repository by providing ready documentation from the CLI itself.

## Implementation Details
1. **Source File Update (src/lib/main.js):**
   - Add a condition to check if the `args` array contains `help` or `--help`.
   - If so, output a structured help message that includes the available commands (e.g., run, diagnostics, version, check-update) and a short description of each.
   - Ensure that the normal functionality of the repository remains intact if help is not requested.

2. **Test File Update (tests/unit/main.test.js):**
   - Add a new test to check that invoking the CLI with `help` or `--help` produces output containing expected help text.
   - Maintain existing tests to ensure continuing functionality of `main`.

3. **README File Update (README.md):**
   - Update the README to include a new section under "Getting Started" or "CLI Usage" documenting the help command.
   - Provide usage examples for invoking the help command.

4. **Dependencies File (package.json):**
   - No changes to dependencies are required; the feature uses standard Node.js functionality.

## Usage Example
```bash
# Display help information
node src/lib/main.js help
node src/lib/main.js --help
```

## Benefits
- Enhances user experience by providing self-contained documentation
- Reduces the need to search externally for usage instructions
- Assists new users in quickly understanding the CLI commands available in the repository

## Testing
- Ensure that executing the help command returns consistent and descriptive help text.
- Validate that other arguments continue to function as expected without interference.

## Rollout
This feature can be added as a minor patch update to improve the CLI interface. The commit should include detailed notes on the added help functionality and updated documentation.