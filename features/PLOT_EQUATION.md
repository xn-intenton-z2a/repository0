# PLOT_EQUATION

# Overview
Add support for plotting mathematical equations as ASCII art from the CLI and hosting an HTTP endpoint to serve plots dynamically. Users can invoke the CLI with a --plot flag to render an equation on the console or with --serve (and optional --port) to start a local HTTP server that returns ASCII plots in a web response.

# Usage

- Plot an equation on the console:
  node src/lib/main.js --plot "x^2 + 2*x - 5"
  This samples x from -10 to 10, evaluates y, and renders an ASCII chart on stdout.

- Start HTTP plot server on default port 3000:
  node src/lib/main.js --serve

- Start HTTP plot server on custom port:
  node src/lib/main.js --serve --port 4000

- Query the server via HTTP GET:
  curl "http://localhost:3000/plot?equation=sin(x)*x"
  Returns an HTML response with a <pre> block containing the ASCII plot.

# Implementation

- Extend src/lib/main.js argument parsing to recognize:
  - --plot <equation>
  - --serve (starts HTTP server)
  - --port <number> (optional, defaults to 3000)

- For --plot:
  1. Parse the equation string using a simple expression evaluator.
  2. Sample x values (default range -10 to 10, fixed step).
  3. Compute y for each x and normalize to ASCII rows.
  4. Render axes and plot points in a monospaced grid.

- For --serve:
  1. Use Node's built-in http module to create a server.
  2. On GET /plot, read the query parameter 'equation'.
  3. Generate ASCII plot as in --plot and wrap in HTML with a <pre> tag.
  4. Respond with content-type text/html and status 200.
  5. For invalid or missing equation, respond with 400 and usage instructions.

- Ensure existing --emotion behavior remains unchanged when --plot or --serve flags are absent.

# Testing

- Add or update unit tests in tests/unit/main.test.js:
  - Verify main(["--plot","x+1"]) prints an ASCII chart and returns 0.
  - Test missing equation after --plot yields error message and return code 1.
  - Test unsupported flags do not interfere with plot behavior.

- Add HTTP server tests by mocking HTTP requests:
  - Start server via main(["--serve","--port","5000"]) in a spawned process.
  - Issue HTTP GET /plot?equation=x*2 and assert the response contains expected ASCII content.

# Documentation

- Update docs/USAGE.md to include CLI examples for --plot and --serve.
- Enhance README.md with a section on equation plotting and server usage.
