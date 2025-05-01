# Overview
This feature enhances the command line interface functionality of the repository. It provides basic argument parsing so that users can trigger specific actions based on CLI flags. For example, when a user supplies a flag like --greet followed by a name, the tool outputs a personalized greeting message.

# Implementation
The main function in src/lib/main.js will be updated to inspect process.argv for recognized flags. The logic will check for the presence of the --greet flag and, if found, will read the subsequent argument as a user name and print "Hello, <name>!". If the flag is not present, the main function will revert to its current behavior of printing the JSON stringified arguments. The implementation should use standard JavaScript methods to parse the arguments so that no new external dependencies are required.

# Testing
The tests in tests/unit/main.test.js will be extended with new unit tests to capture console output and validate behavior. One test will simulate the execution of the command with the --greet flag and check that the output matches the expected greeting message. Additional tests will ensure that the default behavior remains intact when no flags are provided.

# Documentation
The README.md file will be updated to include a new section detailing the usage of the CLI arguments feature. This section will provide examples of how to run the command with and without the --greet flag and explain the expected outputs.

# Dependencies
No additional dependencies are needed since the feature makes use of Node's built in argument handling capabilities.
