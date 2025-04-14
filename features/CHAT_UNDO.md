# CHAT_UNDO Feature

This feature introduces a new subcommand, `undo`, for the chat CLI utility. The purpose of the `chat undo` command is to remove the last appended message from the persistent chat history file (`.chat_history.json`). This functionality helps users quickly revert accidental entries or unwanted messages without having to manually edit the file.

## Overview

- **Subcommand:** `chat undo`
- **Functionality:** Removes the most recent message from the chat history. If there are no messages or the history file does not exist, an informative message is displayed.

## Source File Changes (src/lib/main.js)

- Add a new conditional branch within the `chat` command to check for the `undo` subcommand.
- Check if the chat history file exists. If not, output a message stating "No chat history available."
- If the file exists, parse the chat history and verify that at least one message is present.
  - If messages exist, remove the last message from the array and write the updated history back to the file. Display a confirmation message such as "Last message undone." 
  - If no messages remain after attempting to undo, notify the user with "No messages to undo." 

## Test File Changes (tests/unit/main.test.js)

- Add unit tests covering the following scenarios:
  - When the `chat undo` command is invoked and no chat history exists, the command outputs the appropriate message.
  - When chat history exists and contains one or more messages, verify that invoking `chat undo` removes the last message and updates the history file accordingly.
  - Test the case where multiple undo operations are performed until no messages remain, ensuring that the appropriate message is shown once all messages are undone.

## README.md Updates

- Update the documentation in the Chat Command section to include usage of the new `chat undo` subcommand. Example:
  ```
  node src/lib/main.js chat undo
  ```
- Document that this command removes the last appended message from the chat history, allowing users to easily revert accidental entries.

## Rationale

- **User Mistakes:** Allows users to quickly fix mistakes by reverting the last chat message.
- **Simplicity:** Enhances the existing chat functionality with minimal changes to the codebase, without adding new files.
- **Consistency:** Supports the repository's mission by providing a handy and simple CLI utility in Node.js.
