# CHAT_REPLY Feature

This feature introduces a new subcommand, `chat reply`, to the CLI chat utility. Users can now reply to an existing chat message without quoting it explicitly. Instead, the reply is linked to the original message using a `replyTo` property in the message object.

## Overview

- **Subcommand:** `chat reply <index> <message>`
- **Functionality:**
  - Validates that the chat history exists and that the specified message index is valid.
  - Checks that a reply message is provided.
  - Creates a new chat message which contains the provided reply text and includes a `replyTo` property that references the index of the original message being replied to.
  - Appends the new reply message to the chat history with the current timestamp.
  - Saves the updated chat history to the persistent file (`.chat_history.json`).

## Source File Changes (src/lib/main.js)

- Add a new conditional branch in the main command handler for the `reply` subcommand. For example:
  ```js
  case "reply":
    handleReply(args);
    break;
  ```
- Implement the `handleReply(args)` function which will:
  - Check if the chat history file exists; if not, output an error message.
  - Parse the chat history and validate the provided index (argument index 2). If the index is invalid (negative or out-of-bounds), display an error.
  - Ensure the reply message (arguments from index 3 and beyond) is provided; if not, show a usage error.
  - Optionally call `backupHistory(history)` to allow undo functionality before modifying the history.
  - Create a new message object with the following structure:
    - `timestamp`: Set to the current date/time in ISO format.
    - `message`: The reply text provided by the user.
    - `replyTo`: The index (or a copy of the original message reference) of the message being replied to.
  - Append the new reply message to the `history.messages` array and write back to the file.
  - Provide console feedback confirming that the reply has been added successfully.

## Test File Changes (tests/unit/main.test.js)

- Add unit tests for the `chat reply` subcommand covering:
  - **Valid Reply:** Test that invoking `chat reply` with a valid index and a reply message appends a new message with a `replyTo` property that matches the original index.
  - **Invalid Index:** Ensure that using an invalid message index results in an appropriate error message.
  - **Missing Reply Message:** Check that if the reply message is missing, the command outputs an error message.

## README.md Updates

- Update the Chat Command documentation to include usage details for the new `chat reply` subcommand. Add an example:
  ```
  node src/lib/main.js chat reply <index> <your reply message>
  ```
- Document that this command allows users to reply to an existing message, creating a relationship between the new reply and the original message, thereby enhancing the conversation flow.

## Rationale

- **Contextual Conversation:** Enables tracking of threaded conversations by linking replies to original messages.
- **Improved Usability:** Provides a simple method to respond to specific messages without the need to manually quote them.
- **Mission Alignment:** This feature adds another handy CLI utility to manage multi-turn chat sessions, in line with the repository’s mission to provide valuable Node.js CLI tools using minimal file modifications.
