# Overview
This feature adds a built-in help command to the CLI utility in the repository.

# Details
The main entry point in the source file (src/lib/main.js) will be extended to check if the user has passed a "help" argument. When "help" is detected, the function will output usage instructions along with a brief overview of the current available CLI commands. This promotes a better user experience by clearly outlining how to interact with the repository and understand the provided functionality.

# Implementation
- Update the main function in src/lib/main.js to check if the argument "help" is passed. If so, display a formatted help message and exit gracefully.
- In the tests (tests/unit/main.test.js), add a test case that simulates passing the "help" argument and verifies that the help message is output without errors.
- Update the README.md to include a new section on CLI usage that explains the "help" command and summarizes available commands such as start, diagnostics, version, and update.
- No changes to the dependencies file are required for this feature.

# Impact
This core CLI enhancement directly supports the repository's mission to provide handy CLI utilities in Node.js, making the interface more user-friendly and self-descriptive, and thereby improving the overall developer experience.