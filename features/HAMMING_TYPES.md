# HAMMING_TYPES

Status: IMPLEMENTED — JSDoc annotations present in src/lib/main.js

Purpose
Add clear JSDoc type annotations for the public API so TypeScript consumers can infer types and editors can surface accurate signatures and parameter expectations.

Scope
- JSDoc blocks should appear above exported functions in src/lib/main.js describing parameter types, return types, thrown exceptions, and short examples.
- Ensure exported function names and their JSDoc appear directly above the function definitions so standard tooling recognizes them.

Acceptance Criteria
- src/lib/main.js contains JSDoc blocks for each exported function describing parameter types and return type.
- A simple check (reading src/lib/main.js) shows @param and @returns tags for hammingDistanceString and hammingDistanceInt.
- TypeScript consumers using allowJs and checkJs will receive basic editor hints from these JSDoc comments.

Notes
- This feature uses in-source JSDoc; no .d.ts files are required.
