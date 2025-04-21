# Usage Documentation

This document explains how to use the CLI command provided in `src/lib/main.js`. The command supports basic arithmetic operations with advanced features.

**Note:** This CLI utility supports numeric operations including addition, subtraction, multiplication, and division, as well as a feature activation command.

## Basic Usage

To perform a numeric operation, provide two numeric arguments. By default, the CLI performs addition. For example:

  node src/lib/main.js 3 4

This will output:

  Result: 7

## Operation Flag (--op)

You can specify an arithmetic operation using the `--op` (or `-o`) flag. Supported operations:
  - add: Addition (default)
  - sub: Subtraction
  - mul: Multiplication (you can also use '*' instead of 'mul')
  - div: Division

### Examples

- **Subtraction:**
    node src/lib/main.js 8 2 --op sub
    Output: Result: 6

- **Multiplication:**
    node src/lib/main.js 8 2 --op mul
    Output: Result: 16

- **Division:**
    node src/lib/main.js 8 2 --op div
    Output: Result: 4

**Note:** Division by zero is not allowed and will result in an error message.

## Help Option

For detailed usage instructions and examples, you can invoke the help flag:

  node src/lib/main.js --help
  node src/lib/main.js help

The help message displays usage instructions, supported operations, and examples.

## Feature Command

A special feature command exists. Running:

  node src/lib/main.js ${featureName}

will activate the '${featureName}' feature by outputting:

  Feature ${featureName} activated

## Argument Validation

- The CLI requires exactly two numeric arguments if not using the feature command.
- If fewer than two arguments are provided, or if any argument is non-numeric, an error message and help instructions will be displayed.

For more details on usage, refer to this documentation.
