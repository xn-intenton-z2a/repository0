# FIZZBUZZ_TYPES

Summary

Provide first-class TypeScript type declarations for the FizzBuzz library so TypeScript consumers get accurate autocomplete, type-checking and improved DX while preserving the canonical ESM API.

Specification

- Add a TypeScript declaration file that exports typed signatures for all public named exports from src/lib/main.js: fizzBuzz, fizzBuzzSingle, fizzBuzzFormatted, fizzBuzzSingleFormatted, fizzBuzzStats, fizzBuzzGenerator, fizzBuzzWithWords, fizzBuzzSingleWithWords.
- The declaration file must be placed at src/lib/main.d.ts and must only describe types (no implementation).
- Type signatures:
  - fizzBuzz(n: number): string[]
  - fizzBuzzSingle(n: number): string
  - fizzBuzzFormatted(n: number, formatter: (s: string) => string): string[]
  - fizzBuzzSingleFormatted(n: number, formatter: (s: string) => string): string
  - fizzBuzzStats(n: number): { fizz: number; buzz: number; fizzBuzz: number; numbers: number; total: number }
  - fizzBuzzGenerator(n: number): Generator<string, void, unknown>
  - fizzBuzzWithWords(n: number, words?: { fizz?: string; buzz?: string }): string[]
  - fizzBuzzSingleWithWords(n: number, words?: { fizz?: string; buzz?: string }): string
- All exported function parameter and return types must reflect the canonical behaviour: functions accept numbers (integers) and throw at runtime for invalid inputs; declaration comments should document thrown error types (TypeError/RangeError) for invalid inputs.
- Include concise JSDoc comments above each declaration describing behaviour, edge cases (n = 0 returns empty array / yields nothing), and error conditions.

Examples

- import { fizzBuzz, fizzBuzzSingle } from './lib/main.js'
- const seq: string[] = fizzBuzz(15)
- const single: string = fizzBuzzSingle(3)

Testing guidance

- Unit tests remain JS-based; add a lightweight type check step in CI only if requested. For this feature, include examples in README demonstrating TypeScript usage with the new declarations so static checking can be manually verified by consumers.
- Ensure the declaration file lists every named export so editors like VSCode surface correct completions and signatures.

Acceptance criteria

- A file src/lib/main.d.ts exists at repository root and exports all named signatures listed above.
- README includes a brief TypeScript usage example referencing the typed exports.
- Editors (or a manual tsc check) will resolve types when importing from src/lib/main.js in a TypeScript project (no changes required to package.json beyond the declaration file).
- The canonical JavaScript behaviour and tests are unchanged; adding types must not modify runtime code.

Implementation notes

- Keep declarations minimal and conservative; avoid advanced conditional types or generics.
- Do not add a compile step or new build tools as part of this feature; a plain .d.ts file is sufficient.
- If consumers request, later expand to ship a top-level types field in package.json, but do not change package.json in this change.

Compatibility

- This feature is additive and non-breaking; it provides developer ergonomics for TypeScript consumers while keeping the runtime code unchanged.

