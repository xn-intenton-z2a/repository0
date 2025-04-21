# Usage Documentation

This document explains how to use the CLI command provided in `src/lib/main.js`. The command supports various options.

## Basic Usage

Run the CLI with arguments:

  node src/lib/main.js arg1 arg2

This will output the arguments passed in a JSON formatted string.

## Help Option

For detailed usage instructions, you can use the help flag as follows:

  node src/lib/main.js --help
  node src/lib/main.js help

When invoked with the help flag, the CLI will display a message that includes:

- **Usage Instructions**: How to run the command with available options and arguments.
- **Feature Description**: Details about the '${featureName}' feature.
- **Options**: A list of available options with descriptions.
- **Examples**: Example command invocations.

For more details, please refer to this documentation.
