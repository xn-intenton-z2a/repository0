sandbox/docs/USAGE.md
# sandbox/docs/USAGE.md
# Usage

This document describes how to run the CLI script and demonstrates the new Argument Parser feature.

## Running the Script

You can run the main script with any combination of flags:

```bash
npm run start -- --user alice --verbose
```

## Argument Parser

The `parseArgs` function interprets command-line flags and values:

- Flags with values: `["--name", "John"]` → `{ name: 'John' }`
- Boolean flags: `["--debug"]` → `{ debug: true }`
- Mixed usage supported: `["--mode", "test", "--verbose"]` → `{ mode: 'test', verbose: true }`
- Flags without values when followed by another flag are treated as boolean `true`.

Example:

```bash
node src/lib/main.js --user alice --verbose
# Output:
Run with: ["--user","alice","--verbose"]
Parsed args: {"user":"alice","verbose":true}
```

Edge cases:

- A flag at the end without a value is boolean true.
- Consecutive flags without values: `["--a","--b","value","--c"]` → `{ a: true, b: 'value', c: true }`

The script now logs both the raw array of arguments and the parsed result for easier automation and debugging.
