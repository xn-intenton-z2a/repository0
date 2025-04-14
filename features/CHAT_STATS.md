# CHAT_STATS Feature

This feature enhances the existing `chat stats` subcommand to provide more insightful analytics of the current chat session. In addition to displaying the session title and the total number of messages (as previously implemented), this update will also output the timestamp of the most recent message, if available.

## Changes in Source File (src/lib/main.js)
- Add a new condition to handle the `stats` subcommand under the `chat` command.
- When the user runs `node src/lib/main.js chat stats`, the CLI will attempt to read the `.chat_history.json` file.
  - If the file exists and is valid JSON, the CLI will report:
    - The session title
    - The total count of messages
    - The timestamp of the last message (if there is at least one message)
  - If no chat history is found or if the message list is empty, a suitable message is printed.
- Maintain robust error handling so that if the chat history file cannot be parsed, appropriate error messages are logged.

## Changes in Test File (tests/unit/main.test.js)
- Update existing unit tests for the `stats` subcommand to also verify that the output includes the last message timestamp when applicable.
- Add tests that simulate scenarios with a valid chat history (including non-empty messages) and with no chat history.
- Ensure that edge cases (e.g., corrupted file content) are handled gracefully.

## Changes in README.md
- Update the documentation in the Chat Command section to reflect the new detail provided by the `stats` command. For example:
  ```
  node src/lib/main.js chat stats
  ```
  This command now displays the session title, the number of messages, and the timestamp of the latest message.

## Rationale
- Provides users with deeper insight into their current chat session by showing not just the count of messages but also the timing information of the latest update.
- Continues the repository mission of offering valuable and handy CLI utilities in a single source file.
- Enhances the consistency and usability of the chat functionality by complementing existing features such as clear and export.

## Implementation Considerations
- All changes will be localized to modifications within the source file, test file, and README.md.
- Ensure backward compatibility with existing usage of `chat stats` by preserving current functionality while adding the new detail.
- Tests should remain isolated and ensure no interference with other functionalities.
