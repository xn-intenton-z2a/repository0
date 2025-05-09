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
