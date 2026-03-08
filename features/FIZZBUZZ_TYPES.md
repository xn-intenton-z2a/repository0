# FIZZBUZZ_TYPES

# Summary

Add a small, focused feature that provides TypeScript type declarations and authoritative JSDoc comments for the library's public API (the named exports in src/lib/main.js). This improves editor UX, enables type-aware consumers, and fulfils the guidance already present in FIZZBUZZ_CORE while remaining a single-repository, achievable task.

# Specification

- New file: src/lib/main.d.ts exporting accurate TypeScript declarations for all public, named exports (fizzBuzz, fizzBuzzSingle and the optional helpers: fizzBuzzFormatted, fizzBuzzSingleFormatted, fizzBuzzStats, fizzBuzzGenerator, fizzBuzzWithWords, fizzBuzzSingleWithWords).
- JSDoc: Add or refine JSDoc comments to the runtime implementation in src/lib/main.js so editors without .d.ts still show useful signatures and error documentation. JSDoc must document parameters, return types, thrown errors and behaviour for edge cases.
- package.json types field (optional): If package.json does not already provide a types/type declaration, add "types": "src/lib/main.d.ts" so tooling can discover the declaration automatically; keep the change minimal and compatible with existing ESM setting.
- Tests and README: Update README.md examples to show the intended TypeScript-friendly usage and a short note about the declaration file (no code examples that quote or escape). Add a unit test that imports the runtime and asserts that the declaration file exists on disk (file presence test) and that the exported runtime functions match the signatures documented (lightweight reflection tests are acceptable). Do not add heavy TypeScript compilation as a requirement; keep tests runnable in current JS-only test environment.

# Type declarations (required shapes)

- fizzBuzz(n: number): string[]
  - Returns an array of strings for 1..n following Fizz/Buzz rules.
  - Throws RangeError/TypeError per validation rules.

- fizzBuzzSingle(n: number): string
  - Returns single string for integer n using canonical replacements.

- fizzBuzzFormatted(n: number, formatter: (s: string) => string): string[]

- fizzBuzzSingleFormatted(n: number, formatter: (s: string) => string): string

- fizzBuzzStats(n: number): { fizz: number; buzz: number; fizzBuzz: number; numbers: number; total: number }

- fizzBuzzGenerator(n: number): IterableIterator<string>

- fizzBuzzWithWords(n: number, words?: { fizz?: string; buzz?: string }): string[]

- fizzBuzzSingleWithWords(n: number, words?: { fizz?: string; buzz?: string }): string

# JSDoc requirements

- Each exported function in src/lib/main.js must have a JSDoc block describing:
  - Parameter names and types
  - Return type
  - Thrown errors and the substring expected in the message (e.g., 'integer', '>= 1')
  - Behavioural notes for edge cases (n = 0, omitted words object, empty string words)
- JSDoc should be concise and consistent with messages used in the validation feature documents so tests can match message substrings.

# Testing guidance

- Unit test additions (tests/unit/):
  - File presence test: assert that src/lib/main.d.ts exists.
  - Signature sanity test: require the runtime exports from src/lib/main.js and assert typeof fizzBuzz === 'function' and that calling fizzBuzz(5) returns an array of strings (no need to run tsc).
  - JSDoc message parity test: when possible assert that error messages thrown by runtime match documented substrings described in JSDoc (for example, calling fizzBuzz with -1 throws RangeError and message includes '>= 1').
- Avoid adding a full TypeScript build step; the goal is to ship declarations and verify their presence and runtime compatibility in current test environment.

# Acceptance criteria

- A file src/lib/main.d.ts exists and exports the named declarations listed above.
- src/lib/main.js contains JSDoc comments for each exported function consistent with the .d.ts signatures and the documented validation messages.
- README.md contains a short note describing the presence of TypeScript declarations and a minimal example of importing the library in TypeScript-friendly form.
- tests/unit includes a test that asserts the declaration file is present and that the runtime exports are functions returning the expected runtime types (string or string[]), and validation errors at runtime include the documented substrings.
- No changes to canonical runtime behaviour of fizzBuzz and fizzBuzzSingle.

# Implementation notes

- Keep declarations minimal and precise; prefer string[] and string return types (the project uses string outputs per FIZZBUZZ_CORE contract).
- Do not alter existing runtime signatures; implement declarations to match runtime exactly.
- If package.json already has a "types" or "types"-like field, do not duplicate; only add if absent.
- Keep edits limited to src/lib/main.js (JSDoc), src/lib/main.d.ts (new file), README.md (short note), and tests/unit (small presence and runtime sanity tests).

# Backwards compatibility

- This feature is purely additive and documentation-only at runtime; it must not change function behaviour, error types or messages. Adding a types field to package.json is optional and only to improve tooling; it does not affect runtime.

