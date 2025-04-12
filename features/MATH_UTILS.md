# MATH_UTILS

## Overview
This enhanced math utilities feature now includes additional support for modular arithmetic. In addition to the existing operations (GCD, LCM, prime checking, and prime factorization), this update introduces a new modular exponentiation function. This provides users with the ability to calculate (base^exponent mod modulus) directly via the CLI, enhancing the utility and comprehensiveness of our math library.

## Implementation
- Update the math utilities module (e.g., `src/lib/math_utils.js`) to include a new function:
  - `modExp(base, exponent, modulus)` that efficiently computes the modular exponentiation.
- Update the CLI entry point in `src/lib/main.js` to add a new subcommand `modexp` alongside the existing subcommands (`gcd`, `lcm`, `prime`, `factor`).
- Ensure robust error handling and input validation, including checks for numeric inputs and non-zero modulus where appropriate.
- Extend unit tests in `tests/unit/` to include coverage for the new `modExp` functionality, ensuring validation of correct operation, edge cases, and error scenarios.

## Usage
- Compute the GCD: `node src/lib/main.js math gcd 54 24`
- Compute the LCM: `node src/lib/main.js math lcm 54 24`
- Check for prime numbers: `node src/lib/main.js math prime 13`
- Compute prime factors: `node src/lib/main.js math factor 84`
- Compute modular exponentiation: `node src/lib/main.js math modexp 2 10 1000`

## Benefits
- Expands the range of mathematical operations offered by the CLI tool.
- Provides users with a direct and efficient method for performing modular arithmetic, which is useful in many practical and educational contexts.
- Ensures consistency in coding quality, documentation, and test coverage across all math utilities.
