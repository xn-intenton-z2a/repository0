# PLOT_CUSTOMIZATION

## Purpose
Allow users to control visual styling, data resolution, descriptive annotations, and now optional axes and grid with ticks in Cartesian and polar plots to enhance readability and context.

## CLI Behavior
- Add flags for both plot and polar commands:
  - --resolution <points> to set number of sample points (default: 100)
  - --stroke-color <color> to set line color (default: black)
  - --stroke-width <pixels> to set line width (default: 1)
  - --fill-color <color> to set fill for polyline or polar shapes (default: none)
  - --background-color <color> to set SVG background (default: transparent)
  - --title <string> to add a title at top center
  - --xlabel <string> and --ylabel <string> to label axes
  - --axis to draw X=0 and Y=0 axis lines
  - --grid to draw grid lines at tick intervals
  - --grid-color <color> and --grid-width <pixels> to style grid lines
  - --ticks <number> to specify number of major ticks per axis (default: 5)
- Validate numeric flags are positive; exit with code 1 on invalid values.

## HTTP Endpoints
- Extend GET /plot and GET /polar endpoints to accept query parameters:
  - resolution, strokeColor, strokeWidth, fillColor, backgroundColor, title, xlabel, ylabel
  - axis=true to draw axes
  - grid=true to draw grid lines
  - gridColor, gridWidth, ticks
- Apply defaults and respond with 400 status on missing or invalid parameters.

## Implementation Details
- In handlePlot and handlePolar:
  - Parse axis, grid, gridColor, gridWidth, and ticks from argv or URL searchParams
  - After computing data and before rendering polyline:
    - If axis enabled, insert <line> elements for X=0 and Y=0 spanning the viewBox
    - If grid enabled, calculate tick positions based on range and ticks count, insert horizontal and vertical <line> elements as grid lines
  - Ensure axis and grid elements render behind title, annotations, and data polyline by appending in correct order
- Leverage existing viewBox calculations for positioning lines

## Testing
- Add sandbox/tests/plot-customization-grid.test.js covering:
  - CLI: --plot sine --grid --axis --grid-color gray --grid-width 0.5 --ticks 4 generates appropriate <line> elements and grid lines
  - HTTP: GET /plot?function=quadratic&range=0,10&axis=true&grid=true&ticks=5 returns SVG with axis and grid
  - Error cases: invalid ticks or gridWidth cause exit code 1 or 400 status with descriptive message

## Documentation
- Update sandbox/docs/CLI_USAGE.md and sandbox/docs/HTTP_SERVER.md to document new axis, grid, grid-color, grid-width, and ticks flags
- Update README.md features section to include axis and grid support