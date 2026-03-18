# HAMMING_DOCS

Purpose
Expand and clarify documentation so users understand CLI usage, BigInt support, and Unicode code point behaviour.

Scope
- Update README.md to include:
  - A CLI usage section with examples for both string and bits modes.
  - Examples showing BigInt usage (when Hamming BigInt support is implemented): hammingDistanceInt(1n, 4n) => 2.
  - A short note explaining Unicode code point comparison and an example with emoji highlighting why Array.from or for-of must be used.

Acceptance Criteria
- README.md contains a "CLI Usage" section with concrete examples demonstrating string and bits commands.
- README.md contains a "BigInt examples" subsection and a short "Unicode handling" note with an emoji example.
- Documentation updates are small and focused; tests that check README contents (if present) should pass.
