# CHAT_STATS Feature Enhancement

This feature enhances the existing chat functionality with a dedicated "stats" subcommand to provide deeper analytics on chat sessions. It focuses on computing and displaying refined metrics for the conversation stored in the persistent chat history file.

## Overview
- Introduce a new subcommand for chat stats: when users run `node src/lib/main.js chat stats`, the CLI will display the session title, the total number of messages, the timestamp of the latest message, and—if applicable—the average interval (in seconds) between consecutive messages.
- This enhances user insight into the interaction cadence and offers actionable analytics without adding extraneous complexity.

## Changes in Source File (src/lib/main.js)
- Add a new conditional branch for the "stats" subcommand (i.e., when `args[1] === "stats"`).
- On invoking `chat stats`, load and parse the `.chat_history.json` file.
- Extract the `sessionTitle` and the `messages` array from the chat history.
- Compute the last message timestamp and if there is more than one message, calculate the average interval between consecutive messages (using standard JavaScript date parsing methods).
- Print out the following details to the user:
  - Session Title
  - Total number of messages
  - Timestamp of the last message
  - Average interval between messages (only if two or more valid messages exist; otherwise, omit this metric and note insufficient data).
- Implement robust error handling: if any timestamp is missing or unparseable, skip the average interval calculation and notify the user about the incomplete data.

## Changes in Test File (tests/unit/main.test.js)
- Add new tests to simulate chat histories for the `chat stats` functionality:
  - One test should ensure that when only one message exists, no average interval is reported.
  - Additional tests should create a chat history with multiple messages and verify that the average interval is computed correctly using known timestamps.
  - Cover edge cases where timestamps are invalid or missing to verify graceful error handling.

## Changes in README.md
- Update the Chat Command documentation to include usage of the new `chat stats` subcommand.
- Provide an example command and briefly describe the analytical output provided (including the computed average interval).

## Rationale
- This update delivers enhanced visibility into the dynamics of chat sessions, empowering users to better understand the flow of communication.
- Aligns with the repository's mission to develop handy CLI utilities in Node.js by extending the functionality within a single source file.
- Ensures the additional analytics are implemented in a straightforward manner that integrates seamlessly with existing code, tests, and documentation.
