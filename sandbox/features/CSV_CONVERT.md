# CSV Conversion and Streaming Import

## CLI Behavior

Extend the existing csv-import and csv-export commands and add optional streaming support for very large CSV files.

- **csv-import <inputFile> [--delimiter <char>] [--header <true|false>] [--output <outputFile>] [--stream] [--chunk-size <number>] [--progress]**
  - By default, reads a CSV file into memory, parses with the specified delimiter, uses the first row as headers by default, and outputs a JSON array to stdout or writes to the file given by --output.
  - When --stream is provided, processes the file in a streaming fashion using csv-parse streaming API. Emits parsed records in chunks of size given by --chunk-size (default 1000). Outputs each chunk as a separate JSON array on its own line in stdout or writes sequentially to the --output file. If --progress is set, prints a progress indicator to stderr (percentage of file bytes processed).

- **csv-export <inputFile> [--output <outputFile>] [--delimiter <char>]**
  - Reads a JSON file containing an array of objects or arrays and outputs a CSV string using the given delimiter (default comma). When items are objects, uses the keys of the first object as headers. Writes to stdout or to the specified output file.

## File Modifications

- **sandbox/source/main.js**
  - Update the `doCsvImport` function to detect `argv.stream`, `argv["chunk-size"]`, and `argv.progress`. When streaming, use `fs.createReadStream` and `parse` from `csv-parse/sync` or `csv-parse` streaming API to read records chunk by chunk. For each chunk, serialize to JSON and write to stdout or append to output file. If `--progress` is set, compute processed bytes versus total file size and write progress updates to stderr.
  - Ensure backward compatibility for non-streaming mode and preserve behavior of `--delimiter`, `--header`, and `--output` flags.
  - In the csv-export case, add support for a `--delimiter` flag to override the comma.

- **sandbox/tests/csv-import-stream.test.js**
  - Add tests to verify streaming import behavior on large synthetic CSVs: create a temporary CSV file with thousands of rows, invoke the CLI with `--stream --chunk-size 500` and assert that output consists of multiple JSON arrays, each containing at most 500 records.
  - Test that `--progress` writes progress updates to stderr and does not interfere with JSON output on stdout.
  - Verify that streaming import with `--output` writes all chunks sequentially to the target file and produces a valid JSON lines file.

- **README.md**
  - Update the CLI Usage section for `csv-import` to include examples demonstrating `--stream`, `--chunk-size`, and `--progress` flags.
  - Add a note on use cases for streaming large CSV files without exhausting memory.

- **package.json**
  - No new dependencies required; rely on the existing `csv-parse` package.

## Testing

Add tests to verify:

- Default in-memory import works exactly as before.
- Streaming mode splits output into appropriate chunk sizes.
- Progress indication appears on stderr when requested.
- Export command respects custom delimiter and writes correct CSV rows and headers.
