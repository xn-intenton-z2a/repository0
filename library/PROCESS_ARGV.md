Title: PROCESS_ARGV
Source: https://nodejs.org/api/process.html#processargv

TABLE OF CONTENTS:
1. What process.argv contains
2. Typical usage patterns
3. Relationship with process.execArgv and process.env
4. Parsing recommendations and example patterns
5. Edge cases and notes for packaged apps
6. Reference details (type and indices)
7. Detailed digest
8. Attribution

NORMALISED EXTRACT:
What process.argv contains:
- process.argv is an Array of strings representing the command-line arguments passed when the Node.js process was launched.
- Exact mapping: process.argv[0] is the executable that started the process (absolute or resolved path to node binary), process.argv[1] is the path to the JavaScript file being executed (or the string passed to -e or -p), and process.argv[2...] are the user-supplied command-line arguments.
- Type: string[] (each entry is a string). Use process.argv.slice(2) to get only user arguments.

process.execArgv vs process.argv:
- process.execArgv contains Node.js-specific CLI options passed to the Node process (for example --inspect, --require, --harmony); these are not present in process.argv.
- Typical code to interpret application arguments is: const args = process.argv.slice(2);

Parsing recommendations:
- For non-trivial parsing use a battle-tested CLI parsing library (yargs, minimist, commander). These handle common patterns: flags, short/long options, boolean vs value, combined short flags, default values, and help output.
- Minimal parse example pattern (conceptual):
  - Read args = process.argv.slice(2)
  - Iterate args by index; if arg starts with '--' parse long-option and optional value; if '-' parse single-letter flags; else treat as positional.
- For Node child processes or spawned wrappers, be aware wrapper may alter argv indices.

Edge cases and platform notes:
- On Windows the executable path and script path may contain backslashes; treat as opaque strings for parsing.
- When packaging with tools (pkg, nexe) the script path may not be a real filesystem path.
- When using shebangs or invoking via npm scripts, argv[1] may differ.

REFERENCE DETAILS:
- process.argv: string[]
- Common usage pattern: const userArgs = process.argv.slice(2)
- process.execArgv: string[] of node-specific arguments

DETAILED DIGEST:
- Source URL: https://nodejs.org/api/process.html#processargv
- Retrieved: 2026-03-15 (UTC)
- Crawled byte-size: 694208 bytes (HTML)

ATTRIBUTION:
Content extracted from Node.js official documentation — process.argv — retrieved 2026-03-15.