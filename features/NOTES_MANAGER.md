# NOTES_MANAGER

## Overview
The NOTES_MANAGER feature provides a lightweight note‐taking utility that enables users to quickly save, retrieve, update, delete, and now search personal notes stored persistently in a local JSON file (e.g., `.repository_notes.json`). This updated version adds searchable functionality by allowing users to filter notes based on keywords, matching either the note title or its content. This enhancement fosters better organization and recall of important information, aligning with the repository’s mission of promoting healthy collaboration and streamlined, self-contained utilities.

## CLI Integration
- **Command Flag:** Use the global flag `--notes` to activate the notes management module.
- **Sub-Commands:**
  - **add <title> <content>:** Save a new note with a title and content. Optionally, support a comma-separated list of tags appended to the content.
  - **list:** Display a list of note titles with their creation timestamps.
  - **get <title>:** Retrieve and display full details (title, content, creation date, last modified date) of a note by its title.
  - **update <title> <new_content>:** Modify the content (and optionally tags) of an existing note.
  - **remove <title>:** Delete a note by its title.
  - **search <query>:** Search all notes for the provided keyword. The search examines both titles and content, returning any notes that match the query.

## Implementation Details
- **Data Storage:** Notes are stored in a local JSON file (e.g., `.repository_notes.json`), with each note record including metadata such as title, content, creation timestamp, and last modified timestamp. Optionally, notes may store a list of tags to facilitate categorization.
- **Input Parsing & Validation:** The CLI parser processes sub-commands and validates that required parameters (e.g., note title and content) are provided. For the search command, it ensures a non-empty query is passed.
- **Search Logic:** The search function reads all stored notes and performs case-insensitive matching against the title and content. Matching notes are returned with brief metadata to assist users in quickly finding their desired notes.
- **Error Handling:** Clear error messages are provided if a note is not found (for get, update, or remove) or if required parameters are missing. File I/O errors are handled gracefully with appropriate error notifications.

## Testing & Documentation
- **Unit Tests:** Add tests to cover all sub-commands including the new search functionality. Tests should verify that notes are properly added, retrieved, updated, deleted, and that search queries return accurate results.
- **Documentation:** Update the README and CLI usage guides to include examples such as:
  - Adding a note: `node src/lib/main.js --notes add "Meeting" "Discuss project updates, tags:meeting,project"`
  - Listing notes: `node src/lib/main.js --notes list`
  - Retrieving a note: `node src/lib/main.js --notes get "Meeting"`
  - Updating a note: `node src/lib/main.js --notes update "Meeting" "Discuss timeline and next steps, tags:timeline"`
  - Removing a note: `node src/lib/main.js --notes remove "Meeting"`
  - Searching notes: `node src/lib/main.js --notes search "project"`

## Alignment with Repository Mission
By enabling users to quickly search their notes, the updated NOTES_MANAGER enhances productivity and ease-of-access. This improvement supports agile workflows and fosters healthy collaboration by ensuring that critical documentation and reminders are readily accessible within a single, self-contained CLI tool.