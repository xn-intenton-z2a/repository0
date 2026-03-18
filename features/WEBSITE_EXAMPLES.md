# WEBSITE_EXAMPLES

Summary
Ensure the project website demonstrates the library with a small interactive or static example that mirrors README and CLI examples.

Specification
- The demo page should show a JSON output box with at least these keys and example values:
  - stringExample: { "a": "karolin", "b": "kathrin", "hamming": 3 }
  - bitsExample: { "a": 1, "b": 4, "hammingBits": 2 }
- The page should describe that string comparison is by Unicode code point and note the normalization option if available
- Example content should be static or generated at build time; it must not rely on server-side components

Acceptance criteria
- The website (docs/ or src/web/) contains an example page that displays the JSON object above or produces equivalent output at build time
- The example text references the exported API function names and the normalization option

Notes
This feature ensures parity across README, tests, CLI and website demos; the screenshot provided is a valid reference for desired output shape.