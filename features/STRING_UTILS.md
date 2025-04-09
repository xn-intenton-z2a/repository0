# STRING_UTILS

## Overview
This feature adds a suite of string manipulation utilities to the CLI tool. It allows users to perform common text operations such as reversing a string, changing case (to uppercase, lowercase, title case), counting characters, and performing search and replace. The aim of this feature is to complement the existing numeric and mathematical operations with practical text processing capabilities, maintaining the repository’s mission of providing modular, self-contained CLI utilities.

## CLI Integration
- **Command Flag:** Introduce a new global flag `--string` to invoke string utilities.
- **Sub-Commands:** The `--string` command supports various sub-commands including:
  - **reverse:** Reverses the given string input.
  - **uppercase:** Converts the input string to all uppercase letters.
  - **lowercase:** Converts the input string to all lowercase letters.
  - **capitalize:** Capitalizes the first letter of each word.
  - **count:** Returns the character count (or word count if an optional flag `--words` is provided).
  - **replace:** Performs search and replace operations. Requires two additional parameters: the substring to find and the substring to replace it with.

## Implementation Details
- **Input Parsing:**
  - The CLI parser will extract the sub-command following `--string` and then the corresponding arguments.
  - For commands like `replace`, ensure that exactly three arguments are provided: the sub-command followed by the search string and the replacement string.

- **Operation Logic:**
  - **reverse:** Use built-in JavaScript string methods to split and reverse the input.
  - **uppercase, lowercase, capitalize:** Utilize the appropriate string transformation methods.
  - **count:** If `--words` flag is used, split the string by whitespace; otherwise, return the total character count.
  - **replace:** Use JavaScript’s `String.prototype.replace` with support for global replacement if required.

## Error Handling & Validation
- Validate that input strings are provided; otherwise, return a standardized error message such as "Error: No valid string input provided.".
- For the `replace` command, validate that both the search term and replacement term are non-empty strings.
- Provide clear usage instructions and examples in error messages, similar to how numeric commands are handled.

## Testing & Documentation
- **Unit Tests:**
  - Write tests to verify each sub-command works with valid input.
  - Include tests for error cases such as missing arguments or empty strings.
- **Documentation:**
  - Update the README to include examples of using the `--string` command.
  - Inline comments in the CLI source file (`src/lib/main.js`) will explain the implementation logic for string operations.

## Alignment with Repository Mission
The STRING_UTILS feature extends the CLI tool’s capability by adding text processing functions, which are essential for many automation and diagnostic tasks. This enhancement supports the repository’s mission of offering modular, self-contained utilities, enriching the overall toolset without introducing excessive complexity.