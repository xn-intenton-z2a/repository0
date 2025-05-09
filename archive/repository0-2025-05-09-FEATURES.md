sandbox/features/CLI_ARGS_PARSING.md
# sandbox/features/CLI_ARGS_PARSING.md
# Overview

Implement advanced command-line argument parsing for the main CLI tool using the existing minimist dependency. This feature will allow users to supply flags and positional arguments to control behavior, such as requesting help text, printing version information, or computing simple operations on numeric inputs.

# Usage

Users can invoke the CLI with:

  npm run start -- --help
  npm run start -- --version
  npm run start -- --sum 1 2 3 4
  npm run start -- greet Alice

# Behavior

- --help: Print usage instructions and list available flags and commands. Exit without error.
- --version: Read the version value from package.json and print it. Exit without error.
- --sum: Treat subsequent positional arguments as numbers, compute their sum, and print the result. If any value is non-numeric, print an error and exit with non-zero code.
- greet <name>: If first argument is the word greet, treat the next positional argument as a name and print a greeting message.
- Default: If no flags or commands are provided, fall back to the existing behavior of printing the raw argument array.

# Implementation

- Update src/lib/main.js to import minimist and parse process.argv.
- Add helper functions for each command and flag in the same file.
- Update package.json start script if necessary to forward CLI flags.

# Tests

- Add unit tests in tests/unit/main.test.js for each command and flag:
  - Help output contains the flags and commands.
  - Version output matches package.json version.
  - Sum operation on valid numbers returns correct total.
  - Sum operation with invalid input fails.
  - Greeting command prints correct message.

Ensure all new behavior is covered by tests and documented in the README under a new "CLI Usage" section.sandbox/features/HTTP_API.md
# sandbox/features/HTTP_API.md
# HTTP API Mode

# Overview
Implement a built-in HTTP server when the CLI is invoked with --serve. This mode listens on a port and responds to HTTP requests to expose CLI arguments and usage information.

# Usage
- Invoke the CLI with --serve to start the server on the default port 3000:
  npm run start -- --serve
- Supply --port to customize the listening port:
  npm run start -- --serve --port 4000

# Behavior
- When --serve is present, bypass normal CLI operations and start an HTTP server.
- Parse an optional --port flag; default port is 3000 if not provided.
- GET / returns a JSON object describing available endpoints and usage instructions.
- GET /args returns a JSON array containing the original CLI arguments.
- Log a message to the console: Server listening on port PORT.
- Handle SIGINT gracefully by closing the server and exiting without error.

# Implementation
- Update src/lib/main.js:
  • Import the built-in http module.
  • After parsing arguments with minimist, detect the serve flag and port.
  • Create an http server with a request handler branching on req.url.
  • Call server.listen on the parsed or default port and log the listening message.
  • Attach a SIGINT handler that closes the server and exits.
  • If --serve is not present, preserve existing behavior of printing arguments.

# Tests
- Update tests/unit/main.test.js:
  • Mock console.log to capture log output when main is called with --serve.
  • Verify that main returns an instance of http.Server or an object with a listen method.
  • Assert that console.log was called with Server listening on port 3000 when no port flag is provided.
  • Test with a custom port value to confirm the port parsing.
  • Simulate a SIGINT event and verify that the server is closed without throwing.

# Documentation
- Update README.md:
  • Add a new "CLI Usage" section describing the serve mode and its endpoints.
  • Document examples for starting the server and querying endpoints.
