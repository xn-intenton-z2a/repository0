# SVG_RENDERER

Summary

Render a numeric series to an SVG 1.1 document using a polyline element and a viewBox attribute so output scales cleanly across viewers.

Rationale

SVG is the primary, dependency-free vector output for plots and must be valid, portable, and easy to inspect or convert to PNG.

Scope

- Add a named export renderToSVG in src/lib/main.js that accepts a series of points and rendering options and returns an SVG string.
- The SVG must include a viewBox attribute and a single polyline element representing the series.

Files to change

- src/lib/main.js (add renderToSVG export)
- tests/unit/svg.test.js (unit tests)
- README.md (document SVG output format)

Acceptance Criteria

- renderToSVG is exported and returns a string.
- The returned SVG string contains the substring viewBox and contains a polyline element.
- The polyline points attribute contains numeric coordinate pairs and at least one point for non-empty input.
- Unit tests verify presence of viewBox and polyline in output.

Implementation notes

- Coordinate scaling should map the data range to a predictable viewBox (for example 0 0 width height) and document the mapping used in README.
- Keep SVG 1.1 compatible markup and do not add external resources or scripts.
