# STRICT_VALIDATION

Summary

Enforce strict parsing and validation rules for Roman numeral input across the library API. The library will adopt a single canonical parsing policy: fromRoman must reject non-canonical or malformed strings (for example, "IIII", "VV", "IL", repeated more than allowed, or invalid subtractive combinations) by throwing TypeError. This feature narrows accepted inputs, simplifying round-trip correctness and improving error visibility for callers.

Motivation

The mission requires correct handling of subtractive notation and robust conversions. Allowing ambiguous or non-canonical forms (like IIII) complicates guarantees such as round-trip invariants and makes behaviour inconsistent across consumers. A strict validation mode makes the API predictable and easier to test.

Scope

- API behavior change only for fromRoman(s): when s is not a syntactically valid canonical Roman numeral (per standard subtractive rules and repetition rules), fromRoman throws TypeError.
- toRoman(n) behavior remains unchanged and still throws RangeError for values outside 1–3999.
- No public breaking changes to function signatures; behaviour is a stricter runtime validation.
- Unit tests will be added or updated to assert errors for malformed inputs and to retain existing positive cases.

Implementation notes (developer guidance)

- Implement a regular-expression based validator or deterministic parser that enforces canonical Roman numeral grammar:
  - Allowed symbols: M, D, C, L, X, V, I
  - Repetition limits: M up to 3 in a row, C/X/I up to 3 in a row; D/L/V must not repeat.
  - Valid subtractive pairs: IV, IX, XL, XC, CD, CM only.
  - No other subtractive forms allowed (e.g., IL, IC, XM are invalid).
- fromRoman must run validation first and throw TypeError with a clear message when invalid.
- Tests should cover canonical and non-canonical examples, boundary values, and round-trip invariants.

Acceptance criteria

- fromRoman("MCMXCIV") returns 1994.
- fromRoman("IIII") throws TypeError.
- fromRoman("VV") throws TypeError.
- fromRoman("IL") throws TypeError.
- fromRoman(toRoman(n)) === n for a representative sample of n (1, 4, 9, 40, 90, 400, 900, 1994, 3999).
- Unit tests assert TypeError message includes the word "invalid" for malformed inputs.
- README updated describing the strict validation behaviour and examples.
