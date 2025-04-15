# CHAT_SCHEDULE Feature

This feature introduces a new subcommand, `chat schedule`, to the chat CLI utility. It allows users to schedule a message to be appended to the chat history after a specified delay in seconds. This enhancement adds a time-dependent messaging capability, enabling users to plan future contributions to a chat session.

## Overview
- **Subcommand:** `chat schedule <delay_in_seconds> <message>`
- **Functionality:**
  - Validates that the chat history file exists and the delay parameter is a valid positive integer.
  - Uses a timer (via `setTimeout`) to wait for the specified delay, then appends the scheduled message to the chat history.
  - Before appending the new message, the current state is backed up using `backupHistory` to support undo functionality.
  - The new message is appended with the current timestamp once the delay elapses.
  - Provides console feedback indicating that the message is scheduled and notifies when the scheduled message is added.

## Source File Changes (src/lib/main.js)
- Add a new branch in the main command handler for the `schedule` subcommand. For example:
  ```js
  case "schedule":
    handleSchedule(args);
    break;
  ```
- Implement the `handleSchedule(args)` function:
  - Verify that the chat history file exists; if not, output an error message.
  - Parse `args[2]` as the delay in seconds. Validate it is a number greater than 0.
  - Ensure that a message is provided (arguments from index 3 onward); if missing, output a usage error.
  - Inform the user that the message is scheduled to be added after the delay.
  - Use `setTimeout` to wait for the specified delay, then:
    - Backup the existing chat history using `backupHistory(history)`.
    - Append the new message with the current timestamp to `history.messages`.
    - Write the updated chat history back to the file.
    - Output a success message indicating the scheduled message was added.

## Test File Changes (tests/unit/main.test.js)
- Add unit tests for the `chat schedule` subcommand covering scenarios such as:
  - **Valid Schedule:** Invoking `chat schedule` with a valid delay and message schedules the message and, after the delay (using fake timers/spies), the message is appended to the history.
  - **Invalid Delay:** Providing a non-numeric or zero/negative delay should produce an error.
  - **Missing Message:** When the message parameter is missing, an appropriate error is output.

## README.md Updates
- Update the Chat Command documentation to include details and usage example for the new `chat schedule` subcommand. For example:
  ```
  node src/lib/main.js chat schedule <delay_in_seconds> <your message>
  ```
- Document that this command allows users to schedule a message to be added after a specified delay, enabling timed contributions to a chat session.

## Rationale
- **Enhanced Flexibility:** Users can plan messages to be added at a later time, which is useful for reminders or delayed announcements within a chat.
- **Innovation:** This feature sets itself apart from instant chat commands by introducing time-dependent behavior without adding complexity.
- **Mission Alignment:** It continues our commitment to providing handy CLI utilities in Node.js by expanding the chat session’s capabilities with minimal changes to existing files.
