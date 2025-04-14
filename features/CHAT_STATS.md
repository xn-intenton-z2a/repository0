# CHAT_STATS Feature Enhancement

This update extends the existing CHAT_STATS functionality to provide deeper analytics about the chat sessions. In addition to displaying the session title, number of messages, and the timestamp of the last message, the updated feature will now also report:

- The timestamp of the first message
- The total duration of the chat session (difference between the first and last message timestamps)
- The minimum and maximum intervals between consecutive messages

If there is only a single message or invalid/missing timestamps, the new metrics will be omitted and a note about insufficient data will be provided. This enhancement ensures that users receive a comprehensive statistical summary of their chat sessions.

## Source File Changes (src/lib/main.js)
- Add a new branch in the chat command for handling the "stats" subcommand.
- Load and parse the chat history file (.chat_history.json), and extract the session title and messages.
- Compute and display the following metrics:
  - Session Title
  - Total number of messages
  - Timestamp of the first message (if available)
  - Timestamp of the last message
  - Total duration of the session (if two or more messages exist)
  - Minimum and maximum interval between consecutive messages (if applicable)
  - Average interval between messages (as previously implemented)
- Implement robust error handling: if timestamps are invalid or missing, skip the new metrics and notify the user

## Test File Changes (tests/unit/main.test.js)
- Extend the tests for the `chat stats` subcommand:
  - Verify that with multiple messages, the computed first and last timestamps, total duration, min, max, and average intervals are correctly reported.
  - Add tests for cases where only a single message exists, ensuring that extended metrics are omitted with a proper warning about insufficient data.
  - Include tests to simulate invalid or missing timestamps, checking that the feature gracefully handles these edge cases.

## README.md Updates
- Update the Chat Command documentation to include an example for the enhanced `chat stats` subcommand.
- Document the new analytics metrics (first message timestamp, total duration, min and max intervals) in the usage guide.

## Rationale
- This enhancement aligns with our mission to provide handy CLI utilities in Node.js by offering users deeper insights into their multi-turn chat sessions.
- Additional metrics provide more actionable analytics without adding extra complexity to the codebase.
- The changes are fully backwards-compatible, integrating seamlessly with existing functionality, tests, and documentation.
