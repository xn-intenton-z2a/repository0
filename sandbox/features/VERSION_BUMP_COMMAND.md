# Version Bump Command

## Overview
Detect the bump option in CLI arguments and increment the project version in package.json. This enables users to update semantic versioning without manual edits.

## Behavior
- When invoked with --bump and a value of major, minor, or patch, the CLI reads package.json from the repository root and parses its version field.
- The specified segment of the version number is incremented, and lower segments are reset to zero when necessary (for example bump major zeroes minor and patch).
- The updated version is written back to package.json with two-space indentation.
- The CLI prints the new version string to standard output and exits with code 0 on success.
- If the bump type is invalid or any file operation fails, the CLI prints an error message to standard error and exits with code 1.

## Implementation Details
- In sandbox/source/main.js extend minimist options to include bump as a string option.
- After existing flag branches, add an else if (bump) branch that:
  - Resolves the path to package.json.
  - Uses fs.readFileSync with utf8 encoding to load content and JSON.parse to extract version.
  - Splits the version string by dot, increments the correct segment, resets lower segments, and rejoins to form newVersion.
  - Updates the parsed package object with newVersion and calls fs.writeFileSync to persist changes.
  - Calls console.log(newVersion) and process.exit(0).
  - Wraps all file and parse operations in a try catch block to handle errors.

## Tests
- Create sandbox/tests/bump.test.js with the following scenarios:
  - Valid bump types: mock fs.readFileSync returning a known version and spy fs.writeFileSync to verify the updated content, invoke main(["--bump","patch"]) and assert console.log is called with expected new version and process.exit(0).
  - Invalid bump type: invoke main(["--bump","invalid"]) and assert console.error is called with message about invalid option and process.exit(1).
  - File operation failure: mock fs.readFileSync or fs.writeFileSync to throw and assert appropriate error message and process.exit(1).

## Documentation
- Update sandbox/docs/USAGE.md and sandbox/docs/README.md to include a section for --bump <major|minor|patch> with example usage:
  npm run start -- --bump minor
  Example output: 2.1.0

## Compatibility
- No new dependencies required; uses existing fs, path, and minimist modules.
- Aligns with the existing CLI structure and exit conventions.