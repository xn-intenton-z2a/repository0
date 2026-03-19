# CORE_CONVERTER

Summary

A minimal, testable feature specifying the core integer-to-Roman and Roman-to-integer conversion API and behaviour. This feature makes the library implementation actionable and testable.

Goal

Implement named exports intToRoman(number) and romanToInt(roman) in src/lib/main.js that satisfy the mission acceptance criteria: accurate conversion using subtractive notation, strict error handling, and round-trip correctness for integers 1 through 3999.

Specification

- Public API (named exports from src/lib/main.js):
  - intToRoman(number: number): string
    - Accepts an integer in the inclusive range 1..3999.
    - Returns the uppercase Roman numeral string using canonical subtractive notation (IV, IX, XL, XC, CD, CM).
    - Throws RangeError for numbers <= 0 or >= 4000.
    - Throws TypeError if input is not a finite integer.
  - romanToInt(roman: string): number
    - Accepts a Roman numeral string using canonical uppercase subtractive notation.
    - Returns the integer value (1..3999).
    - Throws TypeError for invalid strings (including incorrect subtractive usage, invalid characters, excessive repeats, empty string).

Behavioral rules

- Subtractive notation must be used where canonical (e.g., 4 -> IV, not IIII).
- The round-trip property must hold: for all integers n in 1..3999, romanToInt(intToRoman(n)) === n.
- The implementation should favour a small deterministic algorithm appropriate for unit testing and clarity (table-driven mapping + greedy reduction for intToRoman; left-to-right validation/accumulation for romanToInt).

Examples

- intToRoman(1994) -> "MCMXCIV"
- romanToInt("MCMXCIV") -> 1994
- intToRoman(4) -> "IV"

Acceptance criteria (testable)

1. Converting 1994 to Roman produces "MCMXCIV".
2. Converting "MCMXCIV" from Roman produces 1994.
3. Converting 4 to Roman produces "IV".
4. Round-trip holds for all n in 1..3999: romanToInt(intToRoman(n)) === n.
5. intToRoman(0) throws RangeError.
6. intToRoman(4000) throws RangeError.
7. romanToInt("IIII") throws TypeError.
8. All public functions are exported as named exports from src/lib/main.js.
9. Unit tests exist in tests/unit/main.test.js covering boundary values, subtractive cases, and invalid inputs.

Implementation notes

- Keep the implementation pure and deterministic with no external dependencies.
- Prefer clarity and testability over micro-optimisations.
- Ensure functions are documented in README as part of the usage feature.

Files to change

- src/lib/main.js (implement or update)
- tests/unit/main.test.js (add unit tests asserting acceptance criteria)
- README.md (add API usage examples and conversion table as part of the usage feature)
