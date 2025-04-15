# CHAT_QUOTE Feature

This feature introduces a new subcommand, `chat quote`, to the chat CLI utility. It allows users to quote an existing message by specifying its index. The quoted message is then appended as a new chat entry with a prefixed quote indicator, helping users highlight important messages for context or future reference without modifying the original message.

## Overview
- **Subcommand:** `chat quote <index>`
- **Functionality:**
  - Validates that the chat history exists and that the provided message index is valid.
  - Retrieves the specified message and prefixes it with a quote marker (e.g., `> `).
  - Appends the quoted message as a new message to the chat history with the current timestamp.
  - Provides console feedback confirming that the message was quoted successfully.
- **Files Affected:**
  - Source file: `src/lib/main.js`
  - Test file: `tests/unit/main.test.js`
  - Documentation: `README.md`
  - Dependencies file: `package.json` (if needed for minor adjustments but typically not necessary)

## Source File Changes (src/lib/main.js)
- Add a new conditional branch in the main command handler for the `quote` subcommand.
- Steps in the new branch:
  - Check if the chat history file (`.chat_history.json`) exists. If not, output an error message.
  - Parse the chat history and validate the provided index (argument index 2). If the index is invalid, display an error.
  - Retrieve the message at the given index, prepend it with a quote marker (e.g., `> `), and create a new message object with the current timestamp.
  - Call the backup function (as done in edits) to preserve the current state before appending.
  - Append the newly created quoted message to the messages array.
  - Save the updated history back to the file.
  - Output a success message such as "Message quoted successfully.".

## Test File Changes (tests/unit/main.test.js)
- Add unit tests for the `chat quote` subcommand:
  - **Valid Index:** Test that invoking `chat quote` with a valid index quotes the message, appends the new message, and updates the chat history.
  - **Invalid Index:** Test that invoking the command with an invalid index (non-numeric, negative, or out-of-bound) outputs an appropriate error message.
  - **No Chat History:** Test that if the chat history file does not exist, the command informs the user accordingly.

## README.md Updates
- Update the Chat Command section to include the new usage example:
  ```
  node src/lib/main.js chat quote <index>
  ```
- Document that this subcommand allows quoting an existing message by index, which appends a new message prefixed with a quotation marker to the chat history.

## Rationale
- **Enhanced Usability:** Enables users to quickly flag and reference previous messages by quoting them without altering the original history.
- **Consistency:** Complements other chat management subcommands (like edit, duplicate, undo) while adhering to the minimalist design of a single source file implementation.
- **Mission Alignment:** Supports the repository's mission to provide handy, file-based CLI utilities in Node.js by adding a valuable yet lightweight enhancement.
