# SCHEDULER

## Overview
The SCHEDULER feature provides a lightweight, self-contained module that allows users to schedule CLI command execution based on a simple delay or cron-like expression. This feature empowers users to automate repeated or deferred tasks without needing external tools, thus reinforcing our mission of streamlined automation and healthy collaboration.

## CLI Integration
- **Command Flag:** Introduce a new global flag `--schedule` to invoke the scheduler.
- **Usage Examples:**
  - Simple Delay: `node src/lib/main.js --schedule "--sum 10 20" 30`
    - Runs the `--sum 10 20` command after a 30-second delay.
  - Cron Expression: `node src/lib/main.js --schedule "--multiply 3 4" "*/5 * * * *"`
    - Executes the command every 5 minutes according to a cron-like syntax.
- **Modes:** Supports one-off scheduling (using a delay) as well as periodic scheduling (using cron expressions). In both cases, the output is delivered via the existing CLI output modes (plain text or JSON).

## Implementation Details
- **Input Parsing & Validation:**
  - Parse the schedule parameters to differentiate between simple delay (numeric, representing seconds) and a cron expression (string pattern).
  - Validate the provided command exists in the CLI command mapping before scheduling.
- **Operation Logic:**
  - For simple delays, use `setTimeout` to execute the provided command after the specified delay.
  - For periodic scheduling, utilize a minimal cron parser to calculate the next execution time and set up recurrent `setTimeout` invocations.
  - Log scheduling events and execution results in the same manner as other CLI commands (including support for JSON output mode with metadata).
- **Fallback & Error Handling:**
  - Provide clear error messages if the scheduling parameters are invalid (e.g., unrecognized cron format or non-numeric delay).
  - Ensure that if the scheduled command fails, appropriate error messages are logged following the standard CLI behavior.

## Testing & Documentation
- **Unit Tests:**
  - Write tests to verify that commands are scheduled correctly (both one-off and periodic) and execute as expected.
  - Include edge-case scenarios such as invalid schedule formats and command verification.
- **Documentation:**
  - README, CLI usage guides, and inline code comments will be updated with examples and detailed instructions on how to use the scheduling functionality.
  - Illustrative examples for both delay-based and cron-based scheduling are provided.

## Alignment with Repository Mission
By integrating the SCHEDULER feature, the repository extends its modular CLI tool with a practical automation utility. This addition supports efficient workflow automation and contributes to the overall goal of facilitating healthy collaboration through self-contained, easy-to-integrate utilities.