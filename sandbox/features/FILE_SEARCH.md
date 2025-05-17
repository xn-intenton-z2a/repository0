# File Search

## CLI Behavior

Introduce a new CLI command `find` to locate files matching a glob pattern within a directory.

Usage:

npm run start -- find <pattern> [directory] [--recursive] [--ignore <pattern>] [--output <file>]

Options:
- `pattern`: Glob pattern to match filenames (required).
- `directory`: Root directory to search; defaults to current working directory.
- `--recursive`: Enable recursive descent into subdirectories; disabled by default.
- `--ignore <pattern>`: Glob pattern to exclude matching files or directories.
- `--output <file>`: Write the list of matching paths to the specified file instead of stdout.

Examples:

npm run start -- find "*.js"
npm run start -- find "*.test.js" src --recursive
npm run start -- find "*.md" . --ignore "README.md" --output matches.txt

## File Modifications

- **sandbox/source/main.js**: Import the `minimatch` library and add a `find` case in the CLI switch. Use `fs/promises` to read directory entries. Implement an asynchronous function that traverses directories when `--recursive` is set, filters files and directories against the include and ignore patterns, and collects matching file paths. Handle the `--output` flag to write results to a file or print to stdout.

- **sandbox/tests/find.test.js**: Create feature-level tests that set up temporary directory structures with nested files and directories. Invoke the CLI with various options (`pattern`, `--recursive`, `--ignore`, `--output`) and assert that the output or written file contains the expected list of matching paths in sorted order. Verify error handling for invalid directories or permission issues.

- **README.md**: Update the CLI Usage section to document the `find` command with examples.

- **package.json**: Ensure that `minimatch` remains listed as a dependency (no new dependencies needed).

## Testing

Add tests to verify:

- Matching files in the current directory without recursion.
- Recursive search finds files in nested subdirectories only when `--recursive` is used.
- Excluding files or directories with the `--ignore` option.
- Writing output to a file with the `--output` flag and proper formatting of line-separated paths.
- Handling of non-existent directories or invalid patterns with clear error messages and non-zero exit codes.