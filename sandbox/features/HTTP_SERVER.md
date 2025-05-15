# HTTP Server API

## Purpose
Provide an HTTP interface to generate and serve SVG plots of mathematical functions and polar plots directly in a web browser.

## Endpoints
- GET /plot?function=<quadratic|sine>&range=<start,end>&output=<filename>  Returns SVG content for a Cartesian plot.
- GET /polar?function=<spiral|rose>&radiusRange=<rStart,rEnd>&angleRange=<thetaStart,thetaEnd>&resolution=<points>&output=<filename>  Returns SVG content for a polar plot.
- GET /mission  Returns mission statement in plain text.
- GET /version  Returns version number.
- GET /help  Returns usage guide.

## Implementation Details
- Add a new --serve flag to sandbox/source/main.js to start the HTTP server on a specified port (default 3000).
- Use the Node http module and URL class to parse request paths and query parameters.
- On each request, route to the existing plot and polar handlers to generate SVG and respond with Content-Type image/svg+xml.
- For mission, version, and help endpoints, reuse showMission, showVersion, and showHelp logic to return text or HTML.
- Validate query parameters and respond with 400 status for missing or invalid values, including a descriptive error message.

## Testing
- Create sandbox/tests/http-server.test.js to cover:
  - Server startup and shutdown without errors.
  - Successful SVG responses for plot and polar endpoints using default and custom parameters.
  - Error responses for unsupported functions, invalid ranges, and missing parameters.

## Documentation
- Update README.md and sandbox/docs/CLI_USAGE.md to include an HTTP Server Usage section with example HTTP requests and expected responses.