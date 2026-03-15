Title: VIEWBOX
Source: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/viewBox

TABLE OF CONTENTS:
1. Definition and syntax
2. Coordinate mapping formula
3. preserveAspectRatio interactions (meet, slice, none)
4. Implementation formulas for scale and translation
5. Examples and usage patterns
6. Supplementary details
7. Reference details (attribute type and examples)
8. Detailed digest
9. Attribution

NORMALISED EXTRACT:
Definition and syntax:
- Attribute: viewBox
- Value: four numbers separated by whitespace and/or commas: min-x, min-y, width, height
- Semantics: defines a rectangle in user coordinate space which is mapped to the element's viewport (the element's rendered area in CSS pixels). The viewBox establishes an internal coordinate system for child content.

Coordinate mapping (core formulas):
Given:
- viewBox: (minX, minY, vbW, vbH)
- viewport size in device units (viewportW, viewportH)
Compute:
- scaleX = viewportW / vbW
- scaleY = viewportH / vbH

preserveAspectRatio handling:
- If preserveAspectRatio specifies 'meet' (the default align xMidYMid meet), use uniform scale = min(scaleX, scaleY).
- If preserveAspectRatio specifies 'slice', use uniform scale = max(scaleX, scaleY).
- If preserveAspectRatio is 'none', use non-uniform scale: scaleX and scaleY are applied independently (content may stretch).

Translation offsets when using uniform scale (meet/slice):
- scaledWidth = vbW * scale
- scaledHeight = vbH * scale
- offsetX (in viewport units) depends on align-x: xMin -> 0; xMid -> (viewportW - scaledWidth)/2; xMax -> (viewportW - scaledWidth)
- offsetY depends on align-y: yMin -> 0; yMid -> (viewportH - scaledHeight)/2; yMax -> (viewportH - scaledHeight)

Effectively the transformation applied to content coordinates (cx, cy) in viewBox space to viewport space is:
- For 'none': vx = (cx - minX) * scaleX, vy = (cy - minY) * scaleY
- For 'meet' or 'slice': vx = (cx - minX) * scale + offsetX, vy = (cy - minY) * scale + offsetY

Practical notes:
- Order of operations: viewBox->scale->translate then apply preserveAspectRatio offsets.
- Negative min-x or min-y shifts the coordinate origin; e.g., viewBox="-50 -50 100 100" centers content around (0,0).
- Use viewBox with responsive SVGs: remove explicit width/height attributes from <svg> or set them to 100% for fluid scaling.

REFERENCE DETAILS:
- viewBox: attribute type: four <number> values: min-x min-y width height
- preserveAspectRatio options: syntax: [align] [meetOrSlice]
  - align: xMin|xMid|xMax combined with yMin|yMid|yMax (e.g., xMidYMid)
  - meetOrSlice: meet | slice | none
- Default preserveAspectRatio: xMidYMid meet

DETAILED DIGEST:
- Source URL: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/viewBox
- Retrieved: 2026-03-15 (UTC)
- Crawled byte-size: 174678 bytes (HTML)

ATTRIBUTION:
Content extracted from MDN Web Docs (Mozilla) — attribute: viewBox — retrieved 2026-03-15.