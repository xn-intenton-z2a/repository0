# PLOT_STYLE_ENHANCEMENTS

Unify and streamline common plot styling and area fill options for both Cartesian and polar plots, including advanced fill-between functionality for comparing series.

# CLI INTEGRATION

Extend the plot, plots, and polar commands with these options:

• --title <text>
  Add a centered title at the top of the SVG.

• --xlabel <text>
  Add a centered X-axis label at bottom of the SVG.

• --ylabel <text>
  Add a rotated Y-axis label along the left side.

• --grid (boolean)
  Render background grid lines: horizontal and vertical lines for Cartesian; concentric circles and radial lines for polar.

• --fill-area (boolean)
  Shade the area under the curve or close the polar path using fill color or semi-transparent stroke color.

• --fill-between <series1,series2>
  Fill the area between two data series specified by their names or positions. When both series are present, draw a closed shape between corresponding points of series1 and series2.

• --fill-between-color <color>
  Specify fill color for the area between series. Defaults to semi-transparent stroke colors of the two series.

• --xticks <n> and --yticks <n>
  Specify number of tick marks on axes (angular and radial ticks for polar). Defaults to automatic tick count.

• --tick-labels / --no-tick-labels (boolean)
  Enable or suppress numeric labels at each tick. Defaults to enabled when ticks are requested.

• --legend <label1,label2,...>
  Provide comma-separated labels for each data series. A legend box is rendered in the top-right with colored swatches and labels. The count of labels must match the number of series.

• --theme <classic|light|dark>
  Apply a predefined visual theme. Defines stroke palette, background, and text colors.

# HTTP ENDPOINT SUPPORT

Extend the /plot and /polar endpoints with query parameters:

• title, xlabel, ylabel
• grid=true
• fillArea=true
• fillBetween=<series1,series2>
• fillBetweenColor=<color>
• xticks=<n>, yticks=<n>
• tickLabels=true|false
• legend=<label1,label2,...>
• theme=<classic|light|dark>

Validation errors (e.g., legend count mismatch, invalid tick counts, unknown theme, or malformed fillBetween) return HTTP 400 with explanatory message.

# IMPLEMENTATION NOTES

1. Generator Signature: Update generatePlotSVG and generatePolarSVG to accept styleOptions including:
   { title, xlabel, ylabel, grid, fillArea, fillBetween, fillBetweenColor, xticks, yticks, tickLabels, legend, theme }

2. Fill Between Series:
   • When fillBetween is provided, locate the two data series by index or name.
   • Construct a closed <polygon> or <path> by concatenating points of series1 in order and series2 in reverse order.
   • Apply fill color from fillBetweenColor or derive a semi-transparent blend of the two series stroke colors.
   • Render the fill shape behind the polylines.

3. Themes: Incorporate fill-between styling when computing palette or override fillBetweenColor if theme defines a contrasting fill.

4. Rendering Order: Draw fillBetween shapes first, then fillArea, then grid and ticks, then data polylines, then legend and labels.

5. CLI Parser: In sandbox/source/main.js, parse --fill-between and --fill-between-color and pass to SVG generators.
   HTTP Handlers: Read params.get('fillBetween') and params.get('fillBetweenColor'), validate, and forward to SVG generators.

# TESTING

Add unit tests in sandbox/tests/cli-interface.test.js:
  - Verify parsing of --fill-between and --fill-between-color flags.
  - Confirm that SVG output contains expected <polygon> or <path> elements with correct fill attributes.

Add integration tests in sandbox/tests/data-export.test.js:
  - Fetch /plot?function=quadratic&range=0,5&fillBetween=quadratic,sine and assert response SVG includes fillBetween shape before polylines.
  - Invalid fillBetween parameters return HTTP 400.

# DOCUMENTATION

- Update sandbox/docs/CLI_USAGE.md and sandbox/docs/HTTP_SERVER.md with entries for fill-between and fillBetween parameters, including usage examples.
- Update README.md feature list to reflect enhanced PLOT_STYLE_ENHANCEMENTS and fill-between capability.