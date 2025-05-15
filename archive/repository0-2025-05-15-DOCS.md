sandbox/docs/USAGE.md
# sandbox/docs/USAGE.md
# CLI Usage

This repository provides a command-line interface (CLI) demo powered by intentïon agentic-lib with options to display
the mission statement, show the version, display help, or echo arguments.

## Display Mission Statement

Invoke the CLI with the `--mission` flag:

```bash
npm run start -- --mission
```

Output:

```
# Mission Statement

repository0 is a repository template that showcases the GitHub workflows imported from intentïon `agentic-lib`. Its
primary purpose is to demonstrate these automated CI/CD workflows and provide a basis for further development.
```

### Error Case

```bash
npm run start -- --mission
```

Output (when mission file is missing or unreadable):

```
Error reading mission file: ENOENT: no such file or directory, open 'MISSION.md'
```

## Display Version

Invoke the CLI with the `--version` flag:

```bash
npm run start -- --version
```

Output:

```
2.1.0-0
```

## Display License

Invoke the CLI with the `--license` flag:

```bash
npm run start -- --license
```

Output (when license is set):

```
MIT
```

Output (when license is missing or empty):

```
No license specified in package.json.
```

## Default Behavior

Without any flags, the CLI will echo the provided arguments:

```bash
npm run start -- foo bar
```

Output:

```
Run with: ["foo","bar"]
```

## Help

Invoke the CLI with the `--help` flag:

```bash
npm run start -- --help
```

Output:

```
repository0: A CLI demo of our agentic workflows.

Usage: sandbox/source/main.js [options] [arguments]

Options:
  --help      Show this help message
  --mission   Print the repository mission statement
  --version   Print the package version
  --license   Print the package license

Examples:
  npm run start -- --help
  npm run start -- --mission
  npm run start -- --license
  npm run start -- foo bar
```
sandbox/docs/README.md
# sandbox/docs/README.md
# repository0

A CLI demo powered by intentïon agentic-lib.

## Overview

`repository0` is a command-line interface (CLI) demonstration harness built on intentïon agentic-lib. It provides basic commands to display the project mission, version, license, help information, or echo provided arguments.

## Source Code

The main CLI implementation is located at:

```
sandbox/source/main.js
```

## Features

- `--help`      Show help message with usage and examples
- `--mission`   Print the repository mission statement
- `--version`   Print the package version
- `--license`   Print the package license
- Argument echo  Echo provided arguments when no flags are used

## Links

- [Mission Statement](../../MISSION.md)
- [Contributing Guidelines](../../CONTRIBUTING.md)
- [License](../../LICENSE.md)
- [agentic-lib](https://github.com/xn-intenton-z2a/agentic-lib)

## Getting Started

Install dependencies, run tests, and start the CLI:

```bash
npm install
npm test
npm run start -- [options] [args]
```

## Usage Examples

### Display Help

```bash
npm run start -- --help
```

### Display Mission

```bash
npm run start -- --mission
```

Outputs the mission statement:

```
# Mission Statement

repository0 is a repository template that showcases the GitHub workflows imported from intentïon `agentic-lib`. Its
primary purpose is to demonstrate these automated CI/CD workflows and provide a basis for further development.
```

Error Case (when mission file is missing or unreadable):

```
Error reading mission file: <error message>
```

### Display Version

```bash
npm run start -- --version
```

### Display License

```bash
npm run start -- --license
```

### Echo Arguments

```bash
npm run start -- foo bar
```

Outputs the provided arguments as an array:

```
Run with: ["foo","bar"]
```
