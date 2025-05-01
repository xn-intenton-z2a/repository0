# CLI Usage Guide

The application now supports enhanced CLI argument parsing using the ARG_PARSER feature. Below are the details:

## Usage

To run the application, use the following command:

```
npm run start -- [options]
```

The application processes the arguments passed after `--` and supports the following options:

- `--help` or `-h`: Displays this help message and exits.
- `--key=value`: Sets a key to a specified value. For example, `--mode=production` will set the option `mode` to `production`.
- `--flag`: Sets a boolean flag. For example, `--verbose` will set the flag `verbose` to true.

Any arguments that do not match these patterns are collected as positional arguments and can be accessed through the `others` array.

## Examples

1. **Display Help**

```
npm run start -- --help
```

This command will display the help message and exit.

2. **Set Options and Flags**

```
npm run start -- --mode=production --verbose
```

This command parses the `mode` option with the value `production` and sets the `verbose` flag to true.

3. **Positional Arguments**

```
npm run start -- input.txt output.txt
```

This command will pass `input.txt` and `output.txt` as positional arguments, which can be accessed in the `others` array.
