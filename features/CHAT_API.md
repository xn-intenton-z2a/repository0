# CHAT_API

## Overview
This feature integrates a Chat Completions API (e.g., OpenAI's ChatGPT) into the CLI tool to enable users to supply textual prompts and receive generated content, such as GitHub issue templates or suggestions, directly from the command line. In this update, we've enhanced the original specification by adding conversation history caching and contextual continuity. This allows the CLI to remember previous interactions during a session, improving the relevance of successive prompts. 

## CLI Integration
- **Command Flag:** The global flag `--chat` triggers the Chat API functionality.
- **Input Parsing:** Accepts a text prompt and optional parameters (e.g., `--max-tokens`, `--temperature`). An optional flag `--chat-session` activates conversation history caching for ongoing interactions.
- **Output Modes:** Supports plain text and JSON outputs (`--json`, `--json-pretty`). The CLI also displays conversation context when in session mode.

## Implementation Details
- **API Integration:**
  - Reads the user prompt from the CLI arguments and, if session mode is active, retrieves recent conversation history to prepend context.
  - Calls the Chat Completions API with provided parameters including prompt, max tokens, and temperature.
  - For session mode, caches the conversation (both prompt and response) into an in-memory store that persists throughout the CLI invocation session.
- **Error Handling:**
  - Provides clear error messages for network issues, missing API keys, or invalid inputs.
  - If the API call fails, the tool returns a fallback error message and includes any cached conversation context for troubleshooting.
- **Conversation History Caching:**
  - When `--chat-session` is active, recent interactions are stored temporarily (e.g., the last 5 exchanges) to enable context continuity.
  - The cached history is included in subsequent API calls to provide context and improve answer relevance.

## Testing & Documentation
- **Unit Tests:** 
  - Simulate API calls using mocks to verify functionality in both standard and session modes.
  - Tests cover error handling, correct integration of conversation history, and proper JSON formatting.
- **Documentation:**
  - The README and CLI usage guides are updated with examples such as:
    - `node src/lib/main.js --chat "Generate an issue template for a bug report"`
    - `node src/lib/main.js --chat --chat-session "How do I fix a null pointer error?"`
  - Inline comments in `src/lib/main.js` clarify the integration of conversation caching and session handling.

## Alignment with Repository Mission
By integrating advanced AI capabilities with added session awareness and conversation history caching, the CHAT_API feature empowers users to generate actionable content with improved relevance and context. This enhancement supports the repository’s mission of fostering healthy collaboration and streamlined automation through modular, self-contained CLI utilities.