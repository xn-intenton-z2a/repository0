# HTTP Server API

## Purpose
Extend the HTTP interface to provide user-friendly, descriptive error responses for missing or invalid query parameters on plot and polar endpoints and include a viewBox attribute in every generated SVG to accurately reflect the data bounds for both Cartesian and polar plots.

## Endpoints
- GET /plot?function=<quadratic|sine>&range=<start,end>&...  Returns an SVG image; responds 400 with descriptive text if any required parameter is missing or malformed.
- GET /polar?function=<spiral|rose>&radius-range=<rStart,rEnd>&angle-range=<thetaStart,thetaEnd>&...  Returns an SVG image; responds 400 with descriptive text on missing or invalid parameters.
- Existing /plot-data, /polar-data, /mission, /version, /help endpoints remain unchanged.

## Implementation Details
- In generatePlotSVG and generatePolarSVG:
  - After computing data points, determine minX, maxX, minY, maxY from data array.
  - Calculate width = maxX - minX and height = maxY - minY.
  - Render the SVG root element with viewBox set to "minX minY width height".
  - Include the optional background <rect> and <polyline> as before, ensuring coordinates map correctly within the viewBox.

- In HTTP request handling for /plot and /polar:
  - Validate each required query parameter (function, range or radius-range, angle-range).
  - If a parameter is missing, set response status to 400 and return text: "Missing required parameter: <name>".
  - If a parameter value is invalid (non-numeric, wrong format, unsupported function name), set status to 400 and return text: "Invalid parameter: <name>" or "Unsupported function: <value>".
  - Only proceed to SVG generation when all parameters are valid.

## Testing
- Add tests in sandbox/tests/:
  - CLI SVG output tests: verify that custom --range or --radius-range and --angle-range flags result in an <svg> element containing a viewBox attribute matching the provided bounds.
  - HTTP tests for /polar: missing radius-range, missing angle-range, unsupported function tests assert 400 status and response body starts with the correct descriptive message.
  - HTTP tests for /plot: missing function or range parameters result in 400 and proper error messages.

## Documentation
- Update sandbox/docs/HTTP_SERVER.md:
  - Document the new viewBox attribute in SVG responses and explain how range parameters affect the viewBox.
  - Add descriptions of the updated 400 error responses with examples of missing or invalid parameter messages.