# CLI Parser Functionality

This feature enhances the main CLI tool by adding built-in argument parsing functionality which improves usability for end users.

# Usage and Help Handling

- The main script now recognizes the '--help' flag and displays a usage message to guide the user.
- When the '--version' flag is provided, the script will output the current version from package.json.
- For any other command line arguments, the tool outputs a message detailing the received arguments.

# Implementation Details

- The main function in src/lib/main.js has been updated to handle argument parsing before executing core functionality.
- A help message is formatted and printed when '--help' is detected, outlining usage, available options and examples.
- When '--version' is provided, the script reads the version from package.json and outputs it.
- The tool maintains default behavior if no recognized flag is found, ensuring backwards compatibility.

# Testing and Documentation

- Unit tests in tests/unit/main.test.js have been updated to include checks for the '--help' and '--version' outputs.
- The README.md has been revised to include instructions and examples on how to use the new CLI options.
- This change adheres to the mission of providing a handy CLI utility and is consistent with the repository's purpose as a template for automated workflows.
