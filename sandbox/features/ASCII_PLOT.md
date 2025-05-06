# Purpose
Combine and unify ASCII plotting capabilities for both the CLI and the HTTP server into a single feature. Users can render text-based graphs of supported functions either directly in the terminal or by requesting an ASCII plot over HTTP.

# CLI Interface
Add a new subcommand "ascii" under the main script invocation:
node src/lib/main.js ascii functionType [options]

Where:
  functionType (required) is either quadratic or sine
  Options:
    --width <number>       number of columns in the ASCII grid (default 80)
    --height <number>      number of rows in the ASCII grid (default 24)
    --domainStart <number> start of x range (default -10)
    --domainEnd <number>   end of x range (default 10)

# HTTP Interface
Extend the existing "serve" subcommand endpoint to handle ASCII requests at `/ascii`:
GET /ascii?functionType=<quadratic|sine>&width=<number>&height=<number>&domainStart=<number>&domainEnd=<number>

# Behavior
1. CLI Mode:
   - Parse arguments for functionType and grid options.
   - Validate functionType; on unsupported exit code 1 with descriptive error.
   - Sample one point per column across the specified domain range.
   - Compute y values (x*x or Math.sin(x)), determine y min and max for scaling.
   - Build a 2D character grid, place '*' at each sampled point, draw axes with '|' and '-'.
   - Join grid rows with line breaks and write to stdout.

2. HTTP Mode:
   - On GET to `/ascii`, parse and validate query parameters.
   - Perform the same sampling, scaling, and grid construction as CLI.
   - Respond with status 200 and header `content-type: text/plain; charset=utf-8`.
   - On invalid parameters respond with status 400 and a JSON error message.

# Tests
- Unit tests in `tests/unit/main.test.js`:
  - Call main(["ascii","quadratic","--width","20","--height","10"]) and assert the returned string contains at least one '*' and axis markers.
  - Test sine function similarly and verify negative and positive y mapping.
  - Test unsupported functionType exits with code 1 and prints an error.

- HTTP unit tests in `tests/unit/main.test.js`:
  - Spawn server via main(['serve','0']), send GET `/ascii?...`, assert status 200, content-type text/plain, and response body contains '*' and axis characters.
  - Test invalid queries return status 400 and JSON error.

- Sandbox tests in `sandbox/tests/http-ascii-plot-server.test.js`:
  - Demonstrate end-to-end HTTP ASCII plot requests and validate output.

# Documentation
- Update README.md:
  - Document the `ascii` CLI subcommand syntax and options.
  - Document the `/ascii` HTTP endpoint under the serve command.
  - Show example CLI invocation and embed a sample ASCII graph in plain text.

# Files to Modify
- src/lib/main.js  implement CLI parsing for `ascii`, ASCII grid logic, and HTTP `/ascii` routing.
- tests/unit/main.test.js  add unit tests and HTTP tests for ASCII.
- sandbox/tests/http-ascii-plot-server.test.js  ensure sandbox-level HTTP ASCII tests.
- README.md  add sections for ASCII subcommand and endpoint.
- package.json  ensure test scripts include sandbox tests for ASCII mode.