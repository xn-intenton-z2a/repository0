# CORE CLI Feature Update

## Overview
This update enhances the core CLI functionality by integrating an update command. In addition to the existing commands (version, diagnostics, and help), the CLI now supports the update command. When a user invokes the update command, the CLI outputs "No update available" and exits. This addition improves the CLI by providing a standard check-update mechanism in line with the repository template's goal of offering handy utilities.

## Source Code Changes
- In src/lib/main.js, add a new condition to check if the first argument is "update". If true, the program will output "No update available" and exit early. This condition should align with the structure used for existing commands (version, diagnostics, and help) to maintain consistency in command handling and output formatting.

## Testing
- Update tests in tests/unit/main.test.js by adding a new test case for the update command. The new test should call main(["update"]) and verify that the output is exactly "No update available". This ensures that the new command is functional and meets the expected behavior.

## Documentation
- Update the README.md file and the docs/USAGE.md file to include details about the new update command. The documentation should explain:
  - How to invoke the update command using the CLI (e.g., node src/lib/main.js update)
  - The existence of the npm script (check-update) which maps to "node src/lib/main.js update"
  - The expected output: "No update available"

## Dependencies and Scripts
- In package.json, ensure that the check-update script is correctly mapped to "node src/lib/main.js update". No new dependencies should be added, and the changes focus on enhancing functionality within the existing framework.

## Summary
This CORE CLI update adds a non-disruptive, high-impact feature that addresses the user need of checking for updates. By expanding the CLI commands to include update, we provide a more complete CLI tool while remaining consistent with the repository's mission to integrate automated workflows and deliver a robust and practical template.