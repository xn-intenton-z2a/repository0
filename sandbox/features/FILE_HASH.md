# File Hash

Introduce a new CLI command `hash` to compute cryptographic checksums of one or more files using built-in Node `crypto`.

# CLI Behavior

The new command accepts one or more file paths and optional flags to control algorithm, JSON output, and output destination.

Usage:

npm run start -- hash <filePath> [<filePath> ...] [--algorithm <name>] [--json] [--output <outputFile>]

Options:
- `--algorithm`: Hash algorithm to use (default: sha256). Supported: sha256, sha512, md5.
- `--json`: Output results as a JSON array of objects `{path, algorithm, hash}`. Defaults to human-readable lines.
- `--output <file>`: Write the output to the specified file instead of stdout.

Examples:

npm run start -- hash README.md
npm run start -- hash src/**/*.js --algorithm md5 --json
npm run start -- hash LICENSE MISSION.md --output hashes.txt

# File Modifications

- sandbox/source/main.js: Import `crypto` from Node core. Add a new `hash` case in the CLI switch. For each path argument, resolve the path, read file content with `fs/promises`, compute digest using `crypto.createHash(algorithm)`, and record the hex string. Collect results into an array. If `--json` is set, serialize the array with `JSON.stringify(results, null, 2)`; otherwise format each entry as `path algorithm hash`. Handle `--output` by writing the final string to the specified file or printing to stdout.

- sandbox/tests/hash.test.js: Add a feature-level test file that creates temporary files with known content and timestamps. Invoke the CLI with various options (`--algorithm`, `--json`, `--output`) and assert that the computed hashes match expected values (compute with crypto in test). Test error handling for non-existent file paths and unsupported algorithm names (should exit with error code 1 and descriptive message).

- README.md: Update the CLI Usage section to document the `hash` command with examples.

- package.json: No new dependencies required since `crypto` is built-in.

# Testing

Add tests to verify:

- Default sha256 hash of a file matches known digest.
- Using `--algorithm md5` produces expected MD5 hash.
- `--json` flag produces a valid JSON array of result objects.
- `--output` flag writes the output to the specified file.
- Unsupported algorithm reports an error and exits with status code 1.
