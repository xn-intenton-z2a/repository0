# CLI Usage

The command-line interface provides the following commands:

- **help**: Display this help message.
- **mission**: Print the mission statement from `MISSION.md`.
- **version**: Print the current version from `package.json`.
- **echo**: Echo the provided arguments.
- **features**: List all feature documents from `sandbox/features/` with their primary headings.
- **mission-features**: Print the full mission statement followed by the list of available features.
- **csv-import**: Import a CSV file and output JSON. Options:
  - `--output <file>`: Write JSON to the specified file instead of stdout.
  - `--delimiter <char>`: Use a custom field delimiter (default: `,`).
  - `--header <true|false>`: Treat the first row as header keys (default: `true`; set to `false` for array output).
- **render**: Render an EJS template with optional JSON data file and output to stdout or file. Options:
  - `--output <file>`: Write rendered output to the specified file instead of stdout.
- **replace**, **text-replace**: Perform search-and-replace operations on a text file. Options:
  - `--search <pattern>` (required): The search string or regular expression source.
  - `--replace <string>` (required): The replacement string.
  - `--regex`: Treat the `search` pattern as a regular expression.
  - `--flags <flags>`: Flags for the regular expression (default: `g` when `--regex` is set).
  - `--output <file>`: Write the result to the specified file instead of stdout.

Examples:

```bash
npm run start -- replace file.txt --search foo --replace bar
```

```bash
npm run start -- text-replace file.txt --search "\\d+" --replace "#" --regex --flags "gi"
```

```bash
npm run start -- replace file.txt --search old --replace new --output out.txt
```