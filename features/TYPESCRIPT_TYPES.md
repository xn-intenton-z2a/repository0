# TYPESCRIPT_TYPES

# Summary

Add a minimal TypeScript declarations feature that ships a declaration file for the library and updates package metadata and scripts to verify the declarations. The goal is to provide accurate editor hints and typings for hammingDistance and hammingDistanceBits without changing runtime behaviour.

# Motivation

TypeScript consumers and modern editors rely on declaration files for parameter and return type hints. Providing a compact, well-documented declaration file improves developer experience and reduces friction for adoption while keeping the runtime JavaScript implementation untouched.

# Specification

1. Declaration file
   - Add src/lib/main.d.ts exporting the named functions with precise signatures:
     - export function hammingDistance(a: string, b: string, options?: { normalize?: false | "NFC" | "NFD" }): number;
     - export function hammingDistanceBits(x: number | bigint, y: number | bigint): number;
   - Include brief JSDoc comments documenting thrown errors (TypeError, RangeError) and acceptable option values.

2. package.json metadata
   - Add or update the top-level types field to point to src/lib/main.d.ts so TypeScript tooling picks it up automatically.

3. Verification script
   - Add a small dev-only script scripts/verify-types that runs npx tsc --noEmit on a temporary file that imports the declarations to ensure parsing succeeds.
   - The script should be safe to run when TypeScript is not installed (should fail gracefully or print guidance).

4. Tests and README
   - Add a short note to README.md describing the types file and how maintainers can validate it locally.
   - Optionally add a unit test under tests/unit that calls the verification script when TypeScript is present, but runtime tests remain JavaScript-only.

5. Non-functional constraints
   - Do not change runtime exports or behaviour; the declaration file must reflect existing runtime validation and options.
   - Keep the declaration file minimal and well-commented to avoid drift from implementation.

# Acceptance Criteria

- src/lib/main.d.ts exists and exports accurate signatures for hammingDistance and hammingDistanceBits
- package.json contains a top-level "types" field pointing to src/lib/main.d.ts
- README documents how to verify the declarations locally using scripts/verify-types
- A local run of npx tsc --noEmit on a small import file succeeds when TypeScript is available

