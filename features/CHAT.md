# CHAT

## Overview
This update enhances the existing CHAT feature by maintaining an optional conversation context. In addition to the current functionality that sends a single query to the Chat Completions API and displays immediate responses, the feature now supports a multi-turn conversational mode. Users can choose to engage in an interactive session where past messages are preserved and sent along with new queries, yielding more contextually accurate responses.

## CLI Integration
- **Command Addition:** The `--chat` CLI flag remains available. A new optional flag `--context` can be provided to enable conversation mode. When `--context` is active, the session will maintain a conversation history in memory.
- **Interactive Mode:** In context mode, after the initial query is processed, the CLI remains open for further input, displaying a prompt (e.g., `chat>`) for subsequent queries. Users can type new messages which will be appended to the conversation history.
- **Session Termination:** Typing an exit command (such as `exit` or `quit`) will end the conversation and clear the history.

## API Interaction
- **Single Query Mode:** As before, when no conversation context is supplied, the command sends a standalone query to the Chat Completions API, reading the API key from the environment variable `CHATGPT_API_SECRET_KEY` and formatting the response appropriately (plain text or JSON with metadata).
- **Contextual Request Handling:** In conversation mode, the API call now includes an array of message objects representing the conversation history along with the latest query. This ensures that responses are generated with awareness of prior exchanges.
- **Response Formatting:** The response is displayed in plain text or JSON, including additional metadata (timestamp, execution duration) in JSON mode. The conversation mode also echoes the previous conversation to help users track context.

## Error Handling & Validation
- **Input Validation:** The command validates that a non-empty query is provided. If no query is given, a standardized error message is output.
- **API Errors:** Network issues or invalid API keys are caught and reported with clear error messages. When in conversation mode, if an error occurs, the session will prompt the user to either fix the issue or exit.

## Testing & Documentation
- **Unit Tests:** New tests simulate multi-turn interactions and verify that conversation history is maintained and correctly passed to the API. Both valid and error responses in context mode are tested.
- **Documentation:** Update the README to include usage examples, such as:
  - Single Query Mode: `node src/lib/main.js --chat "What is the weather today?"`
  - Conversation Mode: `node src/lib/main.js --chat --context "Tell me a joke"`, followed by additional inputs at the prompt.
- **Inline Comments:** In `src/lib/main.js`, comments explain the new conversation logic and how the conversation history is managed.

## Alignment with Repository Mission
By enabling a conversational context, this update enriches the CHAT feature to support interactive, multi-turn dialogues. This improvement promotes a more engaging user experience while reinforcing the mission of healthy collaboration and streamlined automation in a modular, single-file utility.
