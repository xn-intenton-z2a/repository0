# CLI Usage

This document describes the command-line interface for `repository0`.

## Commands

### --help

Displays help information, including a summary of all available commands and example invocations.

Example:
```
$ node sandbox/source/main.js --help
Usage: node main.js [options]

Options:
  --help      Show help information
  --version   Show version number
  --mission   Show mission statement

Examples:
  $ node main.js --help
  $ node main.js --version
  $ node main.js --mission

For full mission statement see MISSION.md
```

### --version

Prints the current version of the tool, as specified in `package.json`.

Example:
```
$ node sandbox/source/main.js --version
2.1.0-0
```

### --mission

Shows the first header and paragraph from the project's `MISSION.md` file.

Example:
```
$ node sandbox/source/main.js --mission
# Mission Statement

`repository0` is a repository template that showcases the GitHub workflows imported from intentïon `agentic-lib`. Its
...
```

### Default behavior

When no flags are provided, the CLI echoes all positional arguments as a JSON array:

Example:
```
$ node sandbox/source/main.js foo bar
Run with: ["foo","bar"]
```
