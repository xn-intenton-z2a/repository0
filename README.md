# `repository0`

This repository is intended as a template that includes:
* A Template Base: A starting point for new projects.
* A Running Experiment: An example implementation demonstrating one way to use the template.
* Workflows from `agentic‑lib` which reference reusable workflows.

You probably want to start with the template documentation here: [TEMPLATE-README.md](https://github.com/xn-intenton-z2a/agentic-lib/blob/main/TEMPLATE-README.md)

## Overview

`repository0` is a demo repository showcasing GitHub workflows imported from intentïon `agentic‑lib`. Its primary purpose is to demonstrate automated CI/CD workflows and a versatile CLI tool.

The CLI functionality in `src/lib/main.js` now includes arithmetic, statistical, logarithmic, percentile, and diagnostic commands. In addition to operations like sum, multiply, subtract, and divide, the tool provides:

- **--median:** Compute the median of a list of numbers.
- **--mode:** Compute the mode(s) of a list of numbers.
- **--stddev:** Compute the population standard deviation.
- **--log:** Compute logarithms with detailed error messages.
- **--percentile:** Compute a specified percentile of a dataset using linear interpolation.
- **--geomean:** Compute the geometric mean of positive numbers.
- **--config:** Display the current CLI configuration including tool version and environment settings.
- **--toggle-allow-nan:** Dynamically toggle the ALLOW_NAN setting for numeric parsing at runtime.
- **--allow-nan-inline:** Allow NaN tokens to be accepted as valid numeric inputs for the current command invocation without changing global settings. This flag is transient and resets after use.
- **--ignore-invalid:** *New!* When provided, invalid numeric tokens (including those resembling 'NaN', with internal whitespace, or empty after trimming) will be ignored instead of causing an error. If all tokens are invalid, a warning message is returned without terminating execution.
- **--diagnose-nan:** Provides a detailed diagnostic report for NaN token handling with token character range details to aid debugging.

### Enhanced Input Parsing Details
The input parsing mechanism has been refactored for improved modularity and performance. A dedicated configuration function now centralizes environment variable initialization for:
- **ALLOW_NAN:** When set to `true`, allows 'NaN' as a valid numeric input.
- **INVALID_TOKENS:** A list of tokens to reject (default rejects variants of "NaN").
- **TOKEN_PUNCTUATION_CONFIG:** Specifies custom punctuation characters to trim from tokens. If undefined, defaults to ",.;?!". An empty string disables punctuation stripping (beyond trimming whitespace).
- **DISABLE_NAN_SUGGESTION:** When set to `true`, suppresses correction suggestions in warnings.
- **DYNAMIC_WARNING_INDEX:** If `true`, warning messages use a 1-indexed token position, otherwise a fixed index (0) is used.

**Improved 'NaN' Normalization:**
Variants in casing, surrounding punctuation, and extraneous whitespace around 'NaN' are now normalized and validated consistently. Only correctly formatted inputs are accepted when configured, ensuring clear diagnostics.

**Global JSON Output Mode:**
- **--json:** Outputs command results as minified JSON for machine integration.
- **--json-pretty:** Outputs formatted JSON with 2-space indentation.

JSON responses include metadata:
- **timestamp:** ISO formatted execution timestamp.
- **version:** Tool version.
- **executionDuration:** Duration in milliseconds.
- **inputEcho:** The cleaned input parameters after flag filtering.

### Shorthand Aliases
- **-s:** Alias for `--sum`
- **-m:** Alias for `--multiply`
- **-a:** Alias for `--average`
- **-d:** Alias for `--divide`
- **-h:** Alias for `--help`
- **-g:** Alias for `--geomean`

All commands return a clear message if invalid inputs are detected. With the new **--ignore-invalid** flag, the CLI will process and ignore these tokens, ensuring that commands execute on the valid subset of inputs.

## What’s Inside

- **GitHub Workflows:**
  CI/CD workflows in the `.github/workflows/` directory utilize reusable workflows from intentïon `agentic‑lib`.

- **Source Code:**
  The main CLI functionality is in `src/lib/main.js`, featuring enhanced numeric parsing with improved 'NaN' normalization and new flags for dynamic behavior.

- **Tests:**
  Unit tests in the `tests/unit/` folder cover CLI behavior, numeric utilities, and the new ignore-invalid functionality.

- **Configuration:**
  Customize behavior via environment variables. Use **--toggle-allow-nan** for runtime changes, or **--allow-nan-inline** for per-command control.

- **Diagnostic Tools:**
  **--diagnose-nan** provides in-depth diagnostics on numeric parsing errors.

- **Documentation:**
  See [MISSION.md](./MISSION.md), [CONTRIBUTING.md](./CONTRIBUTING.md), and [LICENSE](./LICENSE) for more details.

## Getting Started

The repository is set up with necessary workflows and scripts. Add the following secrets under *Settings > Secrets and Variables > Actions*:
- `CHATGPT_API_SECRET_KEY` - For access to the OpenAI API used with model `o3-mini`.

## intentïon `agentic‑lib`

The **intentïon `agentic‑lib`** is a collection of reusable GitHub Actions workflows enabling automated CI/CD.

*Warning:* Running these workflows may incur costs.

---

### Contributing

We welcome contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on reporting issues and submitting pull requests.

## License

Released under the MIT License (see [LICENSE](./LICENSE)).

## Note

The CLI in `src/lib/main.js` has been updated to improve normalization and diagnostic handling of 'NaN' tokens along with other enhancements such as JSON output mode and dynamic warning indices.

For further details, refer to [MISSION.md](./MISSION.md) and [CONTRIBUTING.md].

For guidance on using this repository template, see [TEMPLATE-README.md](https://github.com/xn-intenton-z2a/agentic-lib/blob/main/TEMPLATE-README.md).

For more about intentïon `agentic‑lib`, visit https://github.com/xn-intenton-z2a/agentic‑lib.
