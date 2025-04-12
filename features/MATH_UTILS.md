# MATH_UTILS

## Overview
This feature provides a suite of mathematical utilities that extend the CLI tool. In addition to computing the Greatest Common Divisor (GCD), Least Common Multiple (LCM), and checking for prime numbers, this update introduces prime factorization. These enhancements improve the tool's utility and align with the project's mission by offering clear, practical numerical operations.

## Implementation
- Update the existing module (e.g., `src/lib/math_utils.js`) to include a new function:
  - `primeFactors(n)`: Compute and return the list of prime factors for a given number `n`.
- Update the CLI command in `src/lib/main.js` to support an extended `math` command with a new subcommand `factor` alongside existing subcommands `gcd`, `lcm`, and `prime`.
- Ensure detailed error handling, including validations on input types and help messages for incorrect usage.
- Maintain the existing functions (`gcd`, `lcm`, `isPrime`) ensuring backward compatibility.

## Usage
- To compute the GCD: `node src/lib/main.js math gcd 54 24`
- To compute the LCM: `node src/lib/main.js math lcm 54 24`
- To check if a number is prime: `node src/lib/main.js math prime 13`
- To compute prime factors: `node src/lib/main.js math factor 84`

## Testing & Documentation
- Extend unit tests to cover the new `primeFactors` functionality in the `tests/unit/` suite.
- Update documentation in the README and this feature file with examples and usage instructions for the new subcommand.
- Ensure test coverage includes valid inputs, edge/corner cases, and error scenarios for all math utilities.

## Benefits
- Enhances the CLI by providing a broader set of mathematical operations.
- Demonstrates incremental improvements to software features that adhere to high code quality standards.
- Maintains clarity in functionality while offering additional value to users in numerical computation.
