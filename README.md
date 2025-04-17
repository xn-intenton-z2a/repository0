# `repository0`

The repository is intended as a template that includes:
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
  The main functionality is in `src/lib/main.js`. This file is the focus of the workflow and is maintained to adhere to the project’s mission and coding standards.

- **GCD Utility Function:**
  The repository now provides a handy utility function for computing the greatest common divisor (gcd) of two integers.

  ### Usage Example

  You can import and use the function in your JavaScript code as follows:

  ```javascript
  import { gcd } from '@src/lib/main.js';

  const result = gcd(48, 18);
  console.log(result); // Outputs: 6
  ```

- **Dependencies:**  
  The `package.json` file defines dependencies and scripts for testing, formatting, linting, and running the CLI.

- **Tests:**  
  Unit tests in the `tests/unit/` folder ensure that the CLI commands and utility functions behave as expected. Recent updates have extended the test coverage to include the gcd functionality.

- **Documentation:**  
  This README provides essential project information. For contribution guidelines, please see [CONTRIBUTING.md](./CONTRIBUTING.md).

## Getting Started

This repository is already set up with the necessary workflows and scripts but you need to supply the following secrets:
- `CHATGPT_API_SECRET_KEY` - This key must be for an account with access to the OpenAI chat completions API for model `o3-mini`.

Set these secrets in your repository settings under *Settings > Secrets and Variables > Actions*.

## intentïon `agentic‑lib`

The **intentïon `agentic‑lib`** is a collection of reusable GitHub Actions workflows that enable your repository to operate in an “agentic” manner. Autonomous workflows communicate through branches and issues to continuously review, fix, update, and evolve your code. Each workflow is designed to be invoked using GitHub’s `workflow_call` event, so they can be composed together like an SDK. This project itself is evolving, and these workflows may eventually become bundled actions.

*Warning:* Running these workflows may incur resource usage and charges.

For more details, please refer to the [MISSION.md](./MISSION.md), [CONTRIBUTING.md](./CONTRIBUTING.md), and [LICENSE](./LICENSE).

## Additional Resources
- [TEMPLATE-README.md](https://github.com/xn-intenton-z2a/agentic-lib/blob/main/TEMPLATE-README.md)
- [intentïon agentic‑lib](https://github.com/xn-intenton-z2a/agentic-lib)
