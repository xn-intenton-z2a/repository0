# CHAT_SUMMARY Feature

This feature introduces the `chat summary` subcommand to the chat CLI utility. Unlike `chat stats` which provides numerical metrics, the `chat summary` command offers a concise textual recap of a chat session. It extracts key points from the conversation to narratively summarize the session.

## Overview

- **Subcommand:** `chat summary`
- **Functionality:** Reads the persistent chat history from `.chat_history.json` and produces a short, textual summary. The summary includes the session title, the first and last messages as representative anchors, and the total number of messages exchanged. In cases where the chat history is missing or empty, an appropriate message is displayed.
- **Purpose:** Enables users to quickly grasp the context and evolution of their conversation without reviewing every message, complementing the numeric details provided by `chat stats`.

## Source File Changes (src/lib/main.js)

- Add a new branch to handle the `chat summary` subcommand under the main `chat` command.
- Check if the chat history file exists. If it does not, output "No chat history available for summary.".
- If the file exists, parse the JSON data:
  - If there are no messages, display "Chat history is empty. No summary available.".
  - If messages exist, extract the first and last messages and compute the total count.
  - Construct a summary text in the following format:
    - "Session '<sessionTitle>' started with: '<first message>' and ended with: '<last message>'. A total of <number> messages were exchanged."
- Print the generated summary to the console.

## Test File Changes (tests/unit/main.test.js)

- Add unit tests to cover:
  - Invoking `chat summary` when no chat history file exists: Expect output "No chat history available for summary.".
  - Invoking `chat summary` when the chat history exists but contains no messages: Expect output indicating that no summary is available.
  - Invoking `chat summary` when the chat history contains messages: Verify that the output includes the correct session title, first message, last message, and total message count.

## README.md Updates

- Update the documentation in the Chat Command section to include an explanation and usage example for the new `chat summary` subcommand.
- Example usage:
  ```
  node src/lib/main.js chat summary
  ```
- Document that this command provides a textual recap of the entire chat session.

## Rationale

- **Enhanced User Experience:** Provides users with an accessible overview of their conversation, simplifying long chat histories.
- **Complementary Functionality:** Works in tandem with existing features such as `chat stats` and `chat replay`, rounding out the suite of chat management tools.
- **Mission Alignment:** Realizes the repository's mission to offer handy and compact CLI utilities in Node.js by summarizing multi-turn conversations in a concise way.
