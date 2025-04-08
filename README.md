# `repository0`

This repository is intended as a template that includes:
* A Template Base: A starting point for new projects.
* A Running Experiment: An example implementation that demonstrates one way to use the template.
* Workflows from `agentic‑lib` which reference reusable workflows.

You probably want to start with the template documentation here: [TEMPLATE-README.md](https://github.com/xn-intenton-z2a/agentic-lib/blob/main/TEMPLATE-README.md)

## Overview
`repository0` is a demo repository that showcases the GitHub workflows imported from intentïon `agentic‑lib`. Its primary purpose is to demonstrate these automated CI/CD workflows. The CLI functionality in `src/lib/main.js` now includes arithmetic, statistical, logarithmic, and percentile commands. In addition to operations like sum, multiply, subtract, and divide, the tool now provides:

- **--median:** Compute the median of a list of numbers (average of two middles for even counts).
- **--mode:** Compute the mode(s) (the most frequently occurring number(s)) of a list of numbers.
- **--stddev:** Compute the population standard deviation of a list of numbers.
- **--log:** Compute the logarithm of a given number. When provided a single argument, it computes the natural logarithm (base e). When provided two arguments, it computes the logarithm with the second number as the base, with detailed error messages on invalid inputs.
- **--percentile:** Compute the desired percentile of a dataset. The first argument must be a percentile between 0 and 100, and the remaining arguments form the dataset. Linear interpolation is applied when the computed index is fractional.
- **--geomean:** Compute the geometric mean of a list of positive numbers.

In addition, the input parsing mechanism has been refactored to optimize the detection of invalid numeric inputs. Any input matching 'NaN' (in any casing) is explicitly rejected with detailed positional error reporting, and warnings for each invalid input are now issued individually. Note that the positional numbers for warnings are computed based on the sequence of valid numeric tokens processed.

Additionally, a new global flag has been added:

- **--json:** When provided, all command outputs (results, errors, and warnings) are returned as structured JSON objects rather than plain text. This facilitates easier integration with automated systems and agentic workflows.

Shorthand aliases have been added for frequently used commands to improve usability:
- **-s:** Alias for `--sum`
- **-m:** Alias for `--multiply`
- **-a:** Alias for `--average`
- **-d:** Alias for `--divide`
- **-h:** Alias for `--help`
- **-g:** Alias for `--geomean`

All arithmetic, statistical, logarithmic, and percentile commands now uniformly return "Error: No valid numeric inputs provided." when invalid, missing, or additional flag inputs are encountered. In particular, any input that matches 'NaN' (in any letter casing) is explicitly rejected with detailed error feedback that includes the input's position.

## What’s Inside

- **GitHub Workflows:**
  Workflows in the `.github/workflows/` directory utilize reusable workflows from intentïon `agentic‑lib` to automate project tasks.

- **Source Code:**
  The main functionality is in `src/lib/main.js`. CLI command handling has been refactored to use a command mapping to reduce complexity and improve maintainability. The new JSON output mode and enhanced input parsing improve integration with automated systems.

- **Dependencies:**
  The `package.json` file defines dependencies and scripts for testing, formatting, linting, and running the CLI.

- **Tests:**
  Unit tests in the `tests/unit/` folder ensure that the CLI commands behave as expected. Tests verify detailed error messages including positional information for invalid inputs, such as various casings of "NaN".

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

The CLI in `src/lib/main.js` has been updated to include new statistical commands --median, --mode, --stddev, --log, --percentile, and --geomean, and now supports shorthand aliases (-s, -m, -a, -d, -h, -g) for frequently used commands. A new global flag --json has been introduced to allow all outputs to be returned as structured JSON objects, providing enhanced integration with automated workflows. For further details, refer to [MISSION.md](./MISSION.md) and [CONTRIBUTING.md].

For guidance on using the repository template, see [TEMPLATE-README.md](https://github.com/xn-intenton-z2a/agentic-lib/blob/main/TEMPLATE-README.md).

For more information about intentïon `agentic‑lib`, visit https://github.com/xn-intenton-z2a/agentic-lib.
