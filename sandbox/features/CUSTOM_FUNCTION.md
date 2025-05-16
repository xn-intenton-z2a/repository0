# CUSTOM_FUNCTION

Allow users to specify custom mathematical expressions for Cartesian and polar plots and support plotting multiple series in a single chart.

# CLI INTEGRATION

Introduce two new flags on the plot and polar commands:

• --expression <expr>  
  Accepts a single JavaScript-like mathematical expression in variable x for Cartesian or theta for polar. The tool evaluates the expression at each sample point to compute y or radius.

• --expressions <expr1,expr2,...>  
  Accepts a comma-separated list of expressions. Each expression is rendered as a separate polyline in the SVG output. If expressions is provided, ignore the --expression flag and predefined functions.

Behavior:
- The tool parses each expression and validates allowed characters and operators.
- For Cartesian plots, iterate x over the specified range. For each expression f, compute y = f(x).
- For polar plots, iterate theta over angle-range. For each expression g, compute r = g(theta).
- Assign distinct stroke colors to each series by cycling through a default palette if multiple series are given.
- If evaluation fails for any expression, report an error and exit.

# HTTP ENDPOINT SUPPORT

Extend the /plot and /polar endpoints:

• Accept query parameter expression=<expr> for a single series or expressions=<expr1,expr2,...> for multiple.
• When expressions is present, generate multiple polylines in the SVG response, each for one expression.
• Maintain existing flags and parameters such as range, resolution, width, height, and logScale.
• On invalid expressions or evaluation errors, respond with 400 Bad Request and a clear error message.

# IMPLEMENTATION NOTES

1. Add a helper function evaluateExpression(exprString, variableName, value) to sandbox/source/main.js that safely evaluates the expression. Restrict to Math functions and numeric operations.
2. In handlePlot and handlePolar, detect argv.expression and argv.expressions, build an array of expression strings, and generate data arrays for each expression.
3. Modify generatePlotSVG and generatePolarSVG signatures to accept an array of data series and an array of style objects. For each series, append a <polyline> element with its strokeColor and strokeWidth.
4. Update CLI parser in sandbox/source/main.js to parse the new flags and pass expressions to SVG generators.
5. Extend HTTP handlers for /plot and /polar to read params.get('expression') and params.get('expressions'), split the latter by comma, and pass the list of expressions to the SVG generators.
6. Add unit tests in sandbox/tests/cli-interface.test.js to verify single and multiple expression behavior, including error cases.
7. Add integration tests in sandbox/tests/data-export.test.js to verify that /plot and /polar return valid SVG with one or more <polyline> elements when using expression(s).
8. Update sandbox/docs/CLI_USAGE.md, sandbox/docs/HTTP_SERVER.md, and README.md to document how to use the new expression flags, including examples for single and multiple expressions.