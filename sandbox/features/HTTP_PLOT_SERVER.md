# Purpose
Enable users to run a simple HTTP server that provides generated SVG plots for supported mathematical functions via a REST endpoint. This extends the existing CLI plotting capability to a web API, making it easier to integrate the plot generator into other systems or use it interactively in a browser or script.

# Command Line Interface
Add a new subcommand "serve" to the main script invocation:
- node src/lib/main.js serve [port]
  - port is an optional integer for the HTTP server port (default 3000)
  - When started, the script launches an HTTP server listening on the specified port.

# Behavior
1. On "serve" subcommand, create an HTTP server using Node’s built-in http module.
2. Server listens on the provided port or 3000 by default.
3. Accept GET requests to path "/plot" with query parameters:
   - functionType (required): quadratic or sine
   - width (optional): SVG width in pixels (default 800)
   - height (optional): SVG height in pixels (default 400)
   - domainStart (optional): start of x range (default -10)
   - domainEnd (optional): end of x range (default 10)
4. Validate query parameters and respond with status 400 and a JSON error if invalid or missing.
5. On valid requests, generate an SVG string using existing plot logic.
6. Set response header content-type to image/svg+xml and send the SVG document in the HTTP response.
7. Log incoming requests and errors to the console.

# Tests
- Modify tests/unit/main.test.js to spawn the server in a child process on an ephemeral port.
- Use Node’s fetch or http.get to request /plot?functionType=quadratic and assert:
  - Response status is 200
  - Content-type header is image/svg+xml
  - Body begins with an <svg> tag and contains a path element.
- Test invalid requests (missing functionType or unsupported type) return status 400 and JSON error message.

# Documentation
- Update README.md to describe the "serve" command, its options, sample HTTP request URLs, and expected SVG response.
- Include a usage example showing how to embed the plot in an HTML <img> tag pointing to http://localhost:3000/plot?functionType=sine.

# Dependencies
No new dependencies required. Use Node.js built-in http and url modules to implement the server and query parsing.

# Files to Modify
- src/lib/main.js (add serve command parsing, HTTP server setup, routing, and SVG generation integration)
- tests/unit/main.test.js (add tests for HTTP server endpoints and error cases)
- README.md (document the new serve command and HTTP API examples)
- package.json (no changes unless adding a script alias for serve)