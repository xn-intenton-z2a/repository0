# Overview
This feature integrates the equation plotting capabilities directly into the main CLI alongside the existing emotion display. It supports both a console plotting mode and an HTTP server mode, ensuring mutual exclusivity of the modes and preserving backward compatibility with the emotion feature.

# Usage

## Console Mode
Run the CLI with the plot flag followed by an equation expression
node src/lib/main.js --plot x^2 - 2*x + 1

The CLI will sample x values over the range -10 to 10 by default, compute y values, normalize them to a 20-row grid, draw axes, and mark data points with an asterisk.

## Server Mode
Launch an HTTP server to serve plots over HTTP
node src/lib/main.js --serve --port 4000

Then request a plot via HTTP GET
curl http://localhost:4000/plot?equation=sin(x)*x

The server responds with an HTML page containing the ASCII plot inside a preformatted block.

# Implementation

1. Argument Parsing
   - Extend main function to detect --plot and --serve flags in addition to --emotion.
   - Enforce that --plot and --serve cannot be used together or with --emotion.
   - Report a clear error if conflicting flags are provided and exit with code 1.

2. Console Plotting Mode
   - On --plot with a valid equation parameter sample 80 x points in the range -10 to 10.
   - Evaluate the equation for each x and collect y values.
   - Determine y min and max, normalize values to a fixed grid of 20 rows.
   - Render X and Y axes at zero and plot data points with an asterisk.
   - Print the ASCII grid to stdout and return exit code 0 on success.
   - On missing or invalid equation parameter write an error to stderr, show usage, and return exit code 1.

3. HTTP Server Mode
   - On --serve start an HTTP server on the specified port defaulting to 3000.
   - Handle GET requests to /plot by reading the equation query parameter.
   - Validate the equation, generate the ASCII plot using console logic, wrap it in a minimal HTML document with a pre block.
   - Respond with status 200 and content type text/html on success.
   - On missing or invalid equation respond with status 400 and a plain text error message.
   - Do not exit the process; log server start and any runtime errors to console.error.

4. Backward Compatibility
   - If neither --plot nor --serve flags are provided, preserve the existing --emotion behavior without change.

# Testing

- Unit Tests in tests/unit/main.test.js
  - Verify console plotting success: calling main with ['--plot', 'x^2'] returns 0 and writes grid to stdout.
  - Verify error when --plot is provided without an equation returns 1 and writes usage and error to stderr.
  - Verify mutual exclusion: main with ['--plot', 'x^2', '--serve'] returns 1 with clear stderr message.
  - Stub HTTP server start: calling main with ['--serve', '--port', '3000'] sets up server without throwing.
  - Confirm existing emotion tests continue to pass.

- End-to-End HTTP Tests in tests/e2e/cli.test.js
  - Spawn the CLI in server mode, send GET requests, assert HTTP status and HTML body contains the ASCII grid.
  - Test missing equation query yields a 400 status and error text.

# Documentation

- Update README.md to include examples and descriptions for --plot and --serve modes.
- Extend docs/USAGE.md with console plotting and HTTP server sections, showing sample commands and output.
- Document changes in the API reference for the exported main function, noting new modes and flags.