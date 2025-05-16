# DATA_IMPORT_ANALYSIS

Enable users to load external datasets in CSV or JSON format for plotting and generate summary statistics to gain insights into their data.

# CLI_INTEGRATION

Introduce a new flag --input-data <path> on both plot and polar commands. When provided, the CLI will read the file at the given path (CSV or JSON), parse it into data points with x and y fields, and use that data for plotting instead of generating synthetic function data. Additionally, add a new flag --summary-output <path> that, when combined with --input-data, writes a summary JSON file containing count, min, max, mean, and median for both x and y values. If --summary-output is omitted, the summary is printed to stdout.

# HTTP_ENDPOINT_SUPPORT

Extend the HTTP server with a new endpoint /data-summary that accepts query parameters dataUrl and format. The server will fetch or read the dataset from a local path or remote URL (CSV or JSON), parse into data points, compute summary statistics (count, min, max, mean, median for x and y), and return a JSON response. For /plot and /polar endpoints, accept an optional query parameter inputData to supply inline JSON data. When present, the server uses this data instead of generating function data.

# IMPLEMENTATION_NOTES

In sandbox/source/main.js:
- Implement a parser for CSV: read the file, split lines by newline, split each row by comma, map to {x, y} numbers.
- For JSON input, parse as array of objects with numeric x and y properties.
- Add helper computeSummary(data) to calculate count, min, max, mean, and median for x and y arrays.
- In handlePlot and handlePolar, detect argv['input-data'], read and parse before calling generatePlotSVG or generatePolarSVG.
- Add new subcommand handleDataSummary that reads argv['input-data'], computes summary, writes or prints based on argv['summary-output'].
- In startServer, add route for /data-summary and extend /plot and /polar handlers to check params.get('inputData') and use JSON.parse when present.

Add unit tests in sandbox/tests/cli-interface.test.js for CLI parsing of --input-data and --summary-output, and integration tests in sandbox/tests/data-export.test.js or a new test file to verify /data-summary endpoint behavior.
