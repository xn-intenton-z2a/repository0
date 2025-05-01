# CLI Usage Guide

This document provides instructions on how to use the refactored CLI implementation.

## Overview

The application entry point is located in `src/lib/main.js`. The CLI has been refactored for clarity and maintainability. The core improvement is the extraction of the argument parsing logic into a dedicated helper function named `parseCliArgs`.

## Running the CLI

To execute the CLI, use the following command in your terminal:

```
node src/lib/main.js [arguments]
```

For example:

```
node src/lib/main.js arg1 arg2
```

This command will output a JSON string representation of the provided arguments. For the above example, you would see:

```
Run with: ["arg1", "arg2"]
```

## Functionality Details

- **parseCliArgs(args)**: 
  - This helper function is responsible for processing the CLI arguments. Currently, it returns the arguments unchanged, but it is designed to be extended for more complex parsing logic.

- **main(args)**: 
  - This function invokes the `parseCliArgs` function, and then logs the parsed output in JSON format. It is the main entry point for the application logic.

## Testing

The unit tests located in `tests/unit/main.test.js` include:

- Tests for the `main` function to ensure it runs without error.
- Tests for the `parseCliArgs` helper to verify it handles different scenarios correctly.

## Conclusion

This refactoring improves the code quality by separating concerns – the argument parsing is now isolated from the main execution logic. This makes the code easier to maintain and extend in the future.
