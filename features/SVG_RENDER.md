# SVG_RENDER

Overview

Render a numeric data series to a valid SVG 1.1 string using a polyline element and a viewBox attribute so output is resolution-independent.

Description

The renderer accepts an array of numeric points (either [{x,y}] or parallel arrays) and optional width/height parameters. It scales and maps data coordinates to SVG coordinate space and emits a string containing a top-level svg element with a viewBox attribute and a single polyline element representing the series. The output must be valid SVG 1.1 and include the XML namespace declaration.

Acceptance Criteria

- A named export renderSvg (or renderSVG) is added to src/lib/main.js.
- The returned SVG string contains an svg element with a viewBox attribute and a polyline element.
- The polyline element has a points attribute whose number of coordinate pairs equals the number of input samples.
- Unit tests verify the presence of viewBox and polyline and that the polyline points count matches the input series length.

Implementation Notes

- Choose a simple mapping: map x range to 0..width and y range to height..0 (invert y for SVG coordinate system).
- Default canvas size may be 800x200 unless overridden; include parameters in the API for width/height and margins.
- Keep the SVG minimal (one polyline plus optional axes/labels in later features).