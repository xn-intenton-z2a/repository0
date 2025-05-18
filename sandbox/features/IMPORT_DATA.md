# Import Data Command

## CLI Behavior

Add a top-level command import-data that ingests structured data files and writes their records into a SQLite database table.

Usage:
 npm run start -- import-data <inputFile> --db <dbFile> [--table <name>] [--delimiter <char>] [--header <true|false>]

- <inputFile> the path to a data file with extension .csv, .json, .yaml, .yml, or .env
- --db the SQLite database file path to open or create (required)
- --table the target table name in the database (default data)
- --delimiter the field delimiter for CSV input (default comma)
- --header whether the first CSV row is a header row (default true)

## Implementation

- In sandbox/source/main.js import Database from better-sqlite3 and add a new case import-data in the main CLI switch to call await doImportData(argv).
- Implement async function doImportData(argv) that:
  - Validates presence of input file and db path and resolves their absolute paths
  - Reads file content using fs/promises
  - Determines file type by extension and parses content:
    - .csv use csv-parse/sync with configured delimiter and header options
    - .json parse with JSON.parse and expect an array of objects
    - .yaml or .yml parse with js-yaml and expect an array of objects
    - .env parse with dotenv.parse and wrap the resulting object in an array
  - Opens or creates the SQLite database using better-sqlite3. Infers table schema from keys of first record and creates or replaces the table with appropriate columns
  - Uses a transaction to insert all records into the table
  - Logs a summary message indicating how many records were inserted into which table and database

## File Modifications

- Update package.json to add better-sqlite3 as a dependency
- Modify sandbox/source/main.js:
  - Add import Database from better-sqlite3
  - Add doImportData implementation and integrate it into the CLI switch
  - Handle errors for missing arguments, file reads, parse failures, and database errors with descriptive messages and exit codes
- Create sandbox/tests/import-data.test.js with feature-level tests covering CSV, JSON, YAML, and ENV imports, table creation, insertion counts, flag handling, and error conditions
- Update README.md and sandbox/docs/CLI_USAGE.md to document the import-data command, its flags, and provide usage examples

## Testing

Add feature-level tests in sandbox/tests/import-data.test.js that:
- Prepare temporary CSV, JSON, YAML, and .env files with known records
- Invoke node sandbox/source/main.js import-data with various flag combinations against a temporary SQLite file
- Open the database using better-sqlite3 to query the specified table and assert correct rows and schema
- Test custom table names, delimiter and header flags, and error cases such as unsupported extensions or parse errors