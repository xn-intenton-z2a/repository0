# `repository0`

This repository is intended as a template that includes:
* A Template Base: A starting point for new projects.
* A Running Experiment: An example implementation demonstrating one way to use the template.
* Workflows from `agentic‑lib` which reference reusable workflows.

You probably want to start with the template documentation here: [TEMPLATE-README.md](https://github.com/xn-intenton-z2a/agentic-lib/blob/main/TEMPLATE-README.md)

## Overview

`repository0` is a demo repository showcasing GitHub workflows imported from intentïon `agentic‑lib`. Its primary purpose is to demonstrate automated CI/CD workflows.

The CLI functionality in `src/lib/main.js` now includes arithmetic, statistical, logarithmic, and percentile commands. In addition to operations like sum, multiply, subtract, and divide, the tool provides:

- **--median:** Compute the median of a list of numbers.
- **--mode:** Compute the mode(s) of a list of numbers.
- **--stddev:** Compute the population standard deviation.
- **--log:** Compute logarithms with detailed error messages.
- **--percentile:** Compute a specified percentile of a dataset using linear interpolation.
- **--geomean:** Compute the geometric mean of positive numbers.
- **--config:** Display the current CLI configuration including tool version and environment settings.
- **--toggle-allow-nan:** Dynamically toggle the ALLOW_NAN setting for numeric parsing.

### Enhanced Input Parsing Details
The input parsing mechanism has been refactored for improved modularity. Utility functions to handle token normalization, punctuation stripping, and 'NaN' handling are now integrated directly into the main CLI file (`src/lib/main.js`).

Configuration via environment variables:
- **ALLOW_NAN:** When set to `true`, allows 'NaN' as a valid numeric input.
- **INVALID_TOKENS:** A comma-separated list of tokens to reject (default rejects variants of "NaN").
- **TOKEN_PUNCTUATION_CONFIG:** Specifies custom punctuation characters to trim from tokens. An empty string disables trimming.
- **DISABLE_NAN_SUGGESTION:** When set to `true`, suppresses the correction suggestion in warnings.
- **DYNAMIC_WARNING_INDEX:** If `true`, warning messages report the actual token position (1-indexed); otherwise, a fixed index (0) is used.

### Global JSON Output Mode
A new global flag has been added:
- **--json:** Outputs command results as minified JSON for machine integration.
- **--json-pretty:** Outputs formatted JSON with 2-space indentation. (Takes precedence over --json if both are provided.)

JSON responses now include metadata:
- **timestamp:** ISO formatted execution timestamp.
- **version:** Tool version.
- **executionDuration:** Duration of execution in milliseconds.
- **inputEcho:** The cleaned input parameters post global flag filtering.

### Shorthand Aliases
Aliases have been added for user convenience:
- **-s:** Alias for `--sum`
- **-m:** Alias for `--multiply`
- **-a:** Alias for `--average`
- **-d:** Alias for `--divide`
- **-h:** Alias for `--help`
- **-g:** Alias for `--geomean`

All commands uniformly return "Error: No valid numeric inputs provided." when invalid inputs are encountered, accompanied by detailed warnings.

## What’s Inside

- **GitHub Workflows:**
  CI/CD workflows in the `.github/workflows/` directory utilize reusable workflows from intentïon `agentic‑lib`.

- **Source Code:**
  The main functionality resides in `src/lib/main.js`. The numeric parsing utilities are integrated into this file for a streamlined structure.

- **Tests:**
  Unit tests in the `tests/unit/` folder cover both CLI behavior and the integrated number utilities.

- **Configuration:**
  Customize behavior via environment variables like **INVALID_TOKENS**, **ALLOW_NAN**, **TOKEN_PUNCTUATION_CONFIG**, etc. The **--toggle-allow-nan** command allows runtime changes without restarting the tool.

- **Documentation:**
  This README, along with [MISSION.md](./MISSION.md), [CONTRIBUTING.md](./CONTRIBUTING.md), and [LICENSE](./LICENSE), provide guidelines and details for effective use and contribution.

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

The CLI in `src/lib/main.js` has been updated to include new statistical commands, the **--config** command, and the **--toggle-allow-nan** command for runtime NaN configuration. The utility functions for numeric parsing are now integrated within the main file. Global JSON flags, a configurable warning index mode, and customizable punctuation stripping are all supported.

For further details, refer to [MISSION.md](./MISSION.md) and [CONTRIBUTING.md].

For guidance on using the repository template, see [TEMPLATE-README.md](https://github.com/xn-intenton-z2a/agentic-lib/blob/main/TEMPLATE-README.md).

For more information about intentïon `agentic‑lib`, visit https://github.com/xn-intenton-z2a/agentic-lib.
