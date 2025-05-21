# PLOT_EQUATION

# Overview
Integrate equation plotting into the main CLI, offering two modes:

- **Console Rendering**: Generate ASCII plots directly in the terminal for quick visualization.
- **HTTP Plot Server**: Start a lightweight HTTP server that returns ASCII plots wrapped in simple HTML responses for remote or browser-based access.

# Usage

## Console Mode

Run the CLI with an equation string to render an ASCII plot on stdout:

node src/lib/main.js --plot "<equation>"

Example:

node src/lib/main.js --plot "x^2 - 2*x + 1"

The CLI samples x values across a fixed range, computes y values, and prints an ASCII grid with axes and data points.

## Server Mode

Start the HTTP server to serve plots via GET requests:

node src/lib/main.js --serve [--port <number>]

- **--port**: Optional. Default is 3000.

Example:

node src/lib/main.js --serve --port 4000

Request a plot:

curl "http://localhost:4000/plot?equation=sin(x)*x"

# Implementation

1. **Argument Parsing**
   - Add support for flags: --plot <equation>, --serve, --port <number> alongside existing --emotion.
   - Validate combinations: --plot only for console mode, --serve optionally with --port for server mode.

2. **Equation Parsing and Safety**
   - Use a safe expression parser (e.g., a lightweight math library or manual parser) to avoid eval risks.
   - Support arithmetic operators, standard functions (sin, cos, tan, exp, log).

3. **Console Plotting Mode**
   - Sample N points (default 80) over a configurable range (default -10 to 10).
   - Compute y values, determine min and max, normalize to an ASCII grid of fixed height (e.g., 20 rows).
   - Draw X and Y axes at zero coordinates, mark data points with `*`.
   - Output the grid to stdout and return exit code 0 on success.

4. **HTTP Server Mode**
   - Use Node's built-in `http` module to create a server on the given port.
   - Handle GET requests to `/plot`:
     - Extract `equation` query parameter, validate presence and parse.
     - On valid input, generate the ASCII plot using the same logic as console mode.
     - Wrap the ASCII plot inside an HTML document with a `<pre>` block.
     - Respond with status 200 and `Content-Type: text/html`.
     - On missing or invalid parameter, respond with status 400 and a plain text error message.

5. **Error Handling and Exit Codes**
   - Console mode: exit code 0 on success; 1 on missing or invalid equation.
   - Server mode: do not exit; log errors to console and serve HTTP error codes.

6. **Backward Compatibility**
   - Ensure the existing --emotion feature remains unchanged when neither --plot nor --serve flags are used.

# Testing

- **Unit Tests** in `tests/unit/main.test.js`:
  - Verify console plotting: calling `main(["--plot", equation])` returns exit code 0 and logs the ASCII grid.
  - Verify error on missing equation: calling `main(["--plot"])` returns exit code 1 and logs an error.
  - Verify server setup stub: calling `main(["--serve", "--port", "3000"])` starts the server without error (mock or stub HTTP server).

- **End-to-End HTTP Tests** in `tests/e2e/cli.test.js`:
  - Spawn the CLI with `--serve` and default/custom port.
  - Send HTTP GET requests to `/plot?equation=<expr>` and assert status codes, headers, and response bodies.

- **Regression**:
  - Confirm existing DISPLAY_EMOTION tests still pass when neither --plot nor --serve flags are used.

# Documentation

- Update `README.md` to include examples for --plot and --serve modes, linking to this feature spec.
- Update `docs/USAGE.md` with usage sections for both modes and sample outputs.
- Document the exported API surface in `src/lib/main.js` if applicable.