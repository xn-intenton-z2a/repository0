# SECURITY_UTILS

## Overview
This feature consolidates security-related utilities into a single, modular CLI command. It merges the existing password generation functionality with a new capability to generate secure UUIDs (Universally Unique Identifiers). This unified approach not only provides users with a flexible tool for creating strong passwords but also offers a quick method to generate secure, randomized identifiers, aligning with the repository’s mission of promoting healthy collaboration and streamlined automation.

## Implementation Details
### Command Integration
- **Unified Flag:** Introduce a new CLI flag `--security` which activates the security utilities module. Depending on sub-commands provided, the module will operate in one of two modes:
  - **Password Mode:** When the sub-command is `password` (or if no recognized sub-command is provided and numeric arguments are detected), the module generates a secure password.
    - **Parameters:** Accepts an optional numeric argument for password length (default is 12). Additional flags include `--include-uppercase`, `--include-digits`, and `--include-symbols` to customize the character set.
    - **Logic:** By default, includes lowercase letters. Conditionally appends uppercase letters, digits, and symbols based on flags. Uses Node's `crypto` module (e.g., `crypto.randomInt`) to randomly select characters until the desired length is reached.
  - **UUID Mode:** When the sub-command is `uuid`, the module generates a version 4 UUID.
    - **Parameters:** No additional parameters are required. Optionally, a flag (e.g., `--uppercase`) may be provided to output the UUID in uppercase.
    - **Logic:** Leverages Node's `crypto.randomUUID()` if available or an equivalent secure fallback to generate a truly random UUID.

### Error Handling & Validation
- Validate that the appropriate sub-command (`password` or `uuid`) is provided. If an unrecognized sub-command or insufficient parameters are detected, output a clear error message along with usage instructions for the `--security` command.
- For password generation:
  - Ensure the provided length is a positive integer within a sensible range (e.g., 8 to 128).
  - Return a standardized error message if invalid flags or parameters are provided.
- For UUID generation:
  - If any extraneous parameters are supplied, ignore them and proceed to generate the UUID, while optionally warning the user of unused inputs.

### Testing & Documentation
- **Unit Tests:**
  - Write tests to verify that valid inputs for both password and UUID generation return the expected output.
  - Test error conditions where parameters are missing or invalid, ensuring that clear and consistent error messages are produced.
- **Documentation:**
  - Update the README and CLI usage documentation to include examples for both sub-commands, for instance:
    - Password: `node src/lib/main.js --security password 16 --include-uppercase --include-digits --include-symbols`
    - UUID: `node src/lib/main.js --security uuid`
  - Include inline comments in `src/lib/main.js` where the new `--security` command is integrated, clearly demarcating the branching logic between password and UUID generation.

## Alignment with Repository Mission
By integrating two security utilities into a single feature, the SECURITY_UTILS module reinforces the repository’s mission of delivering modular, self-contained CLI utilities. It not only enhances security considerations within development workflows (through strong password creation) but also provides a practical tool for generating unique identifiers, thereby streamlining automation tasks.