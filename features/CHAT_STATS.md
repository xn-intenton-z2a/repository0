# CHAT_STATS Feature Enhancement

This update extends the existing CHAT_STATS functionality to provide deeper analytics about the chat sessions. In addition to displaying the session title and the total number of messages, this enhancement will compute and display new metrics:

- **First Message Timestamp:** The timestamp of the very first message in the session.
- **Last Message Timestamp:** The timestamp of the most recent message in the session.
- **Total Duration:** The difference between the first and last message timestamps (if at least two messages exist).
- **Minimum and Maximum Intervals:** The smallest and largest time gaps between consecutive messages.

When only a single message is present or if timestamps are missing/invalid, the additional metrics will be omitted and an appropriate informational note will be displayed.

## Source File Changes (src/lib/main.js)
- Update the `handleStats` function to:
  - Load and parse the chat history from `.chat_history.json`.
  - Compute the following metrics:
    - Extract the timestamp of the first and last messages.
    - Calculate the overall duration (if applicable).
    - Iterate through messages to compute all intervals and then determine the minimum and maximum intervals.
  - Display the computed metrics alongside the session title and the total number of messages.
  - Implement error handling to manage cases where there is insufficient data or invalid timestamps.

## Test File Changes (tests/unit/main.test.js)
- Extend existing tests for the `chat stats` subcommand:
  - Add tests to verify that for a session with multiple messages, all metrics (first timestamp, last timestamp, duration, min/max intervals) are accurately computed and displayed.
  - Include edge case tests where there is only one message or timestamps are missing/invalid, ensuring that the additional metrics are omitted and a proper note is output.

## README.md Updates
- Update the Chat Command documentation to include details about the extended `chat stats` subcommand.
- Provide usage examples and document the new metrics:
  ```
  node src/lib/main.js chat stats
  ```
- Explain that when additional data is available, the summary will now also list the first and last message timestamps, total duration, and the minimum and maximum intervals between messages.

## Rationale
- **Enhanced Analytics:** The new metrics give users a more comprehensive understanding of their chat session dynamics.
- **Improved User Experience:** Users can quickly assess the flow and timing of conversations with minimal overhead.
- **Mission Alignment:** This improvement aligns with our mission to enhance handy CLI utilities in Node.js by offering more actionable insights without adding unnecessary complexity.
