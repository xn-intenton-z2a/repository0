# Overview
This feature implements and refines the handling of the --version and --diagnostics commands for the CLI. When a user provides the --version flag, the CLI reads the version from the dependencies file (package.json) and outputs it along with a timestamp. When --diagnostics is provided, the CLI outputs detailed diagnostic information including Node.js version and other relevant environment details.

# Implementation
In the source file (src/lib/main.js), update the main() function to:
- Detect if the provided arguments include "--version". If so, read the version field from package.json and print it along with the current timestamp.
- Detect if the arguments include "--diagnostics". If so, output a diagnostic report that includes the Node.js version (from process.versions.node) and other environment details such as process.platform.
- Retain and integrate the existing help message functionality so that if no arguments or the "--help" flag is provided, the dynamic help message is displayed.

Update the CLI entry in package.json scripts if necessary to ensure that the version and diagnostics commands trigger the new logic.

# Tests
In tests/unit/main.test.js, add test cases to:
- Verify that when the CLI is called with "--version", the output contains the version number (matching package.json) and a valid timestamp.
- Verify that when the CLI is called with "--diagnostics", the output includes diagnostic details such as the Node.js version and the platform.
These tests ensure that the new commands function correctly and that the extension is covered by the unit tests.

# Documentation
Update README.md and docs/USAGE.md to include sections on the new --version and --diagnostics commands. The documentation should describe the expected output for these commands and provide examples of how users can invoke them.

# Impact
This enhancement improves the usability and transparency of the CLI. Users and automation workflows can now quickly check the software version and diagnose the runtime environment, ensuring smoother integrations and easier troubleshooting.