# NUMERIC

## Overview
This feature provides a unified numerical computation module that consolidates arithmetic, statistical, combinatorial, and complex number operations. It also includes an advanced NaN diagnostics submodule that not only reports token parsing errors but now provides detailed insights such as the exact character range (trimStart and trimEnd) of token modifications during whitespace and punctuation normalization. Other enhancements include configurable punctuation stripping, a caching mechanism for performance optimization, and the inline flag (--allow-nan-inline) for temporary toggling of NaN acceptance.

## CLI Integration
- **Primary Commands:** Supports standard operations like `--sum`, `--subtract`, `--multiply`, `--divide`, and statistical commands such as `--median`, `--mode`, `--stddev`, and `--percentile`.
- **Diagnostic Sub-Command:** The `--diagnose-nan` command now outputs a detailed report on token processing. The report includes the original token, its trimmed version, the precise indices (trimStart and trimEnd) that show which characters were preserved after trimming, and a correction suggestion when tokens resembling "NaN" are rejected. This information is available in both plain text and JSON output modes.
- **Inline Flag:** The new `--allow-nan-inline` flag permits the temporary acceptance of tokens resembling "NaN" without modifying the global configuration, ensuring that such changes are transient and isolated to the current command invocation.

## Implementation Details
- **Token Parsing:** Prior to conversion, input tokens are trimmed of outer whitespace. Depending on the `TOKEN_PUNCTUATION_CONFIG` environment variable, leading and trailing punctuation is removed. A caching mechanism is utilized to optimize repetitive regex operations.
- **NaN Handling:** The parser rigorously checks for tokens that resemble "NaN" in any capitalization. By default, these tokens are rejected for safety; however, users may enable acceptance globally via the `ALLOW_NAN` environment variable or on a per-command basis using the `--allow-nan-inline` flag.
- **Advanced Diagnostics:** The `--diagnose-nan` command now comprehensively reports diagnostics on each token. For every input token, the tool shows:
  - **Original Input:** The token as provided by the user.
  - **Trimmed Token:** The token after outer whitespace and punctuation removal.
  - **Trim Indices:** The `trimStart` and `trimEnd` indices, indicating the exact character positions retained in the token.
  - **Acceptance Status:** Whether the token was accepted or rejected.
  - **Correction Suggestion:** A message suggesting to enable NaN acceptance if the token was rejected (unless disabled by configuration).

## Testing & Documentation
- **Unit Tests:** Extensive tests validate not only the numerical operations but also the enhanced diagnostics. Test suites cover normal inputs, edge cases involving extra punctuation, internal whitespace errors, and transient behavior of the inline flag.
- **Documentation:** The README, CLI usage guides, and inline comments have been updated to reflect these enhancements. Examples illustrate the use of standard mode, JSON mode, and diagnostic outputs with detailed token trim information.

## Alignment with Repository Mission
By integrating advanced diagnostics—including precise token character range reporting—and performance optimizations, the NUMERIC feature stands as a robust, self-contained utility. It supports the repository’s mission of promoting healthy collaboration and streamlined automation by providing users, from beginners to power users, with precise control over numerical computations in a maintainable CLI tool.