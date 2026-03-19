# Mission

A JavaScript library for converting between integers and Roman numeral strings.

## Required Capabilities

- Convert an integer (1–3999) to its Roman numeral representation using subtractive notation (IV, IX, XL, XC, CD, CM).
- Convert a Roman numeral string back to an integer.
- The round-trip property must hold: converting to Roman and back yields the original integer for all valid values.

## Requirements

- Throw `RangeError` for numbers outside 1–3999.
- Throw `TypeError` for invalid Roman numeral strings.
- Handle subtractive notation correctly (e.g. IV = 4, not IIII).
- Export all public API as named exports from `src/lib/main.js`.
- Comprehensive unit tests including boundary values (1, 3999), subtractive cases, and invalid inputs.
- README with usage examples and conversion table.

## Acceptance Criteria

- [ ] Converting `1994` to Roman produces `"MCMXCIV"`
- [ ] Converting `"MCMXCIV"` from Roman produces `1994`
- [ ] Converting `4` to Roman produces `"IV"`
- [ ] Round-trip holds for all n in 1–3999
- [ ] Converting `0` to Roman throws `RangeError`
- [ ] Converting `4000` to Roman throws `RangeError`
- [ ] Converting `"IIII"` from Roman throws `TypeError` (strict: only subtractive notation accepted)
- [ ] All unit tests pass
- [ ] README documents usage with examples
