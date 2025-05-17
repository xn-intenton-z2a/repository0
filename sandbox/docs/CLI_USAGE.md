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

Examples:

```bash
npm run start -- features
# CLI Command Support
```

```bash
npm run start -- mission-features
# Mission Statement
# CLI Command Support
# EJS Template Rendering
```

```bash
npm run start -- csv-import data.csv
# Outputs JSON array to stdout
```

```bash
npm run start -- csv-import data.csv --output out.json --delimiter ";" --header false
# Writes JSON array of arrays to out.json
```

```bash
npm run start -- render template.ejs
# Renders and outputs template content to stdout
```

```bash
npm run start -- render template.ejs data.json
# Renders template with JSON data interpolation to stdout
```

```bash
npm run start -- render template.ejs data.json --output out.html
# Writes rendered HTML to out.html and logs confirmation message
```