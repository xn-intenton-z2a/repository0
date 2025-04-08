# BASE_CONVERSION

## Overview
This feature adds a new CLI command `--baseconv` that enables users to convert numbers between different numeral systems directly from the command line. The tool supports common bases such as binary (base 2), octal (base 8), decimal (base 10), and hexadecimal (base 16), as well as any base between 2 and 36. This utility enhances the CLI tool by offering a practical and modular function suitable for educational, diagnostic, and automation purposes.

## Implementation Details
- **Command Integration:**
  - Add a new flag `--baseconv` within the command mapping in `src/lib/main.js`.
  - The command expects three parameters:
    1. A string representing the number (e.g., "1010" or "FF").
    2. The source base (e.g., 2 for binary or 16 for hexadecimal).
    3. The target base (e.g., 10 for decimal).

- **Conversion Logic:**
  - Validate that both the source and target bases are integers within the supported range (2 to 36).
  - Use the built-in parsing function (e.g., `parseInt(numberString, sourceBase)`) to convert the input string to a numeric value.
  - If the parsing fails, output an error message such as "Error: Invalid number for the specified source base.".
  - Convert the numeric value to the target base using JavaScript’s `toString(targetBase)` method.

- **Error Handling & Validation:**
  - Ensure that exactly three parameters are provided.
  - Provide clear error messages if the input number is invalid, or if the source/target bases are not within the valid range.

## Testing & Documentation
- **Unit Tests:**
  - Write tests to verify successful conversion between bases (e.g., binary to decimal, hexadecimal to binary).
  - Test edge cases and error conditions such as missing parameters, invalid bases, or numeric strings that do not conform to the specified source base.

- **CLI Usage Examples:**
  - `node src/lib/main.js --baseconv "1010" 2 10` should output `10`.
  - `node src/lib/main.js --baseconv "FF" 16 2` should output the binary representation of 255 (i.e., `11111111`).

## Alignment with Repository Mission
This feature aligns with the repository's mission by adding an additional, focused utility in a single source file. By expanding the CLI's functionality to include numeric base conversion, it supports practical automation tasks and educational use cases, complementing the wide range of arithmetic and diagnostic operations already available.