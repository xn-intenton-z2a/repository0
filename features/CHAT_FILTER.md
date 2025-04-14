# CHAT_FILTER Feature

This feature introduces a new subcommand, `filter`, in the chat utility. With this update, users can search through their stored chat history for messages that include a specific keyword. This addition provides enhanced usability by quickly identifying relevant parts of a chat session, aligning with our mission of providing handy CLI utilities in Node.js.

## Overview

- **Subcommand**: `chat filter <keyword>`
- **Functionality**: Searches the conversation history for messages containing the specified keyword and displays them. If no keyword is provided or no matches are found, appropriate messages are displayed.
- **Target Files**: The update modifies the source file (`src/lib/main.js`), test file (`tests/unit/main.test.js`), and README (`README.md`).

## Source File Changes (src/lib/main.js)

- Add a new conditional branch under the 'chat' command to handle the `filter` subcommand.
- Validate that the keyword (argument index 2) is provided; if not, output an error message guiding the user.
- Load and parse the `.chat_history.json` file if it exists. If the file does not exist, notify the user that there is no chat history available.
- Filter the messages in the chat history that include the specified keyword (case-insensitive search).
- Display the filtered messages. If no messages match, display a message stating that no matches were found.

## Test File Changes (tests/unit/main.test.js)

- Add unit tests for the following scenarios:
  - When the `filter` subcommand is run without a keyword, expect an appropriate error message.
  - When the chat history file does not exist, ensure the command outputs the message indicating no available history.
  - When the chat history exists and contains messages matching the keyword, verify that the correct messages are displayed.
  - When the chat history exists but no messages match the keyword, verify that a "no matches found" message is output.

## README.md Updates

- Document the new `chat filter` subcommand in the Chat Command section, including usage examples:
  ```
  node src/lib/main.js chat filter <keyword>
  ```
- Explain that this command will search the persistent chat history for messages containing the specified text and display them.

## Rationale

- Enhances user experience by enabling quick search within chat history.
- Provides a valuable and distinct functionality not covered by existing features.
- Aligns with the repository's mission to add useful and compact CLI utilities in Node.js.
- Ensures minimal changes by updating only the relevant files (source, tests, README), making it efficient and maintainable.
