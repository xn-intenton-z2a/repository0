# CORE_CLI Feature Update with UPDATE Command

## Overview
This update enhances the CLI by fully implementing the update command. In addition to the existing commands (version, diagnostics, help), the CLI now recognizes the update command. When a user invokes the update command, the application will clearly indicate that there is no update available by printing "No update available".

## Implementation Details
- In src/lib/main.js, add a new branch in the command dispatcher that checks if the command equals update. If true, the code should print "No update available" and exit. This branch should be placed above the default help message branch so that valid commands are captured correctly.

- In tests/unit/main.test.js, add a new test case which calls main with an array containing "update" and validates that the output is exactly "No update available". This will ensure that the update command behaves consistently like the other supported commands.

- Update documentation:
  - In docs/USAGE.md, amend the CLI command list to include the update command. Document its usage via the command line (e.g. "node src/lib/main.js update" or through the npm script "npm run check-update") and describe that the expected output is "No update available".
  - In README.md, ensure there is a mention of the update command as part of the CLI, reinforcing the repository template's robust functionality.

- Verify and confirm that package.json already includes the check-update script which maps to "node src/lib/main.js update".

## User Impact
Users benefit from a more comprehensive CLI experience. The addition of the update command provides clear feedback regarding updates while maintaining the simple and automated workflows that define this repository template.
