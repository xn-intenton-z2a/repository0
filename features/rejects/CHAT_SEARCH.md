# CHAT_SEARCH Feature

## Overview
This feature adds a new subcommand `search` under the `chat` command. It enables users to search through their stored chat history for messages that contain a specified keyword. The search is performed case-insensitively and displays matching messages along with their timestamps.

## Implementation Details
- Update the source file (`src/lib/main.js`) to include a new branch for handling `chat search <keyword>` command.
- When the `search` subcommand is invoked, the program should:
  - Check for the existence of the chat history file (`.chat_history.json`).
  - Load the chat history, and if it exists, filter the messages based on the provided keyword (case-insensitive match).
  - Display the matching messages in a clear, human-readable format, including message timestamps.
  - If the chat history file does not exist or no messages match the search query, display an informative message to the user.
- Ensure that the new functionality integrates seamlessly with the existing chat commands such as session management and export.

## Testing
- Modify the unit test file (`tests/unit/main.test.js`) to add tests for the following scenarios:
  - The chat history exists and contains messages matching the keyword.
  - The chat history exists but no messages match the provided keyword.
  - The chat history file does not exist.
- Validate that the output is formatted correctly and includes relevant information such as timestamps for matching messages.

## Documentation
- Update the `README.md` file to document the new `chat search` command with usage examples, e.g.,
  ```sh
  node src/lib/main.js chat search <keyword>
  ```
- Briefly explain the purpose and benefits of the search capability as an extension to the persistent multi-turn conversation feature.

This enhancement furthers the repository's mission of providing valuable and handy CLI utilities by allowing users to efficiently filter and review their chat history.