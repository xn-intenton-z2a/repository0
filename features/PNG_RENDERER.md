# PNG_RENDERER

Summary

Status: Implemented (closed issue #3022)

Provide PNG output support by converting rendered SVG to a raster image or by drawing to a canvas; document the chosen approach and required dependency.

Rationale

PNG is commonly requested for downstream pipelines and image previews. The mission allows a native dependency for PNG creation; choose a well-supported library and document it.

Scope

- Add a named export renderToPNG in src/lib/main.js that accepts points or an SVG string and returns a Buffer containing PNG bytes or writes a PNG file when given a path.
- Update package.json to include a single optional dependency for PNG generation (for example canvas or sharp) and document the choice in README.

Files to change

- src/lib/main.js (add renderToPNG export)
- package.json (add optional dependency for PNG rendering)
- tests/unit/png.test.js (unit tests)
- README.md (document approach and install notes)

Acceptance Criteria

- renderToPNG produces a Buffer or file whose first four bytes match the PNG magic bytes 0x89 50 4E 47.
- Unit tests create a small PNG buffer and assert the magic bytes are present.
- README explains which dependency is used and how to install it on common platforms.

Implementation notes

- Prefer a single dependency to keep the surface area small; include optional instructions for environments where building native modules is required.
- Ensure the PNG rendering path is exercised by unit tests but isolate the dependency so CLI can still generate SVG-only output when the PNG dependency is not present.
