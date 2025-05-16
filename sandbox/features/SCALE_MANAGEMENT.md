# SCALE_MANAGEMENT

Provide unified control over plot scaling and axis transformation by combining viewport dimension settings, viewBox computation, and base-10 logarithmic scaling into a single cohesive feature.

# CLI INTEGRATION

Add or enhance the following flags on both plot and polar commands:

• --width <pixels>
  Specify SVG output width in pixels (default 800). Must be a positive integer.

• --height <pixels>
  Specify SVG output height in pixels (default 600). Must be a positive integer.

• --log-scale <x|y|both>
  Apply base-10 log scaling to the X axis, Y axis, or both. Requires that all values on the scaled axis are strictly positive. If omitted, no logarithmic transformation is applied.

When any of these flags are provided, the CLI will parse and validate them before generating the SVG. Width and height values are passed to the SVG generator to set the <svg> width and height attributes. The log-scale flag is applied to data coordinates before viewBox calculation and polyline point generation.

# HTTP ENDPOINT SUPPORT

Extend the /plot and /polar HTTP endpoints to recognize these optional query parameters:

• width=<positive integer>
• height=<positive integer>
• logScale=<x|y|both>

When present, the server validates each parameter and responds with 400 Bad Request on invalid values. Valid parameters are forwarded to generatePlotSVG and generatePolarSVG, which emit SVG with the requested dimensions and axis transformations. The Content-Type remains image/svg+xml.

# IMPLEMENTATION NOTES

1. In generatePlotSVG and generatePolarSVG function signatures, accept width, height, and logScale parameters.

2. Data transformation:
   - If logScale includes x, replace each data point x by Math.log10(x).
   - If logScale includes y, replace each data point y by Math.log10(y).

3. Compute data bounding box after any transformation:
   - Determine minX, maxX, minY, maxY.
   - Build viewBox attribute as "minX minY (maxX - minX) (maxY - minY)".

4. Generate the <svg> root element with xmlns, width, height, and viewBox attributes based on the computed values.

5. CLI parser (sandbox/source/main.js):
   - Parse --width and --height as integers, enforce positive values.
   - Parse --log-scale and enforce allowed values [x, y, both] and require positive range values when used.
   - Pass parsed values into calls to generatePlotSVG and generatePolarSVG.

6. HTTP handlers (sandbox/source/main.js):
   - Read params.get('width'), params.get('height'), params.get('logScale').
   - Parse and validate identical to the CLI.
   - Pass through to SVG generators and set response Content-Type to image/svg+xml.

7. Tests:
   - Add unit tests in sandbox/tests/cli-interface.test.js to cover valid and invalid width, height, and log-scale combinations.
   - Extend sandbox/tests/data-export.test.js to verify HTTP /plot and /polar responses include correct width, height, viewBox, and transformed points for log-scale.

8. Documentation:
   - Update sandbox/docs/CLI_USAGE.md and sandbox/docs/HTTP_SERVER.md with new flag and query parameter entries and usage examples.
   - Update top-level README.md to reference SCALE_MANAGEMENT capabilities in feature list.