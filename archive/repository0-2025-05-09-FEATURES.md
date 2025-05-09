sandbox/features/HTTP_CONVERSION_API.md
# sandbox/features/HTTP_CONVERSION_API.md
# Summary

Extend the conversion-rate CLI to serve the effective conversion rate over HTTP in addition to existing console output. Introduce a new --serve (alias -s) option that starts a lightweight HTTP server. Add a --port option to configure the listening port, defaulting to 3000.

# Implementation

1. Modify sandbox/source/main.js to:
   - Enhance minimist parsing to accept:
     • --serve (alias -s) boolean flag; when provided, run HTTP server instead of exiting immediately.
     • --port numeric option for server port; default 3000.
   - After computing and validating conversionRate:
     • If serve flag is true:
       - Import http from node built in modules.
       - Validate port is a positive integer. On invalid port, log error and throw.
       - Create HTTP server that handles GET requests on path / and responds with Content-Type application/json and body {"conversionRate": rate}.
       - Start listening on configured port and log message "Conversion API listening on port PORT".
       - Do not exit immediately; allow server to run until process termination.
     • Else (default behavior):
       - Log the conversion rate as before and return result.

# README Updates

Update sandbox/docs/USAGE.md in the section describing CLI usage to include:

- New option --serve (alias -s) to start HTTP server.
- New option --port to specify server port (default 3000).
- Examples:
  npm run start -- --serve
  npm run start -- --serve --port 8080

# Testing Deliverables

1. In sandbox/tests/main.test.js add tests to verify:
   • Starting main with serve and default port launches server responding to GET http://localhost:3000/ with expected JSON { conversionRate: rate }.
   • Starting with serve and custom port launches server on that port and returns correct JSON.
   • Invalid port values (negative or non numeric) cause process to throw error and not start server.
   • Existing tests for default console output continue to pass unmodified.
sandbox/features/EXPORT_SVG.md
# sandbox/features/EXPORT_SVG.md
# Summary

Extend the existing plotting CLI to support SVG output format for function data points in addition to JSON and CSV. Introduce a new --output-format (alias -o) option value "svg" that generates a simple line chart as an SVG graphic. Allow customization of dimensions and file output.

# Implementation

1. Modify src/lib/main.js to:
   - Enhance minimist parsing to accept:
     • --output-format (-o) with values json, csv, svg; default json.
     • --width and --height numeric options for SVG canvas dimensions; defaults 800 and 600.
     • --export-file (-f) string option for writing SVG to a file path; if omitted, SVG is written to stdout.
   - After computing the array of points (x,y), branch on output-format:
     • json: serialize points as JSON.
     • csv: as in EXPORT_CSV feature.
     • svg:
       - Compute viewBox and scale coordinates to fit width and height while preserving aspect ratio.
       - Generate an SVG document string with <svg> root, <polyline> element connecting points, and optional axes lines at x=0 and y=0.
       - If --export-file is provided, write using fs.writeFileSync; otherwise console.log the SVG string.
   - Validate numeric dimensions (positive integers) and valid file path; on invalid input, exit with code 1 and print an error message.

# README Updates

- Update Usage section to list new output-format value "svg" and new flags --width, --height, --export-file.
- Provide examples:
  node src/lib/main.js --function sine --from 0 --to 6.28 --step 0.1 --output-format svg
  node src/lib/main.js --function quadratic --output-format svg --width 1024 --height 768 --export-file curve.svg

# Testing Deliverables

1. In tests/unit/main.test.js and sandbox/tests/main.test.js add tests to verify:
   - --output-format svg produces a string containing <svg> and a <polyline> with correct point count.
   - --width and --height flags appear as width and height attributes in the <svg> element.
   - Providing --export-file writes the SVG file with expected content (mock fs to intercept writeFileSync).
   - Invalid dimension values (zero or negative) and unsupported output-format values cause the process to exit with code 1 and print an error.
2. Ensure all existing JSON and CSV output tests continue to pass unmodified.sandbox/features/EXPORT_CSV.md
# sandbox/features/EXPORT_CSV.md
# Summary

Extend the plotting CLI to support CSV output format for function data points in addition to the existing JSON output. Introduce a new --output-format (alias -o) option that accepts either "json" or "csv", defaulting to "json".

# Implementation

1. Enhance sandbox/source/main.js to:
   - Parse a new --output-format (alias -o) option via minimist.
   - Validate that the provided format is either "json" or "csv". On invalid values, exit with code 1 and print an error message.
   - After generating the array of points, choose the output serialization:
     - For "json", print the array as JSON to stdout.
     - For "csv", print a header line "x,y" followed by each point as a CSV row (x,y) to stdout.
2. Update sandbox/source/main.js argument parsing block to include the new option with default value.
3. Ensure proper error handling and process exit on invalid format.

# README Updates

- Add a section in the Usage guide describing the new --output-format (-o) option, valid values, and default.
- Provide examples:
  - node sandbox/source/main.js --function sine --from 0 --to 6.28 --step 0.1 --output-format csv
  - npm run start -- --output-format json

# Testing Deliverables

1. In sandbox/tests/main.test.js, add unit tests to verify:
   - Default behavior outputs valid JSON string for points.
   - Using --output-format csv outputs a CSV with header and expected rows for a small range.
   - Providing an unsupported format (e.g., "xml") causes the process to exit with an error and non-zero code.
2. Ensure all tests pass under the new behavior.sandbox/features/EXPORT_HTML.md
# sandbox/features/EXPORT_HTML.md
# Summary

Extend the existing plotting CLI to support HTML output format that wraps the generated SVG line chart inside a self-contained HTML document. Introduce a new output-format value html (alias -o html) that uses EJS to render an HTML template with embedded SVG and optional title.

# Implementation

1. Update src/lib/main.js to:
   • Accept output-format html as a new branch alongside json, csv, svg.
   • Add options:
     – --title string   (HTML document title; default "Function Plot")
     – --template-file string   (path to custom EJS template; if omitted, use built-in template)
   • When html format is selected:
     – Generate the SVG string as in EXPORT_SVG feature.
     – Load a default EJS template string embedded in code or read from template-file if provided.
     – Render HTML by passing title and svg content into EJS render function.
     – If --export-file is provided write the HTML string to the file; otherwise print to stdout.
   • Validate title is nonempty, template-file exists and is readable; on error exit with code 1 and print message.

# README Updates

- Update Usage section to list html as a valid output-format.
- Document new flags --title and --template-file.
- Provide examples:
  node src/lib/main.js --function sine --from 0 --to 6.28 --step 0.1 --output-format html
  node src/lib/main.js --function quadratic --output-format html --title "My Plot" --export-file plot.html

# Testing Deliverables

1. In tests/unit/main.test.js and sandbox/tests/main.test.js add tests to verify:
   • --output-format html produces a string containing <html>, <head>, <body>, and the <svg> content with correct dimensions.
   • Providing --title sets the <title> element accordingly.
   • Providing a custom --template-file loads and applies the custom template.
   • --export-file writes an HTML file with expected content (mock fs to intercept write).
   • Invalid template-file path or empty title causes process to exit with code 1 and print an error.
2. Ensure existing json, csv, svg tests continue to pass unmodified.sandbox/features/RESEED_CONVERSION_RATE.md
# sandbox/features/RESEED_CONVERSION_RATE.md
# Summary

Update the repository default issue-to-code conversion rate from 0.5 to a higher baseline and expose a CLI option to override this value at runtime. Ensure the new rate is documented in the README and covered by unit tests.

# Implementation

1. Update package.json to set config.issueToCodeConversionRate to 0.75.
2. Enhance src/lib/main.js to:
   - Read the conversion rate from package.json config.
   - Accept an optional --issue-to-code-rate CLI argument (numeric between 0 and 1) that overrides the default.
   - Log the effective conversion rate on startup.

# README Updates

- Document the new default conversion rate in the Configuration section.
- Show example of running the CLI with and without the --issue-to-code-rate flag:

  ```bash
  npm run start -- --issue-to-code-rate 0.85
  ```

# Testing Deliverables

1. Add unit tests in tests/unit/main.test.js to verify:
   - Default behavior uses rate 0.75.
   - CLI override sets the conversion rate to the provided value.
   - Invalid values (outside [0,1] or non-numeric) cause the tool to exit with an error.
2. Ensure all tests pass with new behavior.
sandbox/features/ASCII_PLOT.md
# sandbox/features/ASCII_PLOT.md
# Summary

Introduce an ASCII plot mode for the CLI that renders simple text-based line charts of quadratic and sine functions directly in the console. Add a new --ascii-plot option (alias -A) and accompanying size flags to control the dimensions of the text grid. This enables quick previews without generating files.

# Implementation

1. Modify sandbox/source/main.js to:
   - Enhance minimist parsing to accept:
     • --ascii-plot (alias -A) boolean flag; when provided, run ASCII plot renderer and exit.
     • --plot-width numeric option; default 80 columns.
     • --plot-height numeric option; default 20 rows.
   - After validating function type, range (--from, --to) and step, if ascii-plot flag is true:
     1. Generate points for the selected function over the range.
     2. Determine minY and maxY from the data set.
     3. Create a 2D array of spaces with dimensions [plot-height][plot-width].
     4. For each data point, compute:
        • col = round(((x - from) / (to - from)) * (plot-width - 1))
        • row = round((maxY - y) / (maxY - minY) * (plot-height - 1))
        • Mark the cell with an asterisk.
     5. Join each row into a string and print lines from top to bottom.
     6. After rendering, exit the process.
   - Validate plot-width and plot-height are positive integers; on invalid values, log error to stderr and exit with code 1.

# README Updates

Update sandbox/docs/USAGE.md:
- Document new flag --ascii-plot (alias -A) to enable ASCII rendering.
- Document --plot-width and --plot-height options with defaults.
- Provide examples:
  npm run start -- --function sine --ascii-plot
  npm run start -- --function quadratic --ascii-plot --plot-width 100 --plot-height 25

# Testing Deliverables

In sandbox/tests/main.test.js:
1. Add tests to verify that running main with --ascii-plot outputs an array of lines containing asterisks at expected positions for both quadratic and sine functions.
2. Test custom --plot-width and --plot-height values produce the correct number of columns and rows.
3. Verify invalid width or height values (zero, negative, non-numeric) cause process.exit(1) after logging an error.
4. Ensure existing SVG and conversion-rate tests remain unaffected and continue to pass without modification.sandbox/features/HTTP_PLOT_API.md
# sandbox/features/HTTP_PLOT_API.md
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
2. Ensure all existing plotting and conversion tests continue to pass unmodified.sandbox/features/PLOT_FUNCTIONS.md
# sandbox/features/PLOT_FUNCTIONS.md
# Summary

Enhance the CLI in sandbox/source/main.js to compute and output data points for simple mathematical functions, now including a new polar coordinate mode. Users can specify the function type (quadratic, sine, or polar), numeric range, and step size. Results are serialized as JSON by default.

# Implementation

1. Update sandbox/source/main.js:
   - Use minimist to parse options:
     • --function (-f): string, values "quadratic", "sine", or "polar"; default "quadratic".
     • --from (-a): number, start of range; default -10 for cartesian, 0 for polar.
     • --to (-b): number, end of range; default 10 for cartesian, 6.283185307179586 (2π) for polar.
     • --step (-s): number, increment; default 1. Must be positive.
   - Validate:
     • Function name is one of supported values; on invalid name print error to stderr and exit code 1.
     • Numeric parameters are finite numbers; --step must be positive; on validation failure print clear error and exit code 1.
   - Compute points array:
     • For quadratic: as before, y = x * x.
     • For sine: as before, y = Math.sin(x).
     • For polar:
       – Interpret range values as theta in radians.
       – Loop theta from start to end (inclusive), stepping by step.
       – For each theta compute r = theta.
       – Compute x = r * Math.cos(theta) and y = r * Math.sin(theta).
       – Push an object { x, y }.
   - Serialize the array of points as JSON and print to stdout.
   - Return the array for programmatic invocation.

# README Updates

- In sandbox/docs/USAGE.md under **Plot Functions**:
  • List polar as a valid function: --function polar
  • Note defaults: --from 0, --to 6.283185307179586, --step 1
  • Provide example:
    npm run start -- --function polar
    # Outputs [{"x":0,"y":0},...,{"x":6.2831853*...}]

# Testing Deliverables

1. In sandbox/tests/main.test.js add unit tests to verify:
   • Running main with --function polar and default range produces an array of points matching r=theta spiral in JSON format.
   • Custom --from, --to, --step values for polar yield expected x,y pairs for known theta values (e.g., 0, π/2, π).
   • Supplying an unsupported function name causes process.exit with code 1 and logs an error.
   • Invalid numeric values (non-numeric or negative step) exit with code 1 and an error message.
2. Ensure existing tests for quadratic and sine continue to pass unmodified.