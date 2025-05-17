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

- **--env**
  Load environment variables from a `.env` file and print each `KEY=VALUE` pair sorted alphabetically. Exit with status `0` on success or non-zero on failure.

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

# Show environment variables from .env
npm run start -- --env
```

```bash
# Sample output (for .env containing A=1 and B=2):
A=1
B=2
```
