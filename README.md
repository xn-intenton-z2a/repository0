# `repository0`

This repository is a template that showcases automated CI/CD workflows imported from intentïon `agentic‑lib`. It provides a modular CLI demonstration with commands refactored into discrete functions for enhanced maintainability and ease of extension.

You probably want to start with the template documentation here: [TEMPLATE-README.md](https://github.com/xn-intenton-z2a/agentic-lib/blob/main/TEMPLATE-README.md)

## Overview

`repository0` is a demo repository that showcases the GitHub workflows imported from intentïon `agentic‑lib`. Its primary purpose is to demonstrate these automated CI/CD workflows and serve as an example for future development. The CLI functionality has been refactored to separate command registration into modular functions, improving maintainability.

## CLI Usage

The CLI employs yargs for robust subcommand parsing and improved input validation. Key subcommands include:

- **diagnostics:** Runs diagnostics. 
  - Example: `repository0 diagnostics`
- **version:** Displays the current version dynamically retrieved from package.json.
  - Example: `repository0 version`
- **update:** Initiates an update.
  - Example: `repository0 update`
- **config:** Displays configuration settings. Use the subcommand **show** to view the current configuration.
  - Example: `repository0 config show`
- **info:** Displays repository metadata including the repository name, version, and description.
  - Example: `repository0 info`

**Input Validation:**

- All CLI arguments must be non-empty strings representing valid commands.
- If a non-string argument (e.g. NaN) is provided, the CLI outputs: "Invalid input: Expected a valid string command, but received NaN".
- If an empty string is provided, the CLI outputs: "Invalid input: Expected a non-empty string command, but received an empty string".
- When executed without any arguments, the CLI logs `Run with: []` and displays an error prompting for a valid command.

**Error Handling:**

- Errors are standardized and prefixed with "Error:" to ensure both human-readability and machine parsing.

## What’s Inside

- **GitHub Workflows:**
  GitHub workflows located in the `.github/workflows/` directory leverage reusable workflows from intentïon `agentic‑lib` to automate project tasks.

- **Source Code:**
  The main functionality is provided in `src/lib/main.js`, which has been refactored to modularize CLI command registration into individual command definitions for easier future modifications.

- **Dependencies:**
  The `package.json` file defines project dependencies and scripts for testing, formatting, linting, and CLI execution.

- **Tests:**
  Unit tests in the `tests/unit/` folder validate the CLI commands and error handling scenarios, including checks for invalid inputs like NaN and empty strings.

- **Documentation:**
  This README provides essential project information. For contribution guidelines, please see [CONTRIBUTING.md](./CONTRIBUTING.md).

## Getting Started

This repository is set up with the necessary workflows and scripts. You need to supply the following secret:
- `CHATGPT_API_SECRET_KEY` - An account key with access to the OpenAI chat completions API for model `o3-mini`.

Set this secret in your repository settings under *Settings > Secrets and Variables > Actions*.

## intentïon `agentic‑lib`

The **intentïon `agentic‑lib`** is a collection of reusable GitHub Actions workflows enabling your repository to operate in an “agentic” manner. These workflows are designed to automate tasks such as testing, building, and deploying your projects. They are invoked using GitHub’s `workflow_call` event and can be composed together like an SDK.

*Warning:* Running these workflows may incur resource usage and charges.

## Links

- [TEMPLATE-README.md](https://github.com/xn-intenton-z2a/agentic-lib/blob/main/TEMPLATE-README.md)
- [MISSION.md](./MISSION.md)
- [CONTRIBUTING.md](./CONTRIBUTING.md)
- [LICENSE](./LICENSE)
- [intentïon agentic‑lib GitHub Repository](https://github.com/xn-intenton-z2a/agentic-lib)

## License

Released under the MIT License (see [LICENSE](./LICENSE)).
