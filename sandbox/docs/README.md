# CLI Sandbox Tool

[MISSION.md](../../MISSION.md) | [CONTRIBUTING.md](../../CONTRIBUTING.md) | [LICENSE.md](../../LICENSE.md)

## Overview

This repository provides a CLI sandbox tool implemented in `sandbox/source/main.js` for commands such as `help`, `mission`, `version`, `echo`, and more.

## What’s Inside

- **CLI entrypoint:** `sandbox/source/main.js`
- **Feature documentation:** files under `sandbox/features/`
- **Tests:** files under `sandbox/tests/` and `tests/unit/`
- **Additional docs:** `sandbox/docs/CLI_USAGE.md`

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

## Commands

**help**

Display help message.

Example:  
```bash
npm run start -- help
```

**mission**

Print the mission statement.

Example:  
```bash
npm run start -- mission
```

**version**

Print the current version.

Example:  
```bash
npm run start -- version
```

**echo**

Echo the provided arguments.

Example:  
```bash
npm run start -- echo Hello World
```

**features [--validate-mission]**

List feature document headings. With `--validate-mission`, report and fail on any mission references in feature docs (exit code 1).

Example:  
```bash
npm run start -- features --validate-mission
```

**mission-features**

Print mission then list features.

Example:  
```bash
npm run start -- mission-features
```

**csv-import**

Import a CSV file and output a JSON array.

Example:  
```bash
npm run start -- csv-import data.csv
```

**render**

Render an EJS template with optional JSON data.

Example:  
```bash
npm run start -- render template.ejs data.json
```

**replace / text-replace**

Search-and-replace in text files (literal or regex).

Example:  
```bash
npm run start -- replace file.txt --search foo --replace bar --all
```

**convert**

Convert between `.env`, JSON, and YAML formats.

Example:  
```bash
npm run start -- convert config.env --to-json
```

**validate**

Validate JSON syntax and optionally against a schema.

Example:  
```bash
npm run start -- validate data.json --schema schema.json
```

**markdown**

Convert a Markdown file to HTML.

Example:  
```bash
npm run start -- markdown file.md --output file.html
```

**import-data**

Import structured data into a SQLite database.

Example:  
```bash
npm run start -- import-data data.csv --db my.db --table users
```
