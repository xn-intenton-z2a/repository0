# CLI UTILITY Feature

## Overview
This feature enhances the repository's command-line interface by merging built-in help and diagnostics functionality. The CLI will now correctly respond to both "help" and "diagnostics" arguments. The help command will provide usage instructions for available CLI commands, while the diagnostics command will output system information such as the Node.js version and other relevant runtime details. This update is a consolidation of previous CLI help functions and a new diagnostics capability, ensuring that users get a handy and informative command-line experience.

## Implementation
- Update the main function in src/lib/main.js to inspect the input arguments.
  - If the argument is "help", output a formatted help message detailing available commands such as start, version, diagnostics, update, and any other CLI actions.
  - If the argument is "diagnostics", the CLI should output key runtime diagnostics (for example, process version, environment variables of interest, etc.).
- Extend tests in tests/unit/main.test.js to simulate passing the "help" and "diagnostics" arguments and checking that the expected output is produced without errors.
- Update the README.md to include a detailed CLI section that documents the new help and diagnostics commands, alongside usage examples.
- Adjust the dependencies file if needed to support any new diagnostic libraries (if any) though core functionality may be achieved using native Node.js capabilities.

## Impact
- Improving user understanding with clear CLI instructions.
- Providing immediate runtime diagnostics to assist in troubleshooting.
- Consolidating CLI features to reduce fragmentation and ensure adherence to the repository's mission, while minimizing maintenance overhead.
