# README_EXAMPLES

Status: pending

Ensure README documents usage examples and API with expected outputs and validation notes.

Documentation Requirements

- Provide short usage examples for both functions, e.g.:
  - `hammingDistance("karolin", "kathrin") // 3`
  - `hammingDistanceBits(1, 4) // 2`
- Document input validation (which errors are thrown for which invalid inputs).
- Show Unicode guidance: strings are compared by code points, so emoji and supplementary characters count as single positions.

Acceptance Criteria

- README.md contains a "Hamming distance" section with the above examples and error documentation.
- Examples are copy-pastable and accurate.