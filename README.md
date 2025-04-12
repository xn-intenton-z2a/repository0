# `repository0`

This repository is a template that showcases automated CI/CD workflows imported from intentïon `agentic‑lib`. It provides a modular CLI demonstration with commands refactored into discrete functions for enhanced maintainability and ease of extension, and now includes a chat command integration with OpenAI's API featuring persistent multi-turn conversation support by storing conversation history in a file (.chat_history.json), as well as robust and standardized CLI input validation powered by Zod.

You probably want to start with the template documentation here: [TEMPLATE-README.md](https://github.com/xn-intenton-z2a/agentic-lib/blob/main/TEMPLATE-README.md)

## Overview

`repository0` is a demo repository that showcases the GitHub workflows imported from intentïon `agentic‑lib`. Its primary purpose is to demonstrate these automated CI/CD workflows and serve as an example for future development. The CLI functionality has been refactored to separate command registration into modular functions, improving maintainability. Package metadata is imported using Node's built-in createRequire, which avoids deprecated JSON import assertions.

## CLI Usage

The CLI employs yargs for robust subcommand parsing and improved input validation. Key subcommands include:

- **diagnostics:** Runs diagnostics and provides detailed environment information including Node.js version, package metadata, and dependency versions.
  - Example: `repository0 diagnostics`
- **version:** Displays the current version dynamically retrieved from package.json.
  - Example: `repository0 version`
- **update:** Initiates an update.
  - Example: `repository0 update`
- **config:** Displays configuration settings. Use the subcommand **show** to view the current configuration.
  - Example: `repository0 config show`
- **info:** Displays repository metadata including the repository name, version, and description.
  - Example: `repository0 info`
- **chat:** Interact with OpenAI's API by sending a prompt and receiving a generated response. This command now supports persistent multi-turn conversations by preserving conversation context in a file (.chat_history.json) across CLI sessions. Subsequent calls to the chat command will build upon previous interactions.
  - Example: `repository0 chat --prompt "Hello, how are you?"`

## CLI Input Validation and Error Handling

The CLI validates all input arguments using Zod to ensure that every command receives a valid non-empty string. When an invalid input is provided, such as:

- **NaN**
- **Empty string**
- **Boolean (true or false)**
- **null or undefined**
- **Object or Array**
- **Symbol or BigInt**

The system produces a standardized error message. For example, when a NaN value is provided the error may look like:

```json
{ "error": "CLI Error", "message": "Invalid input: Expected a valid non-empty string command, but received NaN. Please provide a valid non-empty string, such as 'start' or 'info'." }
```

This consistent formatting aids debugging and ensures seamless integration with downstream tools.

## Error Handling Improvements

Error handling has been centralized to include a consistent formatted error output for all CLI errors. This enhancement aids in debugging and integration with downstream tooling by clearly indicating CLI errors with standardized keys (`error` and `message`).

## What’s Inside

- **GitHub Workflows:**
  GitHub workflows located in the `.github/workflows/` directory leverage reusable workflows from intentïon `agentic‑lib` to automate project tasks.

- **Source Code:**
  The main functionality is provided in `src/lib/main.js`, which now uses Node's createRequire for importing package.json, includes enhanced CLI argument validation using Zod (now also covering Symbol and BigInt types), and features a revised chat command that supports persistent multi-turn conversations by storing conversation history in a file (.chat_history.json).

- **Dependencies:**
  The `package.json` file defines project dependencies and scripts for testing, formatting, linting, and CLI execution.

- **Tests:**
  Unit tests in the `tests/unit/` folder validate the CLI commands and error handling scenarios, ensuring robust behavior across a variety of input types, including persistent multi-turn conversation for the chat command.

- **Documentation:**
  This README provides essential project information. For contribution guidelines, please see [CONTRIBUTING.md](./CONTRIBUTING.md).

## Getting Started

This repository is set up with the necessary workflows and scripts. You need to supply the following secret:
- `CHATGPT_API_SECRET_KEY` - An account key with access to the OpenAI chat completions API for model `gpt-3.5-turbo`.

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
