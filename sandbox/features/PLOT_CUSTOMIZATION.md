# PLOT_CUSTOMIZATION

## Purpose
Allow users to control visual styling, data resolution, descriptive annotations, axes, grid lines, tick marks, and now tick labels on Cartesian and polar plots to enhance readability, context, and interpretability of data.

## CLI Behavior
- Add flags for both plot and polar commands:
  - --resolution <points> to set number of sample points (default: 100)
  - --stroke-color <color> to set line color (default: black)
  - --stroke-width <pixels> to set line width (default: 1)
  - --fill-color <color> to set fill for polyline or polar shapes (default: none)
  - --background-color <color> to set SVG background (default: transparent)
  - --title <string> to add a title at the top center
  - --xlabel <string> and --ylabel <string> to label axes
  - --axis to draw X=0 and Y=0 axis lines
  - --grid to draw grid lines at tick intervals
  - --grid-color <color> and --grid-width <pixels> to style grid lines
  - --ticks <number> to specify number of major ticks per axis (default: 5)
  - --tick-labels to enable tick value labels at grid or axis ticks
  - --tick-font-size <pixels> to set font size for tick labels (default: 10)
  - --tick-font-color <color> to set font color for tick labels (default: uses stroke color)
- Validate numeric flags are positive and colors are non-empty; exit code 1 on invalid values.

## HTTP Endpoints
- Extend GET /plot and GET /polar endpoints to accept query parameters:
  - resolution, strokeColor, strokeWidth, fillColor, backgroundColor, title, xlabel, ylabel
  - axis=true to draw axes
  - grid=true to draw grid lines
  - gridColor, gridWidth, ticks, tickLabels=true, tickFontSize, tickFontColor
- Apply defaults and respond with 400 on missing or invalid parameters.

## Implementation Details
- In handlePlot and handlePolar:
  - Parse axis, grid, gridColor, gridWidth, ticks, tickLabels, tickFontSize, tickFontColor from argv or searchParams
  - After computing data and before rendering the polyline:
    1. If grid enabled, calculate tick positions evenly over the data range based on ticks count and insert background <line> elements for grid lines styled by gridColor and gridWidth.
    2. If axis enabled, insert <line> elements for X=0 and Y=0 spanning the viewBox.
    3. If tickLabels enabled:
       - For Cartesian plots, at each major tick on X and Y axes insert <text> elements at appropriate coordinates showing numeric values.
       - For polar plots, insert tick labels along the radius axis or angular axis when tickLabels is true.
       - Use tickFontSize and tickFontColor for styling text.
  - Order elements as: background rect, grid lines, axis lines, tick labels, polyline, markers (if any), title and axis labels.
- Leverage existing viewBox calculations; compute tick coordinates from min/max bounds.

## Testing
- Add sandbox/tests/plot-customization-ticks.test.js covering:
  - CLI: --plot sine --ticks 4 --tick-labels generates SVG with <text> elements at four evenly spaced X and Y tick positions with correct numeric content and styles.
  - CLI: polar plot with --axis --ticks 3 --tick-labels generates tick label text along radius values.
  - HTTP: GET /plot?function=quadratic&range=0,10&axis=true&grid=true&ticks=5&tickLabels=true returns SVG containing <text> tags with tick values.
  - Error cases: invalid ticks, tickFontSize, or tickFontColor result in exit code 1 or 400 status.

## Documentation
- Update sandbox/docs/CLI_USAGE.md to document --tick-labels, --tick-font-size, and --tick-font-color with examples.
- Update sandbox/docs/HTTP_SERVER.md to include tickLabels, tickFontSize, and tickFontColor query parameters.
- Update README.md features section to include Axis, Grid, and Tick Labels Support.