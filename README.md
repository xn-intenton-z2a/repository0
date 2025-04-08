# `repository0`

This repository is intended as a template that includes:
* A Template Base: A starting point for new projects.
* A Running Experiment: An example implementation that demonstrates one way to use the template.
* Workflows from `agentic‑lib` which reference reusable workflows.

You probably want to start with the template documentation here: [TEMPLATE-README.md](https://github.com/xn-intenton-z2a/agentic-lib/blob/main/TEMPLATE-README.md)

## Overview
`repository0` is a demo repository that showcases the GitHub workflows imported from intentïon `agentic‑lib`. Its primary purpose is to demonstrate these automated CI/CD workflows.

The CLI functionality in `src/lib/main.js` now includes arithmetic, statistical, logarithmic, and percentile commands. In addition to operations like sum, multiply, subtract, and divide, the tool now provides:

- **--median:** Compute the median of a list of numbers (average of two middles for even counts).
- **--mode:** Compute the mode(s) (the most frequently occurring number(s)) of a list of numbers.
- **--stddev:** Compute the population standard deviation of a list of numbers.
- **--log:** Compute the logarithm of a given number. When provided a single argument, it computes the natural logarithm (base e). When provided two arguments, it computes the logarithm with the second number as the base, with detailed error messages on invalid inputs.
- **--percentile:** Compute the desired percentile of a dataset. The first argument must be a percentile between 0 and 100, and the remaining arguments form the dataset. Linear interpolation is applied when the computed index is fractional.
- **--geomean:** Compute the geometric mean of a list of positive numbers.

### Enhanced Input Parsing Details
The input parsing mechanism has been refined to optimize the detection of invalid numeric inputs and now employs a helper function to generate standardized warning messages. Notably:
- Any input matching configured invalid tokens is explicitly rejected. By default, tokens matching 'NaN' (in any letter casing) are rejected. 
- A new configuration option via the environment variable **INVALID_TOKENS** allows you to customize the list of rejected tokens (provide a comma-separated list). If you wish to allow tokens such as 'NaN', remove them from the configuration.
- Detailed warnings include the token and its reported positional index, aiding users in identifying which inputs were rejected.

### Global JSON Output Mode
A new global flag has been added:
- **--json:** When provided, all command outputs (results, errors, and warnings) are returned as structured JSON objects in minified form for machine integration.
- **--json-pretty:** When provided, all command outputs are returned as well-formatted JSON objects with 2-space indentation for easier human readability. If both flags are specified, --json-pretty takes precedence.

Additionally, the JSON responses now include the following metadata for enhanced diagnostics and traceability:
- **timestamp:** The ISO formatted time when the command was executed.
- **version:** The current tool version.
- **executionDuration:** The time taken in milliseconds to execute the command.
- **inputEcho:** The cleansed input parameters after filtering out global flags.

### Shorthand Aliases
Shorthand aliases have been added for frequently used commands to improve usability:
- **-s:** Alias for `--sum`
- **-m:** Alias for `--multiply`
- **-a:** Alias for `--average`
- **-d:** Alias for `--divide`
- **-h:** Alias for `--help`
- **-g:** Alias for `--geomean`

All arithmetic, statistical, logarithmic, and percentile commands now uniformly return "Error: No valid numeric inputs provided." when invalid, missing, or flag inputs are encountered. Detailed warnings (with positional indices) are issued to help users understand which inputs were rejected and why.

## What’s Inside

- **GitHub Workflows:**
  Workflows in the `.github/workflows/` directory utilize reusable workflows from intentïon `agentic‑lib` to automate project tasks.

- **Source Code:**
  The main functionality is in `src/lib/main.js`. CLI command handling has been refactored via a command mapping to reduce complexity and improve maintainability. The new JSON output mode and enhanced input parsing improve integration with automated systems.

- **Dependencies:**
  The `package.json` file defines dependencies and scripts for testing, formatting, linting, and running the CLI.

- **Tests:**
  Unit tests in the `tests/unit/` folder ensure that the CLI commands behave as expected. Tests verify detailed error messages with positional information for invalid inputs, including various casings of "NaN".

- **Configuration:**
  You can customize the set of invalid tokens by setting the environment variable **INVALID_TOKENS** to a comma-separated list of tokens that should be rejected during numeric parsing.

- **Documentation:**
  This README provides essential project information. For contribution guidelines, please see [CONTRIBUTING.md](./CONTRIBUTING.md).

## Getting Started

This repository is already set up with the necessary workflows and scripts but you need to supply the following secrets:
- `CHATGPT_API_SECRET_KEY` - This key must be for an account with access to the OpenAI chat completions API for model `o3-mini`.

Set these secrets in your repository settings under *Settings > Secrets and Variables > Actions*.

## intentïon `agentic‑lib`

The **intentïon `agentic‑lib`** is a collection of reusable GitHub Actions workflows that enable your repository to operate in an “agentic” manner. Autonomous workflows communicate through branches and issues to continuously review, fix, update, and evolve your code. Each workflow itself may eventually become bundled actions.

*Warning:* Running these workflows may incur resource usage and charges.

---

### Contributing

We welcome contributions! Please review our [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on how to contribute effectively.

## License

Released under the MIT License (see [LICENSE](./LICENSE)).

## Note

The CLI in `src/lib/main.js` has been updated to include new statistical commands --median, --mode, --stddev, --log, --percentile, and --geomean. It now supports shorthand aliases (-s, -m, -a, -d, -h, -g) and a new global flag --json (or --json-pretty) for structured JSON outputs. The JSON responses include metadata fields: **timestamp**, **version**, **executionDuration**, and **inputEcho**. For further details, refer to [MISSION.md](./MISSION.md) and [CONTRIBUTING.md].

For guidance on using the repository template, see [TEMPLATE-README.md](https://github.com/xn-intenton-z2a/agentic-lib/blob/main/TEMPLATE-README.md).

For more information about intentïon `agentic‑lib`, visit https://github.com/xn-intenton-z2a/agentic-lib.
