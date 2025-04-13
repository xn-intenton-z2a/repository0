# `repository0`

This repository is a template that showcases automated CI/CD workflows imported from intentïon `agentic‑lib`. It provides a modular CLI demonstration with commands refactored into discrete functions for enhanced maintainability and ease of extension.

The CLI now includes a chat command integration with OpenAI's API featuring persistent multi-turn conversation support by storing conversation history in a file (.chat_history.json). Each conversation message now includes a timestamp (in ISO format) indicating when the message was sent. The CLI also features robust and standardized CLI input validation powered by Zod, with additional safeguards against invalid inputs such as NaN. It includes commands to view, summarize, search (with regex support and enhanced multi-keyword filtering using logical operators AND/OR), export (in markdown, HTML, PDF, and CSV – with optional tag filtering, date range filtering, and customizable export templates), analyze, remove, archive, import, restore, translate, edit conversation history, update persistent chat configuration, manage conversation tags, manage chat feedback, and manage a chat session title.

In addition, an automatic archival mechanism has been introduced. When the number of messages in the conversation history exceeds a configurable threshold (set via environment variable `CHAT_AUTO_ARCHIVE_THRESHOLD`, persisted configuration, or defaulting to 50), the conversation history is automatically archived to a timestamped JSON file and then reset.

**Enhancement:** The conversation history export commands (chat-export, chat-html-export, chat-pdf-export, and chat-csv-export) have been enhanced to include session metadata, individual message timestamps, and support filtering by a specified date range using the `--start-date` and `--end-date` options. In addition, they support a new `--template` option to allow users to provide a custom EJS template for export. Notably, the **chat-csv-export** command now includes a new `--delimiter` option that allows users to specify a custom CSV delimiter (default is a comma).

A new **chat-feedback** command has been introduced to allow users to attach, remove, and view feedback on individual conversation entries. This functionality enables users to annotate messages (e.g., with 'positive' or 'negative' feedback) to aid in conversation analysis.

Additionally, the new **chat-restore** command enables users to restore a previously archived conversation history from a specified archive file.

**New Feature: Interactive Chat Mode**

A new subcommand, **chat-interactive**, has been implemented. This command provides a REPL-like interactive chat session with OpenAI's API. Upon starting, it displays an instruction banner and continuously accepts user input until the user types "exit". Each input is processed using the same logic as the non-interactive chat command, including validation, auto-summarization, auto-archival, and conversation history updates. When "exit" is entered, the session terminates gracefully with a summary message.

## Overview

`repository0` is a demo repository that showcases the GitHub workflows imported from intentïon `agentic‑lib`. Its primary purpose is to demonstrate these automated CI/CD workflows and serve as an example for future development. The CLI functionality has been refactored to separate command registration into modular functions, improving maintainability.

## CLI Usage

The CLI employs yargs for robust subcommand parsing and improved input validation. It also supports a global `--verbose` flag that enables detailed debugging output for developers.

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
- **chat:** Interact with OpenAI's API by sending a prompt and receiving a generated response. Supports persistent multi-turn conversations by preserving conversation context (with timestamps) in a file (.chat_history.json) across CLI sessions.
  - Options include: `--prompt`, `--max-history-messages`, `--recent-messages`, `--model`, `--temperature`, `--summarization-prompt`, `--auto-archive-threshold`.
  - Example: `repository0 chat --prompt "Hello, how are you?" --model "gpt-4" --temperature 0.9 --summarization-prompt "Custom summarize:"`
- **chat-interactive:** Starts an interactive REPL-like chat session with OpenAI's API. Type your message and press enter. Type "exit" to quit.
  - Example: `repository0 chat-interactive`
- **chat-history:** Displays the persistent conversation history with timestamps and supports pagination via `--page` and `--page-size`.
  - Example: `repository0 chat-history --page 2 --page-size 10`
- **chat-summarize:** Generates a concise summary of the conversation history using the OpenAI API.
  - Example: `repository0 chat-summarize`
- **chat-search:** Searches the conversation history for entries matching a keyword or regex. Supports logical operators AND/OR.
  - Example: `repository0 chat-search --query "error AND timeout"`
  - Example: `repository0 chat-search --query "failed OR error" --regex`
- **chat-export:** Exports the conversation history to a markdown file (`chat_history.md`), with optional filtering by tag and date range, and supports custom templates.
  - Example: `repository0 chat-export --tag important --start-date 2023-05-01 --end-date 2023-06-01 --template ./custom_template.md`
- **chat-html-export:** Exports the conversation history to an HTML file (`chat_history.html`).
  - Example: `repository0 chat-html-export --tag important --start-date 2023-05-01 --end-date 2023-06-01 --template ./custom_template.html`
- **chat-pdf-export:** Exports the conversation history to a PDF file (`chat_history.pdf`).
  - Example: `repository0 chat-pdf-export --tag important --start-date 2023-05-01 --end-date 2023-06-01 --template ./custom_template.txt`
- **chat-csv-export:** Exports the conversation history to a CSV file (`chat_history.csv`). Includes session metadata, and supports filtering by tag and date range with a customizable delimiter.
  - Example: `repository0 chat-csv-export --tag important --start-date 2023-05-01 --end-date 2023-06-01 --delimiter ";"`
- **chat-statistics:** Provides analytics on the conversation history.
  - Example: `repository0 chat-statistics`
- **chat-remove:** Removes a specific conversation entry by index.
  - Example: `repository0 chat-remove --index 2`
- **chat-edit:** Updates a conversation entry's message by index.
  - Example: `repository0 chat-edit --index 2 --message "Corrected message"`
- **chat-archive:** Archives the current conversation history into a timestamped file and resets the history.
  - Example: `repository0 chat-archive`
- **chat-import:** Imports conversation history from a JSON file and merges it with existing history.
  - Example: `repository0 chat-import --file ./my_conversation.json`
- **chat-restore:** Restores conversation history from an archived JSON file.
  - Example: `repository0 chat-restore --file chat_history-20230101120000.json`
- **chat-translate:** Translates the conversation history into a specified target language.
  - Example: `repository0 chat-translate --language Spanish`
- **chat-config-update:** Updates and persists default chat configuration settings.
  - Example: `repository0 chat-config-update --model gpt-4 --temperature 0.8 --max-history-messages 15 --recent-messages 3 --auto-archive-threshold 100`
- **chat-tag:** Manage tags on conversation entries with subcommands: add, remove, list, and filter.
- **chat-feedback:** Manage feedback on conversation entries with subcommands: add, remove, and list.
- **chat-title:** Manage the chat session title with subcommands: set, get, and clear.

## Global Verbose Mode

A global `--verbose` flag is available to output detailed debugging information.

## Automatic Conversation Archival

When conversation history exceeds a specified threshold, it is auto-archived to a timestamped JSON file and the active history is reset.

## Export Enhancements

Export commands now include session metadata, message timestamps, and support date range filtering and custom EJS templates. The CSV export command supports a custom delimiter via `--delimiter`.

## Interactive Chat Mode

The new **chat-interactive** command provides a dynamic, REPL-like chat session with OpenAI's API. It continuously accepts user input, processes each prompt using the existing chat logic (including validation, auto-summarization, and archival), and terminates gracefully when the user types "exit".

## Links

- [TEMPLATE-README.md](https://github.com/xn-intenton-z2a/agentic-lib/blob/main/TEMPLATE-README.md)
- [MISSION.md](./MISSION.md)
- [CONTRIBUTING.md](./CONTRIBUTING.md)
- [LICENSE](./LICENSE)
- [intentïon agentic‑lib GitHub Repository](https://github.com/xn-intenton-z2a/agentic-lib)

## License

Released under the MIT License (see [LICENSE](./LICENSE)).
