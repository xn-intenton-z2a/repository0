# LENIENT_PARSING

# Overview

LENIENT_PARSING introduces an explicit, opt-in lenient parsing mode for fromRoman so the library can accept a small, well-defined set of commonly-seen nonstandard Roman inputs (for example: lowercase letters, and commonly used nonstandard repeats such as IIII). The default behaviour remains strict and unchanged.

# Motivation

Some consumers (clock-face text, legacy datasets, human-entered content) expect tolerant handling of a few nonstandard Roman forms. Providing an opt-in lenient mode increases the library's practical usefulness while preserving strict validation for correctness-sensitive uses.

# Specification

Exports (no breaking changes)
- Keep both named exports unchanged: toRoman and fromRoman exported from src/lib/main.js.

API changes
- fromRoman(string) stays the same and remains strict by default.
- Add optional second parameter options: fromRoman(s, options)
  - options.lenient: boolean (default false). When true, allow a defined set of nonstandard inputs.
  - options.normalize: boolean (default true). When true, trim outer whitespace and collapse internal repeated whitespace before parsing.

Lenient behaviour (when options.lenient is true)
- Accept lowercase input by uppercasing characters before parsing.
- Accept repeated-subtractive forms commonly used in signage or legacy data, specifically:
  - IIII -> treated as 4
  - VIIII -> treated as 9
  - XXXX -> treated as 40
  - LXXXX -> treated as 90
  - CCCC -> treated as 400
  - DCCCC -> treated as 900
- Implement lenient handling as a small normalization step that maps these nonstandard sequences to canonical subtractive forms (e.g., IIII -> IV) or otherwise computes their numeric value, then passes the normalized string to the strict parser core.
- Do not accept arbitrary malformed strings; inputs with invalid Roman letters or completely malformed sequences must still cause TypeError even in lenient mode.

Strict behaviour (default)
- fromRoman(s) without options or with options.lenient === false must validate strictly and throw TypeError on any invalid Roman numeral, including repeated subtractive misuse like IIII.

Edge cases and constraints
- The lenient mapping is intentionally limited and must be documented; it is not a permissive "guess the number" mode.
- Normalization must not produce numbers outside 1–3999; if normalization yields a value outside this range, throw RangeError to match toRoman constraints.

# Implementation notes

- Structure: implement a small preprocessor function normalizeLenient(s, options) that handles whitespace normalization, case folding, and mapped substitutions when options.lenient is true. Then call the existing strict parser core (fromRomanCore) to compute the numeric value and run validation.
- Reuse the strict parser core for validation and number computation to avoid duplicating parsing logic.
- Keep the strict parser unchanged; implement lenient handling only in the preprocessor and documented option flag.
- Write unit tests that exercise both modes and ensure the round-trip property for strict mode.

# Tests and Acceptance Criteria

Add unit tests to tests/unit/ covering the following (each must be implemented as a test case):
- Strict mode
  - fromRoman("IIII") throws TypeError
  - fromRoman("mcmxciv") throws TypeError (lowercase not accepted in strict)
  - fromRoman(toRoman(n)) === n for representative values including boundaries 1 and 3999 and representative subtractive cases (4, 9, 40, 90, 400, 900, 1994)
- Lenient mode
  - fromRoman("IIII", { lenient: true }) returns 4
  - fromRoman("mcmxciv", { lenient: true }) returns 1994
  - fromRoman("VIIII", { lenient: true }) returns 9
  - fromRoman("   mcmxciv  ", { lenient: true, normalize: true }) returns 1994
  - Inputs with random non-Roman letters still throw TypeError even in lenient mode (e.g., fromRoman("ABC", { lenient: true }) throws TypeError)
- Validation
  - If lenient normalization would imply a number outside 1–3999, the function throws RangeError

Acceptance criteria (testable)
- toRoman(1994) returns "MCMXCIV"
- fromRoman("MCMXCIV") returns 1994
- toRoman(4) returns "IV"
- fromRoman(toRoman(n)) === n for representative values in 1–3999 (including boundaries and subtractive cases)
- toRoman(0) throws RangeError; toRoman(4000) throws RangeError
- fromRoman("IIII") throws TypeError by default
- fromRoman("IIII", { lenient: true }) returns 4
- fromRoman("mcmxciv", { lenient: true }) returns 1994

# Documentation and Examples

README updates
- Add a short subsection "Lenient parsing (opt-in)" documenting options, behaviour, and examples. Show strict vs lenient examples without code escaping:
  - Strict: fromRoman("IIII") throws TypeError
  - Lenient: fromRoman("IIII", { lenient: true }) returns 4
  - Lenient with lowercase: fromRoman("mcmxciv", { lenient: true }) returns 1994
- Document that lenient mode is intentionally conservative and only accepts the listed nonstandard forms.

Examples
- Add example calls in README or examples/ showing fromRoman with options and the expected output.

# Files to change
- src/lib/main.js: add normalizeLenient(s, options) and wire options through fromRoman to the parser core (no change to exported names).
- tests/unit/main.test.js (or equivalent): add lenient tests and strict tests described above.
- README.md: document the new options and provide examples.

# Compatibility
- No breaking API changes. Named exports remain toRoman and fromRoman.
- Compatible with Node.js >=24 per package.json.

# Rationale
- Provides practical utility for common real-world inputs while preserving strict semantics required by correctness and tests. The feature is achievable entirely within the existing repository and can be implemented in a single source file by adding a small normalization helper and tests.

# Acceptance checklist (for reviewers)
- [ ] fromRoman("IIII") throws TypeError by default
- [ ] fromRoman("IIII", { lenient: true }) returns 4
- [ ] fromRoman("mcmxciv", { lenient: true }) returns 1994
- [ ] Unit tests added and passing for both strict and lenient modes
- [ ] README updated with examples and clear opt-in warning

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>
