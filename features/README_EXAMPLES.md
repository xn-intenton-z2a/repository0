# README_EXAMPLES

Summary
Require clear, minimal usage examples in README.md showing how to import and use the library API and CLI with expected outputs.

Specification
- Document named exports and their signatures: hammingString(a, b[, options]) and hammingBits(a, b).
- Provide at least these usage examples (show inputs and the expected result in plain text):
  - Example: import { hammingString, hammingBits } from 'src/lib/main.js'
    - hammingString("karolin", "kathrin") -> 3
    - hammingString("", "") -> 0
  - Example: BigInt usage
    - hammingBits(1n << 100n, 0n) -> 1
  - Example: normalization option
    - hammingString(composed, decomposed, { normalize: 'NFC' }) -> 0
  - Example: CLI
    - node src/lib/main.js string "karolin" "kathrin"  # prints 3 or JSON with result
    - node src/lib/main.js bits 1 4  # prints 2 or JSON with result
- Document error behaviour concisely: TypeError for wrong argument types, RangeError for unequal-length strings and negative integers
- Include a short note that Unicode comparison is by code point, not UTF-16 code units

Acceptance criteria
- README.md contains the named examples above (the exact text can vary but the examples and expected outputs must be present)
- README documents the normalization option and BigInt example
- README documents the exported function names and expected thrown error types

Notes
Keep examples small and copy-pastable; avoid including escaped code blocks inside the feature spec itself.