# `repository0`

This repository template showcases the GitHub workflows imported from intention `agentic‑lib`, including automated CI/CD workflows and handy CLI utilities. It now includes a persistent multi-turn conversation ('chat') command that stores conversation history in a file (.chat_history.json) and offers enhanced export functionality with multiple formatted outputs, a stats subcommand to view chat history summary, a clear subcommand to reset the chat history, an edit subcommand to update a specific chat message, a delete subcommand to remove a specific chat message, an edit-last subcommand to update the most recent message, an undo subcommand to revert the last change (with multi-level undo support), a redo subcommand to reapply an undone change, a search subcommand to search within the chat history, a list subcommand to display all chat messages with their indexes, an import subcommand to load chat history from an external JSON file, a rename subcommand to update the chat session title, and now an edit-ts subcommand to update a chat message by its ISO timestamp.

You probably want to start with the template documentation here: [TEMPLATE-README.md](https://github.com/xn-intenton-z2a/agentic‑lib/blob/main/TEMPLATE-README.md)

## Overview
`repository0` is a demo repository that demonstrates the automated GitHub workflows and CLI utilities derived from intention `agentic‑lib`. The repository now supports a persistent multi-turn chat feature with optional session titling, export functionality with human-readable formats, a stats command to summarize the chat session history, a clear command to reset the chat history, an edit command to update a previously recorded message, a delete command to remove a specified chat message, an edit-last command to quickly update the most recent message, an undo command to revert one or more modifications (multi-level undo), a redo command to reapply undone actions, a search command (case-insensitive) to find messages containing a specific keyword, a list command to display the complete chat history with indexed messages, an import command to import chat history from an external JSON file, a rename command to update the session title, and an **edit-ts** command to update a chat message by specifying its exact ISO timestamp.

## What’s Inside

- **GitHub Workflows:**  
  Workflows in the `.github/workflows/` directory utilize reusable workflows from intention `agentic‑lib` to automate project tasks.

- **Source Code:**  
  The CLI functionality is implemented in `src/lib/main.js`, including a 'chat' command for interactive multi-turn conversations. The chat command now supports:
  - Starting/resuming a chat session
  - Exporting chat history in `markdown`, `html`, `csv`, `pdf`, `json`, or **xml** formats
  - Showing session stats
  - Clearing the entire chat history with the `clear` command
  - Editing a specific message via `edit` (by index), `edit-last` (editing the most recent message), or **edit-ts** (editing by timestamp)
  - Deleting a specific message
  - **Multi-level Undo:** Revert multiple actions sequentially by invoking the `undo` command repeatedly. Each modifying action (addition, edit, delete, clear) pushes the previous state onto an undo stack. Repeatedly executing the undo command will revert the chat history step by step. If no more backup states are available, it outputs "No more actions to undo.".
  - **Redo Command:** Reapply an action that was undone by the `undo` command. The redo functionality uses a redo stack to restore the most recently undone state, and any new modification clears the redo history.
  - Searching chat history (case-insensitive) with the `search` command
  - **Listing chat history** with the `list` command, which displays all messages with their indexes and timestamps
  - **Importing chat history:** Replace the current chat history with data from an external JSON file. The command expects a file path, validates the JSON structure (must include a `sessionTitle` and a `messages` array with objects containing `timestamp` and `message`), backs up the existing history, and imports the new data.
  - **Renaming chat session:** Update the current session title without adding a new chat message by running:
    ```
    node src/lib/main.js chat rename <new session title>
    ```
    This command backs up the current chat history and updates the session title, confirming the change with a log message.
  - **Edit by Timestamp:** Update a chat message by specifying its exact ISO timestamp. Run:
    ```
    node src/lib/main.js chat edit-ts <timestamp> <new_message>
    ```
    This command searches for the message with the exact provided ISO timestamp, updates its content and timestamp.

- **Chat Command Usage:**

  - To start or update a chat session, run:
    ```
    node src/lib/main.js chat [session title]
    ```
    (If no session title is provided, "Default Session" is used.)

  - To export the conversation history in a formatted output, run:
    ```
    node src/lib/main.js chat export <format>
    ```
    where `<format>` is one of:
      - **markdown:** Exports with a markdown header and a list for each message.
      - **html:** Exports as an HTML snippet with an `<h1>` header and `<p>` tags for each message.
      - **csv:** Exports as CSV with a header row (`timestamp,message`) and each message as a new row.
      - **pdf:** Simulates PDF export as a plain text representation. NOTE: This is a simulation and does not produce an actual PDF file.
      - **json:** Exports the chat history as a pretty-printed JSON string, ideal for programmatic consumption.
      - **xml:** Exports the chat history in XML format. The XML structure includes a `<chatHistory>` root element with a `<sessionTitle>` child for the session name and a `<messages>` container that wraps individual `<message>` elements. Each `<message>` element contains a `<timestamp>` element and a `<content>` element.

  - To import chat history from an external JSON file, run:
    ```
    node src/lib/main.js chat import <filePath>
    ```
    This command reads the specified JSON file, validates its structure, backs up the current chat history (if any), and replaces it with the imported data.

  - To rename the current session title without adding a new chat message, run:
    ```
    node src/lib/main.js chat rename <new session title>
    ```
    This command backs up the current history and updates the session title, confirming the change with a log message.

  - To update a chat message by its index, run:
    ```
    node src/lib/main.js chat edit <index> <new_message>
    ```
    Updates the specified message and refreshes its timestamp.

  - To update the most recent chat message quickly, run:
    ```
    node src/lib/main.js chat edit-last <new_message>
    ```

  - To update a chat message by its timestamp, run:
    ```
    node src/lib/main.js chat edit-ts <timestamp> <new_message>
    ```
    This command searches for the message with the exact provided ISO timestamp and updates its content and timestamp.

  - To view a summary of the current chat session, run:
    ```
    node src/lib/main.js chat stats
    ```
    This command prints a summary in the format:
    "Session '<sessionTitle>' contains <number> messages." If no chat history is available, it outputs "No chat history available.".

  - To clear the chat history, run:
    ```
    node src/lib/main.js chat clear
    ```
    This command deletes the `.chat_history.json` file if it exists and prints a confirmation message.

  - To delete a chat message, run:
    ```
    node src/lib/main.js chat delete <index>
    ```
    Validates the index and deletes the specified message upon success.

  - To undo modifications, run:
    ```
    node src/lib/main.js chat undo
    ```
    This command now supports multiple undo operations. Each time you modify the chat history (by adding, editing, deleting, or clearing), the previous state is saved onto an undo stack. Repeatedly executing the undo command will revert the chat history step by step. If no more backup states are available, it outputs "No more actions to undo.".

  - To redo an undone modification, run:
    ```
    node src/lib/main.js chat redo
    ```
    This command reapplies the most recent undone change. If no redo action is available, it outputs "No actions to redo.".

  - To search for messages within the chat history, run:
    ```
    node src/lib/main.js chat search <keyword>
    ```
    This command searches for the provided `<keyword>` (case-insensitively) in all messages and prints any matching messages. If no matches are found, it outputs "No matching messages found.".

  - To list all chat messages with their indexes and timestamps, run:
    ```
    node src/lib/main.js chat list
    ```
    This command displays every recorded message in the format: "[index] timestamp: message".

## Dependencies
The `package.json` file defines dependencies and scripts for testing, formatting, linting, and running the CLI.

## Tests
Unit tests in the `tests/unit/` folder ensure that the CLI commands, including the new multi-level undo/redo functionality, case-insensitive search, import functionality, the rename command, and the new edit-ts command behave as expected.

## Documentation
This README provides essential project information. For contribution guidelines, please see [CONTRIBUTING.md](./CONTRIBUTING.md).

## Getting Started

This repository is already set up with the necessary workflows and scripts but you need to supply the following secrets:
- `CHATGPT_API_SECRET_KEY` - This key must be for an account with access to the OpenAI chat completions API for model `o3-mini`.

Set these secrets in your repository settings under *Settings > Secrets and Variables > Actions*.

## intentïon `agentic‑lib`

The **intentïon `agentic‑lib`** is a collection of reusable GitHub Actions workflows that enable your repository to operate in an “agentic” manner. Autonomous workflows communicate through branches and issues to continuously review, fix, update, and evolve your code. Each workflow is designed to be invoked using GitHub’s `workflow_call` event, so they can be composed together like an SDK. This project itself is evolving, and these workflows may eventually become bundled actions.

*Warning:* Running these workflows may incur resource usage and charges.

## Links

- [TEMPLATE-README.md](https://github.com/xn-intenton-z2a/agentic‑lib/blob/main/TEMPLATE-README.md)
- [MISSION.md](./MISSION.md)
- [CONTRIBUTING.md](./CONTRIBUTING.md)
- [LICENSE](./LICENSE)
- [agentic‑lib GitHub Repository](https://github.com/xn-intenton-z2a/agentic-lib)

## License

Released under the MIT License (see [LICENSE](./LICENSE)).
