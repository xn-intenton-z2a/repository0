# NUMERIC

## Overview
This feature consolidates arithmetic, statistical, combinatorial, and complex number operations into a unified numerical utilities module within the CLI tool. In addition to basic arithmetic (addition, subtraction, multiplication, division, modulo), advanced statistics (median, mode, standard deviation, percentile, geometric mean, variance, Fibonacci, GCD, LCM, and prime detection), complex number arithmetic, and basic calculus operations (numerical differentiation and integration), this update integrates a comprehensive NaN diagnostics submodule. The diagnostics component analyzes and reports input token issues—especially those resembling 'NaN'—including trimmed values, warning indices, and the preserved character range (trimStart and trimEnd).

## CLI Integration
- **Primary Commands:** Commands such as `--sum`, `--subtract`, `--average`, etc., continue to operate as before.
- **New Diagnostic Sub-Command:**
  - **Command Flag:** `--diagnose-nan`
  - **Usage:** `node src/lib/main.js --diagnose-nan <token1> <token2> ...`
  - **Description:** Analyzes input tokens for numeric parsing issues. Reports the original token, its trimmed form, the indices of the characters that were preserved (trimStart and trimEnd), whether the token was accepted, and provides suggestions when tokens resembling 'NaN' are rejected.

## Implementation Details
- **Unified Parsing:** The parsing mechanism now trims outer whitespace and applies configurable punctuation stripping based on `TOKEN_PUNCTUATION_CONFIG`. A caching mechanism improves performance when processing high volumes of tokens.
- **NaN Handling:** Integration of environment variables (e.g., `ALLOW_NAN`, `INVALID_TOKENS`, `DISABLE_NAN_SUGGESTION`, `DYNAMIC_WARNING_INDEX`) ensures flexible treatment of tokens. The module rejects or accepts tokens resembling 'NaN' based on configuration, with appropriate warnings.
- **Diagnostics Integration:** The `--diagnose-nan` command has been merged into the NUMERIC feature. It provides detailed diagnostics, including the exact character ranges (trimStart and trimEnd) from the original tokens, offering users clear insights to resolve input issues.

## Testing & Documentation
- Comprehensive unit tests validate standard arithmetic operations and the enhanced NaN diagnostics functionality. Tests cover edge cases such as varied punctuations and internal whitespace in tokens.
- Documentation in the README and CLI guides has been updated to include examples of how to invoke and interpret the diagnostic output.

## Alignment with Repository Mission
By merging the dedicated NaN diagnostics functionality into the NUMERIC feature, this update enhances error transparency in numerical processing while keeping the repository streamlined. This integration supports the repository’s mission of promoting healthy collaboration and delivering robust, self-contained CLI utilities without adding unnecessary complexity.