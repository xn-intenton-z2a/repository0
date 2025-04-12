# `repository0`

This repository is a template that showcases automated CI/CD workflows imported from intentïon `agentic‑lib`. It provides a modular CLI demonstration with commands refactored into discrete functions for enhanced maintainability and ease of extension. The CLI now includes a chat command integration with OpenAI's API featuring persistent multi-turn conversation support by storing conversation history in a file (.chat_history.json), robust and standardized CLI input validation powered by Zod, and additional commands to view, summarize, search, export (in markdown, HTML, and PDF), analyze, remove, archive, import, translate, edit conversation history, update persistent chat configuration, manage conversation tags, and now manage a chat session title.

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
    - `--summarization-prompt`: Custom prompt to use for summarizing conversation history (optional).
  - Example: `repository0 chat --verbose --prompt "Hello, how are you?" --model "gpt-4" --temperature 0.9 --summarization-prompt "Custom summarize:"`
- **chat-history:** Displays the persistent conversation history in a human-readable format.
  - Example: `repository0 chat-history`
- **chat-summarize:** Generates a concise summary of the conversation history using the OpenAI API.
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
- **chat-remove:** Removes a specific conversation entry from the history by specifying its 1-based index.
  - Example: `repository0 chat-remove --index 2`
- **chat-edit:** Updates a specific conversation entry's message by specifying its index and new message content.
  - Example: `repository0 chat-edit --index 2 --message "Corrected message"`
- **chat-archive:** Archives the current conversation history into a timestamped file and resets the history.
  - Example: `repository0 chat-archive`
- **chat-import:** Imports conversation history from a JSON file and merges it with the existing history.
  - Options:
    - `--file` or `-f`: The path to a JSON file containing conversation entries.
  - Example: `repository0 chat-import --file ./my_conversation.json`
- **chat-translate:** Translates the conversation history into a specified target language.
  - Options:
    - `--language` or `-l`: The target language, e.g., "Spanish" or "French" (required).
  - Example: `repository0 chat-translate --language Spanish`
- **chat-config-update:** Updates and persists default chat configuration settings (model, temperature, etc.)
  - Example: `repository0 chat-config-update --model gpt-4 --temperature 0.8 --max-history-messages 15 --recent-messages 3`
- **chat-tag:** Manage tags on conversation entries. Subcommands include:
  - `add`: Add a tag to a conversation entry (e.g., `repository0 chat-tag add --index 3 --tag "important"`).
  - `remove`: Remove a tag from a conversation entry (e.g., `repository0 chat-tag remove --index 3 --tag "important"`).
  - `list`: List all tags for a conversation entry (e.g., `repository0 chat-tag list --index 3`).
  - `filter`: Filter conversation entries by a tag (e.g., `repository0 chat-tag filter --tag "important"`).
- **chat-title:** Manage the chat session title. Subcommands include:
  - `set`: Set the session title (e.g., `repository0 chat-title set --title "Project Discussion"`).
  - `get`: Get the current session title (e.g., `repository0 chat-title get`).
  - `clear`: Clear the current session title (e.g., `repository0 chat-title clear`).

## Global Verbose Mode

A new global `--verbose` flag has been added to assist developers with detailed debugging information. When enabled, the CLI logs additional internal state and processing details.

Example:

```bash
repository0 --verbose chat --prompt "Hello, Debug me!"
```

## CLI Input Validation and Error Handling

All input arguments are validated using Zod. Invalid inputs yield standardized error messages to guide correct CLI usage.

## Error Handling Improvements

Errors are handled consistently with formatted output. In verbose mode, detailed stack traces are provided.

## What’s Inside

- **GitHub Workflows:**
    Automated workflows from intentïon `agentic‑lib` handle CI/CD tasks.
- **Source Code:**
    The CLI functionality is implemented in `src/lib/main.js` with modular commands including the new `chat-title` for managing session titles.
- **Global Verbose Mode:**
    Enables detailed logging for debugging.
- **Dependencies:**
    Refer to `package.json` for project dependencies and scripts.
- **Tests:**
    Comprehensive unit tests ensure robust functionality including the new chat session title feature.
- **Documentation:**
    This README and linked documents (MISSION.md, CONTRIBUTING.md, LICENSE) outline project details and usage.

## Getting Started

Setup your OpenAI API key by configuring the `CHATGPT_API_SECRET_KEY` environment variable.

Configure other settings (if needed) via environment variables or the `chat-config-update` command.

## Links

- [TEMPLATE-README.md](https://github.com/xn-intenton-z2a/agentic-lib/blob/main/TEMPLATE-README.md)
- [MISSION.md](./MISSION.md)
- [CONTRIBUTING.md](./CONTRIBUTING.md)
- [LICENSE](./LICENSE)
- [intentïon agentic‑lib GitHub Repository](https://github.com/xn-intenton-z2a/agentic-lib)

## License

Released under the MIT License (see [LICENSE](./LICENSE)).
