# `repository0`

This repository template showcases the GitHub workflows imported from intention `agentic‑lib`, including automated CI/CD workflows and handy CLI utilities. It now includes a persistent multi-turn conversation ('chat') command that stores conversation history in a file (.chat_history.json) and offers enhanced export functionality with multiple formatted outputs, a stats subcommand to view chat history summary, a clear subcommand to reset the chat history, an edit subcommand to update a specific chat message, a delete subcommand to remove a specific chat message, an edit-last subcommand to update the most recent message, an undo subcommand to revert the last change (with multi-level undo support), a redo subcommand to reapply an undone change, a search subcommand to search within the chat history, a list subcommand to display all chat messages with their indexes, an import subcommand to load chat history from an external JSON file, a rename subcommand to update the chat session title, an edit-ts subcommand to update a chat message by its ISO timestamp, a new analytics subcommand to display comprehensive conversation metrics including a median message length metric, and a new YAML export format.

You probably want to start with the template documentation here: [TEMPLATE-README.md](https://github.com/xn-intenton-z2a/agentic‑lib/blob/main/TEMPLATE-README.md)

## Overview
`repository0` is a demo repository that demonstrates the automated GitHub workflows and CLI utilities derived from intention `agentic‑lib`. The repository now supports a persistent multi-turn chat feature with optional session titling, export functionality with human-readable formats, a stats command to summarize the chat session history, a clear command to reset the chat history, an edit command to update a previously recorded message, a delete command to remove a specified chat message, an edit-last command to quickly update the most recent message, an undo command to revert one or more modifications (multi-level undo), a redo command to reapply undone actions, a search command (case-insensitive) to find messages containing a specific keyword, a list command to display the complete chat history with indexed messages, an import command to import chat history from an external JSON file, a rename command to update the session title, an **edit-ts** command to update a chat message by specifying its exact ISO timestamp, a **analytics** command to reveal key conversation metrics, and a **yaml** export format.

### Analytics Command Enhancement
The analytics command now computes and reports the median message length in addition to total messages, average message length, total word count, the longest message, and average word count per message. The median is calculated by sorting the lengths of all messages and selecting the middle value (or averaging the two middle values if there is an even number of messages). This additional metric provides a better understanding of the distribution of message lengths in your chat session.

## What’s Inside

- **GitHub Workflows:**  
  Workflows in the `.github/workflows/` directory utilize reusable workflows from intention `agentic‑lib` to automate project tasks.

- **Source Code:**  
  The CLI functionality is implemented in `src/lib/main.js`, including a 'chat' command for interactive multi-turn conversations. The chat command now supports:
  - Starting/resuming a chat session
  - Exporting chat history in `markdown`, `html`, `csv`, `pdf`, `json`, `xml`, or **yaml** formats
  - Showing session stats (including the new median message length)
  - Clearing the entire chat history with the `clear` command
  - Editing a specific message via `edit` (by index), `edit-last` (editing the most recent message), or **edit-ts** (editing by timestamp)
  - Deleting a specific message
  - **Multi-level Undo:** Revert multiple actions sequentially.
  - **Redo Command:** Reapply an action that was undone.
  - Searching chat history (case-insensitive) with the `search` command
  - **Listing chat history** with the `list` command
  - **Importing chat history:** Replace the current chat history with data from an external JSON file.
  - **Renaming chat session:** Update the session title without adding a new chat message.
  - **Analytics:** Get an enhanced overview of your chat session with key metrics including total messages, average message length, **median message length**, total word count, the longest message, and average word count per message.
  - **YAML Export:** Export chat history in YAML format.

- **Chat Command Usage:**

  - To start or update a chat session, run:
    ```
    node src/lib/main.js chat [session title]
    ```
    (If no session title is provided, "Default Session" is used.)

  - To export the conversation history, run:
    ```
    node src/lib/main.js chat export <format>
    ```
    where `<format>` is one of: markdown, html, pdf, csv, json, xml, yaml.

  - To import chat history from an external JSON file, run:
    ```
    node src/lib/main.js chat import <filePath>
    ```

  - To rename the current session title, run:
    ```
    node src/lib/main.js chat rename <new session title>
    ```

  - To update a chat message by index, run:
    ```
    node src/lib/main.js chat edit <index> <new_message>
    ```

  - To update the most recent chat message, run:
    ```
    node src/lib/main.js chat edit-last <new_message>
    ```

  - To update a chat message by its timestamp, run:
    ```
    node src/lib/main.js chat edit-ts <timestamp> <new_message>
    ```

  - To view a summary of the current chat session, run:
    ```
    node src/lib/main.js chat stats
    ```

  - To clear the chat history, run:
    ```
    node src/lib/main.js chat clear
    ```

  - To delete a chat message, run:
    ```
    node src/lib/main.js chat delete <index>
    ```

  - To undo modifications, run:
    ```
    node src/lib/main.js chat undo
    ```

  - To redo an undone modification, run:
    ```
    node src/lib/main.js chat redo
    ```

  - To search for messages, run:
    ```
    node src/lib/main.js chat search <keyword>
    ```

  - To list all chat messages, run:
    ```
    node src/lib/main.js chat list
    ```

  - To display enhanced analytics (including median message length), run:
    ```
    node src/lib/main.js chat analytics
    ```

## Dependencies
The `package.json` file defines dependencies and scripts for testing, formatting, linting, and running the CLI.

## Tests
Unit tests in the `tests/unit/` folder ensure that all CLI commands, including the updated analytics command, operate as expected.

## Documentation
This README provides essential project information. For contribution guidelines, please see [CONTRIBUTING.md](./CONTRIBUTING.md).

## Getting Started

This repository is already set up with the necessary workflows and scripts. Make sure to supply the following secrets:
- `CHATGPT_API_SECRET_KEY`

Set these secrets in your repository settings under *Settings > Secrets and Variables > Actions*.

## intentïon `agentic‑lib`

The **intentïon `agentic‑lib`** is a collection of reusable GitHub Actions workflows that enable your repository to operate in an “agentic” manner. For more details, visit the [agentic‑lib GitHub Repository](https://github.com/xn-intenton-z2a/agentic-lib).

## Links

- [TEMPLATE-README.md](https://github.com/xn-intenton-z2a/agentic‑lib/blob/main/TEMPLATE-README.md)
- [MISSION.md](./MISSION.md)
- [CONTRIBUTING.md](./CONTRIBUTING.md)
- [LICENSE](./LICENSE)
- [agentic‑lib GitHub Repository](https://github.com/xn-intenton-z2a/agentic-lib)

## License

Released under the MIT License (see [LICENSE](./LICENSE)).
