sandbox/features/STYLE_PLOTTER.md
# sandbox/features/STYLE_PLOTTER.md
# Overview

Add support for customizing the appearance of generated SVG plots through new CLI flags. Users can specify stroke color, stroke width, fill color, background color, and SVG dimensions to tailor plots to their requirements.

# CLI Usage

- --stroke-color <css-color>    Set the stroke color for the plot path. Accepts any valid CSS color value. Defaults to #000.
- --stroke-width <number>       Set the stroke width for plot lines in pixels. Must be a positive number. Defaults to 2.
- --fill-color <css-color>      Set the fill color for areas under curves or closed shapes. Defaults to none.
- --background-color <css-color> Set the background rectangle color behind the plot. Defaults to transparent.
- --width <number>              Set the width attribute of the SVG in pixels. Must be a positive integer. Defaults to 800.
- --height <number>             Set the height attribute of the SVG in pixels. Must be a positive integer. Defaults to 600.

# Source File Changes

Modify src/lib/main.js to:

1. Extend argument parsing to recognize stroke-color, stroke-width, fill-color, background-color, width, and height flags.
2. Validate numeric flags (stroke-width, width, height) are positive. On invalid values exit with code 1 and descriptive error.
3. Pass style parameters into the SVG generation logic:
   - Include width and height attributes on the <svg> root element.
   - If background-color is provided, render a <rect> behind the plot covering the full SVG area.
   - Apply stroke-color and stroke-width to the <path> element generating the plot line.
   - Apply fill-color to the <path> or supplementary <polygon> element when set.
4. Ensure existing plot data generation remains unchanged when style flags are omitted.

# Tests

Add sandbox/tests/style-plot.test.js with tests that:

- Invoke main with expression or function flags combined with style flags and assert the output SVG has width and height attributes matching provided values.
- Assert that the <path> element includes the provided stroke-color and stroke-width attributes.
- Assert that background <rect> is present and has the provided fill color when background-color is specified.
- Test that omitting style flags results in defaults (width 800, height 600, stroke #000, stroke-width 2, no fill or background rect).
- Test invalid numeric or color inputs result in exit code 1 and descriptive error messages.

# Documentation

Update README.md to:

- Document all new style-related CLI flags with descriptions and default values.
- Provide example commands demonstrating custom stroke color, width, fill, background, and SVG dimensions.
- Show snippets of SVG output highlighting new attributes.sandbox/features/MULTI_SERIES.md
# sandbox/features/MULTI_SERIES.md
# Overview

Add support for plotting multiple series of data or functions on a single SVG output with distinct styling and an automatic legend.

# CLI Usage

- --series <label>:<kind>:<value>  Define a series to plot. label is a text identifier. kind is one of expression,function,data-file,polar. value is the argument for the kind (expression string, built-in function name, path to data file, or polar expression). This flag can be repeated to include multiple series.

# Source File Changes

1. Extend argument parsing to collect all --series flags into an array. For each series string split into label, kind, and value. Validate kinds and syntax, exiting with code 1 on errors.
2. For each defined series use existing plotting logic: evaluate expressions or functions, parse data files, or compute polar coordinates. Build individual SVG path elements for each series.
3. Assign a distinct stroke color from a default palette for each series. Pass optional global style flags (stroke-width, fill, etc) or use defaults.
4. Compute combined x and y extents across all series to set a unified viewBox that fits all curves and data points.
5. After rendering all paths, generate a legend group located in a plot margin. For each series draw a small colored rectangle and adjacent text label matching the series label and color.
6. Ensure backward compatibility so that if no --series flag is provided, the CLI falls back to single series behavior with existing flags.

# Tests

Add sandbox/tests/multi-series.test.js with tests that:
- Invoke main with a single --series flag and verify the output SVG contains one <path> element and no legend group.
- Invoke main with two --series flags and assert the output includes two <path> elements and a <g> element for the legend containing two <rect> and two <text> entries.
- Test that invalid series syntax or unsupported kind yields exit code 1 with a descriptive error.

# Documentation

Update README.md to document the --series flag syntax and behavior. Provide example commands plotting multiple series and show a snippet of the SVG output illustrating two colored lines and a legend.sandbox/features/HTTP_PLOTTER.md
# sandbox/features/HTTP_PLOTTER.md
# Overview

Add HTTP server support to serve SVG plots through a RESTful HTTP API alongside the existing CLI.

# HTTP Server Mode

Use a new --server flag to launch an HTTP server on a configurable port. Defaults to port 3000 if not provided. In server mode the CLI does not output to stdout but listens for incoming HTTP requests.

# Endpoints

GET /plot
Query parameters:
- expression: Custom mathematical expression in x (overrides built-in functions)
- function: sine or quadratic if expression is omitted
- range: Comma-separated min,max for x values; defaults to -10,10
- points: Number of sample points; defaults to 100

GET /polar
Query parameters:
- polar: Polar expression in theta (overrides other flags)
- theta-range: Comma-separated min,max for theta; defaults to 0,2*pi
- points: Number of sample points; defaults to 100

Responses return the generated SVG content with Content-Type image/svg+xml.

# Source File Changes

1. Import http module from Node.js or add express as a new dependency in package.json
2. Detect the --server flag and optional port value when parsing CLI arguments
3. If server mode is enabled, start the HTTP server and register routes for /plot and /polar
4. Parse query parameters and forward to existing plotting functions to generate SVG strings
5. Send SVG in the HTTP response with status 200 and Content-Type image/svg+xml; send 400 on validation errors
6. Keep the process running to serve requests and log incoming requests and errors

# Tests

Add sandbox/tests/http.test.js with tests that:
- Start the server in a child process and send HTTP GET requests to /plot and /polar
- Assert that responses have status 200 and include valid <svg> tags
- Send requests with invalid expressions or ranges and assert status 400 and error message content

# Documentation

Update README.md to:
- Describe the new --server CLI flag and port option
- Document HTTP endpoints /plot and /polar with their query parameters
- Provide example curl commands showing SVG responsessandbox/features/AXES_LABELS.md
# sandbox/features/AXES_LABELS.md
# Overview

Add support for labeling and customizing the X and Y axes on generated SVG plots. Users can specify axis titles and tick marks for clearer interpretation of plotted data and functions.

# CLI Usage

- --x-label <text>           Set the label text for the X axis. Defaults to no label.
- --y-label <text>           Set the label text for the Y axis. Defaults to no label.
- --x-ticks <n|list>         Define tick positions on the X axis. Provide a number to auto-generate that many ticks or a comma-separated list of numeric positions. Defaults to automatic ticks based on range.
- --y-ticks <n|list>         Define tick positions on the Y axis. Provide a number to auto-generate that many ticks or a comma-separated list of numeric positions. Defaults to automatic ticks based on range.
- --show-grid                Enable light grid lines at each tick intersection. Defaults to off.

# Source File Changes

Modify src/lib/main.js to:

1. Extend argument parsing to recognize x-label, y-label, x-ticks, y-ticks, and show-grid flags.
2. Normalize tick inputs: if numeric count, compute evenly spaced tick values over the plot range; if list, parse comma-separated numeric values.
3. Pass axis label and tick configuration into the SVG generation logic.
4. In SVG output:
   - Render axis lines: a horizontal line at y=0 and a vertical line at x=0 (if within viewBox).
   - Place tick marks and numeric labels along axes according to configured positions.
   - Add axis title text elements at ends of axes with the provided label text.
   - If show-grid is enabled, draw thin lines parallel to axes at each tick.
5. Ensure backward compatibility: when no axis options are provided, omit axis lines, ticks, labels, and grid.

# Tests

Add sandbox/tests/axes-labels.test.js with tests that:

- Invoke main with an expression flag and --x-label and --y-label, verify output SVG includes <text> elements with correct label text positioned near axis ends.
- Test numeric x-ticks and y-ticks count: count=5 generates exactly five tick lines and five numeric <text> labels on each axis.
- Test comma list of ticks: provided list ["-5,0,5"] results in tick marks at those positions.
- Assert that enabling --show-grid adds <line> elements for grid lines at each tick intersection.
- Confirm default behavior when no axis flags: no <line> or <text> elements for axes or ticks.
- Validate invalid tick input (non-numeric) yields exit code 1 and descriptive error.

# Documentation

Update README.md to:

- Document new axis-related CLI flags with their descriptions, expected formats, and default behaviors.
- Provide example commands showing labeled axes and custom ticks with and without grid.
- Include snippet of SVG output illustrating axis titles, tick marks, and grid lines.sandbox/features/DATA_PLOTTER.md
# sandbox/features/DATA_PLOTTER.md
# Overview

Add support for plotting arbitrary datasets from JSON or CSV files. This feature lets users supply a file containing data points and renders the corresponding Cartesian plot as an SVG output. It complements equation and polar plotting by enabling visualization of real or imported data.

# CLI Usage

- --data-file <file-path>  Path to a JSON or CSV file containing data points. JSON format is an array of objects with numeric fields x and y. CSV format is two columns representing x and y values with an optional header. Overrides expression, function, and polar flags.
- --output <file-path>     Optional path to write SVG file; defaults to stdout.

Examples:

npm run start -- --data-file data.json --output dataset.svg
npm run start -- --data-file measurements.csv

# Source File Changes

Modify src/lib/main.js to:
1 Recognize the --data-file flag when parsing CLI arguments and ignore other plot flags
2 Read the specified file with fs and determine format by extension
3 For JSON files parse content as JSON and validate presence of numeric x and y fields in each entry
4 For CSV files split content into lines, skip header if present, parse each line by comma into numeric x and y values
5 Build an array of points from parsed values; on parse error exit with code 1
6 Generate an SVG path connecting the data points similar to function plotting
7 Adjust viewBox to fit the extent of x and y values
8 Write SVG string to stdout or to the specified output file
9 Exit with code 0 on success

# Tests

Add sandbox/tests/data-plot.test.js with tests that:
- Invoke main with a JSON file containing a simple array of points and assert output includes valid <svg> tags and correct path coordinates based on sample data
- Invoke main with a CSV file containing header and data lines and verify behavior is identical to JSON input
- Test invalid JSON syntax and missing fields result in exit code 1 and error message
- Test invalid CSV format (non-numeric values) results in exit code 1 and error

# Documentation

Update README.md to:
- Document the new --data-file flag and its supported file formats
- Provide examples of JSON and CSV inputs and corresponding CLI commands
- Note that this feature uses built in parsing and requires no extra dependenciessandbox/features/EQUATION_PLOTTER.md
# sandbox/features/EQUATION_PLOTTER.md
# Overview

Extend the CLI entry point to support custom mathematical expressions in addition to sine and quadratic functions. Leverage mathjs to parse and evaluate expressions over a defined range of x values and render the result as an SVG plot.

# CLI Usage

- --expression <expr>   Optional mathematical expression in terms of x (e.g. x^3 + 2*x - 5). Overrides --function when provided.
- --function <sine|quadratic>   Select a built-in function when --expression is not used.
- --range <min,max>     Optional numeric range for x values; defaults to -10,10.
- --points <n>          Number of sample points; defaults to 100.
- --output <file-path>  Optional path to write SVG file; defaults to printing SVG to stdout.

Examples:

npm run start -- --expression 'x^3 + 2*x - 5' --output graph.svg
npm run start -- --function sine --range -5,5 --points 200

# Source File Changes

Modify src/lib/main.js to:
1. Import minimist for argument parsing and mathjs for expression evaluation.
2. Parse flags: expression, function, range, points, output.
3. Validate expression syntax via mathjs; on error exit with code 1.
4. Generate an array of x values evenly spaced over the specified range.
5. Evaluate the chosen expression or built-in function at each sample point.
6. Build an SVG path string connecting computed points; ensure correct viewBox.
7. Write SVG string to stdout or to the specified file using fs.
8. Exit with code 0 on success.

# Tests

Add sandbox/tests/plot.test.js with feature-level tests:
- Invoke main with --expression and assert output contains valid SVG tags and expected path commands.
- Invoke main with invalid expression and assert non-zero exit code.
- Invoke main with built-in sine and quadratic and verify behavior unchanged.
- Test --range and --points flags adjust the SVG path complexity.

# Documentation

Update README.md to:
- Document new --expression, --range, and --points flags.
- Provide usage examples showing custom expressions and built-in functions.
- Include a note on adding mathjs to dependencies.sandbox/features/POLAR_PLOT.md
# sandbox/features/POLAR_PLOT.md
# Overview

Add support for polar coordinate plotting so users can supply a polar function r(theta) and render the corresponding Cartesian curve as an SVG plot.

# CLI Usage

- --polar <expr>         Polar expression in terms of theta (e.g. 2*sin(3*theta)). Overrides --expression and --function flags.
- --theta-range <min,max>  Numeric range for theta values; defaults to 0,2*pi.
- --points <n>           Number of sample points; defaults to 100.
- --output <file-path>   Path to write SVG file; defaults to printing SVG to stdout.

Examples:

npm run start -- --polar '1+cos(theta)' --theta-range 0,6.283 --points 200 --output polar.svg

# Source File Changes

Modify src/lib/main.js to:
1. Import mathjs for parsing and evaluating polar expressions.
2. Recognize the --polar flag and parse theta-range, points, and output.
3. Validate the polar expression syntax via mathjs; exit with code 1 on error.
4. Generate an array of theta values evenly spaced over the specified range.
5. Evaluate r(theta) at each sample point and convert to x and y using x=r*cos(theta), y=r*sin(theta).
6. Build an SVG path string connecting the computed Cartesian points; adjust viewBox to include full curve.
7. Write the SVG string to stdout or to the specified file using fs.
8. Exit with code 0 on success.

# Tests

Add sandbox/tests/polar.test.js with tests that:
- Invoke main with --polar and assert output contains valid SVG tags and expected move and curve commands.
- Invoke main with invalid polar expression and assert non-zero exit code.
- Verify that theta-range and points flags adjust plot complexity.

# Documentation

Update README.md to:
- Document new --polar and --theta-range flags.
- Provide usage examples for polar plots.
- Note the addition of mathjs to dependencies.
