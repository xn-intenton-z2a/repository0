# `repository0`

This repository is intended as a template that includes:
* A Template Base: A starting point for new projects.
* A Running Experiment: An example implementation that demonstrates one way to use the template.
* Workflows from `agentic‑lib` which reference reusable workflows.

You probably want to start with the template documentation here: [TEMPLATE-README.md](https://github.com/xn-intenton-z2a/agentic-lib/blob/main/TEMPLATE-README.md)

## Overview
`repository0` is a demo repository that showcases the GitHub workflows imported from intentïon `agentic‑lib`. Its primary purpose is to demonstrate these automated CI/CD workflows. 

## What’s Inside

- **GitHub Workflows:**  
  Workflows in the `.github/workflows/` directory utilize reusable workflows from intentïon `agentic‑lib` to automate project tasks.

- **Source Code:**  
  The main functionality is in `src/lib/main.js`. In this refactoring, CLI command handling has been refactored to inline arithmetic operations, now providing clear error messages when invalid numeric inputs (including explicit 'NaN') are provided.

- **Dependencies:**  
  The `package.json` file defines dependencies and scripts for testing, formatting, linting, and running the CLI.

- **Tests:**  
  Unit tests in the `tests/unit/` folder ensure that the CLI commands behave as expected. The tests now include scenarios verifying that arithmetic commands output an error message when no valid numbers are provided.

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

The CLI command handling in `src/lib/main.js` has been updated to provide explicit error messages when encountering non-numeric inputs (including 'NaN'). For further details, refer to [MISSION.md](./MISSION.md) and [CONTRIBUTING.md].

For guidance on using the repository template, see [TEMPLATE-README.md](https://github.com/xn-intenton-z2a/agentic-lib/blob/main/TEMPLATE-README.md).

For more information about intentïon `agentic‑lib`, visit https://github.com/xn-intenton-z2a/agentic-lib.
