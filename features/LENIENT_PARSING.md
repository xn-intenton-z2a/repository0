# LENIENT_PARSING

Overview

Introduce an optional lenient parsing mode for fromRoman to accept a small set of commonly-used nonstandard inputs (lowercase letters and repeated subtractive forms such as IIII). This mode must be opt-in and documented.

Motivation

Different projects accept nonstandard Roman styles (for clocks and legacy data). Providing an explicit, opt-in lenient mode increases usefulness while preserving the strict behavior required for correctness and tests.

Specification

- Keep the default behaviour of fromRoman(s) strict: invalid Roman strings throw TypeError.
- Add a second optional parameter options to fromRoman: fromRoman(s, options).
- Options supported:
  - lenient: boolean (default false). When true, parser accepts lowercase input and common nonstandard repeat forms such as IIII and returns their numeric value.
  - normalize: boolean (default true). When true, trim whitespace and collapse internal repeated spaces before parsing.
- When lenient is true, fromRoman should still validate against obviously malformed sequences (e.g., random letters) and should throw TypeError for inputs that cannot be parsed even in lenient mode.

API Example

- Strict parsing: fromRoman("IIII") throws TypeError.
- Lenient parsing: fromRoman("IIII", { lenient: true }) returns 4.
- Lowercase support: fromRoman("mcmxciv", { lenient: true }) returns 1994.

Implementation Notes

- Implement lenient parsing as a pre-processing step that maps allowed nonstandard forms into their canonical equivalents when safe to do so, then reuse the strict parser core to convert to a number.
- Do not weaken the strict parser used by default; the library must still throw TypeError for invalid inputs unless lenient mode is explicitly enabled.
- Update unit tests to include both strict and lenient mode cases, including boundary cases like 1 and 3999 and malformed strings.

Acceptance Criteria

- fromRoman("IIII") throws TypeError by default.
- fromRoman("IIII", { lenient: true }) returns 4.
- fromRoman("mcmxciv", { lenient: true }) returns 1994.
- fromRoman(fromRoman(toRoman(n))) === n still holds for strict mode round-trip for all n in 1–3999.
- All new and existing unit tests that cover lenient behaviour pass.

Documentation

- Update README to document the new options parameter and show examples of strict vs lenient usage.
- Clearly document that lenient mode is opt-in and may accept strings that are not valid Roman numerals by the strict standard.
