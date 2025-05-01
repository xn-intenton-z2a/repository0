# Overview
This feature enhances the main command line interface by adding basic argument parsing. When run, the program will now support a help flag that displays usage instructions and a version flag to show the current version from package.json.

# Implementation
The source file (src/lib/main.js) will be updated to inspect the arguments passed to the process. If the argument 'help' is detected, the program will output a help message describing available options. If 'version' is provided, it will read and display the version from package.json. Otherwise, it continues to display a formatted view of the provided arguments.

# Testing
Unit tests in tests/unit/main.test.js will be updated to check the behavior for different arguments: no argument, help, and version. These tests ensure that the proper messages are being output without error.

# Documentation
The README.md will be updated to include instructions on how to use the new command line arguments. This includes examples of invoking the help and version commands and the expected output.

# Dependencies
No additional dependencies are required. All enhancements will be implemented using standard Node.js modules.
