# CSV to SQLite Importer

## CLI Behavior

Add a new command `csv-import-db` to import CSV data directly into a SQLite database table. The command accepts the path to a CSV file, the path to a SQLite database file, and optional flags to control table creation, delimiter, and header usage.

Usage:

npm run start -- csv-import-db <csvFile> --db <dbFile> [--table <tableName>] [--delimiter <char>] [--header <true|false>] [--overwrite] [--chunk-size <number>]

Options:
- `csvFile`: Path to the input CSV file.
- `--db`: Path to the SQLite database file (creates if not exists).
- `--table`: Name of the table to import into (defaults to `data`).
- `--delimiter`: Single character used to split fields (default comma).
- `--header`: Interpret first row as column names (default true).
- `--overwrite`: Drop existing table before import if it exists.
- `--chunk-size`: Number of rows to insert per transaction batch (default 1000).

## File Modifications

- **sandbox/source/main.js**: Import the `better-sqlite3` library. Add a `csv-import-db` case in the CLI switch to call `doCsvImportDb(argv)`. Implement `async function doCsvImportDb(argv)` that:
  - Opens or creates the SQLite database using better-sqlite3.
  - Determines table name, delimiter, and header flag from `argv`.
  - Reads the CSV file as a stream or in-memory depending on file size.
  - If `--overwrite` is set, drop the table if it exists.
  - If header row is used, create a table with columns matching header names. Otherwise create generic column names (col1, col2, ...).
  - Parse CSV rows and insert them in batches of size `--chunk-size` within transactions for performance.
  - Log progress if `--chunk-size` is large and print a summary on completion.
  - Handle errors for file I/O, CSV parsing, and database operations with clear messages and exit codes.

- **sandbox/tests/csv-import-db.test.js**: Create feature-level tests that:
  - Write a temporary CSV file with headers and sample rows.
  - Invoke `node sandbox/source/main.js csv-import-db` with `--db` pointing to a temp database file.
  - After import, open the database using `better-sqlite3` in the test and query the table to verify row count and values.
  - Test importing without header flag and verify generic column names and values.
  - Test `--overwrite` replacing existing data in the table.
  - Test custom delimiter and chunk-size behavior.
  - Verify error on missing CSV file or invalid CSV format yields a non-zero exit code and appropriate stderr message.

- **README.md**: Update the CLI Usage section to document the `csv-import-db` command with examples for common use cases.

- **package.json**: Add `better-sqlite3` under `dependencies` to enable SQLite operations.

## Testing

Add tests to verify:
- Successful import of CSV with headers into a new SQLite table.
- Import without headers yields generic column names and correct data.
- Overwriting an existing table clears prior data.
- Custom delimiters are handled correctly.
- Errors are handled for missing files, invalid CSV rows, and database write failures.