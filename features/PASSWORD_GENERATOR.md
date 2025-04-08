# PASSWORD_GENERATOR

## Overview
This feature adds a new CLI command `--password` that generates random secure passwords directly from the terminal. Users can generate a default password or customize the output by specifying desired length and optional flags to include uppercase letters, digits, and special characters.

## Implementation Details
- **Command Integration:**
  - Add a new flag `--password` to the CLI command mapping in `src/lib/main.js`.
  - The command accepts an optional numeric argument for password length (default is 12). Additional flags such as `--include-uppercase`, `--include-digits`, and `--include-symbols` determine whether the generated password includes characters from these sets.

- **Password Generation Logic:**
  - Define base character sets:
    - Lowercase letters (a-z) are always included.
    - Uppercase letters (A-Z), digits (0-9), and symbols (e.g. !@#$%^&*()) are conditionally added based on flags.
  - Use Node's built-in `crypto` module (e.g., `crypto.randomInt`) to securely choose random characters from the combined set.
  - Concatenate the randomly selected characters until the password reaches the specified length.

- **Error Handling & Validation:**
  - Validate that the length provided is a positive integer within a sensible range (for example, between 8 and 128).
  - If an invalid length is supplied or unrecognized flags are detected, return a standardized error message such as "Error: Invalid parameters for password generation.".

## Testing & Documentation
- **Unit Tests:**
  - Create tests to verify that the generated password meets the criteria: correct length and inclusion of requested character types.
  - Test that invalid parameters are properly handled and appropriate error messages are returned.

- **Documentation:**
  - Update the README and CLI usage documentation with examples such as:
    - `node src/lib/main.js --password`
    - `node src/lib/main.js --password 16 --include-uppercase --include-digits --include-symbols`
  - Provide inline code comments in `src/lib/main.js` where the new command is integrated to clarify the implementation details.

## Alignment with Repository Mission
This enhancement aligns with the repository's mission of providing modular, self-contained CLI utilities that promote healthy collaboration and streamlined automation. The PASSWORD_GENERATOR feature delivers a practical tool for secure password creation, a necessary utility in many development and deployment workflows.
