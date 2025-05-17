# CLI Usage

This sandbox CLI provides a set of commands to demonstrate the agentic workflow capabilities of this repository.

## Installation

Install dependencies:
```bash
npm install
```

## Usage

Invoke the CLI with:
```bash
npm run start -- <command> [args]
```

## Commands

- **help**: Display this help message  
  Example: `npm run start -- help`
- **mission**: Print the mission statement from `MISSION.md`  
  Example: `npm run start -- mission`
- **version**: Print the current version from `package.json`  
  Example: `npm run start -- version`
- **echo**: Echo the provided arguments  
  Example: `npm run start -- echo Hello World`
- **features**: List available feature documents (`sandbox/features/`) by their primary headings  
  Example: `npm run start -- features`
- **mission-features**: Print the mission statement and list available features  
  Example: `npm run start -- mission-features`
- **csv-import**: Import a CSV file and output a JSON array. Options:  
  • `--output <file>`: Write JSON to the specified file instead of stdout  
  • `--delimiter <char>`: Use a custom field delimiter (default: `,`)  
  • `--header <true|false>`: Treat the first row as header keys (default: `true`)  
  Example: `npm run start -- csv-import data.csv --output out.json --delimiter ";" --header false`
- **render**: Render an EJS template with optional JSON data file and output to stdout or file. Options:  
  • `--output <file>`: Write rendered output to the specified file instead of stdout  
  Example: `npm run start -- render template.ejs data.json --output out.html`
- **replace**, **text-replace**: Perform search-and-replace operations on a text file. Options:  
  • `--search <pattern>` (required): The search string or regular expression source  
  • `--replace <string>` (required): The replacement string  
  • `--regex`: Treat the `search` pattern as a regular expression  
  • `--flags <flags>`: Flags for the regular expression (default: `g` when `--regex` is set)  
  • `--output <file>`: Write the result to the specified file instead of stdout  
  Example: `npm run start -- replace file.txt --search foo --replace bar --regex --flags "gi" --output out.txt`
- **convert**: Bidirectional conversion between `.env`, JSON, and YAML formats. Options:  
  • `--to-env`: Serialize input JSON to dotenv format  
  • `--to-yaml`: Serialize input JSON to YAML format  
  • `--output <file>`: Write the result to the specified file instead of stdout  
  Example: `npm run start -- convert file.env --output out.json`

## Testing

Run the test suite:
```bash
npm test
```

## Documentation

- [Mission Statement](../../MISSION.md)  
- [Contributing Guide](../../CONTRIBUTING.md)  
- [License](../../LICENSE.md)
