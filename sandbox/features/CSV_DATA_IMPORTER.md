# Overview
Provide a built-in CLI command to import CSV data files and output parsed JSON records.

# Commands
- csv-import <file> [--delimiter <char>]
  Read the specified CSV file from disk, parse rows into JSON objects using the first row as header keys, and print the JSON array to stdout.
  The optional --delimiter flag defaults to comma if not provided.

# Implementation
1. Add a csv-parse dependency to package.json to handle standard and custom delimiters.
2. In sandbox/source/main.js extend argument parsing to recognize the csv-import subcommand and delimiter option.
3. Read the target file asynchronously. On success, pipe its contents into csv-parse with header auto-mapping and the chosen delimiter.
4. Collect parsed records into an array, then output the complete JSON array as a string via console.log.
5. On file read or parse errors, print a user-friendly error message and exit with nonzero status.

# Tests
Add unit tests in sandbox/tests/csv-importer.test.js covering:
- Parsing a simple CSV string with comma delimiter produces correct JSON output.
- Custom delimiter handling with semicolon.
- Error handling when the file does not exist or parse fails.
Mock file reads and console.log calls to isolate behavior.

# Documentation
Update README.md:
- Describe the csv-import command syntax and options.
- Provide an example CSV file and the corresponding JSON output.
- Show how to include the --delimiter option.
- Link to MISSION.md, CONTRIBUTING.md, and intentïon agentic-lib repository.