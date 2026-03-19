# PNG_RENDER

Overview

Provide a PNG rendering path for generated plots by converting rendered SVG to a raster PNG buffer using an allowed external dependency (documented in README and package.json changes).

Description

Because SVG-to-PNG conversion requires native or canvas capabilities, the implementation may optionally depend on sharp or canvas (node-canvas). The feature exposes a function renderPng that accepts the same input as renderSvg (data series, width, height) and returns a Buffer containing PNG bytes.

Acceptance Criteria

- A named export renderPng (or renderPNG) is added to src/lib/main.js.
- When provided a simple data series, renderPng returns a Buffer whose first eight bytes match the PNG magic bytes (137,80,78,71,13,10,26,10).
- The README is updated to document which optional dependency is required to enable PNG output and how to install it.
- Unit tests stub or run the PNG conversion and assert the returned Buffer starts with the PNG magic bytes. If running the full native dependency is impractical in CI, provide a small integration test that is skipped when the dependency is absent but unit tests still assert the API surface.

Implementation Notes

- Prefer sharp for server-side conversion due to ease of use, or node-canvas as an alternative; document the trade-offs in README.
- Add a note to package.json (dependencies) candidate entry for sharp or canvas so maintainers know the required change.