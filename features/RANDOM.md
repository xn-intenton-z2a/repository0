# RANDOM

## Overview
This feature introduces a suite of randomization utilities to the CLI tool. The RANDOM feature provides methods to generate random numbers within specified ranges, random strings of a specified length and character set, universally unique identifiers (UUIDs), and a new random boolean value. The boolean sub-command returns a random true or false value, optionally allowing users to specify a probability bias. It is designed as a standalone module and integrates with the CLI via a new flag, offering both simple one-off random values and more complex random sequences for scripting or prototyping.

## CLI Integration
- **Command Flag:** Introduce a new global flag `--random` to invoke random generation utilities.
- **Sub-Commands:**
  - **number:** Generate a random number. Accepts optional parameters for minimum and maximum values, and an option to choose between integer or decimal outputs.
    - Example: `node src/lib/main.js --random number 1 100` or `node src/lib/main.js --random number 0 1 --decimal`
  - **string:** Generate a random string. Accepts parameters for the length of the string and an optional character set (default to alphanumeric).
    - Example: `node src/lib/main.js --random string 16` or `node src/lib/main.js --random string 12 abcdef`
  - **uuid:** Generate a random UUID (version 4).
    - Example: `node src/lib/main.js --random uuid`
  - **boolean:** **New!** Generate a random boolean value. Optionally, users can specify a probability parameter to favor `true` or `false`. 
    - Usage Examples:
      - Basic boolean: `node src/lib/main.js --random boolean`
      - With probability bias: `node src/lib/main.js --random boolean 0.7` (Approximately 70% chance of returning `true`)

## Implementation Details
- **Random Number Generation:**
  - Use JavaScript’s built-in `Math.random()` to generate random floating-point numbers. If integer output is required, scale and floor the value appropriately.
- **Random String Generation:**
  - Construct a function that randomly selects characters from a defined pool (default alphanumeric) to form a string of desired length.
- **UUID Generation:**
  - Implement a lightweight function to generate a version 4 UUID compliant with RFC 4122.
- **Random Boolean Generation:**
  - If no probability is specified, the function employs `Math.random()` to return either `true` or `false` with equal likelihood.
  - If a probability parameter (between 0 and 1) is provided, the function returns `true` if a generated random number is less than the provided probability; otherwise, it returns `false`.
  - Input validation ensures that any provided probability is numeric and within the range [0, 1].

## Error Handling & Validation
- Validate that proper parameters are provided for each sub-command. For instance, check numeric bounds for random number generation and ensure the length parameter for random strings is a positive integer.
- For the boolean sub-command, return clear error messages if the probability parameter, when provided, is not a valid number between 0 and 1.

## Testing & Documentation
- **Unit Tests:** Add tests to cover various cases for each sub-command, including valid ranges, edge cases, and invalid inputs. Specific tests should verify:
  - That random number generation falls within specified bounds.
  - That random string generation yields a string of the correct length using the appropriate character set.
  - That UUID generation produces valid version 4 UUIDs.
  - That random boolean generation returns boolean values, and when a probability is provided, returns `true` and `false` in approximately the expected ratio.
- **Documentation:** Update the README and CLI usage guides. Provide usage examples for each type of random generation operation within the in-code comments and documentation.

## Alignment with Repository Mission
By extending the RANDOM feature to include random boolean generation, the tool provides users with enhanced randomization capabilities. This update supports rapid prototyping and testing workflows, fitting into the repository's mission of promoting healthy collaboration and streamlined, self-contained CLI tooling.