# CUSTOM_FUNCTION

Allow users to define and plot both built-in functions and custom mathematical expressions as multiple series in a single SVG output for Cartesian and polar plots.

# CLI INTEGRATION

Introduce or enhance three flags on the plot and polar commands:

• --plots <fn1,fn2,...>
  Accepts a comma-separated list of built-in functions (e.g., quadratic,sine) to render each as a separate series. Overrides --plot if provided.

• --expression <expr>
  Define a single custom JavaScript-like mathematical expression in variable x for Cartesian or theta for polar.

• --expressions <expr1,expr2,...>
  Define a comma-separated list of custom expressions. When provided, ignore --expression and built-in functions flags.

Behavior:
  - If --expressions is present, build series from each custom expression.
  - Else if --expression is present, build a single series from that expression.
  - Else if --plots is present, build series for each named built-in function.
  - Assign distinct stroke colors by cycling through the default palette unless a single --stroke-color is provided.
  - On invalid names or expression errors, report an error and exit.

# HTTP ENDPOINT SUPPORT

Extend the /plot and /polar HTTP endpoints to recognize query parameters:

• plots=<fn1,fn2,...>
• expression=<expr>
• expressions=<expr1,expr2,...>

Rules mirror CLI behavior. Respond with 400 Bad Request on invalid functions or expressions. Return an SVG containing one <polyline> per series with appropriate styling.

# IMPLEMENTATION NOTES

1. Add evaluateExpression(exprString, variableName, value) helper in sandbox/source/main.js to safely compute custom expressions using Math functions.
2. In handlePlot and handlePolar, detect params or argv for plots, expression, and expressions and build an array of data series:
   - For plots, call generatePlotData for each named function.
   - For custom expressions, linspace over x or theta and compute values via evaluateExpression.
3. Refactor generatePlotSVG and generatePolarSVG signatures to accept an array of data series and corresponding style objects, then emit one <polyline> per series.
4. Update CLI parser to parse --plots, --expression, --expressions and pass the series list to SVG generators.
5. Extend HTTP handlers to read params.get('plots'), params.get('expression'), params.get('expressions') and forward to SVG generators.
6. Add unit tests in sandbox/tests/cli-interface.test.js for single and multiple built-in and custom series, including error cases.
7. Add integration tests in sandbox/tests/data-export.test.js to verify /plot and /polar HTTP endpoints return valid SVG with one <polyline> per series.