# CSV Input/Output

## CLI Behavior

Introduce a unified `csv` command with the following subcommands and options:

- `csv convert <inputFile>`
  - Convert a CSV file to JSON array.
  - Flags: `--delimiter <char>`, `--header <true|false>` (default true), `--output <file>`.

- `csv export <inputFile>`
  - Convert a JSON array file to CSV.
  - Flags: `--delimiter <char>`, `--output <file>`.

- `csv stream <inputFile>`
  - Stream-process large CSV files, emitting JSON arrays in chunks.
  - Flags: `--delimiter <char>`, `--header <true|false>`, `--chunk-size <number>` (default 1000), `--progress`, `--output <file>`.

- `csv db-import <inputFile> --db <dbFile>`
  - Import CSV rows into a SQLite database table.
  - Flags: `--table <name>` (default data), `--delimiter <char>`, `--header <true|false>`, `--overwrite`, `--chunk-size <number>` (default 1000).

# File Modifications

- **sandbox/source/main.js**
  - Add a new `csv` case in the CLI switch to delegate to `doCsvCommand(argv)`.
  - Implement `async function doCsvCommand(argv)` that inspects `argv._[1]` for the subcommand and calls:
    - `doCsvConvert(argv)`
    - `doCsvExport(argv)`
    - `doCsvStream(argv)`
    - `doCsvDbImport(argv)`
  - Update or reuse the existing CSV parser for in-memory convert and export.
  - Use `fs.createReadStream` and the `csv-parse` streaming API for the `stream` subcommand, writing JSON chunks to stdout or file and emitting progress to stderr when requested.
  - Import and use `better-sqlite3` for the `db-import` subcommand, handling table creation, optional overwrite, batch inserts in transactions, and error handling.

- **sandbox/tests/csv-io.test.js**
  - Create feature-level tests covering each subcommand: convert, export, stream, and db-import.
  - Verify correct JSON/CSV transformation, chunking behavior, progress output, file writes, database table creation, row counts, and error conditions.

- **README.md**
  - Add a new CLI Usage section for the `csv` command, describing each subcommand, options, and examples.

- **package.json**
  - Add `better-sqlite3` to dependencies if not already present.

# Testing

- Ensure `npm test` runs the new `sandbox/tests/csv-io.test.js` alongside existing tests.
- Test convert subcommand with and without headers and custom delimiters.
- Test export subcommand converts JSON to CSV with correct headers.
- Test stream subcommand produces multiple JSON chunks and progress stderr output.
- Test db-import subcommand creates or overwrites tables and imports data correctly in batches.
- Validate appropriate exit codes and error messages for missing files, invalid formats, or database errors.