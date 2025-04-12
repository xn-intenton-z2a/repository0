# `repository0`

This repository is a template that showcases automated CI/CD workflows imported from intentïon `agentic‑lib`. It provides a modular CLI demonstration with commands refactored into discrete functions for enhanced maintainability and ease of extension. The CLI now includes a chat command integration with OpenAI's API featuring persistent multi-turn conversation support by storing conversation history in a file (.chat_history.json), robust and standardized CLI input validation powered by Zod, and additional commands to view, summarize, search, export (in markdown, HTML, and PDF), analyze, remove, archive, import, translate, edit conversation history, and now persistently update chat configuration settings.

You probably want to start with the template documentation here: [TEMPLATE-README.md](https://github.com/xn-intenton-z2a/agentic-lib/blob/main/TEMPLATE-README.md)

## Overview

`repository0` is a demo repository that showcases the GitHub workflows imported from intentïon `agentic‑lib`. Its primary purpose is to demonstrate these automated CI/CD workflows and serve as an example for future development. The CLI functionality has been refactored to separate command registration into modular functions, improving maintainability.

## CLI Usage

The CLI employs yargs for robust subcommand parsing and improved input validation. It also now supports a global `--verbose` flag that enables detailed debugging output for developers. When enabled, additional internal state and debugging information are logged to assist in troubleshooting and understanding the CLI's flow.

Key subcommands include:

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
    - `--prompt` or `-p`: The prompt message to send (required).
    - `--max-history-messages`: Maximum number of messages before summarization (default: can be set via environment variable or persisted configuration).
    - `--recent-messages`: Number of recent messages to retain after summarization (default: can be set via environment variable or persisted configuration).
    - `--model` or `-m`: The OpenAI model to use (default: can be set via environment variable or persisted configuration).
    - `--temperature` or `-t`: The response randomness factor (default: can be set via environment variable or persisted configuration).
    - `--summarization-prompt`: Custom prompt to use for summarizing conversation history (optional). If provided, it overrides the default summarization prompt and its response will be used as the final output.
  - Example with custom options: `repository0 chat --verbose --prompt "Hello, how are you?" --model "gpt-4" --temperature 0.9 --summarization-prompt "Custom summarize:"`
- **chat-history:** Displays the persistent conversation history in a human-readable format.
  - Example: `repository0 chat-history`
- **chat-summarize:** Generates a concise summary of the conversation history by using the OpenAI API.
  - Example: `repository0 chat-summarize`
- **chat-search:** Searches the conversation history for entries that match a provided keyword (case-insensitive).
  - Example: `repository0 chat-search --query "search text"`
- **chat-export:** Exports the conversation history to a markdown file (`chat_history.md`).
  - Example: `repository0 chat-export`
- **chat-html-export:** Exports the conversation history to an HTML file (`chat_history.html`).
  - Example: `repository0 chat-html-export`
- **chat-pdf-export:** Exports the conversation history to a PDF file (`chat_history.pdf`).
  - Example: `repository0 chat-pdf-export`
- **chat-statistics:** Provides analytics on the conversation history by computing total messages, counts per role, and average message length.
  - Example: `repository0 chat-statistics`
- **chat-remove:** Removes a specific conversation entry from the history. It accepts a required numeric argument `--index` (alias `-i`) representing the 1-based index of the entry to remove.
  - Example: `repository0 chat-remove --index 2`
- **chat-edit:** Updates a specific conversation entry's message. It accepts:
    - `--index` or `-i`: The 1-based index of the conversation entry to update.
    - `--message` or `-m`: The new message content.
  - Example: `repository0 chat-edit --index 2 --message "Corrected message"`
- **chat-archive:** Archives the current conversation history into a timestamped file (e.g., `chat_history-YYYYMMDDHHmmss.json`) and resets the conversation history.
  - Example: `repository0 chat-archive`
- **chat-import:** Imports conversation history from a JSON file and merges it with the existing history.
  - Options:
    - `--file` or `-f`: The path to a JSON file containing an array of conversation entries, where each entry has a non-empty `role` and `content`.
  - Example: `repository0 chat-import --file ./my_conversation.json`
- **chat-translate:** Translates the current conversation history into a specified target language. The command uses the existing OpenAI API integration to translate the entire conversation while preserving the roles and format.
  - Options:
    - `--language` or `-l`: The target language for translation (required), e.g., 'Spanish' or 'French'.
  - Example: `repository0 chat-translate --language Spanish`
- **chat-config-update:** Persistently updates the default chat configuration settings by saving them to a configuration file (`.chat_config.json`). These settings (such as default model, temperature, max-history-messages, and recent-messages) will be loaded by the chat command in subsequent sessions unless overridden by CLI options or environment variables.
  - Options:
    - `--model` or `-m`: Update the default OpenAI model.
    - `--temperature` or `-t`: Update the default response randomness factor.
    - `--max-history-messages`: Update the default maximum conversation messages before auto-summarization.
    - `--recent-messages`: Update the default number of recent messages to retain after summarization.
  - Example: `repository0 chat-config-update --model gpt-4 --temperature 0.8 --max-history-messages 15 --recent-messages 3`

## Global Verbose Mode

A new global `--verbose` flag has been added to assist developers with detailed debugging information. When enabled, the CLI logs additional internal state and processing details. For example:

```bash
repository0 --verbose chat --prompt "Hello, Debug me!"
```

In verbose mode, you will see messages such as "Verbose mode enabled." and various debug logs prefixed with `[DEBUG]` throughout the execution.

## CLI Input Validation and Error Handling

The CLI validates all input arguments using Zod to ensure that every command receives a valid non-empty string. When an invalid input is provided, such as an empty string, boolean, null, undefined, object, array, symbol, or bigint, the CLI returns a standardized error message. For example:

  "Invalid input: Expected a valid non-empty string command, but received NaN. Please provide a valid non-empty string, such as 'start' or 'info'."

This behavior is consistent across all commands and aids in debugging and proper CLI usage.

## Error Handling Improvements

Error handling has been centralized to include a consistent formatted error output for all CLI errors. If verbose mode is enabled, additional error stack traces are output to assist in diagnosing issues.

## What’s Inside

- **GitHub Workflows:**
    GitHub workflows located in the `.github/workflows/` directory leverage reusable workflows from intentïon `agentic‑lib` to automate project tasks.

- **Source Code:**
    The main functionality is provided in `src/lib/main.js`, which now features new commands including the `chat-archive`, `chat-import`, `chat-translate`, `chat-edit`, `chat-html-export`, `chat-pdf-export`, and the newly implemented `chat-config-update` for persistently updating chat settings.

- **Global Verbose Mode:**
    The CLI now supports a global `--verbose` flag for detailed logging of internal operations, aiding debugging without affecting standard output in normal mode.

- **Dependencies:**
    The `package.json` file defines project dependencies and scripts for testing, formatting, linting, and CLI execution.

- **Tests:**
    Unit tests validate the CLI commands and error handling scenarios, ensuring robust behavior in various edge cases.

- **Documentation:**
    This README provides essential project information. For contribution guidelines, please see [CONTRIBUTING.md](./CONTRIBUTING.md).

## Getting Started

Set up the required secret for chat functionality:
- `CHATGPT_API_SECRET_KEY` - Your OpenAI API key for model `gpt-3.5-turbo` (or your chosen model).

Configure this secret in your repository settings under *Settings > Secrets and Variables > Actions*.

## Links

- [TEMPLATE-README.md](https://github.com/xn-intenton-z2a/agentic-lib/blob/main/TEMPLATE-README.md)
- [MISSION.md](./MISSION.md)
- [CONTRIBUTING.md](./CONTRIBUTING.md)
- [LICENSE](./LICENSE)
- [intentïon agentic‑lib GitHub Repository](https://github.com/xn-intenton-z2a/agentic-lib)

## License

Released under the MIT License (see [LICENSE](./LICENSE)).
