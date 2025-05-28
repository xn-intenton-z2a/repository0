# CLI_PARSER

# Description
Add robust command-line argument parsing to the main CLI. Recognize flags and dispatch core behavior rather than simply logging raw arguments.

# Flags
1. --help    Show usage information and exit with code 0
2. --serve   Start the HTTP server and keep it running

# Implementation
- Install and import minimist in src/lib/main.js
- Export function parseArgs(args: string[]): {
    help: boolean,
    serve: boolean
  }
  • Boolean flags for --help and --serve
  • On unknown flags, print error and exit code 1
- In main(args):
  1. Call parseArgs(process.argv.slice(2))
  2. If options.help, print usage text and exit(0)
  3. If options.serve, call startHttpServer(options) and exit after server starts
  4. Otherwise, print usage text and exit with code 0

# Testing
- Unit tests for parseArgs:
  • No flags yields { help: false, serve: false }
  • --help yields { help: true, serve: false } and exit behavior
  • --serve yields { help: false, serve: true }
  • Unknown flag prints error and exits with code 1
- Integration test for main:
  • Spy on process.exit, console.log, and startHttpServer to confirm dispatch flows

# Documentation
- Update README.md under **CLI Usage**:
  • List --help and --serve flags and behaviors
  • Provide inline examples of npm run start --help and npm run start --serve without fenced code blocks
