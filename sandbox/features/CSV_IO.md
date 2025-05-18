# CSV IO and Data Import

## CLI Behavior

### csv command
- **convert <inputFile>**
  Read a CSV file and output a JSON array of records. Options: --delimiter <char> (default comma), --header <true|false> (default true), --output <file>

- **export <inputFile>**
  Read a JSON array file and output a CSV file. Options: --delimiter <char>, --output <file>

- **stream <inputFile>**
  Stream-process large CSV files, emitting JSON arrays in chunks. Options: --delimiter <char>, --header <true|false>, --chunk-size <number> (default 1000), --progress, --output <file>

- **db-import <inputFile>**
  Import CSV rows into a SQLite database table. Options: --db <dbFile> --table <name> (default data) --delimiter <char> --header <true|false> --overwrite --chunk-size <number> (default 1000) --output <file optional report>

### import-data command
Import structured data files into a SQLite database. Supports .csv, .json, .yaml, .yml, and .env formats.
- Usage: import-data <inputFile> --db <dbFile> [--table <name>] [--delimiter <char>] [--header <true|false>] [--overwrite]
- Parses the input based on extension, converts to records array, creates or replaces table, batch inserts records in a transaction, and reports insertion count.

## Implementation

- **sandbox/source/main.js**
  - Enhance doCsvCommand to dispatch db-import subcommand under csv.
  - Ensure doCsvImport (for csv-import) remains unchanged.
  - Retain doImportData for import-data command.
  - Use existing imports: csv-parse, fs/promises, js-yaml, dotenv, better-sqlite3.

## Testing

- **sandbox/tests/csv-io.test.js** covers csv convert, export, stream, and db-import under csv.
- **sandbox/tests/import-data.test.js** covers import-data scenarios: missing args, unsupported formats, CSV, JSON, YAML, ENV imports, overwrite behavior, error cases.

## Documentation

- **README.md** and **sandbox/docs/CLI_USAGE.md**:
  - Update Commands Reference to include csv db-import and import-data with usage, flags, and examples.