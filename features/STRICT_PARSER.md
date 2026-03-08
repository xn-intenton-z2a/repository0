# STRICT_PARSER

# Summary
Introduce an explicit parseRoman API that supports a strict parsing mode and expose a --strict CLI flag so consumers and tests can choose canonical-only Roman numeral acceptance. Make fromRoman behave in strict mode by default and provide parseRoman(s, {strict:false}) for permissive parsing.

# Motivation
The mission allows either rejecting or accepting non-canonical inputs; making strictness explicit avoids ambiguity, gives deterministic CLI/test behaviour, and lets callers opt into permissive parsing when needed.

# Specification
- Library API (src/lib/main.js)
  - Export a new named function parseRoman(s, options) where options is optional. parseRoman(s) defaults to permissive behaviour (strict:false) for compatibility; parseRoman(s, {strict:true}) enforces canonical Roman numerals and throws TypeError on invalid input.
  - Make fromRoman(s) a named export that behaves as parseRoman(s, {strict:true}) (strict by default) so existing callers that expect strict validation get canonical behaviour.
  - Keep toRoman unchanged and exported as before.

- Validation rules for strict mode
  - Only allow subtractive pairs IV, IX, XL, XC, CD, CM.
  - Do not allow more than three repeats of I, X, C, or M in a row.
  - Disallow invalid subtractive combinations such as IIV, VX, IL, etc.
  - Enforce correct ordering so that fromRoman(toRoman(n)) === n for all 1..3999.

- CLI behaviour
  - Add --strict flag to from-roman and no-arg auto-detection. When --strict is present the CLI uses strict parsing (same rules as fromRoman). By default the CLI calls fromRoman (strict) for explicit from-roman commands to match mission acceptance criteria; parseRoman with --permissive may be supported via --permissive if desired.
  - Errors must begin with TypeError: and exit with code 2 when strict parsing rejects input.

# Tests
- Unit tests must assert parseRoman accepts permissive inputs when strict:false and that parseRoman(..., {strict:true}) rejects IIII, VX, IIV with TypeError.
- Tests must assert fromRoman("IIII") throws TypeError and that the CLI node src/lib/main.js from-roman IIII exits with code 2 and stderr starting TypeError:.

# Acceptance Criteria
- src/lib/main.js exports parseRoman, fromRoman, and toRoman as named exports.
- fromRoman enforces canonical rules and throws TypeError for IIII.
- parseRoman(s, {strict:false}) accepts permissive forms and returns their integer equivalent.
- CLI supports --strict (or defaults to strict for from-roman) and rejects IIII with stderr starting TypeError: and exit 2.
- Unit tests validate both strict and permissive behaviour and pass under npm test.

# Notes
- Implementation must be confined to src/lib/main.js and tests in tests/unit/; do not add files outside allowed set.
- Document behaviour choices in README, including that fromRoman is strict by default and parseRoman exists for permissive parsing.

