# CHAT_PRIORITY Feature

This feature introduces a new subcommand `chat priority` that allows users to assign a priority level to an existing chat message. The priority level helps in highlighting messages that are urgent or require special attention. The allowed levels are `high`, `medium`, and `low`.

## Overview

- **Subcommand:** `chat priority <index> <level>`
- **Functionality:**
  - Validates that the chat history file exists.
  - Parses the chat history and validates the provided message index is within bounds.
  - Checks that a priority level is supplied and that it is one of `high`, `medium`, or `low` (case-insensitive).
  - Backs up the current chat history using the existing `backupHistory` function.
  - Updates the target message by adding or updating a new property `priority` with the provided level (normalized to lowercase).
  - Saves the updated chat history back to the file and outputs a confirmation message.

## Source File Changes (src/lib/main.js)

- Add a new case in the main command switch to handle the `priority` subcommand:
  ```js
  case "priority":
    handlePriority(args);
    break;
  ```

- Implement the `handlePriority(args)` function with the following steps:
  - Check if the chat history file exists. If not, output an error message.
  - Parse the chat history file and validate that `args[2]` (the message index) is a valid number and within the appropriate bounds.
  - Validate that `args[3]` (the priority level) is provided and is one of `high`, `medium`, or `low`; if not, output an error message specifying the valid options.
  - Call `backupHistory(history)` to create a backup before making changes.
  - Assign the normalized (lowercase) priority level to the target message: `history.messages[index].priority = level`.
  - Write the updated history back to the file and display a message such as "Priority set for message at index X.".

## Test File Changes (tests/unit/main.test.js)

- Add unit tests for the `chat priority` subcommand:
  - Test that invoking `chat priority` with a valid index and a valid priority level (e.g., "high") updates the message with the correct `priority` property.
  - Test error handling when the chat history file does not exist.
  - Test error outputs when the provided message index is invalid (non-numeric, negative, or out-of-bound).
  - Test error output when the priority level is missing or not one of the allowed values.
  - Use spies on console outputs to verify that success or error messages are correctly logged.

## README.md Updates

- Update the Chat Command documentation section by adding the following usage example:
  ```
  node src/lib/main.js chat priority <index> <high|medium|low>
  ```
- Include a brief explanation that this command allows users to mark a message with a priority level, aiding in the organization of important or urgent messages.

## Rationale

- **Enhanced Message Management:** By assigning priority levels, users can easily flag messages that need special attention.
- **Usability:** Complements existing functions such as edit, delete, and pin by adding an extra layer of message metadata without significant complexity.
- **Mission Alignment:** This feature supports the repository’s mission of building handy CLI utilities in Node.js with minimal file modifications by extending and refining chat session functionalities.