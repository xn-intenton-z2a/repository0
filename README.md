# `repository0`

This repository is intended as a template that includes:
* A Template Base: A starting point for new projects.
* A Running Experiment: An example implementation demonstrating one way to use the template.
* Workflows from `agentic‑lib` which reference reusable workflows.

You probably want to start with the template documentation here: [TEMPLATE-README.md](https://github.com/xn-intenton-z2a/agentic-lib/blob/main/TEMPLATE-README.md)

## Overview

`repository0` is a demo repository showcasing GitHub workflows imported from intentïon `agentic‑lib`. Its primary purpose is to demonstrate automated CI/CD workflows.

The CLI functionality in `src/lib/main.js` now includes arithmetic, statistical, logarithmic, percentile, and diagnostic commands. In addition to operations like sum, multiply, subtract, and divide, the tool provides:

- **--median:** Compute the median of a list of numbers.
- **--mode:** Compute the mode(s) of a list of numbers.
- **--stddev:** Compute the population standard deviation.
- **--log:** Compute logarithms with detailed error messages.
- **--percentile:** Compute a specified percentile of a dataset using linear interpolation.
- **--geomean:** Compute the geometric mean of positive numbers.
- **--config:** Display the current CLI configuration including tool version and environment settings.
- **--toggle-allow-nan:** Dynamically toggle the ALLOW_NAN setting for numeric parsing at runtime.
- **--allow-nan-inline:** *New!* Allow NaN tokens to be accepted as valid numeric inputs for the current command invocation without changing global settings. This inline flag is isolated to each command invocation, resets immediately after each command, and ensures predictable parsing behavior.
- **--diagnose-nan:** *New!* Provides a detailed diagnostic report for NaN token handling. It analyzes each input token, reporting the original token, its trimmed version, whether it was accepted, the warning index, and token character range information (trimStart and trimEnd) to aid in debugging.

### Enhanced Input Parsing Details
The input parsing mechanism has been refactored for improved modularity and performance. A dedicated configuration function now centralizes environment variable initialization for:
- **ALLOW_NAN:** When set to `true`, allows 'NaN' as a valid numeric input.
- **INVALID_TOKENS:** A list of tokens to reject (default rejects variants of "NaN").
- **TOKEN_PUNCTUATION_CONFIG:** Specifies custom punctuation characters to trim from tokens. If undefined, defaults to ",.;?!". An empty string disables punctuation stripping (beyond trimming whitespace).
- **DISABLE_NAN_SUGGESTION:** When set to `true`, suppresses the correction suggestion in warnings.
- **DYNAMIC_WARNING_INDEX:** If `true`, warning messages use the token's actual position (1-indexed); otherwise, a fixed index (0) is used.

**Performance Optimization:** The NaN token parsing now employs caching of regex operations to significantly improve performance in high-volume scenarios.

**Global JSON Output Mode:**
- **--json:** Outputs command results as minified JSON for machine integration.
- **--json-pretty:** Outputs formatted JSON with 2-space indentation (overrides --json if both are provided).

JSON responses include metadata:
- **timestamp:** ISO formatted execution timestamp.
- **version:** Tool version.
- **executionDuration:** Duration of execution in milliseconds.
- **inputEcho:** The cleaned input parameters after global flag filtering.

### Shorthand Aliases
- **-s:** Alias for `--sum`
- **-m:** Alias for `--multiply`
- **-a:** Alias for `--average`
- **-d:** Alias for `--divide`
- **-h:** Alias for `--help`
- **-g:** Alias for `--geomean`

All commands uniformly return "Error: No valid numeric inputs provided." when invalid inputs are encountered, and detailed warnings are provided (via stderr in non-JSON mode).

## What’s Inside

- **GitHub Workflows:**
  CI/CD workflows in the `.github/workflows/` directory utilize reusable workflows from intentïon `agentic‑lib`.

- **Source Code:**
  The main functionality resides in `src/lib/main.js`. The numeric parsing and environment configuration are centralized to ensure consistent behavior.

- **Tests:**
  Unit tests in the `tests/unit/` folder cover both CLI behavior and number utilities.

- **Configuration:**
  Customize behavior via environment variables. The new configuration function in the CLI centralizes settings like **ALLOW_NAN**, **INVALID_TOKENS**, **TOKEN_PUNCTUATION_CONFIG**, etc. The **--toggle-allow-nan** command allows runtime changes, while the **--allow-nan-inline** flag enables per-command control.

- **Diagnostic Tools:**
  The **--diagnose-nan** command offers an in-depth diagnostic report, now including token character range details to assist in debugging.

- **Documentation:**
  Refer to [MISSION.md](./MISSION.md), [CONTRIBUTING.md](./CONTRIBUTING.md), and [LICENSE](./LICENSE) for more details.

## Getting Started

The repository is pre-configured with necessary workflows and scripts. Supply the following secrets in your repository settings:
- `CHATGPT_API_SECRET_KEY` - Key for an account with access to the OpenAI chat completions API for model `o3-mini`.

Set these secrets under *Settings > Secrets and Variables > Actions*.

## intentïon `agentic‑lib`

The **intentïon `agentic‑lib`** is a collection of reusable GitHub Actions workflows. It enables automated, agentic behavior in repositories. Each workflow may be further modularized into bundled actions.

*Warning:* Running these workflows may incur usage costs.

---

### Contributing

We welcome contributions! Please review our [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines on reporting issues, submitting pull requests, and maintaining code quality.

## License

Released under the MIT License (see [LICENSE](./LICENSE)).

## Note

The CLI in `src/lib/main.js` has been updated to include new statistical commands, configuration consolidation for consistent NaN handling, a dedicated environment configuration function, the **--toggle-allow-nan** command, the **--allow-nan-inline** flag, and the **--diagnose-nan** command for detailed diagnostics. Global JSON output, dynamic warning indices, custom punctuation stripping, and performance optimizations via regex caching are also supported.

For further details, refer to [MISSION.md](./MISSION.md) and [CONTRIBUTING.md].

For guidance on using the repository template, see [TEMPLATE-README.md](https://github.com/xn-intenton-z2a/agentic-lib/blob/main/TEMPLATE-README.md).

For more about intentïon `agentic‑lib`, visit https://github.com/xn-intenton-z2a/agentic‑lib.
