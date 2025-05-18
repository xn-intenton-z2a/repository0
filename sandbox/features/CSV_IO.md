# CSV Input and Database Import

## CLI Behavior

Add a top-level csv command with the following subcommands and options:

- csv convert <inputFile>
  - Read a CSV file and output a JSON array of records.
  - Options: --delimiter <char> (default comma), --header <true|false> (default true), --output <file>

- csv export <inputFile>
  - Read a JSON array file and output a CSV file.
  - Options: --delimiter <char>, --output <file>

- csv stream <inputFile>
  - Stream-process large CSV files, emitting JSON arrays in chunks.
  - Options: --delimiter <char>, --header <true|false>, --chunk-size <number> (default 1000), --progress, --output <file>

- csv db-import <inputFile> --db <dbFile>
  - Import CSV rows into a SQLite database table.
  - Options: --table <name> (default data), --delimiter <char>, --header <true|false>, --overwrite, --chunk-size <number> (default 1000)

Each subcommand should read the input file, parse or serialize accordingly, and write result to stdout or to the specified output file. The db-import subcommand should batch insert rows in a transaction and report insertion counts.

## File Modifications

- sandbox/source/main.js
  - Add a new case csv in the CLI switch to call doCsvCommand(argv).
  - Implement doCsvCommand to dispatch to convert, export, stream, and db-import helpers based on argv._[1].
  - For convert and export use parse and stringify from csv-parse/sync and JSON methods.
  - For stream use fs.createReadStream with csv-parse streaming API, emit chunked JSON arrays, and print progress to stderr when requested.
  - For db-import use better-sqlite3: connect to the database, optionally drop and recreate table when overwrite is true, prepare an insert statement, and run a transaction to insert each record.

- sandbox/tests/csv-io.test.js
  - Cover each subcommand: convert with and without header, export round-trip, stream chunking and progress, db-import table creation, overwrite behavior, and error handling for missing files or parse errors.

- README.md and sandbox/docs/CLI_USAGE.md
  - Update the Commands Reference and examples to document the csv command and each subcommand with usage scenarios.

- package.json
  - Ensure csv-parse and better-sqlite3 are listed as dependencies.

## Testing

Write tests to verify JSON and CSV transformation accuracy, correct handling of headers and delimiters, streaming behavior with chunk size and progress output, file writing via --output, and database imports reflecting correct rows, schema, and overwrite behavior.