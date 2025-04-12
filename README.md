# `repository0`

This repository is intended as a template that includes:
* A Template Base: A starting point for new projects.
* A Running Experiment: An example implementation that demonstrates one way to use the template.
* Workflows from `agentic‑lib` which reference reusable workflows.

You probably want to start with the template documentation here: [TEMPLATE-README.md](https://github.com/xn-intenton-z2a/agentic-lib/blob/main/TEMPLATE-README.md)

## Overview
`repository0` is a demo repository that showcases the GitHub workflows imported from intentïon `agentic‑lib`. Its primary purpose is to demonstrate these automated CI/CD workflows.

## CLI Usage
The CLI has been enhanced to use yargs for robust subcommand parsing. Legacy flag usage is deprecated. The following subcommands are available:

- **diagnostics:** Runs diagnostics. 
  - Example: `repository0 diagnostics`
- **version:** Displays the current version.
  - Example: `repository0 version`
- **update:** Initiates an update.
  - Example: `repository0 update`
- **config:** Displays configuration settings. Use the subcommand **show** to view the current configuration.
  - Example: `repository0 config show`

When the CLI is executed without any arguments, it first logs the default parameter message `Run with: []` and then displays an error prompting you to specify a valid command.

- **Error Handling:** 
  - All error messages are output in a standardized format prefixed with "Error:" for both human-readability and machine parsing.
  - **Invalid Input Handling:** If a non-string argument is provided (for example, NaN), the CLI will output an error message such as: "Invalid input: Expected a valid command, but received NaN".

## What’s Inside

- **GitHub Workflows:**  
  Workflows in the `.github/workflows/` directory utilize reusable workflows from intentïon `agentic‑lib` to automate project tasks.

- **Source Code:**  
  The main functionality is in `src/lib/main.js`. This file now includes a yargs-based CLI that supports exclusive subcommand usage for diagnostics, version, update commands, and the new config command for viewing configuration settings, with improved error handling for invalid inputs such as non-string values.

- **Dependencies:**  
  The `package.json` file defines dependencies and scripts for testing, formatting, linting, and running the CLI.

- **Tests:**  
  Unit tests in the `tests/unit/` folder ensure that the CLI commands behave as expected, including proper handling of missing arguments and invalid non-string inputs.

- **Documentation:**  
  This README provides essential project information. For contribution guidelines, please see [CONTRIBUTING.md](./CONTRIBUTING.md).

## Getting Started

This repository is already set up with the necessary workflows and scripts but you need to supply the following secrets:
- `CHATGPT_API_SECRET_KEY` - This key must be for an account with access to the OpenAI chat completions API for model `o3-mini`.

Set these secrets in your repository settings under *Settings > Secrets and Variables > Actions*.

## intentïon `agentic‑lib`

The **intentïon `agentic‑lib`** is a collection of reusable GitHub Actions workflows that enable your repository to operate in an “agentic” manner. Autonomous workflows communicate through branches and issues to continuously review, fix, update, and evolve your code. Each workflow is designed to be invoked using GitHub’s `workflow_call` event, so they can be composed together like an SDK. This project itself is evolving, and these workflows may eventually become bundled actions.

*Warning:* Running these workflows may incur resource usage and charges.

## Links

- [TEMPLATE-README.md](https://github.com/xn-intenton-z2a/agentic-lib/blob/main/TEMPLATE-README.md)
- [MISSION.md](./MISSION.md)
- [CONTRIBUTING.md](./CONTRIBUTING.md)
- [LICENSE](./LICENSE)
- [intentïon agentic‑lib GitHub Repository](https://github.com/xn-intenton-z2a/agentic-lib)

## License

Released under the MIT License (see [LICENSE](./LICENSE)).
