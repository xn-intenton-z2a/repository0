# FIZZBUZZ_TYPES

# Summary

Add small, hand-authored TypeScript declaration file for the canonical FizzBuzz library and wire it into package.json so TypeScript-aware tooling picks up accurate types without introducing a TypeScript build step or new dependencies.

# Specification

- Purpose: Provide lightweight, maintainable TypeScript declarations for the public API exported by src/lib/main.js so consumers get correct types from editors and bundlers.
- Target files to create/update:
  - src/lib/main.d.ts  (new declaration file)
  - package.json       (add top-level "types" field pointing to src/lib/main.d.ts)
  - README.md          (add a one-line note referencing src/lib/main.d.ts)

- Declaration content requirements (src/lib/main.d.ts):
  - Must use only named exports (no default export) matching the canonical API in FIZZBUZZ_CORE:
    - export function fizzBuzz(n: number): string[];
    - export function fizzBuzzSingle(n: number): string;
    - export function fizzBuzzFormatted(n: number, formatter: (value: string, index: number) => string): string[];
    - export function fizzBuzzSingleFormatted(n: number, formatter: (value: string, index: number) => string): string;
    - export function fizzBuzzStats(n: number): { fizz: number; buzz: number; fizzBuzz: number; numbers: number; total: number };
    - export function fizzBuzzGenerator(n: number): IterableIterator<string>;
    - export function fizzBuzzWithWords(n: number, words?: { fizz?: string; buzz?: string }): string[];
    - export function fizzBuzzSingleWithWords(n: number, words?: { fizz?: string; buzz?: string }): string;
  - Keep signatures simple and avoid advanced TypeScript features. The file is purely declarative and must not change runtime behaviour.

# Files changed by this feature

- Add: src/lib/main.d.ts (declaration file)
- Patch: package.json (add "types": "src/lib/main.d.ts")
- Patch: README.md (append or update a one-line note: TypeScript declarations available at src/lib/main.d.ts)

Note: Implementation must avoid adding new dependencies or build steps.

# Acceptance criteria

- src/lib/main.d.ts exists and exports the named declarations exactly as specified above.
- package.json contains a top-level "types" field with the value "src/lib/main.d.ts".
- README.md contains the substring "TypeScript declarations available at src/lib/main.d.ts" or equivalent one-line note referencing that path.
- No runtime codepaths are changed and no new dependencies are added to package.json.
- Unit tests and behaviour tests are not modified as part of this change (type declarations only).

# Testing guidance

- Automated check: a CI job or unit script can assert that src/lib/main.d.ts exists and that package.json.types === "src/lib/main.d.ts".
- Optional developer check: run tsc --noEmit against a minimal consumer file that imports the named exports; this is advisory and not required for acceptance.

# Backwards compatibility

- Declarations are additive only and must not alter runtime exports, side effects, or existing tests.
- No source code build or transpilation is required; the declarations are informational for TypeScript toolchains.

# Implementation notes

- Hand-write the declaration file to mirror the canonical API in src/lib/main.js. Avoid generating it from source.
- Keep the file short, reviewable and placed at src/lib/main.d.ts so editors and bundlers discover it automatically.
- When updating package.json, only add the types field; do not reorder or otherwise reformat package.json except for the minimal insertion.

# Notes

This feature improves developer ergonomics for TypeScript consumers while keeping the repository free of additional toolchain complexity.
