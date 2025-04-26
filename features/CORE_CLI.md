# CORE_CLI Feature Update with UPDATE Command

## Overview
This update enhances the CLI functionality by fully implementing the update command. In addition to the existing commands (version, diagnostics, help), the CLI now recognizes the update command. When a user invokes the update command, the application will check for this instruction and print "No update available" before exiting. This update reinforces the repository's commitment to clear and complete CLI capabilities while staying true to the automated workflow design.

## Implementation Details

### Source File (src/lib/main.js)
- Add a new branch in the command dispatcher to explicitly check for the update command. This branch should compare the input command with "update".
- If the command is "update", the branch will print "No update available" and then exit, bypassing any default behavior.

### Test File (tests/unit/main.test.js)
- Introduce a new test case that calls the main function with an array containing "update".
- Verify that the output is exactly "No update available". This ensures that the update command behaves consistently with the other supported commands.

### Documentation Updates
- Update docs/USAGE.md to include details of the update command. Document its usage (e.g., "node src/lib/main.js update" or through the npm script "npm run check-update") and state the expected output: "No update available".
- Modify the README.md to mention the inclusion of the update command as part of the CLI's functionality. This reinforces the robustness of the repository template.

### Dependencies
- Verify that package.json already includes the corresponding check-update script mapping to "node src/lib/main.js update". No additional dependency changes are needed.

## User Impact
Users benefit from a more complete CLI experience. The addition of the update command provides clear feedback regarding updates and integrates seamlessly with the repository's automated workflows, exemplifying a practical and focused approach to enhancing core functionality.
