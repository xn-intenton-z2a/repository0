# CLI Sandbox CLI Usage

This CLI provides a set of utility commands to demonstrate agentic workflow capabilities and basic file processing operations from the terminal.

## Prerequisites

- Node.js ≥ 20
- Dependencies installed via `npm install`

## Usage and Examples

Invoke the CLI via npm:

```bash
npm run start -- <command> [options]
```

### help
Display a summary of available commands.

```bash
npm run start -- help
```

### mission
Print the mission statement from `MISSION.md`.

```bash
npm run start -- mission
```

### version
Show the current package version from `package.json`.

```bash
npm run start -- version
```

### echo
Echo the provided arguments.

```bash
npm run start -- echo Hello World
```

### features
List headings of Markdown files in `sandbox/features/`.

```bash
npm run start -- features
```

### mission-features
Print the mission statement and then list available features.

```bash
npm run start -- mission-features
```

### csv-import
Import a CSV file and output a JSON array.

```bash
npm run start -- csv-import data.csv
```

With options:
```bash
npm run start -- csv-import data.csv --output out.json --delimiter ";" --header false
```

### render
Render an EJS template with optional JSON data and output to stdout or file.

```bash
npm run start -- render template.ejs [data.json]
```

Write to a file:
```bash
npm run start -- render template.ejs data.json --output out.html
```

### replace (alias: text-replace)
Perform search-and-replace on a text file (literal or regex).

```bash
npm run start -- replace file.txt --search foo --replace bar
```

Regex replace with flags:
```bash
npm run start -- replace file.txt --search "^foo" --replace baz --regex --flags "gi" --output out.txt
```

### convert
Convert between `.env`, JSON, and YAML formats.

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

With an output file:
```bash
npm run start -- convert file.yaml --output out.json
```

## Links

- [Mission Statement](../../MISSION.md)
- [Contributing Guide](../../CONTRIBUTING.md)
- [License](../../LICENSE.md)
- [agentic-lib GitHub Repository](https://github.com/xn-intenton-z2a/agentic-lib)
