# DEBUG_MODE

## Overview
This feature introduces a debug mode to the repository. When users call the main script with the --debug flag, the application will output additional diagnostic and context information to help troubleshoot issues and understand the program flow. The debug information is only activated when the flag is present, ensuring normal users are not overwhelmed with verbose output.

## Implementation
- Update the source file (src/lib/main.js) to detect the --debug flag among the command line arguments.
- When --debug is provided, print extra details such as the parsed arguments, environmental variables (if applicable), and key function calls with parameters.
- Ensure that the extra logging does not interfere with normal output and is only printed in debug mode.
- Use simple console.log statements for the debug output to keep the implementation lightweight and maintainable.

## Testing
- Update tests/unit/main.test.js to include cases where the --debug flag is passed to the main function. These tests should verify that the extra debug information is printed to the console.
- Ensure that running the script without the --debug flag produces the expected minimal output.

## Documentation
- Update README.md by adding a new section that explains the purpose and usage of the --debug flag. Include examples of running the script with and without --debug.
- Ensure the documentation is consistent with the mission statement and contributing guidelines, emphasizing that debug mode is meant for troubleshooting and understanding internal operations.
