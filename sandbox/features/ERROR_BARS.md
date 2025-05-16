# ERROR_BARS

Enable visualization of uncertainty by drawing error bars around data points in plots.

# CLI INTEGRATION

• --error-low <expr> or <column>
  Define the lower error margin for each point. When plotting functions, expr is a JavaScript-like expression in variable x to compute lower error relative to the y-value. When using input data, <column> is the numeric property name in each data object.

• --error-high <expr> or <column>
  Define the upper error margin for each point. Behavior mirrors --error-low.

• --error-style <styleSpec>
  Specify stroke and cap style for error bars. Accepts a JSON object with properties stroke, strokeWidth, capSize, and color. Defaults to stroke=gray, strokeWidth=1, capSize=4.

Behavior:
  - When both --error-low and --error-high are provided, draw vertical error bars at each data point from (x, y-errorLow) to (x, y+errorHigh) with horizontal caps of half capSize.
  - If only one of error flags is present, draw asymmetric error bars accordingly.
  - Error bars are drawn behind the primary polyline series unless --error-style.color is semitransparent.

# HTTP ENDPOINT SUPPORT

Extend /plot and /polar endpoints with query parameters errorLow, errorHigh, and errorStyle. Keys mirror CLI flags (camelCase). When present:

• errorLow=<exprOrColumn>
• errorHigh=<exprOrColumn>
• errorStyle=<jsonEncodedStyle>

Validate expressions and numeric columns. On invalid input, respond with 400 Bad Request and an explanatory message. When valid, include <line> and <line> caps in the returned SVG before the data polyline.

# IMPLEMENTATION NOTES

1. In sandbox/source/main.js, implement helper computeErrorValues(series, lowSpec, highSpec) that returns an array of objects { x, yLow, yHigh } by evaluating expressions against each {x,y} or mapping data columns.
2. Refactor generatePlotSVG and generatePolarSVG signatures to accept an optional errorOptions object { lowSpec, highSpec, style } and to draw <line> elements for each error bar:
   - Use <line x1=x x2=x y1=yLow y2=yHigh stroke= style.stroke stroke-width= style.strokeWidth />
   - Draw caps as <line> of length style.capSize at yLow and yHigh.
3. In handlePlot and handlePolar, parse argv.errorLow, argv.errorHigh, and argv.errorStyle (JSON.parse) or params.get and forward errorOptions to SVG generators.
4. Ensure error bars respect log-scale or custom transforms when applied.

# TESTING

Add unit tests in sandbox/tests/cli-interface.test.js:
  - Verify parsing of errorLow and errorHigh flags for built-in functions and input data.
  - Confirm that SVG output contains the expected number of <line> elements (2 per point when both errors present).
  - Test error-style JSON parsing and default styling.

Add integration tests in sandbox/tests/data-export.test.js:
  - Fetch /plot with errorLow and errorHigh parameters and assert response SVG includes error bar lines before polyline.
  - Invalid expression or unknown column returns 400.

# DOCUMENTATION

Update sandbox/docs/CLI_USAGE.md and sandbox/docs/HTTP_SERVER.md with entries for errorLow, errorHigh, and errorStyle, including usage examples. Update README.md feature list to include ERROR_BARS.