# HAMMING_TYPES

Status: IMPLEMENTED

Purpose
Provide clear JSDoc annotations so editors and TypeScript consumers can infer types and expected behaviour from the JavaScript source without shipping separate declaration files.

Scope
- JSDoc blocks must appear above exported functions in src/lib/main.js and document parameters, return types, thrown errors, and short usage notes.
- Use @param, @returns, and @throws tags where appropriate.

Acceptance Criteria
- src/lib/main.js contains JSDoc comments for hammingDistanceString and hammingDistanceInt with @param and @returns tags
- The JSDoc documents expected exceptions (TypeError, RangeError)
- Editors using allowJs or checkJs surface basic signatures and comments for these functions

Notes
- Do not ship separate declaration files; in-source JSDoc is sufficient for this small library.
