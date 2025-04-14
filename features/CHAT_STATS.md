# CHAT_STATS Feature

This update enhances the existing `chat stats` subcommand by providing additional analytics on the current chat session. In addition to displaying the session title, total message count, and the timestamp of the last message, this update computes the average interval between consecutive messages when there are at least two messages in the chat history.

## Changes in Source File (src/lib/main.js)
- Update the logic for handling the `chat stats` subcommand to include the following:
  - After reading and parsing `.chat_history.json`, check if the messages array contains more than one message.
  - If so, parse the `timestamp` of each message and compute the average time interval (in seconds) between successive messages.
  - Append the computed average interval in the CLI output along with the existing session title, message count, and last message timestamp.
  - Maintain robust error handling: if any timestamp is missing or cannot be parsed, the average interval calculation is skipped, and a note is printed about incomplete data.

## Changes in Test File (tests/unit/main.test.js)
- Extend the unit tests for the `chat stats` subcommand:
  - Add tests that simulate chat histories with exactly one message to ensure no average interval is reported.
  - Add tests that simulate chat histories with multiple messages so that the calculated average interval is validated (e.g., using known timestamps and computed expected interval).
  - Ensure tests also cover edge cases, such as when a message's timestamp is in an invalid format.

## Changes in README.md
- Update the Chat Command documentation to mention that the `chat stats` command now also reports the average interval between messages when applicable.

## Rationale
- This enhancement provides users with deeper and more actionable insights into their chat sessions, enabling them to understand the cadence of interactions.
- It aligns with the repository’s mission to offer valuable CLI utilities in Node.js by extending the functionality within a single source file without adding extraneous complexity.

## Implementation Considerations
- Ensure the additional computation does not introduce performance overhead, particularly for small to moderate-sized chat histories.
- Use standard JavaScript date parsing methods to compute time differences and gracefully handle any irregularities in data formatting.
