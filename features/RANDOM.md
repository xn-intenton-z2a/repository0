# RANDOM

## Overview
This feature introduces a suite of randomization utilities to the CLI tool. The RANDOM feature provides methods to generate random numbers within specified ranges, random strings of a specified length and character set, and universally unique identifiers (UUIDs). It is designed as a standalone module and integrates with the CLI via a new flag, offering both simple one-off random values and more complex random sequences for scripting or prototyping.

## CLI Integration
- **Command Flag:** Introduce a new global flag `--random` to invoke random generation utilities.
- **Sub-Commands:**
  - **number:** Generate a random number. Accepts optional parameters for minimum and maximum values, and an option to choose between integer or decimal outputs.
    - Example: `node src/lib/main.js --random number 1 100` or `node src/lib/main.js --random number 0 1 --decimal`
  - **string:** Generate a random string. Accepts parameters for the length of the string and an optional character set (default to alphanumeric).
    - Example: `node src/lib/main.js --random string 16` or `node src/lib/main.js --random string 12 abcdef`
  - **uuid:** Generate a random UUID (version 4).
    - Example: `node src/lib/main.js --random uuid`

## Implementation Details
- **Random Number Generation:**
  - Use JavaScript’s built-in `Math.random()` to generate random floating-point numbers. If integer output is required, the random value will be scaled and floored appropriately.
  - Validate input parameters for numeric range and ensure that the minimum value is less than the maximum value.

- **Random String Generation:**
  - Construct a function that randomly selects characters from a defined pool (default alphanumeric) to form a string of desired length.
  - Support optional user-specified character set.

- **UUID Generation:**
  - Implement a light-weight function to generate a version 4 UUID or leverage a minimal dependency if needed, ensuring that the UUID is compliant with RFC 4122.

## Error Handling & Validation
- Validate that proper parameters are provided for each sub-command. For instance, check numeric bounds for random number generation and ensure the length parameter for random strings is a positive integer.
- Clear and concise error messages will be returned if validations fail.

## Testing & Documentation
- **Unit Tests:** Add tests to cover various cases for each sub-command, including valid ranges, edge cases, and invalid inputs.
- **Documentation:** Update the README and CLI usage guides. Provide usage examples for each type of random generation operation within the in-code comments and documentation.

## Alignment with Repository Mission
The RANDOM feature extends the repository’s modular CLI utility set by introducing widely applicable random generation capabilities. It supports healthy collaboration by providing developers with easy-to-use tools for prototyping, testing, and automating tasks that require randomness. As a self-contained module, it fits the repository’s aim of streamlined automation with minimal added complexity.