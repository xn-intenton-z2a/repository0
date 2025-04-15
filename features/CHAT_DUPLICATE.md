# CHAT_DUPLICATE Feature

This feature introduces a new subcommand `duplicate` to the chat CLI utility. When a user invokes the command with a valid message index, the feature duplicates the specified chat message by appending a new message with the same content and the current timestamp to the chat history. This capability is helpful when a user needs to resend or quickly repost an earlier message without manually retyping it.

## Source File Changes (src/lib/main.js)
- Add a new conditional branch under the main `chat` command for the `duplicate` subcommand.
- Validate that the chat history file exists; if not, output an appropriate error message.
- Parse and validate the provided message index (argument index 2). If the index is invalid (negative, not a number, or out-of-bounds), display an error.
- Duplicate the message at the provided index by creating a new message object with the same content and a fresh timestamp.
- Append the duplicated message to the end of the `messages` array and save the updated chat history file.
- Provide console feedback indicating successful duplication (e.g., "Message duplicated successfully.").

## Test File Changes (tests/unit/main.test.js)
- Add unit tests for the `chat duplicate` subcommand:
  - Test that invoking the command with a valid index duplicates the message and appends it to the chat history.
  - Test behavior when the chat history file does not exist, expecting an error message.
  - Test error handling when an invalid index is provided (non-numeric, negative, or out-of-bounds).
  - Verify that the new message’s timestamp is updated to the current time and that its content matches the original message exactly.

## README.md Updates
- Update the Chat Command section in README.md to document the new `chat duplicate` subcommand with example usage:
  ```
  node src/lib/main.js chat duplicate <index>
  ```
- Add a brief description explaining that this command duplicates an existing message from the chat history.

## Rationale
- **Usability:** Quickly duplicate a previous message to resend it without manual re-entry.
- **Efficiency:** Leverage the existing file-based persistence model with minimal modifications to source, tests, and documentation.
- **Alignment:** Continues to build on the repository's mission of providing handy CLI utilities in Node.js while remaining consistent with other chat management commands.
