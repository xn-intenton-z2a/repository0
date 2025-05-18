# File Difference

## CLI Behavior

Introduce a new top-level command `diff` to compare two text files and display their differences in a unified diff format.

Usage:

npm run start -- diff <file1> <file2> [--format unified|context] [--output <file>]

- `<file1>`: Path to the original file.
- `<file2>`: Path to the modified file.
- `--format`: Choose diff format; default is `unified`. Supported values: `unified`, `context`.
- `--output <file>`: Optional path to write the diff result; defaults to stdout.

Behavior:

- Read both files with `fs/promises` as UTF-8 text.
- Use the `diff` library to compute line-by-line differences.
- Serialize the differences using the specified format:
  - Unified diff shows added and removed lines with context.
  - Context diff groups changes by sections with surrounding lines.
- If `--output` is provided, write the diff text to that file; otherwise print to stdout.
- Exit code is 0 if files are identical or diff displayed successfully; exit code 1 on I/O errors or invalid arguments.

## Implementation

- **sandbox/source/main.js**
  - Add `import { diffLines, structuredPatch } from 'diff';`
  - In the main switch, add a case `diff` that calls `await doDiffCommand(argv)`.
  - Implement `async function doDiffCommand(argv)`:
    - Validate presence of two file arguments; on missing, print usage and exit with code 1.
    - Read both files as UTF-8 strings.
    - Based on `argv.format`, generate a patch using `structuredPatch` or `diffLines`.
    - Join the patch lines into a single string.
    - Handle `--output` by writing to file or printing to stdout.
    - Catch and report errors, exiting with code 1.

## Testing

Create `sandbox/tests/diff.test.js` with Vitest to cover:

- Comparing identical files produces no output and exit code 0.
- Comparing files with single-line change shows `-` and `+` markers.
- Using `--format context` yields context diff sections.
- Writing diff to `--output` file outputs correct diff and prints nothing to stdout.
- Error on missing file arguments exits code 1 with usage message.
- Error on non-existent files exits code 1 with descriptive error.

## Documentation

- **README.md** and **sandbox/docs/CLI_USAGE.md**:
  - Add an entry for the `diff` command under Commands Reference.
  - Document usage, flags, and examples demonstrating unified and context diffs.
