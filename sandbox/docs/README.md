# repository0

repository0 is a CLI demo of agentic workflows powered by intentïon agentic-lib, supporting a set of simple commands for interactive use.

## Features

- `--help`: Show help message with available options and usage examples.
- `--mission`: Print the repository mission statement.
- `--version`: Print the package version.
- Argument echo: Echo provided arguments when no flags are used.

## Links

- [Mission Statement](../../MISSION.md)
- [Contributing Guidelines](../../CONTRIBUTING.md)
- [License](../../LICENSE.md)
- [agentic-lib](https://github.com/xn-intenton-z2a/agentic-lib)

## Getting Started

```bash
npm install
npm test
npm run start -- [--help|--mission|--version] [args]
```

## Usage Examples

### Display Help

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

Examples:
  npm run start -- --help
  npm run start -- --mission
  npm run start -- foo bar
```

### Display Mission

```bash
npm run start -- --mission
```

Output:

```
# Mission Statement

repository0 is a repository template that showcases the GitHub workflows imported from intentïon agentic-lib. Its
primary purpose is to demonstrate these automated CI/CD workflows and provide a basis for further development.
```

### Display Version

```bash
npm run start -- --version
```

Output:

```
2.1.0-0
```

### Echo Arguments

```bash
npm run start -- foo bar
```

Output:

```
Run with: ["foo","bar"]
```