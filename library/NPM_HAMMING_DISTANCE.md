TITLE: NPM_HAMMING_DISTANCE

TABLE OF CONTENTS
1. Purpose
2. Common exported API patterns (observed across similar packages)
3. Implementation notes and compatibility
4. How to verify exact API when package page is blocked
5. Detailed digest (fetch attempt) — retrieved 2026-03-14
6. Attribution and data size

NORMALISED EXTRACT
1. Purpose
- Provide a small utility to compute Hamming distance between two equal-length inputs (strings, buffers, arrays).

2. Common exported API patterns
- Default export function: hamming(a, b) -> number
  - Validates equal length or throws Error
  - Accepts strings or Buffers/Uint8Array; behavior for strings (code unit vs code point) must be checked in README
- Named exports in some variants: hammingBytes, hammingString
- Typical usage:
  CommonJS: const hamming = require('hamming-distance')
  ESM: import hamming from 'hamming-distance'

3. Implementation notes and options
- For binary inputs likely implements XOR+popcount for performance; for strings may iterate characters or accept encoded buffers.
- Clarify whether strings are compared by code units or code points; if Unicode-aware comparison is required, convert to code-point arrays or pass encoded bytes.

4. How to verify exact API when package page is blocked
- Run: npm view hamming-distance repository dist-tags version
- Run: npm view hamming-distance readme --json to fetch README
- Alternatively, install package in a sandbox (npm pack / npm install) and inspect package.json and README.

DETAILED DIGEST
Attempted source: https://www.npmjs.com/package/hamming-distance — retrieval attempt 2026-03-14 returned Cloudflare challenge preventing HTML extraction. Observed challenge HTML; no README retrieved. Suggested fallback: npm view or inspect repository link from npm if available.

ATTRIBUTION
Source: https://www.npmjs.com/package/hamming-distance — retrieval attempt 2026-03-14; blocked by Cloudflare challenge. Data size observed: Cloudflare challenge HTML ~7 KB. Verify API by consulting package README via npm or repository.