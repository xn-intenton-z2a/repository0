# Purpose
Enable users to request ASCII-rendered function plots over HTTP. This extends the existing HTTP plot server to return a text-based graph for quick CLI-like inspection in web or script contexts.

# HTTP Interface
The server exposes a new endpoint `/ascii` that accepts the same query parameters as `/plot`:
- functionType (required): quadratic or sine
- width (optional): number of columns in the ASCII grid (default 80)
- height (optional): number of rows in the ASCII grid (default 24)
- domainStart (optional): start of x range (default -10)
- domainEnd (optional): end of x range (default 10)
- port (optional): server port when starting via CLI serve command

Example request:
http://localhost:3000/ascii?functionType=sine&width=60&height=20&domainStart=-3.14&domainEnd=3.14

# Behavior
1. On `serve` subcommand, HTTP server listens on provided port or default 3000.
2. When a GET request is made to `/ascii`, parse and validate query parameters.
3. Sample points evenly across the domain range for each column.
4. Compute y values (x * x or Math.sin(x)).
5. Scale y values to the available row count and build a 2D character grid.
6. Plot axes with '|' and '-' and mark each sample with '*'.
7. Respond with status 200 and content-type text/plain; charset=utf-8, returning the ASCII graph.
8. On invalid parameters, respond with 400 and JSON error message.

# Tests
- Add unit tests in `tests/unit/main.test.js` that spawn the server via `main(['serve', '0'])`, send HTTP GET `/ascii?...`, and assert:
  - Status 200
  - content-type text/plain
  - Response body contains at least one '*' and axis characters
- Test unsupported functionType or invalid numeric values result in status 400 and JSON error.
- Add sandbox-level tests in `sandbox/tests/http-ascii-plot-server.test.js` to demonstrate end-to-end usage.

# Documentation
- Update README.md to describe the `/ascii` endpoint under the serve command.
- Provide sample HTTP URL examples and a snippet of ASCII graph output in plain text.

# Files to Modify
- `src/lib/main.js`: implement routing for `/ascii` and ASCII generation logic in the HTTP server block.
- `tests/unit/main.test.js`: add tests for ASCII endpoint success and failure cases.
- `sandbox/tests/http-ascii-plot-server.test.js`: add end-to-end tests.
- `README.md`: document new `/ascii` endpoint and usage examples.