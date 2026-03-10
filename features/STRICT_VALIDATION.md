# PARSER_MODES

Summary

Preserve strict validation while adding an optional, backwards-compatible lenient parser mode. The library continues to default to strict canonical validation for fromRoman, throwing TypeError for malformed or non-canonical strings, but now exposes a clear, testable API to request lenient parsing where non-canonical inputs (for example, "IIII", "VV") are accepted and interpreted according to historically common semantics.

Motivation

Strict validation simplifies reasoning and guarantees the round-trip property when using the library's canonical outputs. However, real-world inputs and legacy data sometimes contain non-canonical Roman forms; allowing an explicit, opt-in lenient mode increases practical utility without weakening defaults or breaking existing callers.

Scope

- Maintain the default behaviour: fromRoman(s) (single argument) remains strict and throws TypeError for non-canonical strings.
- Add an optional second parameter to fromRoman: fromRoman(s, options) where options is an object supporting { strict: boolean }.
  - When options.strict is false, fromRoman operates in lenient mode and accepts a broader set of inputs, returning the interpreted integer value (for example, fromRoman('IIII', {strict:false}) => 4).
  - When options.strict is true or omitted, behaviour is identical to the current strict validation feature.
- No breaking changes to existing call sites; signatures remain backwards-compatible.
- Update unit tests, CLI, and web demo wrappers to surface the new option where appropriate but keep default behaviour unchanged.

API details

- Exports: named exports remain toRoman and fromRoman from src/lib/main.js.
- fromRoman usage examples:
  - Strict (default): fromRoman('MCMXCIV') => 1994; fromRoman('IIII') throws TypeError.
  - Lenient: fromRoman('IIII', {strict:false}) => 4; fromRoman('VV', {strict:false}) => 10 (documented behaviour).
- CLI: add flags --lenient or --strict to control parsing when using --from-roman; default remains strict.
- Web demo: expose demo wrapper functions demoFromRoman(s, {strict:true}) with default strict true; provide a toggle in the UI to enable lenient parsing for demonstration only.

Implementation notes (developer guidance)

- Keep the strict validator as described previously (regex or deterministic parser enforcing canonical grammar):
  - Allowed symbols: M, D, C, L, X, V, I
  - Repetition limits: M up to 3, C/X/I up to 3; D/L/V must not repeat
  - Valid subtractive pairs: IV, IX, XL, XC, CD, CM only
- Implement a separate lenient parser path that:
  - Accepts common non-canonical forms such as IIII (treat as 4), VV (treat as 10), and other additive combinations by summing symbol values left-to-right, applying a minimal subtractive rule if clearly intended.
  - Documents ambiguous cases and chooses a deterministic interpretation so tests can assert exact results.
- Ensure toRoman remains the single source of canonical output (unchanged) so round-trip invariants hold when using toRoman then fromRoman without lenient mode.
- Tests: add unit tests that exercise both modes, including boundary values, subtractive cases, and examples of non-canonical inputs. When testing lenient mode, assert the documented deterministic interpretation (e.g., IIII => 4, VV => 10, IL still invalid unless explicitly documented and supported).

Acceptance criteria

- Default strict behaviour preserved: fromRoman('IIII') throws TypeError when called as fromRoman('IIII') with no options.
- Lenient mode works: fromRoman('IIII', {strict:false}) returns 4; fromRoman('VV', {strict:false}) returns 10.
- toRoman unchanged: toRoman(1994) returns 'MCMXCIV' and toRoman(4) returns 'IV'.
- Round-trip invariant preserved for canonical outputs: fromRoman(toRoman(n)) === n for all tested n when using strict mode.
- CLI supports --lenient flag for --from-roman, defaulting to strict when flag omitted; running node src/lib/main.js --from-roman IIII --lenient prints 4 and exits 0.
- Web demo exposes a toggle to switch parsing mode; demoFromRoman wrapper accepts the same options object and behaves identically to the library functions.
- Unit tests added/updated to assert strict errors include the word "invalid" in the message and to assert exact integer results for lenient cases; tests run under npm test.
- README updated documenting the new optional parsing mode, examples for both strict and lenient usage, and guidance on which mode to use in different scenarios.

Notes

- This feature expands usability while keeping the safe default of strict validation. Implementation must prioritise deterministic, well-documented behaviour for the lenient mode so tests and consumers are reliable.
