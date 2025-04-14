# `repository0`

This repository template showcases the GitHub workflows imported from intentïon `agentic‑lib` and demonstrates a minimal CLI implementation. It uses automated workflows for CI/CD while providing a simple Node.js CLI utility.

You probably want to start with the template documentation here: [TEMPLATE-README.md](https://github.com/xn-intenton-z2a/agentic-lib/blob/main/TEMPLATE-README.md)

## Overview
`repository0` is a demo repository that demonstrates the GitHub workflows from intentïon `agentic‑lib`. Its primary purpose is to showcase automated CI/CD workflows along with a basic CLI tool implemented in Node.js.

## What’s Inside

- **GitHub Workflows:**
  Workflows in the `.github/workflows/` directory utilize reusable workflows from intentïon `agentic‑lib` to automate project tasks.

- **Source Code:**
  The main functionality is in `src/lib/main.js`. This file is maintained to adhere to the project’s mission and coding standards and exports the CLI functionality as library functions.

- **Dependencies:**
  The `package.json` file defines dependencies and scripts for testing, formatting, linting, and running the CLI.

- **Tests:**
  Unit tests in the `tests/unit/` folder ensure that the CLI commands behave as expected.

- **Documentation:**
  This README provides essential project information. For contribution guidelines, please see [CONTRIBUTING.md](./CONTRIBUTING.md).

## Usage

To run the CLI, execute the following command in your terminal:

  node src/lib/main.js [args]

The script will output the provided arguments as a JSON array. If no arguments are provided, it defaults to an empty array.

## Getting Started

This repository is already set up with the necessary workflows and scripts but you need to supply the following secrets:
- `CHATGPT_API_SECRET_KEY` - This key must be for an account with access to the OpenAI chat completions API for model `o3-mini`.

Set these secrets in your repository settings under *Settings > Secrets and Variables > Actions*.

## intentïon `agentic‑lib`

The **intentïon `agentic‑lib`** is a collection of reusable GitHub Actions workflows that enable your repository to operate in an “agentic” manner. Autonomous workflows communicate through branches and issues to continuously review, fix, update, and evolve your code. Each workflow is designed to be invoked using GitHub’s `workflow_call` event, so they can be composed together like an SDK. This project itself is evolving, and these workflows may eventually become bundled actions.

*Warning:* Running these workflows may incur resource usage and charges.

[CONTRIBUTING.md](./CONTRIBUTING.md) | [MISSION.md](./MISSION.md) | [LICENSE](./LICENSE) | [agentic‑lib on GitHub](https://github.com/xn-intenton-z2a/agentic-lib)

## License

Released under the MIT License (see [LICENSE](./LICENSE)).
