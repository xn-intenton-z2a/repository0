# CLI Sandbox Usage

This repository provides a CLI demo showcasing a variety of utility commands implemented in `sandbox/source/main.js`. It demonstrates agentic workflow capabilities and provides basic file processing and conversion operations from the terminal.

## Overview

Available commands:

- **help**               Display this help message
- **mission**            Print the mission statement
- **version**            Print the current package version
- **echo**               Echo the provided arguments
- **features**           List available feature documents
- **mission-features**   Print the mission statement and list available features
- **csv-import**         Import a CSV file and output a JSON array
- **render**             Render an EJS template with optional JSON data and output to stdout or file
- **replace**, **text-replace**
                        Perform search-and-replace on a text file
- **convert**            Convert between .env, JSON, and YAML formats

## What’s Inside

- **sandbox/source/main.js**  — CLI implementation using `minimist` and built-in libraries
- **sandbox/tests/**          — Vitest tests covering each command and edge cases
- **sandbox/docs/**           — Additional CLI usage documentation
- **sandbox/features/**       — Feature documents with headings and descriptions
- **package.json**            — Dependencies, scripts, and configuration

## Usage

Invoke the CLI via npm:

```bash
npm run start -- <command> [options]
```

### Examples

#### Display help
```bash
npm run start -- help
```

#### Print mission statement
```bash
npm run start -- mission
```

#### Show current version
```bash
npm run start -- version
```

#### Echo arguments
```bash
npm run start -- echo Hello World
```

#### List feature documents
```bash
npm run start -- features
```

#### Mission and features
```bash
npm run start -- mission-features
```

#### CSV import (stdout)
```bash
npm run start -- csv-import data.csv
```

CSV import with options:
```bash
npm run start -- csv-import data.csv --output out.json --delimiter ";" --header false
```

#### Render EJS template
```bash
npm run start -- render template.ejs [data.json]
```

Render with output file:
```bash
npm run start -- render template.ejs data.json --output out.html
```

#### Text replace
```bash
npm run start -- replace file.txt --search foo --replace bar
```

Regular-expression replace:
```bash
npm run start -- replace file.txt --search "^foo" --replace baz --regex --flags "gi" --output out.txt
```

#### Convert formats
```bash
npm run start -- convert file.env
```

JSON to .env:
```bash
npm run start -- convert file.json --to-env
```

JSON to YAML:
```bash
npm run start -- convert file.json --to-yaml
```

Convert with output file:
```bash
npm run start -- convert file.yaml --output out.json
```

## Testing

Run the full test suite:

```bash
npm test
```

## Resources & Links

- [Mission Statement](../../MISSION.md)
- [Contributing Guide](../../CONTRIBUTING.md)
- [License](../../LICENSE.md)
- [agentic-lib GitHub Repository](https://github.com/xn-intenton-z2a/agentic-lib)
