# CHAT

## Overview
This feature introduces a new CLI command `--chat` which allows users to interact with the Chat Completions API directly from the terminal. By submitting a query via the command line, users receive a generated response from the API. This feature leverages the existing OpenAI dependency and assists in quick testing and prototyping of conversational queries, aligning with the repository’s mission of fostering healthy collaboration and streamlined automation.

## Implementation Details
- **Command Integration:**
  - Add a new flag `--chat` to the CLI command mapping in `src/lib/main.js`.
  - The command accepts a string query as input which will be sent to the Chat Completions API.
- **API Interaction:**
  - Use the OpenAI library to send the provided query to the Chat Completions API.
  - Ensure that the API key is read from the environment variable `CHATGPT_API_SECRET_KEY`.
  - Handle valid responses and potential errors (e.g., network issues, invalid API key) with standardized error messages.
- **Output Handling:**
  - Display the API response as plain text by default or within JSON output mode if the `--json` flags are used.
  - Include relevant metadata (timestamp and execution duration) in JSON mode.
- **Error Handling & Validation:**
  - Validate that a query is provided. If not, return an error message such as "Error: No query provided for chat interaction.".
  - Handle and log errors from the API call without interrupting the CLI’s operation.

## Testing & Documentation
- **Unit Tests:**
  - Write tests simulating valid query submissions and check that a valid response is generated or that the appropriate error is returned when inputs are missing.
  - Test JSON output mode to ensure that metadata is correctly included.
- **Documentation:**
  - Update the README and CLI usage documentation to include examples such as:
    - `node src/lib/main.js --chat "What is the weather today?"`
  - Add inline comments in `src/lib/main.js` where the new command is integrated to document API interaction and error handling.

## Alignment with Repository Mission
This feature strengthens the repository’s goal of providing a modular, single-source file CLI tool that not only performs mathematical and utility tasks but also integrates modern API services. By incorporating a conversational query interface through the Chat Completions API, it promotes experimentation, rapid prototyping, and healthy collaboration among contributors.
