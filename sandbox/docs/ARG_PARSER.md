# ARG_PARSER

The ARG_PARSER feature provides robust CLI argument parsing functionality for the repository's command-line interface.

## Features

- Detects flags starting with `--`.
- Supports both `--key value` and `--key=value` formats. Flags without accompanying values default to `true`.
- Captures positional arguments in an array under the property `_`.
- When the `--help` flag is used, displays a comprehensive usage guide and exits the process.

## Implementation

The argument parser is implemented in `src/lib/main.js` within the `parseArgs()` function. It processes CLI arguments passed to the script and constructs an object representing both flags and positional arguments.

### Parsing Logic

1. The parser iterates over each argument provided.
2. For arguments starting with `--`:
   - If the argument is `--help`, a usage guide is displayed.
   - If the argument contains `=`, it is split into a key and a value.
   - Otherwise, if the next argument is not a flag, it treats that as the value; if not, the flag defaults to `true`.
3. All arguments not beginning with `--` are collected as positional arguments under the `_` property.

## Usage Examples

### Displaying Help

```
node src/lib/main.js --help
```

This command prints the following usage guide and exits:

```
Usage: node src/lib/main.js [options] [positional arguments]
Options:
  --help                  Display this help message.
  --key value             Set a key with a value.
  --key=value             Alternative syntax for setting a key-value pair.
  --flag                  Set a flag to true by default.
```

### Parsing Key-Value Options

```
node src/lib/main.js --foo bar
```

Expected output:

```
{"foo": "bar", "_": []}
```

```
node src/lib/main.js --baz=qux
```

Expected output:

```
{"baz": "qux", "_": []}
```

### Parsing Positional Arguments

```
node src/lib/main.js pos1 pos2
```

Expected output:

```
{"_": ["pos1", "pos2"]}
```

## Conclusion

This ARG_PARSER implementation allows flexible and robust command-line argument parsing, ensuring that both flags and positional arguments are handled efficiently.