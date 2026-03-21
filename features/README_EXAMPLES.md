README_EXAMPLES

# README_EXAMPLES

Goal

Document usage examples and short explanation to appear in README.md demonstrating library usage for both programmatic API and CLI usage (start:cli script).

Description

Provide concise examples showing:

- Importing named exports from src/lib/main.js
- Calling fizzBuzzSingle for a single value
- Calling fizzBuzz for a range
- Expected outputs for the examples (as literal arrays/strings)

Examples

1) Programmatic usage (ES modules)

import { fizzBuzz, fizzBuzzSingle } from './src/lib/main.js';

// Single values
console.log(fizzBuzzSingle(3)); // "Fizz"
console.log(fizzBuzzSingle(5)); // "Buzz"
console.log(fizzBuzzSingle(7)); // "7"

// Range 1..15
console.log(fizzBuzz(15));
// Expected output:
// [
//  "1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz",
//  "11","Fizz","13","14","FizzBuzz"
// ]

2) CLI usage (npm start:cli)

# If the project exposes a start:cli script that prints fizzBuzz(15):
# npm run start:cli -- 15
# Output (stdout):
# 1
# 2
# Fizz
# 4
# Buzz
# Fizz
# 7
# 8
# Fizz
# Buzz
# 11
# Fizz
# 13
# 14
# FizzBuzz

Acceptance Criteria (expanded)

1. Examples show import syntax for ES modules and a ready-to-copy snippet for README.md.
2. Programmatic examples include fizzBuzzSingle outputs for 3, 5, and 7 and fizzBuzz output for 1..15 with an exact expected array literal.
3. CLI example documents expected stdout lines for fizzBuzz(15) when run via the project's CLI script (if present).
4. Examples are concise (≤ 20 lines of code) and copy-paste ready.
5. Acceptance tests: manual inspection of README.md copy will match these examples and outputs.
