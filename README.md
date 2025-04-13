# `repository0`

This repository is a template that showcases automated CI/CD workflows imported from intentïon `agentic‑lib`. It provides a modular CLI demonstration with commands refactored into discrete functions for enhanced maintainability and ease of extension. 

The CLI now includes a chat command integration with OpenAI's API featuring persistent multi-turn conversation support by storing conversation history in a file (.chat_history.json). Each conversation message now includes a timestamp (in ISO format) indicating when the message was sent. The CLI also features robust and standardized CLI input validation powered by Zod, with additional safeguards against invalid inputs such as NaN. It also includes commands to view, summarize, search (with regex support and enhanced multi-keyword filtering using logical operators AND/OR), export (in markdown, HTML, PDF, and CSV – with optional tag filtering, date range filtering, and customizable export templates), analyze, remove, archive, import, restore, translate, edit conversation history, update persistent chat configuration, manage conversation tags, manage chat feedback, and manage a chat session title.

In addition, an automatic archival mechanism has been introduced. When the number of messages in the conversation history exceeds a configurable threshold (set via environment variable `CHAT_AUTO_ARCHIVE_THRESHOLD`, persisted configuration, or defaulting to 50), the conversation history is automatically archived to a timestamped JSON file and then reset.

**Enhancement:** The conversation history export commands (chat-export, chat-html-export, chat-pdf-export, and chat-csv-export) have been enhanced to include session metadata, individual message timestamps, and support filtering by a specified date range using the `--start-date` and `--end-date` options. In addition, they support a new `--template` option to allow users to provide a custom EJS template for export. Notably, the **chat-csv-export** command now includes a new `--delimiter` option that allows users to specify a custom CSV delimiter (default is a comma). When provided, the CSV file will use the chosen delimiter for column separation while ensuring proper quoting and escaping of fields.

A new **chat-feedback** command has been introduced to allow users to attach, remove, and view feedback on individual conversation entries. This functionality enables users to annotate messages (e.g., with 'positive' or 'negative' feedback) to aid in conversation analysis.

Additionally, the new **chat-restore** command enables users to restore a previously archived conversation history from a specified archive file.

**New Feature in chat-search:** The **chat-search** command now supports logical operators (AND, OR) for multi-keyword filtering. For example, a query like "error AND timeout" returns only messages that contain both words, while "failed OR error" returns messages that contain either keyword. In cases where the query includes logical operators, the regular expression flag is ignored to properly process the logical criteria.

**Pagination:** The **chat-history** command has been enhanced with pagination support. Two new optional CLI parameters, `--page` and `--page-size`, allow users to specify which page of messages to display and how many messages per page to show (defaulting to page 1 and 10 messages per page). This makes it easier to navigate large conversation histories.

Additionally, to avoid unintended issue creation, inputs that are not valid (e.g., NaN strings) are explicitly rejected by the CLI.

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
- **chat:** Interact with OpenAI's API by sending a prompt and receiving a generated response. Supports persistent multi-turn conversations by preserving conversation context (with timestamps) in a file (.chat_history.json) across CLI sessions. Also automatically summarizes older parts of the conversation history if a configurable threshold is exceeded, and auto archives history if it exceeds a set threshold.
  - Options include: `--prompt`, `--max-history-messages`, `--recent-messages`, `--model`, `--temperature`, `--summarization-prompt`, `--auto-archive-threshold`.
  - Example: `repository0 chat --verbose --prompt "Hello, how are you?" --model "gpt-4" --temperature 0.9 --summarization-prompt "Custom summarize:"`
- **chat-history:** Displays the persistent conversation history with timestamps and supports pagination via `--page` and `--page-size`.
  - Example: `repository0 chat-history --page 2 --page-size 10`
- **chat-summarize:** Generates a concise summary of the conversation history using the OpenAI API.
  - Example: `repository0 chat-summarize`
- **chat-search:** Searches the conversation history for entries matching a keyword or regex. Use `--regex` to treat the query as a regular expression. Now also supports logical operators AND/OR for combining multiple keywords.
  - Example: `repository0 chat-search --query "error AND timeout"`
  - Example: `repository0 chat-search --query "failed OR error" --regex`
- **chat-export:** Exports the conversation history to a markdown file (`chat_history.md`), with optional filtering by tag and date range, and supports custom templates via `--template`.
  - Example: `repository0 chat-export --tag important --start-date 2023-05-01 --end-date 2023-06-01 --template ./custom_template.md`
- **chat-html-export:** Exports the conversation history to an HTML file (`chat_history.html`), with similar filtering and templating options.
  - Example: `repository0 chat-html-export --tag important --start-date 2023-05-01 --end-date 2023-06-01 --template ./custom_template.html`
- **chat-pdf-export:** Exports the conversation history to a PDF file (`chat_history.pdf`), with similar options.
  - Example: `repository0 chat-pdf-export --tag important --start-date 2023-05-01 --end-date 2023-06-01 --template ./custom_template.txt`
- **chat-csv-export:** Exports the conversation history to a CSV file (`chat_history.csv`). The CSV includes session metadata (session title and export timestamp) in the header, and each row contains the index, role, content, timestamp, feedback (if provided), and tags. Supports filtering by tag and date range. Additionally, the new `--delimiter` option allows specifying a custom CSV delimiter (default is a comma).
  - Example: `repository0 chat-csv-export --tag important --start-date 2023-05-01 --end-date 2023-06-01 --delimiter ";"`
- **chat-statistics:** Provides analytics on the conversation history (total messages, counts per role, and average message length).
  - Example: `repository0 chat-statistics`
- **chat-remove:** Removes a specific conversation entry by specifying its index.
  - Example: `repository0 chat-remove --index 2`
- **chat-edit:** Updates a specific conversation entry's message by index.
  - Example: `repository0 chat-edit --index 2 --message "Corrected message"`
- **chat-archive:** Archives the current conversation history into a timestamped file and resets the history.
  - Example: `repository0 chat-archive`
- **chat-import:** Imports conversation history from a JSON file and merges it with the existing history.
  - Example: `repository0 chat-import --file ./my_conversation.json`
- **chat-restore:** Restores the conversation history from an archived JSON file.
  - Example: `repository0 chat-restore --file chat_history-20230101120000.json`
- **chat-translate:** Translates the conversation history into a specified target language.
  - Example: `repository0 chat-translate --language Spanish`
- **chat-config-update:** Updates and persists default chat configuration settings.
  - Example: `repository0 chat-config-update --model gpt-4 --temperature 0.8 --max-history-messages 15 --recent-messages 3 --auto-archive-threshold 100`
- **chat-tag:** Manage tags on conversation entries with subcommands: add, remove, list, and filter.
- **chat-feedback:** Manage feedback on conversation entries with subcommands: add, remove, and list.
- **chat-title:** Manage the chat session title using subcommands: set, get, and clear.

## Global Verbose Mode

A global `--verbose` flag is available to output detailed debugging information for internal state tracking.

Example:

```bash
repository0 --verbose chat --prompt "Hello, Debug me!"
```

## Automatic Conversation Archival

When the conversation history exceeds a specified threshold (`--auto-archive-threshold`, environment variable, or persisted config), the history is automatically archived to a timestamped JSON file and the active history is reset. This helps manage long-term data while maintaining performance.

## Export Metadata Enhancement, Date Range Filtering, Custom Templates, and Conversation Restoration

The export commands (chat-export, chat-html-export, chat-pdf-export, and chat-csv-export) include session metadata, individual message timestamps, and support filtering via `--start-date` and `--end-date`. A custom EJS template can be provided using the `--template` option to format the export output. Additionally, the **chat-restore** command allows restoring archived conversations.

## CSV Export Customization

The **chat-csv-export** command has been enhanced to allow users to specify a custom delimiter using the new `--delimiter` option. By default, it uses a comma, but users can choose alternatives (e.g., semicolon, tab) as needed. This ensures flexibility in handling CSV outputs with proper quoting and escaping.

## CLI Input Validation and Error Handling

All inputs are validated using Zod. Invalid inputs, including inputs such as "NaN", result in standardized error messages to guide proper usage.

## What’s Inside

- **GitHub Workflows:** Automated workflows from intentïon `agentic‑lib` manage CI/CD tasks.
- **Source Code:** The CLI functionality, including the new CSV export command and enhanced chat-search command, is implemented in `src/lib/main.js`.
- **Global Verbose Mode:** Provides detailed logging when enabled.
- **Dependencies:** See `package.json` for project dependencies and scripts.
- **Tests:** Extensive unit tests cover all CLI commands and the new multi-keyword filtering and CSV export functionalities.
- **Documentation:** This README, along with linked documents (MISSION.md, CONTRIBUTING.md, LICENSE), provide project details and usage instructions.

## Getting Started

Set up your OpenAI API key by configuring the `CHATGPT_API_SECRET_KEY` environment variable.

Configure additional settings via environment variables, CLI options, or the `chat-config-update` command.

## Links

- [TEMPLATE-README.md](https://github.com/xn-intenton-z2a/agentic-lib/blob/main/TEMPLATE-README.md)
- [MISSION.md](./MISSION.md)
- [CONTRIBUTING.md](./CONTRIBUTING.md)
- [LICENSE](./LICENSE)
- [intentïon agentic‑lib GitHub Repository](https://github.com/xn-intenton-z2a/agentic-lib)

## License

Released under the MIT License (see [LICENSE](./LICENSE)).
