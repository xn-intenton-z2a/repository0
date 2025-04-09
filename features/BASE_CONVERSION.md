# BASE_CONVERSION

## Overview
This feature adds a base conversion utility to the CLI tool. It enables users to convert numeric values between different numeral systems such as binary, octal, decimal, and hexadecimal. Unlike the UNIT_CONVERSION module which handles physical measurement units, BASE_CONVERSION focuses solely on numeric bases and provides an easy interface for developers and users who need to quickly switch between numeral systems.

## CLI Integration
- **Command Flag:** Introduce a new global flag `--base` to invoke base conversion commands.
- **Sub-Commands:
  - **to:** Convert a given number from its current base to a target base.
    - Example: `node src/lib/main.js --base to 1010 2 10` converts the binary number 1010 to its decimal representation (10).
  - **from:** Convert a given number from a specified base to decimal.
    - Example: `node src/lib/main.js --base from A F` converts the hexadecimal number A to decimal using base F (if applicable, but typically, the command just converts from the given base to decimal).
- **Output Modes:** Like other features, the output can be presented in plain text or JSON mode (using `--json` or `--json-pretty`).

## Implementation Details
- **Input Parsing:**
  - Validate that the number provided is a valid string for the specified source base.
  - Ensure that the source and target bases are within the allowed range (typically 2 to 36, as limited by JavaScript's parsing functions).
- **Conversion Logic:**
  - For the `to` command, the feature will first parse the number from its source base (using `parseInt(input, base)`) and then convert it to a string representation in the target base (using `num.toString(targetBase)`).
  - For the `from` command, the number will be parsed from the specified base and returned in decimal form.
- **Error Handling:**
  - If the number contains invalid characters for the given base, a clear error message will be returned.
  - In cases of missing or extra arguments, the tool will return usage instructions along with an explanation of the expected input format.

## Testing & Documentation
- **Unit Tests:** Create tests covering conversions between various bases (e.g., binary to decimal, decimal to hexadecimal, octal to decimal, etc.), as well as failure cases with invalid input.
- **Documentation:** Update the README and usage guides to include examples of base conversion commands. Inline comments in the source file will describe how conversions are handled and the limitations (base range 2-36).

## Alignment with Repository Mission
The BASE_CONVERSION feature enhances the repository’s modular CLI tool by providing a focused utility for numeral base conversions. It fits well with the mission of promoting healthy collaboration and streamlined automation by offering developers a lightweight, self-contained component that addresses a common need in programming and debugging scenarios.