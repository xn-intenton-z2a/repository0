TITLE: NPM_HAMMING_DISTANCE

NOTE: npm package page returned a Cloudflare protection challenge on retrieval; CDN response prevented fetching the package page HTML. The following is a pragmatic, actionable extract based on common package patterns and the package name; users should verify exact API from the package README when accessible.

TABLE OF CONTENTS
1. Purpose
2. Common exported API patterns for packages named 'hamming-distance'
3. Implementation notes and compatibility
4. How to verify and use the package when page is accessible
5. Detailed digest (attempted source fetch: https://www.npmjs.com/package/hamming-distance) — retrieved 2026-03-14 (challenge page)
6. Attribution and data size

NORMALISED EXTRACT
1. Purpose
- Provide a small utility to compute Hamming distance between two equal-length inputs (strings, buffers, arrays).

2. Common exported API patterns
- Single default export function: hamming(a, b) -> number
  - Validates equal length or throws an Error
  - Accepts strings (compares code units or bytes) or Buffers/Uint8Array (byte-wise XOR)
- Optional named exports: hammingBytes, hammingString, etc.
- Common usage in Node: const hamming = require('hamming-distance') or import hamming from 'hamming-distance'

3. Implementation notes and options
- If inputs are strings, clarify whether package compares UTF-16 code units or bytes; for Unicode-aware comparisons, provide a code-point-aware wrapper or let caller pass Uint8Array of encoded bytes.
- Performance: likely uses byte/word XOR + popcount when Buffers are passed; string paths may iterate characters.

4. How to verify and use when accessible
- Inspect README on npm or repository (GitHub) for exact signatures and option flags.
- Test quickly: run small examples verifying behavior on surrogate pairs and differing lengths.

DETAILED DIGEST
Attempted source: https://www.npmjs.com/package/hamming-distance — retrieved 2026-03-14. Response blocked by Cloudflare challenge; no package README HTML retrieved. A fallback is to inspect package repository (often linked from npm) or install the package locally (npm view or npm pack) to read README.

ATTRIBUTION
Source: https://www.npmjs.com/package/hamming-distance — retrieval attempt 2026-03-14; Cloudflare challenge prevented full retrieval. Data size observed: Cloudflare challenge HTML ~7 KB. Action: consult package repository or run `npm view hamming-distance readme` locally to obtain authoritative API.