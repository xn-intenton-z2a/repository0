# PLOT_EQUATION

# Overview
This feature adds two new modes to the CLI: console equation plotting and an HTTP plot server. It extends the existing emotion display without altering its behavior when plotting flags are absent.

# Usage

## Console Mode
Run the CLI with an equation to render an ASCII graph on stdout:

node src/lib/main.js --plot "<equation>"

Example:

node src/lib/main.js --plot "x^2 - 2*x + 1"

The CLI samples x values over a default range, computes y values, and prints an ASCII grid with axes and data points.

## Server Mode
Start an HTTP server that serves plots on GET requests:

node src/lib/main.js --serve [--port <number>]

- --port: Optional. Default is 3000.

Example:

node src/lib/main.js --serve --port 4000

Request a plot via:

curl "http://localhost:4000/plot?equation=sin(x)*x"

The server responds with an HTML page containing the ASCII plot inside a <pre> block.

# Implementation

1. Argument Parsing
   - Extend main to handle --plot, --serve, and --port flags alongside --emotion.
   - Enforce that --plot cannot be combined with --serve and vice versa.

2. Console Plotting Mode
   - Sample N points (default 80) across a configurable range (default -10 to 10).
   - Compute y values for each x, determine min and max, normalize to a fixed grid height (default 20 rows).
   - Draw X and Y axes at zero, marking data points with `*`.
   - Output the grid to stdout and return exit code 0 on success.
   - On missing or invalid equation, log an error to stderr, print usage, and return exit code 1.

3. HTTP Server Mode
   - Use Node's built-in http module to create a server on the specified port.
   - Handle GET /plot requests:
     - Extract and validate the `equation` query parameter.
     - Generate the ASCII plot using the console logic.
     - Wrap the ASCII grid in a simple HTML document with a <pre> block.
     - Respond with status 200 and Content-Type text/html.
     - On missing or invalid equation, respond with status 400 and a plain text error.
   - Do not exit the process; log server start and error messages to console.

4. Backward Compatibility
   - When neither --plot nor --serve flags are provided, preserve the existing --emotion behavior.

# Testing

- Unit Tests (tests/unit/main.test.js)
  - Verify console plotting success: main(["--plot", equation]) returns 0 and logs the ASCII grid.
  - Verify error on missing equation: main(["--plot"]) returns 1 with appropriate stderr message.
  - Verify server invocation stub: main(["--serve", "--port", "3000"]) starts the HTTP server without errors (use mocks).
  - Confirm all DISPLAY_EMOTION tests pass unchanged.

- End-to-End HTTP Tests (tests/e2e/cli.test.js)
  - Spawn the CLI in server mode, send GET /plot?equation=<expr>, assert status, headers, and HTML body.

# Documentation

- Update README.md with examples for --plot and --serve modes and link to this feature spec.
- Extend docs/USAGE.md to include sections for console plotting and HTTP server usage with sample output.
- Document the exported main function’s new behavior in README.md under API reference.