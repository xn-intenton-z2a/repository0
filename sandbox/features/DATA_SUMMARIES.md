# DATA_SUMMARIES

# Purpose
Provide users with quick statistical insights into the generated data series by computing summary statistics such as minimum, maximum, mean, and median values. This feature helps users understand data distributions without manual calculation.

# CLI Behavior
- Introduce a flag --stats (alias --summary) to compute summary statistics for the selected plot or polar series.
- Add an optional --stats-format parameter to choose output format: text (default) or json.
- When --stats is present:
  - After data generation, calculate min, max, mean, median, and count of data points for X and Y values.
  - If --stats-format=text:
    - Print a formatted table to stdout:
      Statistic    X Value    Y Value
      ----------   -------    -------
      Count        100        100
      Min          0          -1
      Max          10         1
      Mean         5          0
      Median       5          0
  - If --stats-format=json:
    - Print a JSON object with keys count, min, max, mean, median under fields x and y.
  - Exit with code 0 after printing statistics and do not write SVG or data files.

# HTTP Endpoints
- Extend GET /plot and GET /polar endpoints to accept query parameter stats=true and optional statsFormat=text or statsFormat=json.
- When stats=true:
  - Validate required parameters (function, range or polar ranges) as usual.
  - Generate data but do not produce SVG.
  - Compute summary statistics on the data points.
  - For statsFormat=text respond with Content-Type text/plain and a human-readable table.
  - For statsFormat=json respond with Content-Type application/json and a JSON object containing statistics.
  - On invalid statsFormat respond with status 400 and descriptive message.

# Implementation Details
- In handlePlot and handlePolar in sandbox/source/main.js:
  - Read argv.stats and argv.statsFormat or params.get('stats') and params.get('statsFormat').
  - If stats flag is true:
    1. Call generatePlotData or generatePolarData to get array of points.
    2. Compute count as length, min as minimum over values, max, mean as sum divided by count, median by sorting values and picking middle.
    3. Format output based on statsFormat.
    4. Bypass SVG generation and direct data export.
- Add helper function computeStats(data) returning object { x: {count,min,max,mean,median}, y: {...} }.

# Testing
- Add sandbox/tests/data-summaries.test.js covering:
  - CLI: --plot sine --range 0,6.28 --stats generates correct text table when stats-format is omitted.
  - CLI: --plot quadratic --stats --stats-format=json outputs JSON with proper numeric fields.
  - CLI exit code is 0 and no plot.svg file is created.
  - HTTP: GET /plot?function=quadratic&range=0,5&stats=true returns text/plain table.
  - HTTP: GET /polar?function=rose&radius-range=0,1&angle-range=0,6.28&stats=true&statsFormat=json returns application/json with stats.
  - HTTP: invalid statsFormat results in 400 with descriptive error.

# Documentation
- Update sandbox/docs/CLI_USAGE.md to document --stats, --summary, and --stats-format options with examples.
- Update sandbox/docs/HTTP_SERVER.md to include stats and statsFormat query parameters.
- Update README.md features section to mention Data Summaries Support.