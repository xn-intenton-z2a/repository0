# CHAT_STATS Feature

This feature introduces a new subcommand `stats` under the existing `chat` command. When the user executes the command `node src/lib/main.js chat stats`, the CLI will read the `.chat_history.json` file and display a summary of the current chat session. This summary includes the session title and the total number of messages. If no chat history is found, a suitable message is printed.

## Changes in Source File (src/lib/main.js)
- Add a new condition under the `chat` command to handle the `stats` subcommand.
- When `args[1]` is `stats`, the CLI should attempt to read the `.chat_history.json` file.
  - If the file exists, compute and display:
    - The session title
    - The count of messages
  - If the file does not exist, print "No chat history found.".
- Ensure error handling is robust and outputs useful messages if the file content cannot be parsed.

## Changes in Test File (tests/unit/main.test.js)
- Add unit tests to verify the `stats` subcommand functionality:
  - Test that when a valid chat history exists, the returned output includes the correct session title and message count.
  - Test that if no chat history file is present, the CLI outputs the appropriate message.
  - Ensure tests are isolated and do not interfere with existing tests.

## Changes in README.md
- Update the Chat Command section in the README to document the new `stats` option. For example:
  ```
  node src/lib/main.js chat stats
  ```
  This command displays the chat session statistics including the session title and the number of messages in the current chat history.

## Rationale
- Enhances user operability by providing insight into the current chat session.
- Complements the existing chat functionality (chatting, clearing, exporting) by adding a feature to quickly monitor the state of the chat.
- Maintains consistency with the repository's mission to offer handy CLI utilities in Node.js, using single file modifications and simple file-based persistence.

## Implementation Considerations
- Maintain clean separation from existing functionalities to ensure that adding this feature does not affect the core chat functionality.
- All changes should be confined to modifications within the source file, test file, README.md, and dependencies if necessary.
- No new files should be created or existing ones deleted.
