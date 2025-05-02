# CLI Usage Instructions

The CLI tool is executed using the following command:

```
npm run start
```

When you run the command, the script in `src/lib/main.js` processes any additional command-line arguments
using an integrated argument parser. The parser handles:

- **Long-form options:** For example, `--verbose` or `--count 3`.
- **Short-form options:** For example, `-v` (which is treated as a boolean flag).
- **Positional arguments:** Arguments that do not start with dashes are collected under the `_` key.

### Examples

1. **Long-Form Boolean Flag**

```
npm run start -- --verbose
```
*Output:* `{ "verbose": true, "_": [] }`

2. **Short-Form Boolean Flag**

```
npm run start -- -v
```
*Output:* `{ "v": true, "_": [] }`

3. **Option with Value and Positional Argument**

```
npm run start -- file.txt --count 3
```
*Output:* `{ "_": ["file.txt"], "count": "3" }`

### How It Works

- The script extracts command-line arguments by slicing `process.argv` to ignore the first two entries.
- It then calls the `parseArguments` function which:
  - Scans each argument to determine if it is an option or a positional argument.
  - For long-form options (e.g. `--option`), it checks if the following argument is a value.
  - For short-form options (e.g. `-o`), it treats each character as a separate boolean flag.
  - All non-option arguments are collected in an array under the key `_`.
- The parsed arguments are logged in a JSON formatted string.

Unit tests for this functionality are located in `tests/unit/main.test.js` and verify that the parser behaves as expected.

This ARGUMENT_PARSER feature allows for flexible command line usage and easy integration of additional options in the future.
