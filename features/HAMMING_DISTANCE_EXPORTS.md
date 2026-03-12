# HAMMING_DISTANCE_EXPORTS

Specification

Document and verify the module exports for the hamming distance functions.

Acceptance Criteria

- `src/lib/main.js` exports named exports `hammingDistance` and `hammingDistanceBits`.
- The module also exposes `name`, `version`, `description`, and `main` (existing CLI helpers) without breaking the API.
- Consumers can import the functions via `import { hammingDistance, hammingDistanceBits } from '@xn-intenton-z2a/repository0'` or via relative path `src/lib/main.js` in tests.

Notes

This feature ensures the public API surface remains stable and documented.