# STRICT_PARSER

## Summary

Add an optional strict parsing mode to fromRoman and the CLI that enforces canonical Roman numeral forms and rejects non-canonical inputs (for example IIII, VX, IIV). This feature complements the existing CLI_TOOL feature by making the library behaviour configurable and explicitly documented so tests and consumers can choose either permissive or strict behaviour.

## Motivation

The mission requires handling subtractive notation correctly and allows either rejecting or accepting non-canonical inputs for fromRoman. Offering a strict-parser option makes behaviour explicit, improves interoperability, and enables deterministic CLI/test behaviour without changing the library's default semantics unexpectedly.

## Specification

- Library API changes (src/lib/main.js)
  - Export a new optional named export parseRoman(s, options).
  - parseRoman(s, {strict: boolean}) performs the same conversion as fromRoman(s) when strict is false or omitted (preserve current behaviour). When strict is true, validate that the input is a canonical Roman numeral (no repeated more-than-allowed numerals, subtractive pairs only IV, IX, XL, XC, CD, CM, and correct ordering). If invalid in strict mode, throw TypeError.
  - Keep fromRoman(s) as an alias to parseRoman(s, {strict: true}) or document that fromRoman uses strict parsing by default — choose one and document it clearly in README and tests. The recommended choice for clarity: make fromRoman(s) behave in strict mode by default and provide parseRoman for permissive parsing, but maintain backward compatibility by ensuring tests pass.

- CLI behaviour (src/lib/main.js main guard)
  - Add a --strict flag to both to-roman and from-roman commands and to automatic detection no-arg mode.
  - When --strict is present, CLI rejects non-canonical roman inputs with a stderr message beginning with TypeError: and exit code 2.
  - Document that CLI without --strict accepts permissive forms for backward compatibility (if implementing permissive behavior). If fromRoman is strict by default, then CLI without --strict should pass --strict implicitly to match mission acceptance criteria that from-roman IIII errors; document the choice.

- Tests (tests/unit/)
  - Add unit tests verifying parseRoman(s, {strict: true}) rejects IIII, VX, IIV and parseRoman(s, {strict:false}) accepts common permissive forms when appropriate.
  - Add CLI behaviour tests asserting that node src/lib/main.js from-roman IIII with --strict triggers stderr starting with TypeError: and exit 2. Also cover from-roman IIII without --strict if permissive mode is supported.

- README.md
  - Document the new parseRoman API and the --strict CLI flag, including examples showing strict rejection of IIII and permissive acceptance if supported.

## Acceptance Criteria

- Library exports parseRoman and fromRoman as named exports from src/lib/main.js.
- fromRoman(s) enforces canonical rules (strict) and throws TypeError for IIII.
- parseRoman(s, {strict:false}) accepts permissive inputs where reasonable and returns their integer equivalent.
- CLI supports --strict and when used rejects IIII with stderr starting TypeError: and exit 2.
- Unit tests validate strict and permissive behaviours and pass under npm test.

## Notes and Compatibility

- Implementation must be contained to src/lib/main.js and tests in tests/unit/. No new files outside allowed set.
- Choose the default behaviour (strict vs permissive) thoughtfully; the spec recommends fromRoman be strict to match the CLI acceptance criteria in the mission but parseRoman remains available for permissive needs.
- Preserve existing named exports and ensure backward compatibility with consumers.

