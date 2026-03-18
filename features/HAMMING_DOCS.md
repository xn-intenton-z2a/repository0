# HAMMING_DOCS

Status: MERGED — consolidated into README.md and HAMMING_DISTANCE.md

Summary
Documentation previously maintained here has been consolidated. README.md contains user-facing examples; HAMMING_DISTANCE.md contains implementation details and acceptance criteria.

Acceptance Criteria
- README.md contains an "Hamming distance API" or "API Examples" section showing hammingDistanceString("karolin", "kathrin") => 3 and hammingDistanceInt(0n, 3n) => 2.
- README.md documents CLI usage (current flags: --version, --identity and planned subcommands), notes on Unicode/code-point handling, and declared error types (TypeError, RangeError).
- Implementation details (error types, input validation, Unicode code-point comparison, and BigInt support) are present and authoritative in HAMMING_DISTANCE.md.

Action
Use README.md and HAMMING_DISTANCE.md as the authoritative documentation sources; this file is retained only as a consolidation note.
