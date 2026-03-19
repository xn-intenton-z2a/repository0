# USAGE_README

Summary

Specify README updates that document usage examples, the public API, and a concise conversion table so users and tests can verify examples and the library is easy to adopt.

Goal

Add clear examples demonstrating intToRoman and romanToInt, show the conversion table for key values, and document CLI usage for the library entry point when run with node.

Required README content

1. Brief description of the library's purpose: convert integers (1..3999) to Roman numeral strings and back.
2. API usage examples (literal examples that must appear):
   - import { intToRoman, romanToInt } from './src/lib/main.js'
   - intToRoman(1994) // => "MCMXCIV"
   - romanToInt("MCMXCIV") // => 1994
   - intToRoman(4) // => "IV"
3. Conversion table (compact):
   - 1 I
   - 4 IV
   - 5 V
   - 9 IX
   - 10 X
   - 40 XL
   - 50 L
   - 90 XC
   - 100 C
   - 400 CD
   - 500 D
   - 900 CM
   - 1000 M
4. Error behaviour examples (show expected exceptions):
   - intToRoman(0) throws RangeError
   - romanToInt("IIII") throws TypeError
5. CLI note: a small example showing how to run the library as a CLI entry point if desired: node src/lib/main.js and a suggested behaviour (print usage or convert args) to be implemented by the core feature.

Acceptance criteria (testable)

1. README contains the intToRoman(1994) example producing "MCMXCIV".
2. README contains the romanToInt("MCMXCIV") example producing 1994.
3. README includes the conversion table with the canonical subtractive entries.
4. README documents the errors shown above (RangeError and TypeError examples).

Files to change

- README.md (add the content described above)
- optionally a small CLI example in src/lib/main.js to be demonstrated by start:cli script
