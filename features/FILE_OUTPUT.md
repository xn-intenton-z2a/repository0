# FILE_OUTPUT

Overview

Save rendered plots to disk, inferring output format from the file extension and delegating to the appropriate renderer (SVG or PNG).

Description

A small helper savePlot(path, svgOrBuffer) or savePlotFromData(data, path, options) writes the final output to disk. If the path ends with .svg the file is written as UTF-8 SVG text. If the path ends with .png the PNG renderer is invoked and the result is written as binary. Unsupported extensions produce a clear error.

Acceptance Criteria

- A named export savePlot (or saveFile) is added to src/lib/main.js.
- Calling the CLI example node src/lib/main.js --expression "y=Math.sin(x)" --range "-3.14:0.01:3.14" --file output.svg produces a file at output.svg and its contents contain an svg element with viewBox.
- Saving to output.png produces a binary file whose first bytes match the PNG magic bytes when PNG rendering is available.
- Attempting to save to an unsupported extension throws a descriptive error.

Implementation Notes

- Unit tests should write to a temporary file (in a test-specific temp directory) and assert the file exists and (for svg) contains the expected svg tag, or (for png) starts with PNG magic bytes.
- Do not alter user files outside the test temp area during tests.