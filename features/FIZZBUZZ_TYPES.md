# FIZZBUZZ_TYPES

# Summary

Add a concise, machine-friendly TypeScript declaration file for the canonical FizzBuzz library so TypeScript consumers get correct types without changing runtime behaviour. This feature also prescribes a tiny unit test that asserts the declarations and package metadata exist, and a README note announcing TypeScript support.

# Specification

Purpose

- Provide a single declaration file that documents the public API exported by src/lib/main.js and enables comfortable consumption from TypeScript-aware editors and bundlers.
- Declarations must mirror the canonical exports and validation behaviour defined in FIZZBUZZ_CORE and must not change any runtime behaviour or validation messages.

Public types to declare (file: src/lib/main.d.ts)

- export type FizzBuzzWords = { fizz?: string; buzz?: string };
- export type FizzBuzzStats = { fizz: number; buzz: number; fizzBuzz: number; numbers: number; total: number };
- Exported functions (named exports):
  - export function fizzBuzz(n: number): string[];
  - export function fizzBuzzSingle(n: number): string;
  - export function fizzBuzzFormatted(n: number, formatter: (value: string, index: number) => string): string[];
  - export function fizzBuzzSingleFormatted(n: number, formatter: (value: string, index: number) => string): string;
  - export function fizzBuzzStats(n: number): FizzBuzzStats;
  - export function* fizzBuzzGenerator(n: number): Generator<string, void, unknown>;
  - export function fizzBuzzWithWords(n: number, words?: FizzBuzzWords): string[];
  - export function fizzBuzzSingleWithWords(n: number, words?: FizzBuzzWords): string;

File and package changes (implementation guidance)

- Create src/lib/main.d.ts with the above declarations only; do not reimplement logic.
- Add or update package.json to include the types entry: "types": "src/lib/main.d.ts" so TypeScript-aware tools pick up the declarations automatically.
- Add a short README line noting TypeScript declaration availability and pointing to src/lib/main.d.ts.

Testing guidance (unit tests)

- Add a small unit test at tests/unit/types.test.js that asserts two things exactly:
  - The file src/lib/main.d.ts exists and is readable.
  - package.json has a top-level "types" field whose value equals "src/lib/main.d.ts".
- Tests must be simple filesystem and JSON assertions (no TypeScript compiler invocation required) so they remain fast and deterministic in the existing Vitest test runner.

Acceptance criteria

- src/lib/main.d.ts exists and exports the exact type names and function signatures listed in this spec.
- package.json contains the key "types" with value "src/lib/main.d.ts".
- README.md contains the substring TypeScript and src/lib/main.d.ts so automated checks can discover the note.
- The new tests (tests/unit/types.test.js) pass under npm test and fail if declarations or package.json types are missing.

Notes and rationale

- This feature is purely additive and documentation-oriented: it improves DX for TypeScript users without touching runtime code or behaviour.
- The test approach is intentionally light-weight: verifying presence and package metadata is sufficient to provide value and keep CI cheap.
- Keep the declaration file minimal and closely aligned with the canonical exports in FIZZBUZZ_CORE to avoid drift.
