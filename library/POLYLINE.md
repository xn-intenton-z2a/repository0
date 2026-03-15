Title: POLYLINE
Source: https://developer.mozilla.org/en-US/docs/Web/SVG/Element/polyline

TABLE OF CONTENTS:
1. Element summary
2. 'points' attribute syntax and types
3. Presentation attributes and defaults
4. DOM interface and usable properties
5. Practical examples and patterns
6. Supplementary details
7. Reference details (attributes exact types)
8. Detailed digest
9. Attribution

NORMALISED EXTRACT:
Element summary:
- The <polyline> SVG element constructs a set of straight line segments connecting a sequence of points. It is typically used for open shapes. For closed shapes prefer <polygon>.

'points' attribute (exact syntax):
- Attribute name: points
- Value type: one or more coordinate pairs: <number>+ where every two numbers form an x,y pair; coordinates may be separated by whitespace and/or commas.
- Example canonical forms: "0,100 50,25 50,75 100,0" or "0 100 50 25 50 75 100 0".
- Default value: empty string "" (no points). The attribute is animatable.

Presentation attributes and defaults:
- Presentation attributes (fill, stroke, stroke-width, etc) apply to <polyline> as they do to other shapes. Default browser initial values: fill initial value is 'black' (user agent default) and stroke initial value is 'none'. Therefore a polyline with default fill and no stroke may appear filled (the rendering will close the shape and fill interior according to fill-rule).
- Common attributes used: points, pathLength (optional numeric scaling), fill, stroke, stroke-width, stroke-linecap, stroke-linejoin, marker-start/mid/end.

DOM interface:
- Implements SVGPolylineElement interface. Access points programmatically via element.points (returns SVGPointList in DOM-capable environments) or by reading the attribute string.

Practical patterns and pitfalls:
- For open polylines use stroke and set fill="none" to avoid implicit closing and filling.
- To create an explicitly closed polygonal shape use <polygon> which implicitly closes the path.
- For precise drawing in pixels, set viewBox on the parent <svg> and calculate points in user coordinate space.

REFERENCE DETAILS (attributes and types):
- points: <number>+ (Default: "") — list of x,y coordinate pairs, animatable.
- pathLength: <number> (Default: none) — target length in user units for path-based alignment/animation.
- The element supports standard presentation attributes (fill, stroke, stroke-width, opacity, transform, etc).

DETAILED DIGEST:
- Source URL: https://developer.mozilla.org/en-US/docs/Web/SVG/Element/polyline
- Retrieved: 2026-03-15 (UTC)
- Crawled byte-size: 173780 bytes (HTML)

ATTRIBUTION:
Content extracted from MDN Web Docs (Mozilla) — element: polyline — retrieved 2026-03-15.