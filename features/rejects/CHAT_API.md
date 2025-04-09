# CHAT_API

## Overview
The CHAT_API feature integrates Chat Completions (e.g., OpenAI's ChatGPT) into the CLI tool to allow users to supply prompts and receive generated content. In this update, the feature has been enhanced with improved conversation history caching, context continuity, and a dedicated sub-mode to directly generate GitHub issue templates. This makes it easier for users to obtain actionable issue templates or suggestions directly from command line interactions, thereby fostering healthy collaboration and streamlining the issue creation process.

## CLI Integration
- **Command Flag:** The global flag `--chat` triggers the Chat API functionality. An additional sub-command `issue` allows users to generate GitHub issue templates directly. For example:
  - `node src/lib/main.js --chat "Your prompt here"`
  - `node src/lib/main.js --chat issue "Bug: unexpected behavior in module"`

- **Input Parsing:** The CLI reads the prompt text and optionally accepts parameters such as `--max-tokens`, `--temperature`, and the `--chat-session` flag to maintain and incorporate conversation history in subsequent interactions.

## Implementation Details
- **API Integration:**
  - When a prompt is provided, the system checks if conversation history caching is active (via `--chat-session`) and prepends recent interactions for contextual relevance.
  - In `issue` sub-mode, the prompt is further processed to align with GitHub issue formatting guidelines. This includes adding sections such as **Steps to Reproduce**, **Expected Behavior**, and **Actual Behavior** if not already specified by the user.
  - The API call is executed with provided parameters, and the response is parsed and forwarded to the user.

- **Conversation History Caching:**
  - When `--chat-session` is active, the feature caches the last several interactions (e.g., the last 5 exchanges) in an in-memory store. This cached history is automatically included in future API calls to improve context and relevance.
  - The caching mechanism ensures sensitive information is not logged.

- **GitHub Issue Generation:**
  - In `issue` sub-mode, additional formatting logic processes the response to include actionable details suitable for GitHub issues.
  - The generated output includes metadata such as a suggested title, description, and steps to reproduce if applicable.
  - This mode integrates seamlessly with the chat conversation flow, allowing users to iterate on generated issue content.

## Error Handling & Testing
- **Error Reporting:**
  - Provides clear messages for network errors, missing API keys, or invalid user inputs (e.g., an unrecognized sub-command).
  - If the API call fails, the system returns a fallback message that includes any cached conversation context for troubleshooting.

- **Testing & Documentation:**
  - Unit tests simulate API calls and check for correct handling of both standard and `issue` sub-mode prompts, including response formatting and conversation history integration.
  - The README and CLI guides are updated with examples:
    - `node src/lib/main.js --chat "Generate a bug report template"`
    - `node src/lib/main.js --chat issue "Error when clicking button"`
  - Inline comments in the source code highlight the branching logic for handling chat sessions and issue generation mode.

## Alignment with Repository Mission
By enhancing CHAT_API with extended conversation continuity and a dedicated GitHub issue generation mode, this feature empowers users to transition quickly from ideation to actionable tasks. This integration supports the repository’s mission of fostering healthy collaboration and automating practical development workflows within a single, self-contained CLI tool.