# TYPES_DECLARATION

Status: Planned

Overview

Provide a TypeScript declaration file for the library public API to improve developer experience for TypeScript consumers and editors that rely on type hints.

Deliverables

- src/lib/main.d.ts describing named exports: encode, decode, defineEncoding, listEncodings, encodeUUIDShorthand, decodeUUIDShorthand and associated types (EncodingMetadata, EncodeOptions).
- JSDoc comments on each exported declaration explaining parameter types and return types.

Acceptance criteria (testable)

1. src/lib/main.d.ts exists and exports the declared symbols; a simple content check by tests asserts the presence of 'export function encode(' and 'export function decode(' substrings.
2. Declaration file documents parameter and return types consistent with the public API (Uint8Array for binary inputs/outputs; string for encoded text; EncodingMetadata structure for listEncodings entries).
3. The declaration file is small and dependency-free (no external type packages required).

Implementation notes

- Do not change runtime JS API surface; the .d.ts is purely additive for consumers.
- Keep types conservative and compatible with plain JS usage (avoid advanced generics).
