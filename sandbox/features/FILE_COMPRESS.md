# File Compression

## CLI Behavior

Introduce two new top-level commands `compress` and `decompress` to apply gzip or brotli compression to a specified file or reverse the operation.

### compress

Usage:

npm run start -- compress <file> [--algorithm <gzip|brotli>] [--level <0-9>] [--output <file>]

- `<file>`: Path to the input file to compress (required).
- `--algorithm`: Compression algorithm; supported values are `gzip` (default) and `brotli`.
- `--level`: Compression level from 0 (fastest) to 9 (best compression); default is 6.
- `--output`: Optional path to write the compressed data; defaults to writing raw bytes to stdout.

Behavior:

- Read the input file as a Buffer using fs/promises.
- Based on `--algorithm`, use Node's built-in `zlib` module:
  - For `gzip`, call zlib.gzip with the specified level.
  - For `brotli`, call zlib.brotliCompress with the specified level.
- On success, write the compressed Buffer to the specified output file or stdout.
- On missing file argument or read error, print an error message to stderr and exit code 1.
- On invalid algorithm or compression error, print descriptive message and exit code 1.

### decompress

Usage:

npm run start -- decompress <file> [--algorithm <gzip|brotli>] [--output <file>]

- `<file>`: Path to the compressed file to decompress (required).
- `--algorithm`: Decompression algorithm; default is `gzip`; set to `brotli` when input was brotli compressed.
- `--output`: Optional path to write the decompressed data; defaults to writing raw text or binary to stdout.

Behavior:

- Read the compressed file as a Buffer.
- Based on `--algorithm`, use `zlib.unzip` (for gzip) or `zlib.brotliDecompress` (for brotli).
- Write the decompressed Buffer to `--output` or stdout.
- On errors in reading, algorithm selection, or decompression, print descriptive error and exit code 1.

## Implementation

- **sandbox/source/main.js**
  - Import `import zlib from 'zlib';`
  - In the main CLI switch, add cases `compress` and `decompress` to call new functions `await doCompressCommand(argv)` and `await doDecompressCommand(argv)` respectively.
  - Implement `async function doCompressCommand(argv)`:
    - Validate `argv._[1]` exists.
    - Determine algorithm and compression level from `argv.algorithm` and `argv.level`, validate values.
    - Read file as Buffer.
    - Call the appropriate zlib method and await its result (using `util.promisify` or callback wrapper).
    - Write result to `argv.output` if given, else `process.stdout.write`.
    - Handle errors, print to stderr, and `process.exit(1)`.
  - Implement `async function doDecompressCommand(argv)` similarly.

## Testing

Create `sandbox/tests/compress.test.js` covering:

- compress and decompress round-trip: write a temporary text file, compress it (both gzip and brotli) and decompress, then assert decompressed content equals original.
- Using `--level` with gzip produces smaller output as level increases (compare lengths for level 1 and level 9).
- `--output` writes to file and produces no stdout output.
- Error on non-existent input file exits with code 1 and appropriate stderr message.
- Error on invalid algorithm option exits with code 1.

## Documentation

- **README.md** and **sandbox/docs/CLI_USAGE.md**:
  - Add entries for `compress` and `decompress` under Commands Reference.
  - Document usage, flags, default behaviors, and examples for gzip and brotli.

