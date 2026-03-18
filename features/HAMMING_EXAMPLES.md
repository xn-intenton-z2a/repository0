# HAMMING_EXAMPLES

Status: IMPLEMENTED

Purpose
Describe the short, canonical examples used across README, web demo, and tests so examples remain consistent and easy to reference.

Scope
- The README is the canonical host for short examples; this file documents which examples must be present in README and web demo.
- Examples to include:
  - String example: karolin vs kathrin => 3
  - Empty string example: empty vs empty => 0
  - Integer example: 1 vs 4 => 2
  - BigInt example: 1n vs 4n => 2
  - Unicode example: two emoji or composed vs decomposed e-acute showing normalization behaviour

Acceptance Criteria
- README contains an "API examples" section with the examples listed above
- Web demo displays the same example outputs
- Tests assert the same example vectors so documentation and test-suite remain in agreement

Notes
- Avoid large example sets; keep examples targeted and representative of core behaviour.
