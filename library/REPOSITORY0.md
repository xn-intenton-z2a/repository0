DOCUMENT: REPOSITORY0

NORMALISED EXTRACT

This extract contains immediately actionable technical specifications from the repository "repository0" (source: https://github.com/xn-intenton-z2a/repository0).

Table of Contents
1. Hamming utilities API
2. Package and entry-point behavior
3. agentic-lib configuration and operational knobs
4. CI / GitHub Actions and required secrets
5. Implementation patterns and exports
6. Troubleshooting checklist

1. Hamming utilities API
Signature: hammingDistance(a: string, b: string) -> number
- Inputs: two Unicode strings (ECMAScript string). Both must be validated as strings or throw TypeError.
- Normalization: Normalize both strings to Unicode Normalization Form C (NFC) before comparison.
- Comparison unit: compare by Unicode code points (use Array.from(string) or equivalent) rather than UTF-16 code units.
- Length requirement: If the number of code points differs, throw RangeError.
- Behavior: Return an integer counting positions i where normalizedCodePointsA[i] !== normalizedCodePointsB[i].
- Errors: TypeError for non-strings, RangeError for unequal code point lengths.
- Return: non-negative integer. Example contract: hammingDistance('e\u0301', 'é') === 0.

Signature: hammingDistanceBits(x: Buffer | Uint8Array | ArrayBuffer) -> number
- Inputs: two byte-sequence buffers with equal byte lengths. Accept Buffer, Uint8Array, or ArrayBuffer.
- Validation: Throw TypeError for unsupported types; throw RangeError if lengths differ.
- Behavior: Compute bitwise Hamming distance across corresponding bytes: sum(popcount(byteA ^ byteB)) for all positions.
- Return: non-negative integer equal to number of differing bits across the sequences.
- Notes: For integer-based APIs, convert nonnegative integers into fixed-width byte arrays explicitly before calling this function.

2. Package and entry-point behavior
- package.json main: "src/lib/main.js" — this file is an ESM module that re-exports the hamming utilities and provides a CLI shim.
- Scripts: "start" runs node src/lib/main.js; "test" runs vitest on tests/unit.
- Engine: node >= 24.0.0 required.
- Exports: src/lib/main.js exports named exports hammingDistance and hammingDistanceBits and also has main(args) for CLI invocation.
- CLI behavior: when executed directly, main() logs Run with: <args-array> and returns. Consumers should import named functions from the package entry.

3. agentic-lib configuration and operational knobs
- schedule.supervisor: continuous | daily | hourly | weekly | off. Controls supervisor dispatch cadence.
- paths: mission, source, tests, features, library, docs, examples, readme, dependencies, contributing, library-sources. Keep these aligned to repository layout.
- execution: build/test/start commands mapped to npm scripts.
- limits: feature-issues, maintenance-issues, attempts-per-branch, attempts-per-issue, features-limit, library-limit — tune for concurrency and retry behavior.
- tuning.model: default gpt-5-mini; reasoning-effort and other knobs can be set per profile. infinite-sessions toggles session compaction behavior.
- bot.log-file: path for agent logs.

4. CI / GitHub Actions and required secrets
- Required secrets:
  - COPILOT_GITHUB_TOKEN: fine-grained PAT with Copilot SDK read permission. Used for Copilot-driven changes.
  - WORKFLOW_TOKEN: classic PAT with workflow scope; required because GITHUB_TOKEN cannot edit .github/workflows/ files.
- Repository settings required:
  - Actions: Allow all actions
  - Workflow permissions: Read and write
  - Enable Discussions (for discussion bot)
- Branch protection recommendations: require PR reviews and status checks (select test workflow).

5. Implementation patterns and exports (exact patterns to adopt)
- ESM exports in src/lib/main.js: export function main(args) { ... } and export { hammingDistance, hammingDistanceBits } from internal module hamming.js.
- Internal implementation guidance for hammingDistance:
  - Normalize: const aN = a.normalize('NFC'); const bN = b.normalize('NFC');
  - Code points: const aPts = Array.from(aN); const bPts = Array.from(bN);
  - Validate lengths: if (aPts.length !== bPts.length) throw new RangeError('unequal length');
  - Loop and count differences using strict !==.
- Internal implementation guidance for bit-distance:
  - Accept typed arrays; ensure both are Uint8Array views.
  - If an ArrayBuffer is provided, create a Uint8Array view.
  - For each pair of bytes compute x ^ y then use a 256-entry popcount lookup table or builtins to count bits.
  - Return the accumulated count.
- Exposing from package: use re-export from the entry file so consumers can import directly.

6. Troubleshooting checklist (step-by-step)
- Tests failing: run npm test and inspect failing assertion. If hammingDistance tests fail on certain Unicode inputs, verify normalization to NFC and Array.from usage.
- Type errors: ensure input validation checks typeof input === 'string' for string API and Buffer/Uint8Array/ArrayBuffer detection for byte API.
- Token & workflow errors: if init workflow fails to update workflows, ensure WORKFLOW_TOKEN is present and has workflow scope (classic token) and that the repository Actions settings allow write operations.
- CI node version mismatches: ensure runner or developer environment uses Node >= 24; otherwise runtime ESM semantics and Array.from on code points may differ.

SUPPLEMENTARY DETAILS
- Exact runtime requirements: Node >= 24, vitest for unit tests, devDeps include @vitest/coverage-v8 and vitest.
- File structure of interest: src/lib/main.js (entry), src/lib/hamming.js (internal functions) — ensure hamming.js exports functions used by main.js.
- Tests location: tests/unit/*.test.js; test script runs vitest --run tests/unit/*.test.js.
- Init and update: npx @xn-intenton-z2a/agentic-lib@latest init updates agentic infra and may overwrite distributed files; prefer fixing source in agentic-lib upstream when appropriate.

REFERENCE DETAILS (API SPECIFICATIONS AND SIGNATURES)
1) hammingDistance
- Signature: function hammingDistance(a: string, b: string): number
- Parameters:
  - a: string — must be an ECMAScript string. Normalized to NFC internally.
  - b: string — must be an ECMAScript string. Normalized to NFC internally.
- Throws:
  - TypeError if typeof a !== 'string' or typeof b !== 'string'
  - RangeError if Array.from(aN).length !== Array.from(bN).length
- Return: integer >= 0; exact count of differing code point positions.
- Complexity: O(n) time, O(n) temporary for code-point arrays.

2) hammingDistanceBits
- Signature: function hammingDistanceBits(x: Buffer | Uint8Array | ArrayBuffer, y: Buffer | Uint8Array | ArrayBuffer): number
- Parameters:
  - x, y: same byte-length typed containers. If ArrayBuffer provided, create Uint8Array(view).
- Throws:
  - TypeError for unsupported types
  - RangeError if x.byteLength !== y.byteLength
- Return: integer >= 0; sum of popcount(x[i] ^ y[i]) for i in 0..length-1.
- Complexity: O(n) time; optimize with 256-entry popcount table for per-byte popcount.

EXACT IMPLEMENTATION PATTERNS (snippet-like algorithm descriptions)
- Normalize and compare code points for textual Hamming distance.
- For bytes, align lengths and use XOR + popcount per byte.
- Re-export utilities from package entry to keep consumer import surface stable.
- Validate inputs early and fail fast with precise JS Error types.

DETAILED DIGEST
- Extracted from repository: README.md, agentic-lib.toml, package.json, src/lib/main.js, MISSION.md, SOURCES.md
- Retrieval date: 2026-03-06
- Key items digested: hammingDistance and hammingDistanceBits API contracts; agentic-lib configuration keys and operational knobs; required GitHub secrets and repository settings; package entry and node engine requirement; testing and update workflow commands.

ATTRIBUTION AND DATA SIZE
- Source: https://github.com/xn-intenton-z2a/repository0
- Files read: README.md, agentic-lib.toml, package.json, src/lib/main.js, SOURCES.md, MISSION.md
- Total bytes retrieved during crawl: 9072 bytes
- Attribution: xn-intenton-z2a/repository0 (repository content retrieved 2026-03-06)

END OF DOCUMENT
