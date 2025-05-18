# File Hashing

## CLI Behavior

Introduce a new top-level command `hash` to compute cryptographic digests for a specified file.

Usage:

npm run start -- hash <file> [--algorithm <alg>] [--output <file>]

- `<file>`: Path to the file to hash (required).
- `--algorithm <alg>`: Hash algorithm to use; supported values: `sha256`, `sha1`, `md5`. Default is `sha256`.
- `--output <file>`: Optional path to write the result as a JSON object; defaults to stdout.

Behavior:

- Read the file as a binary Buffer using fs/promises.
- Compute the digest with Node’s built-in crypto module using the specified algorithm.
- Construct a JSON object with fields `file`, `algorithm`, and `hash` (hex string).
- Serialize the JSON with two-space indentation.
- If `--output` is provided, write to the given path; otherwise print to stdout.
- On missing arguments or I/O errors, print a descriptive error to stderr and exit with code 1.

# Implementation

- **sandbox/source/main.js**
  - Import `crypto` from Node’s standard library.
  - In the main switch, add case `hash` to call `await doHashCommand(argv)`.
  - Implement `async function doHashCommand(argv)`:
    - Validate presence of `argv._[1]`; on missing, print usage and exit code 1.
    - Read file into Buffer; catch and handle read errors.
    - Determine algorithm from `argv.algorithm` or default to `sha256`; validate supported values.
    - Use `crypto.createHash(algorithm).update(buffer).digest('hex')` to compute the hash.
    - Build result object and serialize.
    - Handle `--output` by writing to file or printing to stdout.
    - On any error, print message and exit with code 1.

# Testing

- **sandbox/tests/hash.test.js** (using Vitest)
  - Create a temporary file with known content.
  - Test default algorithm produces expected `sha256` digest.
  - Test `--algorithm md5` and `--algorithm sha1` produce correct hashes.
  - Test `--output` writes JSON to file and prints nothing to stdout.
  - Test missing file argument exits code 1 with usage message.
  - Test non-existent file exits code 1 with descriptive error.

# Documentation

- **README.md** and **sandbox/docs/CLI_USAGE.md**:
  - Add entry for `hash` in Commands Reference with usage examples.
  - Document flags `--algorithm` and `--output`, default behaviors, and example commands.