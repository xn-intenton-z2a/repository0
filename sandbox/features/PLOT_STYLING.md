# Plot Styling

## Purpose
Allow users to customize visual aspects of Cartesian and polar plots by specifying stroke color, stroke width, fill color, and background color via CLI flags or HTTP parameters.

## CLI Behavior
- Introduce new flags with --plot and --polar commands:
  - --stroke-color <color> (default: black)
  - --stroke-width <pixels> (default: 1)
  - --fill-color <color> (default: none)
  - --background-color <color> (default: transparent)
- When provided, include corresponding attributes in the generated SVG output.
- If background color is specified, render a <rect> element covering the viewBox before the polyline.
- Validate stroke-width as a positive number; on error, output descriptive message and exit code 1.

## HTTP Endpoints
- Extend GET /plot and GET /polar to accept query parameters:
  - strokeColor=<color>
  - strokeWidth=<number>
  - fillColor=<color>
  - backgroundColor=<color>
- Apply defaults and override SVG attributes in the HTTP response.
- Validate strokeWidth parameter and return 400 status with an error message on invalid values.

## Implementation Details
- In sandbox/source/main.js, parse new flags from argv and raw args, and query params in handleRequest.
- Pass style values into SVG generation logic:
  - Polyline element attributes for stroke, stroke-width, and fill.
  - Optional rect element with fill set to backgroundColor behind the plot.
- Maintain existing viewBox calculation and ordering of elements.

## Testing
- Create sandbox/tests/plot-styling.test.js with tests covering:
  - CLI: --plot sine --stroke-color red --stroke-width 2 generates polyline with stroke="red" and stroke-width="2"
  - CLI: --polar spiral --fill-color blue produces polyline with fill="blue"
  - HTTP: GET /plot?function=sine&range=0,6.28&strokeColor=green returns SVG containing stroke="green"
  - HTTP: invalid strokeWidth returns 400 and descriptive message

## Documentation
- Update sandbox/docs/CLI_USAGE.md to document new style flags under plot and polar commands with examples.
- Update sandbox/docs/HTTP_SERVER.md to include new query parameters and sample requests.
- Update README.md to mention appearance customization under Features.