# PLOT_STYLE_ENHANCEMENTS

Unify and streamline common plot styling options — annotations, grid, area fill, tick labels, legend, and visual themes — into a cohesive feature for both Cartesian and polar plots, simplifying flag and parameter usage and ensuring consistent behavior across CLI and HTTP interfaces.

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

• --xticks <n> and --yticks <n>
  Specify number of tick marks on axes (angular and radial ticks for polar). Defaults to automatic tick count if omitted.

• --tick-labels / --no-tick-labels (boolean)
  Enable or suppress numeric labels at each tick. By default labels are shown when ticks are requested.

• --legend <label1,label2,...>
  Provide comma-separated labels for each data series. A legend box is rendered in the top-right with colored swatches and labels. The count of labels must match the number of series.

• --theme <classic|light|dark>
  Apply a predefined visual theme. classic: default palette and white background; light: pastel strokes with light background; dark: bright strokes on dark background with white text.

# HTTP ENDPOINT SUPPORT

Support these query parameters on /plot and /polar:

title, xlabel, ylabel
grid=true to enable grid
fillArea=true to enable area fill
xticks=<n>, yticks=<n>
tickLabels=true|false
legend=<label1,label2,...>
theme=<classic|light|dark>

When present, these parameters apply the corresponding SVG enhancements. Validation errors (e.g., legend count mismatch, invalid tick counts, or unknown theme) return HTTP 400 with an explanatory message.

# IMPLEMENTATION NOTES

1. Generator Signature: Update generatePlotSVG and generatePolarSVG to accept options: title, xlabel, ylabel, grid, fillArea, xticks, yticks, tickLabels, legend, and theme.

2. Themes: Define a theme mapping in code:
   - classic: stroke palette ['black','red','blue','green','orange','purple'], background white, text black.
   - light: stroke palette ['steelblue','seagreen','orchid','goldenrod','tomato','slategray'], background #f9f9f9, text #333.
   - dark: stroke palette ['cyan','lime','magenta','yellow','orange','lightgray'], background #222, text #fff.
   On CLI or HTTP when theme is provided: override strokeColor, fillColor, backgroundColor, and legend text color accordingly.

3. Annotations: Append <text> elements for title and axis labels at computed coordinates using SVG alignment attributes and inherited styles based on theme.

4. Grid and Ticks: If grid is true, draw grid or concentric/radial ticks. Then if xticks or yticks specified, draw major tick lines and, if tickLabels is true, append numeric <text> at each tick position.

5. Area Fill: If fillArea is true, close polyline path to the baseline or connect last and first polar points, then insert a <polygon> or closed path with fill styling behind the data line, using theme fill color or strokeColor with opacity.

6. Legend: After drawing series lines, compute legend box dimensions and render a <rect> background with slight opacity, and a <g> containing colored line swatches and <text> labels aligned vertically. Text color from theme.

7. Parser Changes: Enhance CLI parser (sandbox/source/main.js) to parse --theme and validate allowed values. In handlePlot and handlePolar, detect and apply theme before other styling options. For HTTP handlers in startServer, read params.get('theme') and validate.

8. Tests: Add unit tests in sandbox/tests/cli-interface.test.js to cover CLI invocation with --theme, verifying default stroke and background attributes. Extend integration tests in sandbox/tests/data-export.test.js to verify HTTP /plot?theme=dark returns SVG with dark background and bright strokes; HTTP /plot?theme=unknown returns 400.

9. Documentation: Update sandbox/docs/CLI_USAGE.md and sandbox/docs/HTTP_SERVER.md with descriptions and examples of the --theme flag and theme=<> parameter. Update README.md feature list to include PLOT_STYLE_ENHANCEMENTS enhancements.