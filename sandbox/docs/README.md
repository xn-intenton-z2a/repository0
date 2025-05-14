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