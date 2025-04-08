# CHAT

## Overview
This updated CHAT feature integrates a new CLI command `--chat` which enables users to interact with the Chat Completions API directly from the terminal. This command broadens the repository’s capabilities, allowing rapid prototyping and testing conversational queries, thus aligning with our mission of promoting healthy collaboration and streamlined automation.

## Implementation Details
- **Command Integration:**
  - Update `src/lib/main.js` to add a new flag `--chat` to the command mapping.
  - Ensure that the command accepts a string query parameter. If no query is provided, output a standardized error message.

- **API Interaction:**
  - Utilize the OpenAI library to send the user's query to the Chat Completions API.
  - The API key should be securely read from the environment variable `CHATGPT_API_SECRET_KEY`.
  - Handle successful responses by displaying plain text output by default, or JSON output if the global JSON modes (`--json` or `--json-pretty`) are active.
  - Include additional metadata such as a timestamp and execution duration when in JSON mode.

- **Error Handling & Validation:**
  - Validate that a non-empty query is provided. If not, return an error message like "Error: No query provided for chat interaction.".
  - If the API call fails (e.g., due to network issues or an invalid API key), catch the error and display a standardized error message.

- **Testing & Documentation:**
  - Write unit tests simulating both valid and error scenarios for chat queries.
  - Document usage examples in the README, e.g., `node src/lib/main.js --chat "What is the weather today?"`.
  - Add inline comments within `src/lib/main.js` where the new command is integrated, explaining API interactions and error handling routines.

## Alignment with Repository Mission
This enhancement enriches the repository by adding modern API interaction capabilities to the CLI tool. By offering a quick testing mechanism for Chat Completions, it not only promotes innovative experimentation but also exemplifies the modular, single-file utility approach that is central to our mission.