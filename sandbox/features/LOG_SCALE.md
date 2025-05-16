# LOG_SCALE

Add support for rendering Cartesian plots using logarithmic scales on axes to visualize exponential relationships and handle data spanning multiple orders of magnitude.

# CLI INTEGRATION

Introduce a new option --log-scale that accepts one of x, y, or both. When provided to the CLI for --plot, the specified axis or axes will be transformed to a base-10 logarithmic scale before rendering.

# HTTP ENDPOINT SUPPORT

Extend the /plot endpoint to accept an optional query parameter logScale=x|y|both. When present, the server will apply logarithmic scaling on the requested axis or axes in the returned SVG.

# IMPLEMENTATION NOTES

- Parse the logScale value from CLI arguments or HTTP query parameters and validate against allowed values. Defaults to none.
- In generatePlotSVG, before constructing the polyline points, transform data points: if logScale includes x, replace each x with Math.log10(x) for x > 0; if logScale includes y, replace each y with Math.log10(y) for y > 0. If any requested value is non-positive, throw an error.
- Update unit and integration tests to verify that points are transformed correctly for each logScale setting and that errors are thrown for invalid inputs.
- Ensure that axis ticks and labels (when ANNOTATIONS is enabled) reflect logarithmic values.