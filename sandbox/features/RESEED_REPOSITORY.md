# Summary
This feature adds a local reseed command to refresh the repository scaffold with the latest workflow templates and baseline files maintained by agentic-lib. It ensures that key source, test, documentation, and dependency files stay in sync with upstream workflow updates.

# File Modifications
- package.json: add a new npm script named "reseed" pointing at the CLI with a --reseed flag.
- src/lib/main.js: extend the main function to detect a --reseed argument, back up current files into a .backup folder, and replace source, tests, README, and package.json using the latest templates.
- tests/unit/main.test.js: add a new unit test to simulate invocation with --reseed and assert that the CLI prints a reseed summary without throwing.
- README.md: document the reseed command under the usage section, explain prerequisites, backup behavior, and example invocation.

# CLI Usage
1. Ensure Node.js >= 20 is installed.
2. Run npm install to install dependencies.
3. Execute npm run reseed to back up current files and apply the latest baseline. The output will list each file updated and backup location.

# Testing
- Extend the vitest suite to include a test that sets process.argv to ["node","src/lib/main.js","--reseed"] and verifies console output contains "Reseeding repository with latest templates".
- Ensure existing tests pass unchanged, confirming that reseed mode does not break normal execution.