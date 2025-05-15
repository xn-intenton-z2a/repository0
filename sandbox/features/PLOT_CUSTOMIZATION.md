# PLOT_CUSTOMIZATION

## Purpose
Enhance visual styling and annotation controls for both Cartesian and polar plots, including line styling, grid and axis rendering, tick labels, data markers, and closed-area shading under curves. This feature centralizes all plot styling options to improve readability and presentation quality.

## CLI Behavior

Add flags for both plot and polar commands:

  --resolution <points>         Number of sample points (default: 100)
  --stroke-color <color>        Line stroke color (default: black)
  --stroke-width <pixels>       Line stroke width in pixels (default: 1)
  --fill-color <color>          Fill color for shapes when shading is enabled (default: none)
  --background-color <color>    SVG background color (default: transparent)
  --title <string>              Add a centered title
  --xlabel <string>             Label for X axis
  --ylabel <string>             Label for Y axis
  --axis                         Draw X=0 and Y=0 axis lines
  --grid                         Draw grid lines at major tick intervals
  --grid-color <color>          Grid line color (default: lightgray)
  --grid-width <pixels>         Grid line width (default: 1)
  --ticks <number>              Number of major ticks per axis (default: 5)
  --tick-labels                  Render numeric labels at major ticks
  --tick-font-size <pixels>     Font size for tick labels (default: 10)
  --tick-font-color <color>     Font color for tick labels (default: stroke color)
  --markers                      Render circles at each data point
  --marker-size <pixels>        Radius for markers (default: 3)
  --marker-color <color>        Fill color for markers (default: stroke color)
  --fill-under                   Shade the area under the curve down to the baseline
  --baseline <value>             Baseline Y value for shading (default: 0)

Validation:

  Numeric flags must be positive numbers. Color flags must be non-empty valid CSS color strings. Flags are mutually respected according to documented precedence.

## HTTP Endpoints

Extend GET /plot and GET /polar to accept query parameters:

  resolution, strokeColor, strokeWidth, fillColor, backgroundColor, title, xlabel, ylabel
  axis=true, grid=true, gridColor, gridWidth, ticks, tickLabels=true, tickFontSize, tickFontColor
  markers=true, markerSize, markerColor
  fillUnder=true, baseline=<number>

Behavior mirrors CLI. Invalid parameter values return HTTP 400 with descriptive messages.

## Implementation Details

In handlePlot and handlePolar handlers:

1. Parse new flags from argv or searchParams:
   - axis, grid, gridColor, gridWidth, ticks, tickLabels, tickFontSize, tickFontColor
   - markers, markerSize, markerColor
   - fillUnder, baseline
2. After generating data array:
   - Compute viewBox from data bounds
   - Render background <rect> if backgroundColor is set
   - If grid enabled: insert <line> elements at tick positions styled by gridColor and gridWidth
   - If axis enabled: insert <line> for X=0 and Y=0 spanning viewBox
   - If tickLabels enabled: insert <text> at each major tick showing value, styled by tickFontSize and tickFontColor
   - Build the polyline string for data points
   - If fillUnder enabled:
     - Create a closed polygon by appending two points at baseline: first point x at baseline, last point x at baseline
     - Render <polygon points="..." fill="fillColor" stroke="none" /> before or behind the polyline
   - Insert polyline with strokeColor and strokeWidth
   - If markers enabled: for each data point render <circle> with cx, cy, r=markerSize, fill=markerColor
   - Append title, xlabel, ylabel using <text> elements positioned appropriately
3. Output the assembled SVG with xmlns and viewBox attributes

Re-use existing generatePlotSVG and generatePolarSVG or refactor into a common svgBuilder module.

## Testing

Add sandbox/tests/plot-customization.test.js with cases:

- CLI: --plot sine --ticks 4 --tick-labels outputs SVG containing <text> elements at correct positions
- CLI: --plot quadratic --markers generates <circle> elements with default marker size and color
- CLI: --plot sine --fill-under --baseline -1 produces <polygon> element closing at Y=-1 with correct fill color
- HTTP: GET /plot?function=quadratic&range=0,5&fillUnder=true returns SVG with <polygon> and fill attribute
- Error handling: invalid ticks, markerSize, fillUnder values produce exit code 1 or HTTP 400

## Documentation

Update sandbox/docs/CLI_USAGE.md to document markers, marker-size, marker-color, fill-under, and baseline flags with examples.
Update sandbox/docs/HTTP_SERVER.md to include markers and fillUnder query parameters.
Update README.md features section to reflect enhanced styling and shading support under Plot Customization.