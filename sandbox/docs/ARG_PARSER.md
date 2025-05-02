# ARG_PARSER

The `ARG_PARSER` feature provides robust CLI argument parsing functionality.

## Features

- Recognizes flags that start with `--`.
- Supports both `--key value` and `--key=value` formats, extracting the key and associated value appropriately.
- Collects positional arguments in an array under the property `_`.
- Flags without accompanying values default to `true`.

## Implementation

The argument parser is implemented in `src/lib/main.js` as the function `parseArgs()`. It processes the CLI arguments and returns an object representing flags and positional arguments.

## Usage

### General Usage

Run the CLI with various arguments. For example:

- `node src/lib/main.js --foo bar`  
  Output: `{"foo": "bar", "_": []}`

- `node src/lib/main.js --baz=qux`  
  Output: `{"baz": "qux", "_": []}`

- `node src/lib/main.js pos1 pos2`  
  Output: `{"_": ["pos1", "pos2"]}`

- `node src/lib/main.js --flag`  
  Output: `{"flag": true, "_": []}`

### Help Option

When the `--help` flag is used, the CLI displays the following usage information:

```
Usage: node src/lib/main.js [options] [positional arguments]

Options:
  --help                  Display this help message.
  --key value             Set a key with a value.
  --key=value             Alternative syntax for setting a key-value pair.
  --flag                  Set a flag to true by default.
```

This parser ensures that users can easily understand and use the CLI tool based on the provided examples.
