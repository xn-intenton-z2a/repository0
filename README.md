# `repository0`

The repository is intended as a template that includes:
* A Template Base: A starting point for new projects.
* A Running Experiment: An example implementation that demonstrates one way to use the template.
* Workflows from `agentic-lib` which reference reusable workflows.

## Mission
Build a knowledge graph of the physical world by crawling public data sources. See [MISSION.md](MISSION.md) for details.

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
  Unit tests in the `tests/unit/` folder ensure that the main script doesn't drift too far.
  This test file can be modified by the workflow `tests/unit/main.test.js`, duplicate `main.test.js` to fix a version of the behaviour where the workflow can't change it.

- **Docs**  
  This `README.md` can be modified by the workflow.

## Getting Started

This repository is already set up with the necessary workflows and scripts but you do need to supply the following secrets:
- `CHATGPT_API_SECRET_KEY` - This key must be for an account with access to the OpenAI chat completions API for model `o3-mini`.
  Set these secrets in your repository settings under *Settings > Secrets and Variables > Actions*. They are essential for the automated workflows such as publishing packages and managing issues.

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

### Initiating the workflow

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

### CLI Usage

Our CLI supports the following commands, aligned with the mission to build a knowledge graph of the physical world by crawling public data sources:

- `--help`
  - Show available flags and exit.
  ```bash
  $ npm run start -- --help
  Usage: node src/lib/main.js [--help] [--version] [--mission] [--ingest <url>] [--ingest-all <url>]
  --help           Show this help message and exit
  --version        Print version number and exit
  --mission        Print repository mission statement and exit
  --ingest <url>   Fetch and ingest a record and persist to graph.json
  --ingest-all <url>  Batch ingest multiple records from URL and persist to graph.json
  ```

- `--version`
  ```bash
  $ npm run start -- --version
  1.2.0-0
  ```

- `--mission`
  ```bash
  $ npm run start -- --mission
  Build a knowledge graph of the physical world by crawling public data sources.
  ```

- `--ingest <url>`
  ```bash
  $ npm run start -- --ingest https://jsonplaceholder.typicode.com/posts/1
  Ingested record with id: 1
  ```

- `--ingest-all <url>`
  ```bash
  $ npm run start -- --ingest-all https://jsonplaceholder.typicode.com/posts
  Ingested 100 records from https://jsonplaceholder.typicode.com/posts
  ```
