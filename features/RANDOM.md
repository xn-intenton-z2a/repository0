# RANDOM

## Overview
This feature provides a suite of randomization utilities to the CLI tool. It currently supports generating random numbers, strings, UUIDs, and booleans. In this update, we extend the RANDOM feature by adding a new sub-command for generating random passwords. This new sub-command allows users to generate secure, customizable passwords with options to set length, include uppercase letters, numbers, and optional symbols. This enhancement keeps the tool self-contained and aligns with the repository’s mission to support streamlined automation and healthy collaboration.

## CLI Integration
- **Global Flag:** `--random` remains the global flag to invoke the randomization module.
- **Existing Sub-Commands:**
  - **number:** Generate a random number within a configurable range.
  - **string:** Generate a random string from an alphanumeric set (or a provided character set).
  - **uuid:** Generate a random UUID (version 4).
  - **boolean:** Generate random boolean values, with an optional probability bias.
- **New Sub-Command - password:**
  - **Description:** Generates a secure random password.
  - **Usage Examples:**
    - Basic: `node src/lib/main.js --random password 12`
      - Generates a 12-character password using alphanumeric characters.
    - Advanced: `node src/lib/main.js --random password 16 --symbols --uppercase`
      - Generates a 16-character password including symbols and ensuring uppercase letters are incorporated.

## Implementation Details
- **Input Parsing & Validation:**
  - The new sub-command will treat the first parameter as the desired password length, which must be a positive integer.
  - Optional flags `--symbols` and `--uppercase` (and possibly `--numbers`) can be provided to include special characters and force inclusion of uppercase letters, respectively.
  - If no flags are provided, the default password will consist of lowercase alphanumeric characters.

- **Operation Logic:**
  - A secure random generation function will construct the password by selecting random characters from the allowed character set.
  - The character set is built based on the provided flags. For example, if `--symbols` is supplied, a set of punctuation characters will be appended. If `--uppercase` is provided, uppercase letters will be added and at least one uppercase letter will be ensured.
  - The final password is assembled and returned in plain text mode or in JSON mode (if global JSON flags are set) along with additional metadata such as timestamp and executionDuration.

- **Error Handling:**
  - If an invalid length is provided (non-positive or non-numeric), a clear error message is returned.
  - Missing parameters or unrecognized flags produce informative error messages guiding the user toward correct usage.

## Testing & Documentation
- **Unit Tests:**
  - Tests will cover valid password generation for various lengths and flag combinations.
  - Edge cases (such as zero or negative lengths, very long lengths, and invalid flag usage) will be included.

- **Documentation:**
  - The README and CLI usage guides will be updated with examples illustrating the use of the new password sub-command.
  - Inline code comments will explain the random password generation logic and character set construction.

## Alignment with Repository Mission
Enhancing the RANDOM feature with password generation capabilities provides an additional, practical utility that supports secure automation. It enriches the tool's randomization suite while adhering to the repository’s goal of offering self-contained, modular, and useful CLI utilities.
