# CLI Sandbox

Project Overview:

> CLI sandbox showcasing agentic-lib workflows and utility commands.

## What’s Inside

- **Entry point:** `sandbox/source/main.js` implements all supported CLI commands.
- **Tests:** `sandbox/tests/` contains feature-level and unit tests for each command.
- **Features:** `sandbox/features/` holds Markdown documentation outlining individual features.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the test suite:
   ```bash
   npm test
   ```
3. Invoke the CLI:
   ```bash
   npm run start -- <command> [options]
   ```

## Commands Reference

| Command            | Description                                                                      |
|--------------------|----------------------------------------------------------------------------------|
| help               | Display help message listing all commands and usage examples                     |
| mission            | Print the mission statement from `MISSION.md`                                    |
| version            | Show the current version from `package.json`                                      |
| echo               | Echo the provided arguments                                                       |
| features           | List headings of Markdown files in `sandbox/features/`                            |
| mission-features   | Print the mission statement, then list available features                         |
| csv-import         | Import a CSV file and output a JSON array                                        |
| render             | Render an EJS template with optional JSON data to stdout or file                 |
| replace / text-replace | Perform search-and-replace on a text file (literal or regex)              |
| convert            | Convert between .env, JSON, and YAML formats                                      |
| markdown           | Convert a Markdown file to HTML, optionally writing to an output file             |

## Examples

- Display help:
  ```bash
  npm run start -- help
  ```
- Show mission:
  ```bash
  npm run start -- mission
  ```
- Get version:
  ```bash
  npm run start -- version
  ```
- Echo arguments:
  ```bash
  npm run start -- echo Hello World
  ```
- List features:
  ```bash
  npm run start -- features
  ```
- CSV import with header row and custom delimiter:
  ```bash
  npm run start -- csv-import data.csv --delimiter ";" --header false --output out.json
  ```
- Render template with data file:
  ```bash
  npm run start -- render template.ejs data.json --output report.html
  ```
- Replace text using regex:
  ```bash
  npm run start -- replace file.txt --search "foo" --replace "bar" --regex --flags gi
  ```
- Convert JSON to YAML:
  ```bash
  npm run start -- convert config.json --to-yaml
  ```
- Convert Markdown to HTML (stdout):
  ```bash
  npm run start -- markdown README.md
  ```
- Convert Markdown to HTML and write to file:
  ```bash
  npm run start -- markdown README.md --output README.html
  ```

## Related Documents

- [Mission Statement](../../MISSION.md)
- [Contributing Guide](../../CONTRIBUTING.md)
- [License](../../LICENSE.md)
- [Agentic-lib Repository](https://github.com/xn-intenton-z2a/agentic-lib)
