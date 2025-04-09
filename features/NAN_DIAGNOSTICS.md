# NAN_DIAGNOSTICS

## Overview
This feature introduces an advanced diagnostic tool specifically for analyzing and debugging the processing of numeric tokens, with a focus on how the CLI handles inputs resembling "NaN". It provides detailed reports including the original token, its trimmed version, the indices of preserved characters (trimStart and trimEnd), and contextual warning messages with suggestion texts. This functionality empowers users to better understand and address input errors when tokens are malformed or inadvertently rejected.

## CLI Integration
- **Command Flag:** Introduce a new command flag `--diagnose-nan` that triggers the diagnostic report.
- **Output Modes:** The report is available in both plain text and JSON modes. In JSON mode, the output is structured with keys such as `original`, `trimmed`, `trimStart`, `trimEnd`, `accepted`, `value`, `warningIndex`, and `suggestion` for each token analyzed.
- **Usage Examples:**
  - Plain Text: `node src/lib/main.js --diagnose-nan " NaN " "10" "bad token" "!!NaN??" "N aN"`
  - JSON: `node src/lib/main.js --json --diagnose-nan " NaN " "10" "bad token" "!!NaN??" "N aN"`

## Implementation Details
- **Parsing and Analysis:** Leverage existing input parsing utilities to trim whitespace and punctuation based on `TOKEN_PUNCTUATION_CONFIG`. Determine the exact character range that is preserved (i.e., the start and end indices after trimming).
- **Warning Generation:** Produce detailed warnings for tokens that are rejected, including the dynamic or fixed warning index based on the environment variable `DYNAMIC_WARNING_INDEX`. If enabled, correction suggestions (e.g., "Did you mean to allow NaN values?") are included unless suppressed by `DISABLE_NAN_SUGGESTION`.
- **Output Formatting:** In JSON mode, encapsulate all diagnostics in a structured object that also includes metadata such as `timestamp`, `version`, `executionDuration`, and `inputEcho`.

## Testing & Documentation
- **Unit Tests:** Add comprehensive tests to simulate various edge-case tokens including different casings, punctuation, and internal whitespace scenarios. Validate that the reported `trimStart` and `trimEnd` values correctly reflect the characters removed.
- **Documentation:** Update README and CLI help guides to include examples for the `--diagnose-nan` command. Inline code comments should explain the diagnostic logic, especially how indices are computed and warnings are formulated.

## Alignment with Repository Mission
NAN_DIAGNOSTICS directly supports the repository’s mission of streamlined automation and healthy collaboration by enhancing error transparency. By providing detailed, actionable diagnostics for token parsing issues, it assists developers and users alike in debugging poorly formatted inputs, improving overall robustness and usability of the CLI tool.