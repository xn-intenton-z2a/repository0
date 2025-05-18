# Text Search

## CLI Behavior

Introduce a new top-level command search to search for a text pattern across one or more files in a single invocation.

Usage:

npm run start -- search <pattern> <file1> [file2 ...] [--regex] [--ignore-case] [--count] [--files-with-matches] [--line-numbers] [--output <file>]

Behavior:

Read each specified file as UTF-8 text and split into lines. For each line, test whether it matches the given pattern. If --regex is provided, interpret the pattern as a regular expression, applying --ignore-case if set. Otherwise perform a substring search, respecting --ignore-case if provided. By default, print each matching line prefixed with file name and line number. If only one file is searched, prefixes are optional. If --count is set, print the count of matching lines per file instead of lines. If --files-with-matches is set, print only the names of files that contain at least one match. The --line-numbers flag includes line numbers in each matching line. If --output is provided, write results to the specified file; otherwise print to stdout. On missing pattern or files, print usage to stderr and exit with code 1. On file read errors or invalid regex, print a descriptive error to stderr and exit with code 1.

## Implementation

- sandbox/source/main.js:
  - Import fs from fs/promises and path.  Optionally import glob for pattern support.
  - In the main CLI switch, add a case search that calls await doSearchCommand(argv).
  - Implement async function doSearchCommand(argv):
    - Validate presence of argv._[1] as pattern and argv._[2] as at least one file; on missing, print usage to stderr and process.exit(1).
    - For each file argument, resolve its path and read content as UTF-8 string.
    - Split content into lines and apply a matching function built from flags.
    - Collect match results according to flags:
      - Default listing lines with optional prefixes.
      - count mode prints one line per file with numeric count.
      - files-with-matches prints file names only.
    - Join results with newlines into an output string.
    - If argv.output is provided, write the string to the given path; otherwise print to stdout.
    - Catch and report errors, exiting with code 1.

## Testing

Add sandbox/tests/search.test.js using Vitest to cover:

- Searching a literal substring without flags prints matching lines with file name and line number.
- Searching with --regex and --ignore-case finds expected matches.
- --count outputs only the numeric count per file.
- --files-with-matches lists only file names containing matches.
- --line-numbers flag includes line numbers in match output.
- --output writes results to a file and prints nothing to stdout.
- Missing pattern or files triggers exit code 1 with usage message.
- File read errors or invalid regex patterns trigger exit code 1 with descriptive stderr.

## Documentation

- README.md and sandbox/docs/CLI_USAGE.md:
  - Add an entry for the search command under Commands Reference with usage, flags, and examples for literal search, regex search, counts, and output-file usage.