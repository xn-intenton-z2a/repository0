# HAMMING_TYPES

Purpose
Add clear JSDoc type annotations for the public API so TypeScript consumers can infer types and editors can surface accurate signatures and parameter expectations.

Scope
- Add JSDoc comments to each exported function in src/lib/main.js describing parameter types, return types, thrown exceptions, and examples of accepted inputs (string, number, bigint).
- Ensure exported function names and their JSDoc appear directly above the function definitions so standard TypeScript tooling recognizes the annotations.
- Document whether mixed numeric kinds are supported (Number + BigInt) and how coercion is handled.

Acceptance Criteria
- src/lib/main.js contains JSDoc blocks for each exported function describing parameter types and return type.
- A consumer using TypeScript with allowJs and checkJs enabled can import the functions and receive accurate editor type hints based on JSDoc.
- README includes a short note stating that JSDoc types are present and that TypeScript consumers can rely on editor hints.

Notes
- Do not add separate .d.ts files as part of this feature; prefer in-source JSDoc so that the repository remains a single-file implementation for the library.
