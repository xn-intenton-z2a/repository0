START_README_BEGINNING
# `repository0`

The repository is intended as a template that includes:
* A Template Base: A starting point for new projects.
* A Running Experiment: An example implementation that demonstrates one way to use the template.
* Workflows from `agentic‑lib` which reference reusable workflows.

## Overview
`repository0` is a demo repository that showcases the GitHub workflows imported from intentïon `agentic‑lib`. Its primary purpose is to demonstrate these automated CI/CD workflows.

## What’s Inside

- **GitHub Workflows:**  
  Workflows in the `.github/workflows/` directory consume reusable workflows from intentïon `agentic‑lib`.

- **Source Code:**  
  The main functionality is in `src/lib/main.js`. This file is the focus of the workflow and is modified by the automated workflows to meet project goals. Recently, it has been extended with additional arithmetic operations including GCD and LCM to further align with repository0's mission.

- **Dependencies:**  
  `package.json` is used to manage dependencies and scripts for build, test, and workflow operations.

- **Tests:**  
  Unit tests in the `tests/unit/` folder ensure that the main script remains aligned with project goals and maintains high test coverage.

- **Docs:**  
  This `README.md` is maintained to reflect the current functionality and best practices, ensuring clarity per the CONTRIBUTING guidelines.

## Change Log
- Updated header documentation in `src/lib/main.js` to reflect repository0's mission and prune code drift.
- Refactored version retrieval for better testability and fixed error handling per lint warnings.
- Removed usage of the `void` operator in version retrieval to resolve sonarjs lint error.
- Added extended arithmetic operations: median, mode, stddev, range, factors, variance, Fibonacci, GCD, and LCM.
- Extended CLI features: Added --info, --variance, --fibonacci, --gcd, and --lcm commands for diagnostic output and additional computations.

## Getting Started

This repository is already set up with the necessary workflows and scripts but you do need to supply the following secrets:
- `CHATGPT_API_SECRET_KEY` - This key must be for an account with access to the OpenAI chat completions API for model `o3-mini`.
  Set these secrets in your repository settings under *Settings > Secrets and Variables > Actions*.

## intentïon `agentic-lib`

The **intentïon `agentic-lib`** is a collection of reusable GitHub Actions workflows that enable your repository to operate in an “agentic” manner. Autonomous workflows communicate through branches and issues to continuously review, fix, update, and evolve your code. Each workflow is designed to be invoked using GitHub’s `workflow_call` event, so they can be composed together like an SDK. This project itself is evolving, and these workflows may eventually become bundled actions.

*Warning:* Executing these workflows may incur charges on your OpenAI account and consume GitHub Actions minutes.

*Warning:* Experimental. This coding system is still in development and may not suit production use.

## Should you use the `agentic-lib` Coding System?

* Do you have access to an OpenAI account with necessary API keys?
* Are you willing to incur charges for consumed resources?
* Are you curious about self-evolving code?
* Would you like to see how such a system can be built?
* Do you appreciate integrated OpenAI and GitHub API calls in a JavaScript environment?
  END_README_BEGINNING

---
---

START_README_END
### Contributing

We welcome contributions! Please review our [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on how to contribute effectively.

## License

Released under the MIT License (see [LICENSE](./LICENSE)).
END_README_END
