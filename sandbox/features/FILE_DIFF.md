# File Diff

This feature introduces a new CLI command `diff` to produce unified diffs between two text files.

## CLI Behavior

Add a `diff` command that accepts two file paths and optional flags:

- `diff <fileA> <fileB>`: Computes a unified diff of fileA versus fileB and prints to stdout.
- `--output <file>`: Writes the diff output to the specified file instead of stdout.
- `--context <number>`: Number of context lines to include; defaults to 3.

Examples:

npm run start -- diff a.txt b.txt
npm run start -- diff a.txt b.txt --context 5 --output changes.diff

## File Modifications

- **sandbox/source/main.js**: 
  - Import the `createTwoFilesPatch` function from the `diff` library.
  - Add a `diff` case in the CLI switch to call `doDiff(argv)`.
  - Implement `async function doDiff(argv)` that:
    - Validates two file paths are provided, else prints an error and exits with status code 1.
    - Reads both files using `fs.readFile` as UTF-8.
    - Calls `createTwoFilesPatch(fileA, fileB, contentA, contentB, '', '', { context: argv.context || 3 })`.
    - If `--output` is provided, writes the patch to the file and exits; otherwise prints to stdout.
    - Handles file read or write errors by printing an error message and exiting non-zero.

- **sandbox/tests/diff.test.js**:
  - Create two temporary files with known differences.
  - Invoke `node sandbox/source/main.js diff fileA fileB` and assert the output contains unified diff headers and changed lines prefixed with `+` or `-`.
  - Test the `--context` flag by verifying more context lines in the output.
  - Test the `--output` flag writes the diff to the specified file.
  - Test error handling for missing file arguments or non-existent files, expecting exit status 1 and error messages.

- **README.md**:
  - Update the **Commands Reference** section to document the `diff` command with usage examples.

- **package.json**:
  - Add `diff` to dependencies under `dependencies` if not already present.
