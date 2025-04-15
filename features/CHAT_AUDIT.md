# CHAT_AUDIT Feature

This feature introduces the `chat audit` subcommand for the chat CLI utility. It allows users to review the history of modifications saved in the undo stack. By listing the backup states, users gain insight into previous chat history snapshots prior to modifications, which can help in understanding the sequence of changes and diagnosing issues.

## Overview
- **Subcommand:** `chat audit`
- **Functionality:** Reads the persistent chat history from `.chat_history.json` and, if available, inspects the `_undoStack` property. For each backup in the undo stack, it displays a summary including the session title and the number of messages in that backup. If no backup exists or if the file itself is missing, an appropriate message is shown.
- **Target Files:** Updates will be made in the source file (`src/lib/main.js`), test file (`tests/unit/main.test.js`), and README (`README.md`).

## Source File Changes (src/lib/main.js)
- **New Function:** Add a new function `handleAudit()` that does the following:
  - Check if the chat history file exists; if not, print "No chat history available for audit." and return.
  - Load and parse the chat history file. If an `_undoStack` is not found or is empty, display a message such as "No audit history available.".
  - If the `_undoStack` exists, iterate over its entries and for each backup, print a summary line (for example: "Backup 1: Session 'Session Title', Messages: X").
  - Ensure proper error handling for file read/parse errors.
- **Integration:** In the `main` function, add a new case for the subcommand `audit` which calls `handleAudit()`.

## Test File Changes (tests/unit/main.test.js)
- Add unit tests for the `chat audit` subcommand:
  - Test that if no chat history file exists, executing the audit command results in output "No chat history available for audit.".
  - Test that if a chat history file exists but the `_undoStack` is empty or missing, the command outputs "No audit history available.".
  - Test that if the chat history file contains backups in `_undoStack`, the command outputs a summary for each backup. For example, create a dummy history with an `_undoStack` array containing objects with a `sessionTitle` and `messages` array, then verify that the output includes the expected backup summaries.

## README.md Updates
- Update the Chat Command section to document the new `chat audit` subcommand:
  ```
  node src/lib/main.js chat audit
  ```
- Include a brief description stating that this command provides a review of the undo backup history, summarizing past states of the chat history.

## Rationale
- **Enhanced Transparency:** By exposing the undo stack, users can better understand the sequence of changes made to the chat history.
- **Debugging and Recovery:** This feature can help users diagnose issues by revealing what changes have been captured automatically and when they occurred.
- **Mission Alignment:** It reinforces our mission to provide handy CLI utilities in Node.js by offering deeper insights into the multi-level undo functionality already implemented.
