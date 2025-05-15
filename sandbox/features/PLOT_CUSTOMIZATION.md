# PLOT_CUSTOMIZATION

## Purpose
Allow users to control both visual styling and data resolution of Cartesian and polar plots and add descriptive annotations, enhancing readability and context of generated SVG output.

## CLI Behavior
- Add flags for both --plot and --polar commands:
  - --resolution <points> to set number of sample points (default 100)
  - --stroke-color <color> to set line color (default black)
  - --stroke-width <pixels> to set line width (default 1)
  - --fill-color <color> to set fill for polar shapes (default none)
  - --background-color <color> to set SVG background (default transparent)
  - --title <string> to add a title element at top center of SVG
  - --xlabel <string> to label the x axis on Cartesian plots
  - --ylabel <string> to label the y axis on Cartesian plots
- Validate resolution and stroke-width are positive numbers greater than zero; exit code 1 on invalid values.
- When flags are provided, include corresponding <rect>, <polyline>, and <text> elements in output SVG before writing file.

## HTTP Endpoints
- Extend GET /plot and GET /polar endpoints to accept query parameters:
  - resolution, strokeColor, strokeWidth, fillColor, backgroundColor, title, xlabel, ylabel
- Apply defaults and override SVG attributes and insert <title> and <text> elements accordingly
- Validate numeric parameters and respond with 400 status and descriptive error on invalid values

## Implementation Details
- In sandbox/source/main.js, update handlePlot and handlePolar to parse new flags from minimist argv and raw args, and params from URL searchParams
- Pass styling and annotation values into SVG generation logic:
  - Insert a <rect> covering viewBox with backgroundColor before any shapes
  - Add a <title> element at top with title text
  - Add <text> elements for xlabel and ylabel positioned along axes
  - Apply stroke, stroke-width, fill, and polyline points as currently implemented
- Ensure existing behaviors for data export and file writing remain unchanged when export-data is used

## Testing
- Add sandbox/tests/plot-customization.test.js covering:
  - CLI: --plot sine --resolution 50 --stroke-color red --stroke-width 2 --background-color yellow --title MyPlot --xlabel X --ylabel Y generates SVG containing matching attributes and <text> elements
  - HTTP: GET /plot?function=quadratic&range=0,10&resolution=25&strokeColor=blue&title=Test returns SVG with <title>Test</title> and polyline stroke="blue"
  - Error cases: invalid resolution and strokeWidth lead to exit code 1 or 400 response

## Documentation
- Update sandbox/docs/CLI_USAGE.md and sandbox/docs/HTTP_SERVER.md to document new customization and annotation flags
- Update README.md features section to describe plot customization capabilities