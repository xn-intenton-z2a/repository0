# CLI Features

This demo CLI tool provides several command-line options to enhance user experience.

## Usage

```bash
npm run start -- [options] [arguments]
```

## Options

- **--help**, **-h**
  Display usage information and exit.

- **--version**, **-v**
  Display the current version of the CLI (from package.json) and exit.

- **--mission**
  Display the repository mission statement and exit.

## Examples

```bash
# Show help
npm run start -- --help

# Show version
npm run start -- --version

# Show mission statement
npm run start -- --mission

# Echo arguments
npm run start -- arg1 arg2
```