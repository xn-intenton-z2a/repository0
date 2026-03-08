# FIZZBUZZ_TYPES

Summary

Add a minimal TypeScript declaration file for the canonical FizzBuzz library API and wire it into package.json so consumers get accurate types without introducing a TypeScript build step. The declaration file must reflect the canonical named exports defined in src/lib/main.js and be small, hand-authored, and easy to maintain.

Specification

- Create a single declaration file at src/lib/main.d.ts that exports named ESM declarations for:
  - export function fizzBuzz(n: number): string[];
  - export function fizzBuzzSingle(n: number): string;
  - export function fizzBuzzFormatted(n: number, formatter: (value: string, index: number) => string): string[];
  - export function fizzBuzzSingleFormatted(n: number, formatter: (value: string, index: number) => string): string;
  - export function fizzBuzzStats(n: number): { fizz: number; buzz: number; fizzBuzz: number; numbers: number; total: number };
  - export function fizzBuzzGenerator(n: number): IterableIterator<string>;
  - export function fizzBuzzWithWords(n: number, words?: { fizz?: string; buzz?: string }): string[];
  - export function fizzBuzzSingleWithWords(n: number, words?: { fizz?: string; buzz?: string }): string;

- Update package.json to include the types field pointing at src/lib/main.d.ts so TypeScript-aware tooling picks up the declarations automatically.

- Update README.md to include a short one-line TypeScript note pointing to src/lib/main.d.ts when declarations are present; keep the README change minimal and machine-findable (the existing README feature already asks for this substring).

- Do not change runtime behaviour or introduce a TypeScript build step, new devDependencies, or transpilation. The declaration file must be purely informational for TS consumers.

Acceptance criteria

- File src/lib/main.d.ts exists in the repository root with the exported declarations listed above.
- package.json contains a top-level "types" field whose value is the relative path "src/lib/main.d.ts".
- README.md contains a short TypeScript note referencing src/lib/main.d.ts (for example: TypeScript declarations available at src/lib/main.d.ts).
- The addition of the declaration file does not modify any runtime code paths or tests and does not add new dependencies.

Testing guidance

- Unit-level verification: a CI check or local script can assert that src/lib/main.d.ts exists and that package.json includes the types field with the expected value; this is sufficient for automated validation without adding TypeScript compilation.

- Optional developer verification: running tsc --noEmit against the declaration file and a minimal consumer file should succeed if a TypeScript toolchain is present, but this is not required by the acceptance criteria.

Implementation notes

- Keep the declaration file concise and avoid advanced TypeScript features; simple function signatures and plain object types are preferred.
- Do not export default; only use named exports to match src/lib/main.js.
- Ensure all exported function parameter and return types align with the canonical behaviour documented in FIZZBUZZ_CORE and MISSION.md (strings for Fizz/Buzz/FizzBuzz outputs, arrays of strings, generator yielding strings, and stats object with numeric fields).
- Make no other changes to the codebase in this feature step; tests and examples remain unchanged.

Notes on scope

- This feature is deliberately small and additive: it improves developer ergonomics for TypeScript consumers without changing any library behaviour or CI configuration.
- If maintainers later adopt a TypeScript toolchain, the declaration file can be promoted into source or expanded, but that is outside the scope of this feature.