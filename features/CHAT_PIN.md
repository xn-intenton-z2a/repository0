# CHAT_PIN Feature

This feature introduces two new subcommands, `pin` and `unpin`, to the chat CLI utility. It allows users to mark a specific chat message as pinned, thereby highlighting or prioritizing that message in subsequent operations such as export, summary, or replay. Pinned messages remain flagged in the persistent chat history file and can be unpinned at a later time.

## Overview

- **Subcommands:**
  - `chat pin <index>`: Marks the chat message at the given index as pinned.
  - `chat unpin <index>`: Removes the pinned status of the chat message at the given index.

- **Functionality:**
  - When a message is pinned, an additional property (e.g., `pinned: true`) is added to the message object in the `.chat_history.json` file.
  - The unpin command removes or resets this property.
  - Appropriate error handling is provided if the index is invalid or if the chat history file does not exist.

## Source File Changes (src/lib/main.js)

- Add a new conditional branch within the `chat` command to handle the `pin` subcommand:
  - Validate that a chat history file exists and can be read.
  - Parse the provided index (e.g., argument index 2) and check if it is valid.
  - Set a new `pinned` property to `true` on the specified message.
  - Write the updated history back to the file and log a confirmation message (e.g., "Message at index X pinned.").

- Similarly, add another branch for the `unpin` subcommand:
  - Validate that the chat history file exists and parse the index.
  - Remove the `pinned` property or set it to `false` for the specified message.
  - Write the updated history back to the file and log a confirmation message (e.g., "Message at index X unpinned.").

- Ensure that both commands include robust error handling for cases where:
  - The chat history file does not exist.
  - The provided index is out of bounds or invalid.
  - The chat history file cannot be read or written.

## Test File Changes (tests/unit/main.test.js)

- Add unit tests for the new `chat pin` subcommand:
  - Setup a chat history file with one or more messages and test that invoking `chat pin <index>` correctly updates the message with a new `pinned` property set to `true`.
  - Verify that the command outputs the correct confirmation message.
  - Include tests to simulate invalid indices and ensure the error messages are correct.

- Add unit tests for the `chat unpin` subcommand:
  - Create a scenario where a message is pinned, then invoke `chat unpin <index>` and check that the `pinned` property is removed or set to `false`.
  - Test error cases similarly when the index is invalid or the chat history file is missing.

## README.md Updates

- Update the Chat Command section to include the new `pin` and `unpin` commands with usage examples. For example:
  ```
  node src/lib/main.js chat pin <index>
  node src/lib/main.js chat unpin <index>
  ```
- Document that these commands allow users to flag important messages and later remove the flag.

## Rationale

- **Enhanced Usability:** Pinning messages helps users to mark important parts of the conversation for quick reference.
- **Consistency:** This feature complements existing chat management commands (such as edit, delete, and export) without adding new files or complex dependencies.
- **Mission Alignment:** The enhancement aligns with our mission to add handy CLI utilities by providing additional control over chat history management.
