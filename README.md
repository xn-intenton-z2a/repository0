# `repository0`

`repository0` is a template project that includes:
- A Template Base: A starting point for new projects.
- A Running Experiment: An example implementation demonstrating use of the template.
- Agentic-lib Workflows: Automated CI/CD workflows imported from intentïon `agentic-lib`.

## Overview

The primary purpose of `repository0` is to showcase how agentic-lib workflows can autonomously evolve code, tests, and documentation. It also provides a flexible CLI tool (`src/lib/main.js`) supporting diagnostics, HTTP serving, build workflows, configuration refresh, and data persistence.

## What’s Inside

- **Source Code:**
  Core CLI implementation in `src/lib/main.js` with structured argument parsing.
- **Tests:**
  Unit tests in `tests/unit/main.test.js` ensure CLI flags and workflows behave as expected.
- **Scripts:**
  Defined in `package.json` under `scripts`:
  - `start`: Run the CLI with no flags (outputs parsed options).
  - `diagnostics`: Run diagnostics mode.
  - `serve`: Start the HTTP server.
  - `build-intermediate`: Perform staged build operations.
  - `build-enhanced`: Perform enhanced build operations.
  - `refresh`: Reload and validate configuration files.
  - `merge-persist`: Merge data sources and persist results.
- **Docs:**
  Usage guides in the `docs/` folder, including detailed CLI Usage.

## Getting Started

1. **Clone the Repository:**
   `git clone <repository_url>`
2. **Install Dependencies:**
   `npm install`
3. **Run Tests:**
   `npm test`
4. **Run the CLI:**
   `npm run start`  — displays parsed options for no flags.

## CLI Usage

Detailed usage is provided in `docs/CLI_USAGE.md`, but here is a quick reference:

Supported flags (pass after `--` when using npm scripts):
- `--help`               Show usage information and exit
- `--diagnostics`        Enable diagnostics mode and exit
- `--serve`              Start an HTTP server (endpoints: `/health`, `/options`)
- `--build-intermediate` Generate an intermediate build manifest
- `--build-enhanced`     Produce a final, optimized build output
- `--refresh`            Reload and validate configuration files
- `--merge-persist`      Merge data sources and persist results to disk

Examples:
- Run diagnostics mode: `npm run diagnostics`
- Start HTTP server: `npm run serve`
- Generate intermediate build: `npm run build-intermediate`
- Produce enhanced build: `npm run build-enhanced`
- Reload configuration: `npm run refresh`
- Merge and persist data: `npm run merge-persist`
- Display usage: `npm run start -- --help`

## agentic-lib Workflows

This project uses agentic-lib’s reusable GitHub Actions workflows to continuously review and evolve the code. See [CONTRIBUTING.md](CONTRIBUTING.md) and [MISSION.md](MISSION.md) for details on the workflows and how to interact with them.

## Contributing

Please follow the guidelines in [CONTRIBUTING.md](CONTRIBUTING.md) when proposing changes, and ensure all tests pass with `npm test`.

## License

Apache-2.0