# CHAT_REACT Feature

This feature introduces a new subcommand, `chat react`, to the chat CLI utility. Users can now annotate a specific chat message with a reaction (for example, an emoji) by specifying the message index and the reaction. The enhanced functionality helps users quickly mark messages for later attention or convey additional sentiment without altering the original message content.

## Overview
- **Subcommand:** `chat react <index> <reaction>`
- **Functionality:**
  - Validates that the chat history exists and that the provided message index is valid.
  - Adds or updates a `reaction` property on the specified message with the provided reaction (e.g., 👍, ❤️, 😄).
  - Saves the updated chat history to the persistent file (`.chat_history.json`).
- **Files Affected:**
  - Source file: `src/lib/main.js`
  - Test file: `tests/unit/main.test.js`
  - Documentation: `README.md`

## Source File Changes (src/lib/main.js)
- Add a new function or conditional branch to handle the `react` subcommand. For example:
  - Check if the chat history file exists; if not, output an error message.
  - Parse the provided index from the command arguments and validate it against the length of the messages array.
  - Retrieve the reaction parameter and verify it is provided; if missing, output a usage error.
  - Update the targeted message's object by adding (or updating) a property called `reaction` with the reaction string.
  - Save the updated history back to the file.
  - Provide console feedback confirming that the reaction was added successfully.

## Test File Changes (tests/unit/main.test.js)
- Add new tests for the `chat react` subcommand:
  - Test that invoking `chat react` with a valid index and reaction updates the message correctly.
  - Test error handling for scenarios where no chat history exists, the index is invalid, or the reaction parameter is missing.
  - Verify that after adding a reaction, subsequent listing commands show the updated message with the reaction.

## README.md Updates
- Update the Chat Command documentation to include details for the new `chat react` subcommand.
  - Provide a usage example such as:
    ```
    node src/lib/main.js chat react <index> <reaction>
    ```
  - Explain that this command adds a reaction (e.g., an emoji) to the specified chat message without modifying the original text.

## Rationale
- **Enhanced Expressiveness:** Allows users to annotate messages with quick reactions, adding a visual layer of sentiment.
- **Usability:** Enhances the interactive experience by enabling users to mark important or noteworthy messages.
- **Mission Alignment:** Extends the capabilities of our handy CLI utilities within a single, cohesive source file without adding unwanted complexity.
