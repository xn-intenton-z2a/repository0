# `repository0`

A template for autonomous code evolution. Create from this template, write your mission, and watch the code evolve.

## Overview

`repository0` is a template repository that showcases the GitHub workflows imported from intentïon `agentic-lib`. Its primary purpose is to demonstrate autonomous CI/CD workflows powered by the GitHub Copilot SDK.

## What's Inside

- **GitHub Workflows:**
  Workflows in `.github/workflows/` consume reusable workflows from intentïon `agentic-lib`.

- **Source Code:**
  The main functionality is in `src/lib/main.js`. This file is the focus of the workflow and is modified by the workflow to deliver the project goals.

- **Dependencies:**
  `package.json` can be modified by the workflow to add or update dependencies. It also defines test and build scripts.

- **Tests:**
  Unit tests in `tests/unit/` ensure that the main script stays on track.

- **Docs:**
  This `README.md` can be modified by the workflow.

## Getting Started

1. Create a repository from this template
2. Write your `MISSION.md` with project goals
3. Enable GitHub Copilot and activate the workflows

See [GETTING-STARTED.md](GETTING-STARTED.md) for detailed setup instructions.

## Links

- [intentïon agentic-lib](https://github.com/xn-intenton-z2a/agentic-lib)
- [MISSION.md](MISSION.md)
- [CONTRIBUTING.md](CONTRIBUTING.md)
- [LICENSE](LICENSE)
