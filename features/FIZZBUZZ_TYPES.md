# FIZZBUZZ_TYPES

Summary

Add TypeScript declaration files and comprehensive JSDoc comments to the canonical FizzBuzz library so editors and consumers get accurate types and in-editor documentation without changing runtime behaviour. This feature is strictly additive: it provides a lightweight main.d.ts and JSDoc annotations on exported functions in src/lib/main.js and adds README examples referencing the types when appropriate.

Specification

- Deliverables
  - A new TypeScript declaration file at src/lib/main.d.ts that exports the exact runtime signatures for named exports: fizzBuzz, fizzBuzzSingle, fizzBuzzFormatted, fizzBuzzSingleFormatted, fizzBuzzStats, fizzBuzzGenerator, fizzBuzzWithWords, fizzBuzzSingleWithWords (only include declarations for functions actually present in the runtime). Types must reflect input and output shapes precisely and use descriptive parameter and return types.
  - JSDoc comments added to each exported function in src/lib/main.js describing parameters, thrown errors, return values and a short example usage line (no code blocks). JSDoc must be concise and accurate so IDEs surface tooltips.
  - README additions demonstrating typed usage in two short examples: importing named exports and showing expected types in prose (no code block quoting or escaping). Keep examples small and directly related to function signatures.

- Type design
  - fizzBuzz(n: number): Array<string>
  - fizzBuzzSingle(n: number): string
  - fizzBuzzFormatted<T = any>(n: number, formatter: (value: string, index: number) => T): Array<T>
  - fizzBuzzSingleFormatted<T = any>(n: number, formatter: (value: string, index: number) => T): T
  - fizzBuzzStats(n: number): { fizz: number; buzz: number; fizzBuzz: number; numbers: number; total: number }
  - fizzBuzzGenerator(n: number): Generator<string, void, unknown>
  - fizzBuzzWithWords(n: number, words?: { fizz?: string; buzz?: string }): Array<string>
  - fizzBuzzSingleWithWords(n: number, words?: { fizz?: string; buzz?: string }): string

- Validation and compatibility
  - Declarations must match runtime behaviour precisely: parameter names and thrown error types documented in JSDoc must reflect actual runtime errors (RangeError messages and TypeError usages) so tests and editors do not show conflicting information.
  - No runtime code changes that alter behaviour are permitted; JSDoc only complements runtime behaviour.
  - The declaration file should be placed at src/lib/main.d.ts and package.json type declarations do not need changing unless necessary for editor discovery; keep package.json unchanged unless an explicit test requires it.

Testing guidance

- Unit tests (tests/unit/) remain authoritative; add a small unit test asserting that requiring the declaration file does not change runtime behaviour by importing the functions and exercising a couple of calls if the environment supports TypeScript declaration consumption in tests. Prefer pure JS tests that import the runtime and assert behaviour rather than relying on TS compilation in CI.
- Manual verification steps:
  - Open src/lib/main.js in an editor after JSDoc additions and confirm hover tooltips show parameter and return descriptions.
  - Verify that TypeScript-aware editors pick up src/lib/main.d.ts when importing from src/lib/main.js using relative imports.

Acceptance criteria

- A file src/lib/main.d.ts exists and exports typed declarations for the runtime functions present in src/lib/main.js.
- Each exported runtime function in src/lib/main.js has an accurate JSDoc comment describing parameters, thrown errors and return values.
- README contains a short prose example referencing typed usage (two short examples) and mentions where the declaration file lives.
- No runtime behaviour is changed; existing unit tests continue to pass.
- Editors with TypeScript support surface correct tooltips and parameter types for the exported APIs when hovering over imports.

Notes

- Keep types minimal and focused on developer experience; use generic T for formatter returns to avoid over-specifying.
- Do not add a full TypeScript build step or new devDependencies; this feature is limited to a declaration file and JSDoc only to keep changes small and reversible.
- If new runtime helpers are declared in the d.ts that do not exist at runtime, adjust the declarations to match the actual exports instead.
