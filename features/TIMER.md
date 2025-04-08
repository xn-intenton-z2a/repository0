# TIMER

## Overview
This feature introduces a new CLI command `--timer` that allows users to set a countdown timer directly within the CLI tool. Users provide the timer duration in seconds, and the tool waits for that duration before notifying the user that time is up. This feature can be useful for scheduling, reminders, and time management in automated workflows.

## Implementation Details
- **Command Integration:**
  - Add a new flag `--timer` in the CLI command mapping in `src/lib/main.js`.
  - The command expects a single numeric argument representing the duration in seconds. If the input is missing or if more than one argument is provided, the command returns a standardized error message.

- **Timer Logic:**
  - Validate that the provided input is a positive number. If the input is invalid, output an error message: "Error: Invalid timer duration provided.".
  - Use JavaScript's `setTimeout` to implement the countdown. Once the timer completes, output a message such as "Timer finished!".
  - In non-JSON mode, simply print the message to the console. In JSON mode, structure the output to include metadata such as the scheduled duration, a timestamp at completion, execution duration, and the input echo.

- **Error Handling & Validation:**
  - Ensure the command properly handles cases with missing, extra, or non-numeric inputs by issuing clear error messages.
  - Create unit tests that mock `setTimeout` to simulate timer functionality and verify that both plain text and JSON outputs are produced correctly.

## Documentation
- **Usage Examples:**
  - `node src/lib/main.js --timer 10` starts a 10-second countdown timer.
  - When using the global JSON flag (`--json` or `--json-pretty`), the response will include additional metadata such as the execution timestamp and the total duration of the command execution.

## Alignment with Repository Mission
The TIMER feature enhances the CLI tool by adding a time management utility that supports automated workflows and healthy collaboration. It allows users to integrate simple time-based reminders or pauses into their scripts, aligning with the repository's mission of promoting streamlined automation and practical, modular utilities.
