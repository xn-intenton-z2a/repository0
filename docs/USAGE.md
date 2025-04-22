# CLI Usage Examples

This document describes how to use the CLI provided by our repository. The primary command is executed through the Node.js CLI in the file `src/lib/main.js`.

## Usage Examples

1. Running without any arguments (default usage):
   
   Command:
   
       npm run start
   
   Expected output:
   
       Run with: []

2. Running diagnostics:
   
   Command:
   
       npm run diagnostics
   
   Expected output:
   
       Diagnostics: System check initiated.

3. Checking version:
   
   Command:
   
       npm run version
   
   Expected output:
   
       Version: 2.1.0-0

4. Checking for updates:
   
   Command:
   
       npm run check-update
   
   Expected output:
   
       Update check in progress.

5. Passing multiple arguments manually:
   
   Command:
   
       node src/lib/main.js arg1 arg2
   
   Expected output:
   
       Run with: ["arg1","arg2"]

## Notes

- The CLI behavior is adjusted based on the number and value of the arguments provided.
- For a single recognized command (diagnostics, version, check-update), specific messages are logged.
- For all other cases (no arguments or multiple generic arguments), the CLI logs the arguments array as a JSON string.

This covers the CLI usage as verified by unit, integration, and feature tests in our test suite.
