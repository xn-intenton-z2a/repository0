# Data Export

## Purpose
Allow users to export generated plot data points as CSV or JSON files via the CLI and HTTP interface. Facilitates downstream analysis and integration.

## CLI Behavior
- Add a new --export-data flag that accepts a filename with .csv or .json extension
- When used with --plot or --polar, compute data points and write to the specified file instead of generating SVG
- CSV output includes a header row "x,y" followed by each numeric pair on its own line
- JSON output is an array of objects with x and y properties
- If both --export-data and --output are provided, prioritize export-data and ignore output for SVG

## HTTP Endpoints
- Extend the HTTP server to support GET /plot-data and GET /polar-data with existing query parameters plus:
  - format=<csv|json>
  - output=<filename>
- Respond with Content-Type text/csv for CSV and application/json for JSON when writing directly in HTTP response
- Validate format parameter and return 400 on invalid or missing values

## Implementation Details
- In sandbox/source/main.js, parse argv["export-data"] and raw args for export-data flag
- In handlePlot and handlePolar, detect export-data and branch to data export logic
- Compute xs and ys arrays as currently implemented
- Serialize data: for CSV, join header and rows; for JSON, JSON.stringify array
- Use fs.writeFileSync to write file to process.cwd()
- Update HTTP routing: add handlers for /plot-data and /polar-data that generate and return data in response; reuse existing parsing logic for ranges and functions

## Testing
- Add sandbox/tests/data-export.test.js to cover:
  - CLI: plot quadratic --export-data data.csv creates CSV with header and 100 data rows
  - CLI: polar rose --export-data data.json creates JSON array with correct length
  - HTTP: request /plot-data?function=sine&range=0,6.28&format=json returns valid JSON array
  - HTTP: request /polar-data?function=spiral&radius-range=0,1&angle-range=0,6.28&format=csv returns CSV content with header

## Documentation
- Update README.md and sandbox/docs/CLI_USAGE.md to document the --export-data flag and new HTTP endpoints