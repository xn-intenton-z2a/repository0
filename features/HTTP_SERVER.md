# HTTP_SERVER

# Description
When the serve flag is provided via the CLI, the tool starts an HTTP server on a configurable port and serves status and options endpoints.

# Endpoints
1. GET /health returns a 200 OK response with a JSON object { status: 'ok' }
2. GET /options returns the current parsed CLI options as JSON

# Implementation
In src/lib/main.js:
- Create and export a function startHttpServer(options, port) that uses Node's http module to create a server.
- Read port from the environment variable PORT or default to 3000.
- Within the request handler, inspect request.url and dispatch to /health and /options endpoints with appropriate JSON responses.
- Modify main() to invoke startHttpServer when options.serve is true, log "Server listening on port <port>", and prevent immediate process exit so the server remains alive.

# Testing
- Update tests/unit/main.test.js to:
  * Spy on http.createServer or the exported startHttpServer to verify invocation with correct options and port.
  * Test that startHttpServer returns an instance of http.Server.
  * Simulate HTTP requests for /health and /options by invoking the request handler directly and assert correct status codes, headers, and JSON bodies.

# Documentation
- Update README.md to include an HTTP Server section:
  * Describe the serve flag and default port.
  * Document the /health and /options endpoints.
  * Provide inline examples using curl to interact with the server.