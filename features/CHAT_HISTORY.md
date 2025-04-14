# Overview
This feature enhances the existing chat command by adding a "history" subcommand. When invoked, the chat history is read from the persistent file and displayed in a human-readable summary format on the console. This improves usability by allowing users to quickly review past chat messages without needing to export them to a separate file.

# Implementation Details
- Update the source file (src/lib/main.js) to include a new branch for the "chat history" command (i.e., when `args[0]` is "chat" and `args[1]` is "history").
- Read the existing chat history from `.chat_history.json`. If the file exists, format and print the session title and a list of messages including their timestamps.
- If the file does not exist or fails to load, display an appropriate message indicating that there is no chat history available.
- Maintain compatibility with the current CLI structure and ensure minimal changes to existing functionality.

# Testing
- Update the unit test file (tests/unit/main.test.js) to add tests that validate the new output for the "chat history" command.
- Test cases should include scenarios where the chat history exists and where it does not, ensuring proper formatting and error handling.

# Documentation
- Update the README file to document the new "chat history" command. Include usage examples, such as:
  ```sh
  node src/lib/main.js chat history
  ```
- Add a description of the feature and instructions on how it enhances user experience.

# Dependencies
- This feature only modifies the source code, tests, and documentation. No additional dependencies are required.

# Conclusion
This enhancement brings added value by providing immediate feedback on past conversations, aligning with the repository's mission of offering handy CLI utilities in Node.js.