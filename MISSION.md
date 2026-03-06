# Mission

A JavaScript library for converting between integers and Roman numeral strings.

## Core Functions

- `toRoman(n)` — convert an integer (1–3999) to its Roman numeral representation using subtractive notation (IV, IX, XL, XC, CD, CM).
- `fromRoman(s)` — convert a Roman numeral string back to an integer.

## Requirements

- Throw `RangeError` for numbers outside 1–3999.
- Throw `TypeError` for invalid Roman numeral strings.
- Handle subtractive notation correctly (e.g. IV = 4, not IIII).
- The round-trip property must hold: `fromRoman(toRoman(n)) === n` for all valid n.
- Export both functions as named exports from `src/lib/main.js`.
- Comprehensive unit tests including boundary values (1, 3999), subtractive cases, and invalid inputs.
- README with usage examples and conversion table.

## Acceptance Criteria

- [ ] `toRoman(1994)` returns `"MCMXCIV"`
- [ ] `fromRoman("MCMXCIV")` returns `1994`
- [ ] `toRoman(4)` returns `"IV"`
- [ ] `fromRoman(toRoman(n)) === n` for all n in 1–3999
- [ ] `toRoman(0)` throws `RangeError`
- [ ] `toRoman(4000)` throws `RangeError`
- [ ] `fromRoman("IIII")` throws or returns `4` (accept either; document the choice)
- [ ] All unit tests pass
- [ ] README documents usage with examples
