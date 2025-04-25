# Overview
This feature enhances the CLI experience by providing a helpful usage message when the user runs the command without any arguments or with the keyword help. The help message will list the available commands and provide guidance on how to use the repository.

# Implementation Details
The main source file (src/lib/main.js) will be updated to check if no arguments are provided or if the first argument is 'help'. In that case, it will output a clear usage message. Otherwise, it will continue with the existing behavior of logging the provided arguments.

The following changes will be made:
- In src/lib/main.js, update the main function to conditionally display the help message.
- In tests/unit/main.test.js, add a test case to verify that running the CLI without arguments outputs the help message without error.
- Update the README.md to include a section about the usage message and instructions for new users, ensuring that basic usage scenarios are documented.

# Tests
The test file (tests/unit/main.test.js) will include an additional test to simulate calling the main function with no parameters and verifying that the help message is printed. This ensures that the functionality does not break during future updates.

# Dependencies
No additional dependencies are required for this feature as it utilizes existing libraries and Node.js features.

# Impact
By adding this feature, the repository becomes more user-friendly for new users and developers. This aligns with the mission of providing a clear and usable template for automated workflows and CLI utilities.
