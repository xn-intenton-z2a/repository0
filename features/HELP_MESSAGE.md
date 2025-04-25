# Overview
This update refines the command-line help feature to not only provide a usage message when no arguments or the 'help' keyword is passed, but also to support additional commands such as 'version' and 'diagnostics'. The aim is to make the CLI more self-explanatory and in line with the repository mission of delivering handy Node.js CLI utilities.

# Implementation
- In src/lib/main.js, update the main function so that:
  - When no arguments or 'help' is provided, a detailed usage message is printed covering available commands.
  - When the argument 'version' is provided, the application reads the version field from package.json and outputs the current version.
  - When 'diagnostics' is provided, the CLI outputs diagnostic information such as environment details (e.g., Node version) along with a brief status summary.
- Modify the logic so that all recognized flags ('help', 'version', 'diagnostics', and an existing update trigger) are handled before falling back to the default argument log.

# Tests
- Update tests/unit/main.test.js to include new test cases that simulate the CLI being called with no arguments, with 'help', with 'version', and with 'diagnostics'.
- Verify that the help message is correctly printed, the version number matches the package.json value, and that diagnostics output is produced without errors.

# Documentation
- Amend README.md to add a section documenting the enhanced CLI usage. This section should clearly describe the functions of the 'help', 'version', and 'diagnostics' commands and provide instructions for local testing as well as CI/CD invocation.

# Impact
- New and existing users will have immediate access to guidance on using the repository through the CLI. The added version and diagnostics options help ensure that users and automated workflows can quickly determine the status and configuration of the repository, promoting reliability and transparency.
