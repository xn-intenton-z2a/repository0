ENTRYPOINT

NORMALISED EXTRACT

This document records exact, implementation-ready details for the package entrypoint at src/lib/main.js and its exported APIs and CLI behaviour.

Table of Contents
1. Module exports and signatures
2. CLI invocation and runtime detection
3. Implementation details and patterns
4. Error semantics and validation rules
5. Package configuration and scripts
6. Best practices and troubleshooting

1. Module exports and signatures

main(args: string[] | undefined) -> void
- Purpose: Minimal CLI handler used when file is invoked directly.
- Parameters: args: an array of command-line arguments (strings) or undefined when used programmatically.
- Behavior: Writes to stdout a single line containing the JSON-stringified args: "Run with: <json>".
- Invocation check: The module invokes main(args) when process.argv[1] === fileURLToPath(import.meta.url); when invoked directly via node, args are process.argv.slice(2).
- Return: void (synchronous), no thrown errors in default implementation.

hammingDistance(a: string, b: string) -> number
- Accepts two ECMAScript strings.
- Precondition: Both parameters must be of type string, otherwise throw TypeError.
- Normalization: Both strings MUST be normalized to Unicode Normalization Form C (NFC) before comparison.
- Comparison unit: Convert each normalized string into a sequence of Unicode code points (not UTF-16 code units). Implementation must use an iterator or Array.from(string) to ensure surrogate pairs count as single code points.
- Length requirement: If code point counts differ, throw RangeError.
- Behavior: Return integer count of indices i where codePointArrayA[i] !== codePointArrayB[i]. Use strict equality on code point values.
- Return: non-negative integer.
- Deterministic example: hammingDistance('e\u0301', 'é') === 0.

hammingDistanceBits(x: Buffer | Uint8Array | ArrayBuffer, y: Buffer | Uint8Array | ArrayBuffer) -> number
- Accepts two byte-sequence buffers of identical length. Supported types: Buffer, Uint8Array, ArrayBuffer.
- Validation: Convert ArrayBuffer to Uint8Array view before processing. If inputs are not one of the supported types, throw TypeError. If byte lengths differ, throw RangeError.
- Behavior: For each byte position i, compute xor = byteA ^ byteB; accumulate popcount(xor) into total. Return total number of differing bits across sequences.
- Return: non-negative integer.
- Implementation notes: Use table-driven or builtin popcount (if available) for performance; ensure consistent interpretation of ArrayBuffer endianness by using byte-wise views (Uint8Array) only.

2. CLI invocation and runtime detection

- Shebang: src/lib/main.js begins with a Node shebang, enabling direct execution as an executable script on Unix-like systems.
- Direct-invocation check: The module detects direct execution using process.argv[1] === fileURLToPath(import.meta.url). When true, it calls main(process.argv.slice(2)).
- CLI arguments: main receives arguments as an array of strings derived from process.argv.slice(2). The module prints a single diagnostic line; any CLI consumer should parse arguments before delegating to main.
- package.json start script: npm start runs node src/lib/main.js which triggers the same behaviour when executed as a script.

3. Implementation details and patterns

- Module format: ESM (package.json: "type": "module"). Use import/export syntax; use fileURLToPath from url to compare import.meta.url when detecting direct invocation.
- Re-export pattern: The entrypoint re-exports utilities from relative module ./hamming.js to allow import { hammingDistance, hammingDistanceBits } from 'package'. This pattern keeps utility implementations in dedicated modules while exposing them via the package main.
- Minimal CLI contract: main must be side-effect free except for its console output; avoid long-running tasks inside the entrypoint to keep programmatic imports safe.

4. Error semantics and validation rules

- TypeError: thrown when argument types do not match required types (non-string to hammingDistance, unsupported buffer types to hammingDistanceBits).
- RangeError: thrown when input lengths are incompatible (different code point counts for strings, different byte lengths for buffers).
- Failure modes: Consumers should catch and rethrow or translate these exceptions to CLI exit codes. Recommended mapping: TypeError -> exit code 2; RangeError -> exit code 3; unexpected exceptions -> exit code 1.

5. Package configuration and scripts

- package.json main: "src/lib/main.js" — this is the ESM module entrypoint for node and package imports.
- type: module -> ESM semantics. Node engine requirement: >=24.0.0.
- Scripts:
  - test: vitest --run tests/unit/*.test.js
  - test:unit: vitest --run --coverage tests/unit/*.test.js
  - start: node src/lib/main.js
- Dependency: @xn-intenton-z2a/agentic-lib is present as a runtime dependency in the repository.

6. Best practices and troubleshooting

- Importing: Use named import from package entrypoint to access utilities: import { hammingDistance, hammingDistanceBits } from 'package'; ensure Node resolves package main to src/lib/main.js in ESM mode.
- Unicode correctness: Always apply String.prototype.normalize('NFC') before generating code point arrays.
- Binary inputs: Normalize ArrayBuffer by wrapping in Uint8Array; do not rely on platform endianness for byte-level comparisons.
- Popcount algorithm: For repeated comparisons, implement lookup table for 256-entry byte popcount for predictable performance.
- Common errors:
  - Module not found: confirm package.json main path points to src/lib/main.js and that ESM mode is enabled.
  - TypeError/RangeError from utilities: validate input types/lengths before calling and present user-friendly CLI messages.

SUPPLEMENTARY DETAILS

- File detection mechanism exact check: process.argv[1] === fileURLToPath(import.meta.url) — ensures file is the entrypoint invoked directly, not imported.
- Shebang handling: interpreter selection relies on first line starting with "#!"; when publishing as a CLI package, build/release tool must preserve the shebang.
- Re-export semantics: export { hammingDistance, hammingDistanceBits } re-exports named exports from the local hamming module so consumers receive the original functions, preserving error types and semantics.

REFERENCE DETAILS

Function signatures and behavior (precise):

main(args: string[] | undefined) -> void
- params: args: string[] | undefined
- side-effects: console.log('Run with: ' + JSON.stringify(args))
- throws: None in current implementation

hammingDistance(a: string, b: string) -> number
- params:
  - a: string (must be ECMAScript string)
  - b: string (must be ECMAScript string)
- preconditions:
  - typeof a === 'string'
  - typeof b === 'string'
  - normalizedCodePointsLength(a) === normalizedCodePointsLength(b) else RangeError
- normalization:
  - aN = a.normalize('NFC')
  - bN = b.normalize('NFC')
- comparison unit: code points (use Array.from(aN) to create code point arrays)
- algorithm:
  - for i from 0 to N-1: if codePointA[i] !== codePointB[i] increment diff
  - return diff
- errors:
  - TypeError for non-string
  - RangeError for mismatched length

hammingDistanceBits(x, y) -> number
- params:
  - x: Buffer | Uint8Array | ArrayBuffer
  - y: Buffer | Uint8Array | ArrayBuffer
- normalization:
  - If input is ArrayBuffer, use new Uint8Array(input) to obtain view
  - If input is Buffer (Node), treat as Uint8Array view
- preconditions:
  - byteLength(x) === byteLength(y) else RangeError
- algorithm:
  - total = 0
  - for i from 0 to length-1:
    - xor = x[i] ^ y[i]
    - total += popcount(xor)
  - return total
- errors:
  - TypeError for unsupported types
  - RangeError for mismatched byte length

BEST PRACTICE EXAMPLES (description-only)
- Unicode: normalize both strings to NFC and use Array.from to generate code points prior to comparison.
- Binary: wrap ArrayBuffer in Uint8Array to avoid endianness issues; use a 256-entry popcount lookup table for performance.
- CLI: validate args length and types and map known errors to distinct exit codes.

TROUBLESHOOTING

- Symptoms: TypeError from hammingDistance: Verify callers pass strings and not String objects or other wrappers.
- Symptoms: RangeError from hammingDistance: Verify normalization reduces composed and decomposed forms to same code point length; inspect code point arrays.
- Symptoms: Unexpected module resolution error: Confirm package.json "type" is module and Node version >=24; use node --version.

DETAILED DIGEST

Source: https://github.com/xn-intenton-z2a/repository0
Retrieved: 2026-03-06T22:12:48.611Z
Files inspected: src/lib/main.js, README.md, package.json, tests/unit/main.test.js, SOURCES.md
Data size obtained during crawl: approximately 3.3 KiB

ATTRIBUTION

- Repository: xn-intenton-z2a/repository0 (https://github.com/xn-intenton-z2a/repository0)
- Retrieved on: 2026-03-06T22:12:48.611Z
- Crawl method: local repository read during library extraction
- Note: This document is distinct from existing HAMMING_UTILS and REPOSITORY0 documents and focuses on entrypoint and package-level integration details.
