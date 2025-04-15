# CHAT_REACT Feature

This feature introduces a new subcommand, `chat react`, to the chat CLI utility. It allows users to add an emoji reaction or similar indicator to an existing chat message without modifying its original content. The reaction is stored within the message object as a new `reaction` property.

## Overview

- **Subcommand:** `chat react <index> <reaction>`
- **Functionality:**
  - Verifies that the chat history file exists.
  - Parses the chat history and validates that the provided message index is within bounds.
  - Ensures that a reaction parameter is supplied; if not, outputs a usage error.
  - Updates the target message by adding or updating a `reaction` property with the provided reaction string.
  - Backs up the current chat history using the `backupHistory` function before making modifications.
  - Saves the updated history back to the file and outputs a confirmation message.

## Source File Changes (src/lib/main.js)

- **New Branch in Command Switch:**
  - Add a new case for the `react` subcommand in the main switch-case block:
    ```js
    case "react":
      handleReact(args);
      break;
    ```

- **New Function Implementation:**
  - Implement `handleReact(args)` with the following steps:
    - Check if the chat history file exists; if not, log an error and return.
    - Parse the chat history from the `.chat_history.json` file.
    - Validate that `args[2]` (the message index) is a valid number and within the messages array length. If invalid, output an error message.
    - Validate that `args[3]` (the reaction) is provided. If missing, output a usage error.
    - Call `backupHistory(history)` to create a backup of the current state.
    - Update the target message object by setting `history.messages[index].reaction = args[3]`.
    - Write the modified history back to the file.
    - Log a confirmation message indicating that the reaction has been added or updated.

## Test File Changes (tests/unit/main.test.js)

- **Add Unit Tests for `chat react`:**
  - Test that invoking `chat react` with a valid index and reaction updates the target message with the correct `reaction` property.
  - Test error handling when the chat history file does not exist.
  - Test error handling when the provided message index is invalid (non-numeric, negative, or out-of-range).
  - Test error message output when no reaction parameter is provided.
  - Use spies to capture console outputs and verify that success or error messages are correctly logged.

## README.md Updates

- **Documentation Update:**
  - Add a section in the Chat Command documentation describing the new `chat react` subcommand.
  - Usage example:
    ```
    node src/lib/main.js chat react <index> <reaction>
    ```
  - Include a brief explanation that this command allows users to add an expressive reaction (such as an emoji) to an existing message, enriching the interaction without changing the original content.

## Rationale

- **Enhanced Expressiveness:** Allows users to quickly react to messages, adding an extra layer of communication without editing the original message.
- **Usability:** Complements other message modification commands (edit, delete, etc.) while keeping modifications lightweight.
- **Minimal Impact:** Only minimal changes are required in existing files (source, tests, and README), ensuring consistency with repository guidelines and maintaining overall simplicity.
