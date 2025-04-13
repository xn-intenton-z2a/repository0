# CHAT

## Overview
This feature integrates a chat command into the CLI that leverages the OpenAI API to facilitate interactive, multi-turn conversations. It uses persistent conversation storage through a dedicated file (.chat_history.json) to maintain context across sessions, robust input validation through Zod, and dynamically imports the OpenAI API. In this update, an interactive mode is introduced. If no prompt is provided via the CLI flag, the CLI will fall back to an interactive prompt mode allowing continuous user input until an exit command is received.

## Implementation
- **Command Options:**
  - Accepts a required `--prompt` argument for single message interactions, or, when omitted, triggers interactive mode where the CLI continuously prompts the user for input.
  - Provides options to configure conversation archival (`--auto-archive-threshold`), auto-summarization (`--max-history-messages`, `--recent-messages`, `--summarization-prompt`), and model parameters (`--model`, `--temperature`).
- **Persistent Conversation History:**
  - Loads and updates conversation history from/to `.chat_history.json`, ensuring context is maintained across sessions.
  - Automatically triggers auto-summarization when the number of messages exceeds a configurable threshold, and auto-archives when exceeding the archival threshold.
- **Interactive Mode Enhancements:**
  - When no prompt argument is provided, the feature enters interactive mode by reading user input from STDIN in a loop.
  - Provides clear instructions and an exit command (e.g., typing `exit`) to end the interactive session.
  - All messages continue to be validated using Zod and appended to the conversation history.
- **Error Handling and Debugging:**
  - Incorporates robust error handling via a helper function to ensure errors are logged consistently. When verbose mode is enabled, additional debugging information is provided.

## Usage
- **Single Message Mode:**
  ```bash
  node src/lib/main.js chat --prompt "Hello, how are you?"
  ```
- **Interactive Mode:**
  ```bash
  node src/lib/main.js chat
  ```
  When executed without the `--prompt` flag, the CLI will prompt the user for input repeatedly until termination (e.g., by typing `exit`).

## Benefits
- **Flexible Interaction:** Users can choose between single prompt mode and an interactive session without leaving the CLI.
- **Persistent Context:** Conversation history is maintained across sessions, ensuring dialog continuity.
- **Enhanced Error Handling:** Input validation via Zod and consistent error reporting ensure a robust user experience.
- **Seamless Integration:** Works within the existing modular CLI framework and complements other utilities like MATH_UTILS without additional overhead.