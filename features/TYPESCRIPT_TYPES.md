# README_DOCS

# Summary

Improve and consolidate library documentation, examples, and README so the hamming-distance mission is discoverable, the API is clearly documented, and deterministic examples exist for unit and behaviour tests. This feature specifies the exact README content, example scripts, and small README-driven acceptance checks to support maintainers and automated tests.

# Motivation

Clear, minimal documentation is essential for adoption and for tests that assert usage examples. The README must show the exported API (hammingDistance, hammingDistanceBits, popcount), demonstrate Unicode normalization behaviour, and include CLI and web-demo quick-start examples used by tests and the demo build.

# Specification

1. README content and structure
   - Top-level brief description matching package.json description and mission.
   - API section listing the three named exports with signatures and short descriptions:
     - hammingDistance(a: string, b: string, options?: { normalize?: false | "NFC" | "NFD" }): number
     - hammingDistanceBits(x: number | bigint, y: number | bigint): number
     - popcount(value: bigint): number
   - Validation notes summarising thrown errors and canonical keywords tests look for: TypeError (string, number, bigint, options, normalize), RangeError (length, non-negative).
   - Usage examples (one-liners) for each core function, including normalization example showing a\u0301 vs á and calling with options.normalize = "NFC".
   - CLI examples referencing node src/lib/main.js usage for string and bits modes and the normalize flag.
   - Web demo quick-start pointing to npm run build:web and docs/demo.html.

2. Examples directory requirements
   - Ensure examples/compare-strings.js exists and imports hammingDistance and logs the numeric result for karolin vs kathrin.
   - Ensure examples/compare-normalize.js exists and demonstrates a\u0301 vs á difference and shows result with and without NFC normalization.
   - Ensure examples/compare-bits.js exists and imports hammingDistanceBits and logs the result for 1 vs 4.
   - All example scripts must print exactly one integer followed by a newline for success cases or a single-line error message containing one of the canonical keywords for failure cases.

3. README-driven acceptance checks
   - Add a short section describing how to run examples and verify the canonical acceptance cases (karolin/kathrin -> 3; empty strings -> 0; a vs bb -> RangeError; bits 1 vs 4 -> 2; bits 0 vs 0 -> 0).
   - Provide the exact commands to run the examples (node examples/compare-*.js) and the expected single-line outputs used by CI and tests.

4. Tests and deterministic behaviour
   - Tests must be able to run the example scripts and assert stdout/stderr and exit codes; the README examples must therefore be deterministic.
   - Keep examples dependency-free beyond the package itself; they should import from src/lib/main.js.

# Acceptance Criteria

- README.md contains an API section with the three named exports and their signatures.
- README.md includes one-line usage examples for hammingDistance (including normalize option), hammingDistanceBits, and popcount.
- examples/compare-strings.js, examples/compare-normalize.js, and examples/compare-bits.js exist and are deterministic; running them with node prints exactly the expected integer or a single-line error containing a canonical keyword.
- README includes exact commands to reproduce the core acceptance examples used by tests and CI.

