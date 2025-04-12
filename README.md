# `repository0`

This repository is a template that showcases automated CI/CD workflows imported from intentïon `agentic‑lib`. It provides a modular CLI demonstration with commands refactored into discrete functions for enhanced maintainability and ease of extension. The CLI now includes a chat command integration with OpenAI's API featuring persistent multi-turn conversation support by storing conversation history in a file (.chat_history.json), robust and standardized CLI input validation powered by Zod, and additional commands to view, summarize, search, export, analyze, and remove (delete specific entry) from the conversation history.

You probably want to start with the template documentation here: [TEMPLATE-README.md](https://github.com/xn-intenton-z2a/agentic-lib/blob/main/TEMPLATE-README.md)

## Overview

`repository0` is a demo repository that showcases the GitHub workflows imported from intentïon `agentic‑lib`. Its primary purpose is to demonstrate these automated CI/CD workflows and serve as an example for future development. The CLI functionality has been refactored to separate command registration into modular functions, improving maintainability.

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
- **chat:** Interact with OpenAI's API by sending a prompt and receiving a generated response. This command supports persistent multi-turn conversations by preserving conversation context in a file (.chat_history.json) across CLI sessions. It also automatically summarizes older parts of the conversation history if a configurable threshold is exceeded.
  - Options:
    - `--max-history-messages`: Maximum number of messages before summarization (default: 10) or via `CHAT_MAX_HISTORY_MESSAGES` environment variable.
    - `--recent-messages`: Number of recent messages to retain after summarization (default: 2) or via `CHAT_RECENT_MESSAGES` environment variable.
  - Example: `repository0 chat --prompt "Hello, how are you?" --max-history-messages 5 --recent-messages 1`
- **chat-history:** Displays the persistent conversation history in a human-readable format.
  - Example: `repository0 chat-history`
- **chat-summarize:** Generates a concise summary of the conversation history by using the OpenAI API.
  - Example: `repository0 chat-summarize`
- **chat-search:** Searches the conversation history for entries that match a provided keyword (case-insensitive).
  - Example: `repository0 chat-search --query "search text"`
- **chat-export:** Exports the conversation history to a markdown file (`chat_history.md`).
  - Example: `repository0 chat-export`
- **chat-statistics:** Provides analytics on the conversation history by computing total messages, counts per role, and average message length.
  - Example: `repository0 chat-statistics`
- **chat-remove:** Removes a specific conversation entry from the history. It accepts a required numeric argument `--index` (alias `-i`) representing the 1-based index of the entry to remove. 
  - Example: `repository0 chat-remove --index 2`

## CLI Input Validation and Error Handling

The CLI validates all input arguments using Zod to ensure that every command receives a valid non-empty string. When an invalid input is provided, such as:

- **Empty string**
- **Boolean (true or false)**
- **null or undefined**
- **Object or Array**
- **Symbol**
- **BigInt**

This consistent formatting aids debugging and ensures seamless integration with downstream tools.

## Error Handling Improvements

Error handling has been centralized to include a consistent formatted error output for all CLI errors. This enhancement aids in debugging and integration with downstream tooling by clearly indicating CLI errors with standardized messages.

## What’s Inside

- **GitHub Workflows:**
  GitHub workflows located in the `.github/workflows/` directory leverage reusable workflows from intentïon `agentic‑lib` to automate project tasks.

- **Source Code:**
  The main functionality is provided in `src/lib/main.js`, which now features a new `chat-remove` command for fine-grained deletion of conversation history entries along with other chat history commands.

- **Dependencies:**
  The `package.json` file defines project dependencies and scripts for testing, formatting, linting, and CLI execution.

- **Tests:**
  Unit tests validate the CLI commands and error handling scenarios, ensuring robust behavior in various edge cases.

- **Documentation:**
  This README provides essential project information. For contribution guidelines, please see [CONTRIBUTING.md](./CONTRIBUTING.md).

## Getting Started

Set up the required secret for chat functionality:
- `CHATGPT_API_SECRET_KEY` - Your OpenAI API key for model `gpt-3.5-turbo`.

Configure this secret in your repository settings under *Settings > Secrets and Variables > Actions*.

## Links

- [TEMPLATE-README.md](https://github.com/xn-intenton-z2a/agentic-lib/blob/main/TEMPLATE-README.md)
- [MISSION.md](./MISSION.md)
- [CONTRIBUTING.md](./CONTRIBUTING.md)
- [LICENSE](./LICENSE)
- [intentïon agentic‑lib GitHub Repository](https://github.com/xn-intenton-z2a/agentic-lib)

## License

Released under the MIT License (see [LICENSE](./LICENSE)).
