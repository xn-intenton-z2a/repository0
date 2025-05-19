# CSV to JSON Conversion Command

## Overview

The CLI will support a --csv2json <csvPath> [--output <outputPath>] option (alias -c) that:

1. Reads a CSV file with a header row
2. Parses records into objects using the header row as keys
3. Converts the records into a JSON array
4. Outputs the JSON to stdout or writes it to the specified output file

## Implementation Details

- Extend minimist setup to recognize csv2json (string) with alias c and output (string) with alias o
- In main(), after existing commands, detect args.csv2json and call a new convertCsvToJson handler
- Handler convertCsvToJson(csvPath, outputPath) should:
  - Read csvPath using fs.promises.readFile
  - Parse content using the synchronous API of csv-parse with columns set to true
  - Serialize the record array to JSON with two space indentation
  - If outputPath is provided, write the JSON to that file and exit with status 0
  - Otherwise, console.log the JSON and exit with status 0
  - On file read or parse errors, log error message to stderr and exit with status 1

## Testing

- Add tests in sandbox/tests/convert.test.js covering:
  - Conversion of a valid CSV file to JSON on stdout
  - Writing JSON output to a file when --output is used
  - Handling of missing input file with appropriate error and exit code

## Documentation

- Update sandbox/docs/README.md to include the new command under Commands:
  --csv2json <csvPath> Convert CSV file to JSON printed to stdout
  -c <csvPath> alias for --csv2json
  --output <file> Write JSON output to the specified file