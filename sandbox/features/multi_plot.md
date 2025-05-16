# MULTI_PLOT

This feature enables plotting multiple built-in functions (e.g., `quadratic`, `sine`) in a single SVG output.

## CLI Integration

- Introduces `--plots <fn1,fn2,...>` alongside existing `--plot` flag.
- Users can specify a comma-separated list of function names to render multiple series in one chart.
- Example:
  ```bash
  node sandbox/source/main.js --plots quadratic,sine --range 0,5 --resolution 50 --output multi.svg
  ```
- Internally, the CLI splits the `plots` argument, validates each function, and generates a data series for each.
- Stroke colors for each series cycle through a default palette (`['black','red','blue','green','orange','purple']`), unless a single `--stroke-color` is provided, which applies to all series.
- Export of raw data (`--export-data`) remains supported only when a single function is specified.

## HTTP Endpoint Support

- The `/plot` endpoint now recognizes a `plots` query parameter:
  ```
  GET /plot?plots=quadratic,sine&range=0,5&width=400&height=200
  ```
- If `plots` is provided, it overrides the legacy `function` parameter. The server generates multiple `<polyline>` elements, one per function.
- Stroke colors cycle through the default palette; custom stroke color via `strokeColor` applies to all series.
- The viewBox calculation covers the combined data extents across all series.
- Invalid or unsupported function names result in a 400 Bad Request.

## Implementation Notes

- Refactored inline SVG generation to loop through multiple series, constructing individual `<polyline>` tags.
- Combined series data to determine overall `viewBox` bounds for proper scaling.
- Ensured backward compatibility: a single `function` or `--plot` still works as before.
