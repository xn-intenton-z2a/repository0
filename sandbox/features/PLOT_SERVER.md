# Overview
This feature adds an HTTP server to the CLI tool, enabling users to request SVG plots over HTTP for quadratic, sine, or arbitrary expressions. It extends the existing plotting commands into a simple web API, allowing dynamic visualization without manual file handling.

# CLI Commands
- plot-server: Start an HTTP server for on-the-fly SVG plotting.
  - --port <number>    TCP port for the server (default: 3000)
  - --host <string>    Hostname or IP to bind (default: localhost)

# HTTP Endpoints
- GET /plot
  - Query parameters:
    - type <quadratic|sine|expression>  Plot type
    - For quadratic: a, b, c (numbers)
    - For sine: frequency, amplitude (numbers)
    - For expression: expr (string), domain (start,end), samples (number)
    - width, height (numbers, optional)
  - Response: 200 OK with Content-Type: image/svg+xml, body contains generated SVG

# Implementation Details
1. In sandbox/source/main.js, add a new case for plot-server:
   - Parse port and host flags using minimist.
   - Use Node.js http module to create a server that listens on the specified host and port.
   - On each request to /plot, parse URL and query parameters.
   - Delegate to existing generateQuadraticSVG, generateSineSVG, or new generateExpressionSVG helper directly in this file.
   - Set response headers and write SVG to response.
   - Handle invalid routes or parameters with 400 responses.
2. Include error handling for missing or invalid query parameters.
3. No external dependencies required beyond existing libraries.

# Tests
- Create integration tests in sandbox/tests/plot-server.test.js:
  - Start the server on a random port before tests and close after.
  - Perform HTTP GET requests for each plot type with minimal parameters.
  - Assert response status is 200, content-type is image/svg+xml, and body starts with <svg.
  - Test invalid type or missing parameters returns 400.

# Documentation
- Update README.md:
  - Add a section for plot-server under CLI commands with usage examples:
    npm run start -- plot-server --port 4000
    curl "http://localhost:4000/plot?type=quadratic&a=1&b=0&c=0"
  - Describe HTTP endpoints and query parameters.
- Update sandbox/docs/CLI_COMMANDS.md with plot-server details.