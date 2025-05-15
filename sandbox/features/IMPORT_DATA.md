# IMPORT_DATA

# Purpose
Allow users to plot arbitrary data series from external CSV or JSON files instead of predefined or custom functions, enabling visualization of real-world datasets.

# CLI Behavior
- Introduce flag --input-data <filename> for CSV or JSON files.
- When --input-data is present, ignore --plot and --expression flags and load data from the specified file.
- For CSV: expect header row x,y and numeric values. For JSON: expect an array of objects with numeric x and y properties.
- Validate file existence and format; on parse errors or invalid values, print descriptive error and exit with code 1.
- After parsing, allow existing flags (styling, log-scale, noise, stats, export-data, output) to apply to the imported data series.
- Default output behavior: write SVG to --output or plot.svg if --export-data is not specified.

# HTTP Endpoints
- Extend GET /plot-data to accept query parameter dataFile=<filename> for server-accessible JSON datasets; ignore function and range when dataFile is set.
- Implement POST /plot endpoint that accepts a JSON body with an array of {x,y} points and query parameters for styling and transformations.
- Validate body payload or file reference; respond with HTTP 400 and descriptive message on errors.
- Generate and return an SVG using imported data points, honoring styling and scale parameters.

# Implementation Details
- In CLI handler: detect argv.inputData. Read file via fs; determine format by extension.
- For CSV: split lines, parse header, map numeric values. For JSON: JSON.parse and validate shape.
- Bypass generatePlotData; use loaded data array in generatePlotSVG and downstream transformations (log scale, noise, stats).
- In HTTP server: detect params.get('dataFile') for GET /plot-data, and req.method POST /plot with JSON body.
- Reuse existing SVG builders by passing loaded data instead of calling generatePlotData.
- Ensure error handling for missing files, invalid JSON or CSV, unsupported extensions.

# Testing
- Add sandbox/tests/data-import.test.js covering:
  - CLI: --input-data sample.csv produces SVG with correct number of points.
  - CLI: --input-data sample.json produces SVG matching input values.
  - CLI errors for missing file, invalid CSV format, or malformed JSON.
  - HTTP: POST /plot with JSON body returns 200 and SVG containing polyline for each provided point.
  - HTTP: GET /plot-data?dataFile=sample.json&format=json returns original JSON array and 400 on missing or invalid file.

# Documentation
- Update sandbox/docs/CLI_USAGE.md to document --input-data flag, expected CSV/JSON formats, and examples.
- Update sandbox/docs/HTTP_SERVER.md to describe GET /plot-data dataFile usage and POST /plot endpoint with JSON payload.
- Update README.md features section to include Import Data Support.