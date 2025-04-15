# CHAT_REPLAY Feature

This feature introduces a new subcommand, `replay`, to the chat CLI utility. The `chat replay` command reads the stored chat history and re-displays each message in sequence. This allows users to review past interactions in the order they occurred.

## Overview
- **Subcommand:** `chat replay`
- **Functionality:** Reads the `.chat_history.json` file (if present) and prints each message to the console one by one in the order they were recorded. If no chat history exists, a suitable informational message is shown.
- **Purpose:** Helps users quickly review the conversation flow without manually searching through the history.

## Source File Changes (src/lib/main.js)
- Add a new conditional branch for the `replay` subcommand under the main `chat` command.
- Check if the chat history file exists. If not, output "No chat history available for replay.".
- If the file exists, parse the chat history and iterate over the messages array.
- For each message, print its timestamp and content in a readable format.
- Ensure that error handling is in place in case of file access or parsing errors.

## Test File Changes (tests/unit/main.test.js)
- Add unit tests for the following scenarios:
  - When the `chat replay` command is executed and no chat history exists, confirm that the output indicates the absence of history.
  - When chat history exists, verify that invoking `chat replay` outputs all messages in the correct order. Use spies on console.log to capture the output.
  - Include tests for verifying the formatting of each replayed message (e.g., timestamp and message content are present).

## README.md Updates
- Update the Chat Command section to document the new `chat replay` subcommand. Example usage:
  ```
  node src/lib/main.js chat replay
  ```
- Add a brief explanation that this command replays the chat history, displaying each message in order.

## Rationale
- **Enhanced Usability:** Allows users to review the conversation context easily without manually inspecting the JSON history.
- **Consistency:** Complements existing chat functionalities (stats, undo, filter, edit, clear) by addressing the review stage of the conversation.
- **Simplicity:** Implements replay functionality with minimal changes to the existing single source file structure.

## Implementation Considerations
- Ensure that the new branch in the source file does not conflict with other subcommands.
- Maintain clear and consistent error handling for non-existent history files and JSON parsing issues.
- Follow existing code style and documentation standards as per CONTRIBUTING.md.
