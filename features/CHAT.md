# CHAT

## Overview
This feature integrates a chat command into the CLI that leverages the OpenAI API to facilitate interactive, multi-turn conversations. Using persistent conversation storage through a dedicated file (.chat_history.json), this feature ensures context continuity across sessions. It also employs robust input validation through Zod, ensuring that prompts conform to expected formats.

## Implementation
- Add a chat command to the CLI which supports the following:
  - Accepting a prompt via a required `--prompt` argument.
  - Validating the prompt using Zod to enforce non-empty string inputs, with comprehensive error messaging for invalid inputs (including booleans, null, undefined, arrays, objects, symbols, and BigInts).
  - Loading and updating persistent conversation history stored in a `.chat_history.json` file.
  - Dynamically importing and interfacing with the OpenAI API (using the model `gpt-3.5-turbo`), ensuring the environment variable `CHATGPT_API_SECRET_KEY` is set.
  - Appending both the user prompt and the assistant's reply to the conversation history, thereby supporting multi-turn conversations.
  - Comprehensive unit testing covering valid use cases, edge cases, and persistence functionality.

## Usage
- Interact with the chat functionality by running the command:
  ```bash
  node src/lib/main.js chat --prompt "Hello, how are you?"
  ```
- This command will validate the input, load the previous conversation (if any), communicate with the OpenAI API, display the response, and update the conversation history.

## Benefits
- **Interactive Experience:** Provides users with an engaging CLI interface for interacting with advanced language models, supporting a range of conversational scenarios.
- **Persistent Context:** Maintains conversation history across sessions, which enhances the continuity of dialog and overall user experience.
- **Robust Validation:** Uses Zod for input validation, ensuring that command line inputs are strictly validated against expected non-empty string types.
- **Seamless Integration:** Works within the existing modular CLI framework of the repository, complementing other utilities (such as MATH_UTILS) without introducing unnecessary dependencies or complexity.
