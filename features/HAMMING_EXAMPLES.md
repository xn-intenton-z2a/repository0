# HAMMING_EXAMPLES

Status: IMPLEMENTED

Purpose
Ensure repository documentation includes clear, minimal examples that show how to use the public API and the CLI.

Scope
- README.md contains short API examples demonstrating hammingDistanceString and hammingDistanceInt usage, including BigInt examples.
- A CLI Usage section in README demonstrates current CLI flags and example outputs.
- Creating examples/ files is optional; the README is the canonical source for examples in this repo.

Acceptance Criteria
- README.md contains an "Hamming distance API" or "API Examples" section showing hammingDistanceString("karolin", "kathrin") => 3 and hammingDistanceInt(0n, 3n) => 2.
- README.md contains a "Usage (Node)" and "Usage (browser)" or "CLI Usage" section describing the current CLI flags and expected outputs.
- If examples/ files are added in the future, they must mirror README examples.

Notes
- The README is used by the web demo and should remain the single source of truth for short examples.
