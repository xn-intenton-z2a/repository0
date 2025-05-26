# `repository0`

The repository is intended as a template that includes:
* A Template Base: A starting point for new projects.
* A Running Experiment: An example implementation that demonstrates one way to use the template.
* Workflows from `agentic-lib` which reference reusable workflows.

## Overview
`repository0` is a demo repository that showcases the GitHub workflows imported from intentïon `agentic-lib`. Its primary purpose is to demonstrate these automated CI/CD workflows.

## What’s Inside

- **GitHub Workflows:**  
  Workflows in the `.github/workflows/` These workflows consume reusable workflows from intentïon `agentic-lib`.

- **Source Code:**  
  The main functionality is in `src/lib/main.js`. This file is focus of the workflow and is modified by the workflow to deliver the project goals.

- **Dependencies:**  
  `package.json` can be modified by the workflow to add or update dependencies and it also defines some of the test and build scripts.

- **Tests:**  
  Unit tests in the `tests/unit/` folder ensure that the main script doesn't drift too far.  This test file can be modified by the workflow `tests/unit/main.test.js`, duplicate `main.test.js` to fix a version of the behaviour where the workflow can't change it.

- **Docs**  
  This `README.md` can be modified by the workflow.

## Getting Started

This repository is already set up with the necessary workflows and scripts but you do need to supply the following secrets:
- `CHATGPT_API_SECRET_KEY` - This key must be for an account with access to the OpenAI chat completions API for model `o3-mini`.
  Set these secrets in your repository settings under *Settings > Secrets and Variables > Actions*. They are essential for the automated workflows such as publishing packages and managing issues.

## CLI Usage

You can run the main script with various subcommands to control its behavior:

```bash
# Default 'start' command, logs provided arguments
npm run start -- <arg1> <arg2>

# 'diagnostics' command, prints Node version, platform, and memory usage
npm run diagnostics

# 'serve' command, starts an HTTP server on port 3000 with /health endpoint
npm run serve

# Unrecognized command example (will error)
npm run start -- unsupported
```

Available subcommands:
- **start** (default): Logs the provided arguments as JSON array.
- **diagnostics**: Outputs a single line with `Node`, `Platform`, and `MemoryUsage` details.
- **serve**: Launches a simple HTTP server on port 3000 serving `GET /health` with `{ status: 'ok' }`.

Try running:

```bash
npm run start
npm run start -- diagnostics
npm run start -- serve
npm run start -- invalid
```

## Should you use the `agentic-lib` Coding System?

*Do you have access to an OpenAI account with necessary API keys?*
*Are you willing to incur charges for consumed resources?*
*Are you curious about self-evolving code?*
*Would you like to see how such a system can be built?*
*Do you appreciate integrated OpenAI and GitHub API calls in a JavaScript environment?*

## Initiating the workflow

Run the action "Create Issue" and enter some text to create an issue. This will create an issue and trigger the "Issue Worker" to write the code.
If the Issue Worker is able to resolve the issue a Pull Request is raised, the change automatically merged.
The issue reviewed and closed if the change is deemed to have delivered whatever was requested in the issue.

#### Development Workflows:
```
On timer / Manual: Create Issue (new issue opened) 
-> Issue Worker (code changed, issue updated) 
-> Automerge (code merged)
-> Review Issue (issue reviewed and closed)

On timer: Issue Worker (code changed, issue updated) 
-> Automerge (code merged)
-> Review Issue (issue reviewed and closed)

On timer: Automerge (code merged)
-> Review Issue (issue reviewed and closed)

On timer: Review Issue (issue reviewed and closed)
```
(Each workflow is triggered by the previous one and also on a schedule so that failures can be recovered from.)