# CHAT_REACT Feature

This feature introduces a new subcommand, `chat react`, to the chat CLI utility. It allows users to add or update a reaction (such as an emoji) on a specific chat message, enhancing the expressiveness of the conversation without modifying the original message text.

## Overview
- **Subcommand:** `chat react <index> <reaction>`
- **Functionality:**
  - Validates that the chat history file exists and that the provided message index is within bounds.
  - Checks that a reaction parameter is provided.
  - Updates the target message by adding or updating a `reaction` property with the supplied reaction
  - Writes the modified chat history back to the persistent storage (.chat_history.json).
  - Provides console feedback upon successful addition or update of the reaction.

## Source File Changes (src/lib/main.js)
- Add a new conditional branch in the main switch-case block to handle the `react` subcommand. For example:
  ```js
  case "react":
    handleReact(args);
    break;
  ```
- Implement the `handleReact(args)` function which performs the following steps:
  - Verify the existence of the chat history file. If not present, output an error.
  - Parse the chat history data. Validate that the given message index (from args[2]) is a valid numeric index within the messages array.
  - Ensure that the reaction (args[3]) is provided; if missing, output a usage error.
  - Update the target message object by adding or updating the `reaction` property with the reaction string.
  - Save the updated history back to the file.
  - Optionally call the `backupHistory(history)` function before making modifications to support undo functionality.

## Test File Changes (tests/unit/main.test.js)
- Add unit tests for the new `chat react` subcommand with scenarios including:
  - Successful reaction update when a valid index and reaction are provided.
  - Error handling when the chat history file does not exist.
  - Error handling for invalid message index (e.g., negative, out-of-range, or non-numeric index).
  - Error when the reaction parameter is missing.
- Use spies to capture console outputs to verify appropriate success or error messages.

## README.md Updates
- Update the Chat Command documentation to include a section for the new `chat react` subcommand.
- Include a usage example:
  ```
  node src/lib/main.js chat react <index> <reaction>
  ```
- Provide a brief explanation that this command allows users to append an emoji or similar indicator to a specified chat message, offering a quick sentiment or reaction without editing the original content.

## Rationale
- **Enhanced Expressiveness:** Users can quickly signal feelings or mark important messages using reactions, which adds a layer of interactive expression.
- **Usability:** The addition of reactions complements existing chat management commands, making the CLI utility more dynamic and versatile.
- **Minimal Changes:** The feature leverages only modifications to the source code, tests, and documentation, in line with repository guidelines.
