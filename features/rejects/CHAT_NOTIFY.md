# CHAT_NOTIFY Feature

This feature introduces a new subcommand, `chat notify`, which allows users to toggle desktop notifications for new chat messages. When notifications are enabled, each new chat message received via the chat session will trigger a desktop notification, enhancing user awareness of incoming messages.

## Overview
- **Subcommand:** `chat notify <on|off>`
- **Functionality:**
  - Allows users to enable (`on`) or disable (`off`) desktop notifications for new chat messages.
  - Stores the notification preference in the chat history file by adding a new property, `enableNotifications`.
  - When enabled, the chat session handler will trigger a desktop notification (using the `node-notifier` package) each time a new chat message is appended.
  - Provides appropriate success feedback to the console.

## Source File Changes (src/lib/main.js)
- **Dependency Addition:**
  - Add `node-notifier` as a dependency in `package.json` (e.g., "^10.0.0").
- **New Function - `handleNotify(args)`:**
  - Parse the command argument to check if notifications should be turned on or off.
  - Load or initialize the chat history file.
  - Update (or create) a new property `enableNotifications` with a boolean value (true for "on", false for "off").
  - Write the updated history back to the file and output a confirmation message.
- **Modification in `handleChatSession(args)`:**
  - After appending a new chat message, check if `history.enableNotifications` is true.
  - If true, require and use `node-notifier` to trigger a desktop notification showing the new message content along with a timestamp.
- **Update Main Switch-Case:**
  - Add a new case for "notify" that calls `handleNotify(args)`.

## Test File Changes (tests/unit/main.test.js)
- Add unit tests for the `chat notify` subcommand:
  - **Toggle On:** Test that invoking `chat notify on` sets the `enableNotifications` property to true in the chat history file and outputs a success message.
  - **Toggle Off:** Test that invoking `chat notify off` sets the property to false and outputs a corresponding message.
  - **Notification Trigger:** Optionally, use a spy/mocking mechanism for the `node-notifier` module to verify that when a new chat message is received with notifications enabled, the notify function is called with the expected parameters.

## README.md Updates
- Add documentation for the new `chat notify` subcommand in the Chat Command section:
  ```
  node src/lib/main.js chat notify <on|off>
  ```
- Include a brief explanation that this command toggles desktop notifications for new chat messages, allowing users to be alerted of incoming messages even when not actively monitoring the terminal.

## Rationale
- **Enhanced Awareness:** Enables users to receive real-time desktop notifications for new chat messages, which is especially useful when multitasking or away from the terminal.
- **Improved User Experience:** Provides a simple yet effective way to manage notifications without adding excessive complexity, aligning with the mission of delivering handy CLI utilities in Node.js.
- **Minimal Impact:** The feature only modifies existing files (source, test, README, and package.json) without creating new files, adhering to repository guidelines.
