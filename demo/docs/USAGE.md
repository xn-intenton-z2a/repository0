# CLI Usage

This repository template provides an enhanced command-line interface (CLI) that supports the following commands:

- **help**: Displays usage instructions including available commands and options.
- **version**: Reads the version from package.json and outputs the current version of the application.
- **echo [arguments]**: Echoes back the provided arguments.

For any unrecognized command, the CLI will display a summary of available commands along with a brief description for each.

## Examples

### Show Help

```
node src/lib/main.js help
```

_Output:_
```
Usage: <command> [options]

Available Commands:
  help      Show usage instructions
  version   Show version information
  echo      Echo the provided arguments
```

### Show Version

```
node src/lib/main.js version
```

_Output:_
(Current version as specified in package.json, e.g., "2.1.0-0")

### Echo Command

```
node src/lib/main.js echo Hello world!
```

_Output:_
```
Hello world!
```

### Unknown Command

```
node src/lib/main.js unknown
```

_Output:_
```
Unrecognized command. Available commands:
  help      Show usage instructions
  version   Show version information
  echo      Echo the provided arguments
```