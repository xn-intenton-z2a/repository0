# `repository0`

This repository is intended as a template that includes:
* A Template Base: A starting point for new projects.
* A Running Experiment: An example implementation that demonstrates one way to use the template.
* Workflows from `agentic‑lib` which reference reusable workflows.

You probably want to start with the template documentation here: [TEMPLATE-README.md](https://github.com/xn-intenton-z2a/agentic-lib/blob/main/TEMPLATE-README.md)

## Overview
`repository0` is a demo repository that showcases the GitHub workflows imported from intentïon `agentic‑lib`. Its primary purpose is to demonstrate these automated CI/CD workflows. The CLI functionality in `src/lib/main.js` now includes arithmetic, statistical, and logarithmic commands. In addition to operations like sum, multiply, subtract, and divide, the tool now provides:

- **--median:** Compute the median of a list of numbers (average of two middles for even counts).
- **--mode:** Compute the mode(s) (the most frequently occurring number(s)) of a list of numbers.
- **--stddev:** Compute the population standard deviation of a list of numbers.
- **--log:** Compute the logarithm of a given number. When provided a single argument, it computes the natural logarithm (base e). When provided two arguments, it computes the logarithm with the second number as the base. Error messages are displayed if the input is non-positive or if the base is invalid (not greater than 0 and not equal to 1).
- **--percentile:** Compute the desired percentile of a dataset. The first argument must be a percentile between 0 and 100, and the remaining arguments form the dataset. Linear interpolation is applied when the computed index is fractional.

Additionally, shorthand aliases have been added for frequently used commands to improve usability:
- **-s:** Alias for `--sum`
- **-m:** Alias for `--multiply`
- **-a:** Alias for `--average`
- **-d:** Alias for `--divide`
- **-h:** Alias for `--help`

All arithmetic, statistical, logarithmic, and percentile commands standardize error messaging to "Error: No valid numeric inputs provided." when invalid, missing, or additional flag inputs are encountered. Additionally, any literal input of 'NaN' (in any case) is explicitly treated as invalid with a clear warning or error message.

## What’s Inside

- **GitHub Workflows:**
  Workflows in the `.github/workflows/` directory utilize reusable workflows from intentïon `agentic‑lib` to automate project tasks.

- **Source Code:**
  The main functionality is in `src/lib/main.js`. CLI command handling has been refactored to use a command mapping to reduce complexity and improve maintainability.

- **Dependencies:**
  The `package.json` file defines dependencies and scripts for testing, formatting, linting, and running the CLI.

- **Tests:**
  Unit tests in the `tests/unit/` folder ensure that the CLI commands behave as expected. Tests verify that arithmetic, statistical, logarithmic, and percentile commands output the standardized error message when no valid numbers are provided and compute the correct results for valid inputs. Additional tests now verify that alias commands produce identical outputs to their full command counterparts.

- **Documentation:**
  This README provides essential project information. For contribution guidelines, please see [CONTRIBUTING.md](./CONTRIBUTING.md).

## Getting Started

This repository is already set up with the necessary workflows and scripts but you need to supply the following secrets:
- `CHATGPT_API_SECRET_KEY` - This key must be for an account with access to the OpenAI chat completions API for model `o3-mini`.

Set these secrets in your repository settings under *Settings > Secrets and Variables > Actions*.

## intentïon `agentic‑lib`

The **intentïon `agentic‑lib`** is a collection of reusable GitHub Actions workflows that enable your repository to operate in an “agentic” manner. Autonomous workflows communicate through branches and issues to continuously review, fix, update, and evolve your code. Each workflow is designed to be invoked using GitHub’s `workflow_call` event, so they can be composed together like an SDK. This project itself is evolving, and these workflows may eventually become bundled actions.

*Warning:* Running these workflows may incur resource usage and charges.

---

### Contributing

We welcome contributions! Please review our [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on how to contribute effectively.

## License

Released under the MIT License (see [LICENSE](./LICENSE)).

## Note

The CLI in `src/lib/main.js` has been updated to include new statistical commands --median, --mode, --stddev, --log, and --percentile, and now supports shorthand aliases (-s, -m, -a, -d, -h) for frequently used commands. All arithmetic, statistical, logarithmic, and percentile functions now uniformly return "Error: No valid numeric inputs provided." when invalid, missing, or additional flag inputs are encountered. Literal 'NaN' inputs (in any case) are explicitly treated as invalid. For further details, refer to [MISSION.md](./MISSION.md) and [CONTRIBUTING.md].

For guidance on using the repository template, see [TEMPLATE-README.md](https://github.com/xn-intenton-z2a/agentic-lib/blob/main/TEMPLATE-README.md).

For more information about intentïon `agentic‑lib`, visit https://github.com/xn-intenton-z2a/agentic-lib.
