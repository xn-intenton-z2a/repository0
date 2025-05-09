# Summary

Extend the plotting CLI to serve function data over HTTP in addition to standard output. Introduce a new `--serve-plot` option that starts a lightweight HTTP server returning plot data or assets in multiple formats.

# Implementation

1. Modify src/lib/main.js to:
   • Use minimist to parse:
     - `--serve-plot` boolean flag; when provided, run HTTP server instead of exiting normally.
     - `--plot-port` numeric option for server port; default 4000.
     - `--format` string option to specify output format (json, csv, svg, html); default json.
   • After computing and validating plot points and assets:
     - If serve-plot is true:
       1. Import http module from node.
       2. Validate plot port is a positive integer; on invalid port log error and throw.
       3. Create HTTP server that handles GET requests:
          - Path `/plot` responds with application/json and JSON array of points.
          - Path `/csv` responds with text/csv and CSV data including header.
          - Path `/svg` responds with image/svg+xml and SVG document string.
          - Path `/html` responds with text/html and HTML document with embedded SVG.
          - Path `/` returns same content as `/plot`.
       4. Start listening on configured port and log message 'Plot API listening on port PORT'.
       5. Do not exit; allow server to run until process termination.
     - Else:
       - Default behavior prints output to stdout as before using `--format`.

# README Updates

Update sandbox/docs/USAGE.md to document new options:

- `--serve-plot` to start HTTP server for plots.
- `--plot-port` to specify server port (default 4000).
- Format endpoints:
  • GET http://localhost:4000/plot for JSON.
  • GET http://localhost:4000/csv for CSV.
  • GET http://localhost:4000/svg for SVG.
  • GET http://localhost:4000/html for HTML.

Provide examples:

npm run start -- -f sine --serve-plot
npm run start -- -f sine --serve-plot --plot-port 8080

# Testing Deliverables

1. In tests/unit/main.test.js and sandbox/tests/main.test.js add tests to verify:
   • Starting with `--serve-plot` and default port launches server responding with correct content for each path and format.
   • Custom port launches server on that port.
   • Invalid port values cause process to throw error and not start server.
   • Default console output without serve-plot continues to print data to stdout unchanged.
2. Ensure all existing plotting and conversion tests continue to pass unmodified.