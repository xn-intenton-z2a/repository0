# MATH_UTILS

## Overview
This feature introduces essential mathematical utilities into the repository. It provides command-line functionality to compute the Greatest Common Divisor (GCD), Least Common Multiple (LCM), and to check if a number is prime. This enhancement aligns with the repository's mission by extending the CLI capabilities while maintaining clarity and simplicity in implementation.

## Implementation
- Create a new module (e.g., `src/lib/math_utils.js`) that exports the following functions:
  - `gcd(a, b)`: Compute the greatest common divisor using the Euclidean algorithm.
  - `lcm(a, b)`: Compute the least common multiple using the relationship `lcm(a, b) = |a * b| / gcd(a, b)`.
  - `isPrime(n)`: Determine if `n` is a prime number.
- Update `src/lib/main.js` to handle a new command `math`. Within this command, parse subcommands such as `gcd`, `lcm`, and `prime`, and route the arguments to the appropriate function in `math_utils`.
- Add detailed error handling and usage instructions for users.

## Usage
- To compute the GCD: `node src/lib/main.js math gcd 54 24`
- To compute the LCM: `node src/lib/main.js math lcm 54 24`
- To check for a prime number: `node src/lib/main.js math prime 13`

## Testing & Documentation
- Extend the unit tests in `tests/unit/` to include tests for each mathematical function ensuring their correctness.
- Update the README to document this new functionality with usage examples and to showcase its integration with the CLI.

## Benefits
- Provides common numerical operations that enhance the CLI tool's practical value.
- Offers a clear example of extending the CLI with additional, testable functionality while adhering to project standards and mission.
