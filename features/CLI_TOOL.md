# CLI_TOOL

Summary
Specify a minimal CLI surface so users can exercise the library from the command line and the website can show identical example output.

Specification
- Entrypoint: node src/lib/main.js supports a simple subcommand API:
  - string <a> <b> [--normalize=NFC|NFD]
  - bits <a> <b>
  - --help prints usage and exits 0
  - --version prints version and exits 0
- Output format:
  - Default plain numeric output is acceptable, but a --json flag must be supported to print structured JSON with keys stringExample and bitsExample when running the default demo or when requested
  - On invalid input, print a human-readable error to stderr and exit with non-zero exit code
- Examples:
  - node src/lib/main.js string "karolin" "kathrin" -> prints 3
  - node src/lib/main.js bits 1 4 -> prints 2
  - node src/lib/main.js --json -> prints a JSON object showing example inputs and results similar to the website demo

Acceptance criteria
- CLI respects subcommands and flags described above
- --json output matches the example shape used in website screenshots (stringExample and bitsExample keys)
- Non-zero exit code on error and TypeError/RangeError messages shown on stderr

Notes
The CLI need not be feature-complete; keep it minimal and testable by invoking the start:cli script in package.json.