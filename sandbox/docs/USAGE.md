# CLI Usage Instructions

This application supports command-line flags to assist users in interacting with the tool.

## Accepted Flags

- **--help**
  - Displays this help message with usage instructions and available options.

- **--version**
  - Displays the current version of the application as specified in package.json.

## Usage Examples

Display the help message:

  node src/lib/main.js --help

Display the version number:

  node src/lib/main.js --version

Handling Unknown Flags

- If an unknown flag (e.g. `--foo`) is provided, the application will output an error message indicating that the flag is unrecognized.

Ensure you use the supported flags to achieve the desired output.
