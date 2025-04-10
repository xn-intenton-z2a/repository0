# `repository0`

This repository template demonstrates GitHub workflows imported from intentïon `agentic‑lib` and serves as a demo for automated CI/CD processes. For guidance on using this template, refer to [TEMPLATE-README.md](https://github.com/xn-intenton-z2a/agentic-lib/blob/main/TEMPLATE-README.md).

## Overview
`repository0` is a demo repository that showcases the GitHub workflows imported from intentïon `agentic‑lib`. Its primary purpose is to demonstrate these automated CI/CD workflows and to serve as a reference for new project setups.

## Key Feature Documentation

- **CLI Execution:**
  The CLI is implemented in `src/lib/main.js`. Run the CLI with `node src/lib/main.js [options]`. Use the `--help` or `-h` flag to see usage options. Additional flags include:
  - `--version`: Display the current package version
  - `--warning-index-mode <value>`: Configure a warning index mode via the command line.
  - `--diagnostics`: Show detailed diagnostic information (Node version, package version, and dependencies).
  - `--json-output`: Output CLI response in JSON format including all provided arguments and metadata (e.g., timestamp, Node version, package version).
  - `--verbose`: Enable verbose logging for detailed debug information, including parsed arguments and internal state details.

- **CLI Diagnostics:**
  The CLI outputs diagnostic information when the `--diagnostics` flag is provided.

- **NaN Handling:**
  Note that any `NaN` directives or inputs are intentionally treated as no-ops. This design decision is by intention, ensuring that no operations are performed on such inputs. For more details, see [CONTRIBUTING.md](./CONTRIBUTING.md) and [MISSION.md](./MISSION.md).

- **GitHub Workflows:**
  Workflows in the `.github/workflows/` directory use reusable workflows from intentïon `agentic‑lib` to automate project tasks.

- **Source Code:**
  Main functionality resides in `src/lib/main.js`, which adheres to the project’s mission and coding standards.

- **Dependencies:**
  The `package.json` file outlines dependencies and scripts for testing, formatting, linting, and CLI execution.

- **Tests:**
  Unit tests in the `tests/unit/` folder ensure expected CLI behavior and showcase usage examples.

- **Documentation:**
  This README provides essential project information. For contribution guidelines, please see [CONTRIBUTING.md](./CONTRIBUTING.md).

## Getting Started

This repository is set up with the necessary workflows and scripts. You need to supply the following secrets:
- `CHATGPT_API_SECRET_KEY` - Access key for the OpenAI chat completions API for model `o3-mini`.

Set these secrets in your repository settings under *Settings > Secrets and Variables > Actions*.

## Additional Documentation Links

- [TEMPLATE-README.md](https://github.com/xn-intenton-z2a/agentic-lib/blob/main/TEMPLATE-README.md)
- [MISSION.md](./MISSION.md)
- [CONTRIBUTING.md](./CONTRIBUTING.md)
- [LICENSE](./LICENSE)

## intentïon `agentic‑lib`

The **intentïon `agentic‑lib`** is a collection of reusable GitHub Actions workflows. These workflows enable autonomous operations and continuous evolution of your code through automated processes. Each workflow is designed for invocation via GitHub’s `workflow_call` event, making them composable like an SDK. This project is continuously evolving, and the workflows may eventually be bundled as actions.

*Warning:* Running these workflows may incur resource usage and charges.
