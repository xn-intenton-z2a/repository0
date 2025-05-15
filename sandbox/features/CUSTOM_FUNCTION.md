# Custom Function Support

## Purpose
Allow users to define and plot arbitrary mathematical functions via a CLI flag or HTTP parameter. Expands the tool beyond predefined functions (quadratic, sine, spiral, rose) to any JavaScript-compatible expression of x.

# CLI Behavior
- Introduce a new --expression flag that accepts a string representing a function of x, for example x*2+Math.sin(x)
- When --expression is provided alongside --plot, compile the expression into a JavaScript function and generate data points over the specified range
- Expression takes precedence over named functions; if both --plot and --expression are present, ignore the plot value and use the expression
- Validate the expression by evaluating at a sample x; on syntax or runtime error, output a descriptive error and exit with code 1
- Support --export-data, --output, --resolution, and --range flags as with existing behavior

# HTTP Endpoints
- Extend GET /plot-data and GET /plot to accept an expression parameter in place of function
  - Query parameter expression=<js expression>
  - Expression is URL-decoded and used for data generation or SVG
  - If expression is provided, named function parameter is ignored
  - Validate expression with sample evaluation; respond 400 on error with message
- Update help text to document expression usage for CLI and HTTP

# Implementation Details
- In sandbox/source/main.js, detect argv.expression and args index for --expression
- Compile expression string into a function via new Function('x','return '+expression)
- On first invocation, test the function at x=0 to catch syntax errors
- Replace generatePlotData call to accept custom function callback when expression is present instead of predefined generator
- For SVG generation, map sample x values through the custom function for y

# Testing
- Add sandbox/tests/custom-function.test.js covering:
  - CLI: --plot dummyName --expression "x*2" generates SVG with y values equal to 2*x
  - CLI error: invalid expression "x**" exits code 1 and logs syntax error
  - HTTP: GET /plot-data?expression=x%2B2&range=0,2&format=json returns correct numeric array
  - HTTP error: invalid expression parameter returns 400 with descriptive message

# Documentation
- Update sandbox/docs/CLI_USAGE.md under plot options to document --expression usage with examples
- Update sandbox/docs/HTTP_SERVER.md to include expression parameter in /plot-data and /plot endpoints
- Update README.md to mention custom function support under features section