# Usage Documentation

This document explains how to use the CLI command provided in `src/lib/main.js`. The command supports various options.

## Basic Usage

To perform a numeric addition, provide two numeric arguments. For example:

  node src/lib/main.js 3 4

This will output the sum of the two numbers, for example:

  Result: 7

## Help Option

For detailed usage instructions, you can use the help flag as follows:

  node src/lib/main.js --help
  node src/lib/main.js help

When invoked with the help flag, the CLI will display a message that includes:

- **Usage Instructions**: How to run the command with available options and arguments.
- **Feature Description**: Details about the 'CLI Utility' feature.
- **Options**: A list of available options with descriptions.
- **Examples**: Example command invocations.

## Feature Command

A new CLI command has been added to activate a specific feature. To use this command, run:

  node src/lib/main.js ${featureName}

This command will activate the '${featureName}' feature by outputting:

  Feature ${featureName} activated

This is useful for triggering feature-specific behaviors without engaging the numeric addition functionality.

## Argument Validation

The CLI command requires two numeric arguments for addition. If fewer than two arguments are provided, or if any argument is not a valid number, the CLI will display an error message along with the usage instructions and exit gracefully. For example:

- Valid Input:
    node src/lib/main.js 3 4

- Invalid Input (insufficient arguments):
    node src/lib/main.js 3

- Invalid Input (non-numeric value):
    node src/lib/main.js a 4

For more details, please refer to this documentation.
