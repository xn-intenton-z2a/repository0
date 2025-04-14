# `repository0`

This repository template showcases the GitHub workflows imported from intention `agentic‑lib`, including automated CI/CD workflows and handy CLI utilities. It now includes a persistent multi-turn conversation ('chat') command that stores conversation history in a file (.chat_history.json).

You probably want to start with the template documentation here: [TEMPLATE-README.md](https://github.com/xn-intenton-z2a/agentic-lib/blob/main/TEMPLATE-README.md)

## Overview
`repository0` is a demo repository that demonstrates the automated GitHub workflows and CLI utilities derived from intentïon `agentic‑lib`. The repository now supports a persistent multi-turn conversation chat feature with optional session titling and export functionality.

## What’s Inside

- **GitHub Workflows:**  
  Workflows in the `.github/workflows/` directory utilize reusable workflows from intentïon `agentic‑lib` to automate project tasks.

- **Source Code:**  
  The CLI functionality is implemented in `src/lib/main.js`, including a new 'chat' command for interactive multi-turn conversations.

- **Chat Command:**
  The `chat` command allows you to start a new chat session or resume an existing one. Conversation history is stored persistently in a file named `.chat_history.json`.
  
  - To start or update a chat session, run:
    ```
    node src/lib/main.js chat [session title]
    ```
    (If no session title is provided, "Default Session" is used.)
  
  - To export the conversation history, run:
    ```
    node src/lib/main.js chat export <format>
    ```
    where `<format>` is one of: `markdown`, `html`, `pdf`, or `csv`.

- **Dependencies:**  
  The `package.json` file defines dependencies and scripts for testing, formatting, linting, and running the CLI.

- **Tests:**  
  Unit tests in the `tests/unit/` folder ensure that the CLI commands, including the new `chat` command, behave as expected.

- **Documentation:**  
  This README provides essential project information. For contribution guidelines, please see [CONTRIBUTING.md](./CONTRIBUTING.md).

## Getting Started

This repository is already set up with the necessary workflows and scripts but you need to supply the following secrets:
- `CHATGPT_API_SECRET_KEY` - This key must be for an account with access to the OpenAI chat completions API for model `o3-mini`.

Set these secrets in your repository settings under *Settings > Secrets and Variables > Actions*.

## intentïon `agentic‑lib`

The **intentïon `agentic‑lib`** is a collection of reusable GitHub Actions workflows that enable your repository to operate in an “agentic” manner. Autonomous workflows communicate through branches and issues to continuously review, fix, update, and evolve your code. Each workflow is designed to be invoked using GitHub’s `workflow_call` event, so they can be composed together like an SDK. This project itself is evolving, and these workflows may eventually become bundled actions.

*Warning:* Running these workflows may incur resource usage and charges.

## Links

- [TEMPLATE-README.md](https://github.com/xn-intenton-z2a/agentic-lib/blob/main/TEMPLATE-README.md)
- [MISSION.md](./MISSION.md)
- [CONTRIBUTING.md](./CONTRIBUTING.md)
- [LICENSE](./LICENSE)
- [agentic‑lib GitHub Repository](https://github.com/xn-intenton-z2a/agentic-lib)

## License

Released under the MIT License (see [LICENSE](./LICENSE)).
