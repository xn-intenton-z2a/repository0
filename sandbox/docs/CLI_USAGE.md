# CLI Usage Instructions

The CLI tool is executed using the following command:

```
npm run start
```

This command runs the `src/lib/main.js` script. The script processes any additional command-line arguments
passed to it and logs them in a JSON formatted string. For example, if you run:

```
npm run start -- hello world
```

The expected output will be:

```
Run with: ["hello", "world"]
```

## How It Works

- The script extracts CLI arguments by slicing `process.argv` to remove the node executable and the script path.
- The extracted arguments are passed to the `main` function, which logs them in a clear, JSON formatted manner.
- The code has been refactored to enhance readability and maintainability, following Clean Code and SOLID principles.

## Testing

Unit tests for the CLI functionality are located in `tests/unit/main.test.js`. These tests simulate various CLI scenarios by:

- Verifying that no arguments produce an empty array output.
- Checking that multiple arguments are correctly logged in JSON format.
- Confirming that the script terminates without error.

Review the source code and tests for more detailed insights into the implementation.
