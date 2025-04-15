# CHAT_PIN Feature

This feature introduces two new subcommands, `pin` and `unpin`, to the chat CLI utility. These commands allow users to mark a specific chat message as important (pinned) for quick reference and later remove the pinned status if needed. This enhancement builds on the existing chat functionality and extends the capabilities for managing conversation history.

## Overview

- **Subcommands:**
  - `chat pin <index>`: Marks the chat message at the given index as pinned by adding a `pinned: true` property.
  - `chat unpin <index>`: Removes the pinned status from the chat message at the given index.

- **Behavior:**
  - When the `pin` command is invoked, the application first validates that the chat history file exists, then parses the list of messages. If the provided index is valid, it sets a new property `pinned` to `true` on that message and saves the updated file. If the index is invalid or the file does not exist, an appropriate error message is displayed.
  - The `unpin` command follows a similar flow: validate, parse, check index, and either remove or set the `pinned` property to `false` for the specified message.

## Source File Changes (src/lib/main.js)

- Add a new conditional branch under the `chat` command to handle the `pin` and `unpin` subcommands.
- For `chat pin <index>`:
  - Verify that the chat history file exists; if not, output an error.
  - Parse the provided index from the command arguments and check its validity against the messages array.
  - If valid, set `history.messages[index].pinned = true` and write the updated history back to the file. Confirm the action to the user.
- For `chat unpin <index>`:
  - Follow similar steps, removing the `pinned` flag (or setting it to `false`) if the index is valid.
- Ensure robust error handling in scenarios where the file is missing, the index is invalid, or read/write operations fail.

## Test File Changes (tests/unit/main.test.js)

- Add unit tests for both `chat pin` and `chat unpin` subcommands. Tests should cover:
  - Successful pinning and unpinning of a message at a valid index.
  - Error handling when an invalid index is provided (e.g., negative or out of bounds).
  - Cases where the chat history file does not exist, ensuring the appropriate error is output.
  - Verification that the `pinned` property is correctly set or removed in the chat history file.

## README.md Updates

- Update the Chat Command documentation in README.md to include usage examples for the new subcommands:
  ```
  node src/lib/main.js chat pin <index>
  node src/lib/main.js chat unpin <index>
  ```
- Provide a brief description of the feature, emphasizing how pinning helps identify and manage important messages within a chat session.

## Rationale

- **Enhanced Usability:** This feature allows users to quickly flag important messages, making it easier to reference key parts of a conversation.
- **Consistency:** It complements other chat management commands (such as edit, delete, and export) while maintaining the simplicity and file-based persistence model.
- **Mission Alignment:** By improving message management, the feature supports the repository’s mission of providing handy CLI utilities in Node.js with minimalistic yet effective enhancements.
