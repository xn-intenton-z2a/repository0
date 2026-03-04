# RENDER_OUTPUTS

Summary

Render time series point arrays to visual outputs: SVG and PNG. Provide a renderer that accepts points and styling options and returns a serialized SVG string or writes a PNG image.

Motivation

Core value of the project is producing visual plots from expressions. A focused renderer with clear inputs and outputs ensures consistent image output for embedding, CLI usage, and testing.

Scope

- Implement an SVG renderer that accepts points, width, height, padding and stroke styling and returns a complete SVG string containing axes, gridlines (optional), and a path for the series.
- Implement optional PNG rendering that converts the SVG or draws the series to an image buffer and writes a PNG file when requested.
- Keep renderer pure where possible: given the same inputs it produces identical outputs.

Implementation notes

- Prefer generating vector output first (SVG) and use a conversion step for PNG (for example an in-memory SVG-to-PNG conversion) to keep the rendering pipeline simple and testable.
- Place rendering logic in src/lib/main.js or move to src/lib/renderer.js and expose a small API renderToSvg(points, opts) and renderToPng(points, opts, filename).
- If adding an image conversion dependency is necessary, document it in package.json and provide fallbacks or clear error messages when conversion is unavailable.

Files to modify

- src/lib/main.js or src/lib/renderer.js
- tests/unit/renderer.test.js to validate that renderToSvg returns an SVG string containing an svg element and a path element for non-empty input
- README.md example of producing output files

Acceptance criteria

- renderToSvg returns a string that contains an svg root element and a path element representing the series for a simple test case.
- renderToPng writes a PNG file when conversion is available; if conversion is not present, it returns a clear, documentable error.
- Unit tests validate SVG string structure (root svg element and at least one path or polyline) and that renderToPng either produces a file or a documented error condition.

Test cases (examples)

- Given points for y=x and width 200 height 100, renderToSvg returns a string starting with an svg root tag and containing a path element.
- When renderToPng is invoked but conversion dependency is not installed, it throws a documented error message that tests can assert on.

Notes

Keep visuals simple and clear; the initial renderer focuses on correctness and reproducibility rather than advanced styling or interactivity.